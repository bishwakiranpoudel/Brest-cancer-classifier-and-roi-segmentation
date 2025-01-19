import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import torch
from torchvision import transforms
from torchvision.models import densenet161
from PIL import Image
import tensorflow.image as tfi
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Layer
from tensorflow.keras.layers import Conv2D
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import UpSampling2D
from tensorflow.keras.layers import concatenate
from tensorflow.keras.layers import Add
from tensorflow.keras.layers import Multiply
from tensorflow.keras.layers import Input
from tensorflow.keras.layers import MaxPool2D
from tensorflow.keras.layers import BatchNormalization
from tensorflow.keras.saving import register_keras_serializable


@register_keras_serializable(package="CustomLayers")
class EncoderBlock(Layer):

    def __init__(self, filters, rate, pooling=True, **kwargs):
        super(EncoderBlock, self).__init__(**kwargs)

        self.filters = filters
        self.rate = rate
        self.pooling = pooling

        self.c1 = Conv2D(filters, kernel_size=3, strides=1, padding='same', activation='relu', kernel_initializer='he_normal')
        self.drop = Dropout(rate)
        self.c2 = Conv2D(filters, kernel_size=3, strides=1, padding='same', activation='relu', kernel_initializer='he_normal')
        self.pool = MaxPool2D()

    def call(self, X):
        x = self.c1(X)
        x = self.drop(x)
        x = self.c2(x)
        if self.pooling:
            y = self.pool(x)
            return y, x
        else:
            return x

    def get_config(self):
        base_config = super().get_config()
        return {
            **base_config,
            "filters":self.filters,
            'rate':self.rate,
            'pooling':self.pooling
        }

@register_keras_serializable(package="CustomLayers")
class DecoderBlock(Layer):

    def __init__(self, filters, rate, **kwargs):
        super(DecoderBlock, self).__init__(**kwargs)

        self.filters = filters
        self.rate = rate

        self.up = UpSampling2D()
        self.net = EncoderBlock(filters, rate, pooling=False)

    def call(self, X):
        X, skip_X = X
        x = self.up(X)
        c_ = concatenate([x, skip_X])
        x = self.net(c_)
        return x

    def get_config(self):
        base_config = super().get_config()
        return {
            **base_config,
            "filters":self.filters,
            'rate':self.rate,
        }

@register_keras_serializable(package="CustomLayers")
class AttentionGate(Layer):

    def __init__(self, filters, bn, **kwargs):
        super(AttentionGate, self).__init__(**kwargs)

        self.filters = filters
        self.bn = bn

        self.normal = Conv2D(filters, kernel_size=3, padding='same', activation='relu', kernel_initializer='he_normal')
        self.down = Conv2D(filters, kernel_size=3, strides=2, padding='same', activation='relu', kernel_initializer='he_normal')
        self.learn = Conv2D(1, kernel_size=1, padding='same', activation='sigmoid')
        self.resample = UpSampling2D()
        self.BN = BatchNormalization()

    def call(self, X):
        X, skip_X = X

        x = self.normal(X)
        skip = self.down(skip_X)
        x = Add()([x, skip])
        x = self.learn(x)
        x = self.resample(x)
        f = Multiply()([x, skip_X])
        if self.bn:
            return self.BN(f)
        else:
            return f

    def get_config(self):
        base_config = super().get_config()
        return {
            **base_config,
            "filters":self.filters,
            "bn":self.bn
        }


class ModelConfig:
    # Load classifier (PyTorch)
    classifier_model_path = os.path.join(os.path.dirname(__file__), 'classifier_model.pth')
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    classifier = densenet161(pretrained=False)
    num_ftrs = classifier.classifier.in_features
    classifier.classifier = torch.nn.Sequential(
        torch.nn.Dropout(p=0.2, inplace=True),
        torch.nn.Linear(num_ftrs, 3),
        torch.nn.BatchNorm1d(3)
    )
    classifier.load_state_dict(torch.load(classifier_model_path, map_location=device))
    classifier.to(device)
    classifier.eval()

    # Load segmentation model (TensorFlow)
    segmentation_model_path = os.path.join(os.path.dirname(__file__), 'segmentation_model.keras')
    segmentation = load_model(segmentation_model_path, custom_objects={'EncoderBlock': EncoderBlock, 'DecoderBlock': DecoderBlock, "AttentionGate": AttentionGate})

    # Image transformations
    classifier_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor()
    ])

    @staticmethod
    def preprocess_image(image, target_size=256):
        img = tfi.resize(np.array(image) / 255.0, (target_size, target_size))
        return img
