from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import CsrfViewMiddleware
from PIL import Image
import numpy as np
from .apps import ModelConfig
from .serializers import ImageSerializer
import cv2
from io import BytesIO
import base64
import torch 
import tensorflow as tf

class PredictView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.validated_data['image']
            pil_image = Image.open(image).convert('RGB')

            # Classify image
            transformed_image = ModelConfig.classifier_transform(pil_image).unsqueeze(0).to(ModelConfig.device)
            with torch.no_grad():
                outputs = ModelConfig.classifier(transformed_image)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                predicted_class = torch.argmax(probabilities).item()
                class_labels = ['normal', 'benign', 'malignant']

            # If 'normal', return predicted class
            if class_labels[predicted_class] == 'normal':
                return Response({
                    'predicted_class': 'normal',
                }, status=status.HTTP_200_OK)

            def process_image(pil_image, SIZE):
                """Resize and normalize an image from a PIL.Image."""
                # Convert PIL image to NumPy array and normalize to [0, 1]
                img = np.array(pil_image) / 255.0
                # Resize the image to the desired size
                img = tf.image.resize(img, (SIZE, SIZE))
                # Ensure the shape is [SIZE, SIZE, 3] for RGB images
                return np.expand_dims(img, axis=0)  # Add batch dimension for model input

            # Preprocess the image
            SIZE = 256
            processed_image = process_image(pil_image, SIZE)

            # Make prediction
            predicted_mask = ModelConfig.segmentation.predict(processed_image)

            # Post-process prediction (e.g., threshold to binary mask)
            binary_mask = (predicted_mask[0, :, :, 0] > 0.5).astype(np.uint8)  # Remove batch dimension

            # Resize mask to match original image dimensions
            binary_mask_resized = cv2.resize(binary_mask, (pil_image.width, pil_image.height), interpolation=cv2.INTER_NEAREST)

            # Overlay mask on the original image
            original_image_np = np.array(pil_image)  # Convert PIL image to NumPy array
            colored_mask = np.zeros_like(original_image_np)
            colored_mask[:, :, 0] = binary_mask_resized * 255  # Red channel for mask

            # Blend the mask and the original image
            overlayed_image = cv2.addWeighted(original_image_np, 0.7, colored_mask, 0.3, 0)

            # Convert overlayed image to base64
            _, buffer = cv2.imencode('.png', overlayed_image)
            image_base64 = base64.b64encode(buffer).decode('utf-8')

            return Response({
                'predicted_class': class_labels[predicted_class],
                'segmentation_overlay': image_base64,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
