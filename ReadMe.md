# Breast Cancer Detection System using Deep Learning

## Introduction

This project aims to enhance breast cancer detection using a deep learning-based system leveraging DenseNet for classification and U-Net for segmentation. The tool provides accurate and efficient mammogram analysis, helping radiologists identify areas of concern and improving diagnostic outcomes.

## Problem Statement

Manual mammogram interpretation is subjective and prone to errors, causing delayed or inaccurate diagnoses. This system addresses these challenges by automating mammogram analysis to improve diagnostic precision and reduce radiologist workload.

## Objectives

- Accurately classify mammograms as normal, benign, or cancerous.
- Highlight areas of concern in cancerous/benign images using segmentation.
- Provide an intuitive interface for healthcare professionals.

## Methodology

1. **Preprocessing:** Mammogram normalization, resizing, and augmentation.
2. **Classification:** DenseNet extracts hierarchical features and classifies images.
3. **Segmentation:** U-Net highlights tumor regions in cancerous/benign images.
4. **Integration:** Backend (Django) and frontend (React) with APIs for seamless interaction.

## Features

- **Classification:** High accuracy in distinguishing normal, benign, and cancerous tissues.
- **Segmentation:** Detailed region marking in abnormal cases.
- **User Interface:** Simple image upload and visualization tools.
- **Confidence Scores:** Reliable metrics for decision support.

## Expected Outcomes

- Increased diagnostic accuracy and reduced false positives/negatives.
- Fully functional web application for mammogram analysis.
- Enhanced accessibility for radiologists.

## Technology Stack

- **Frontend:** React
- **Backend:** Django
- **Deep Learning Framework:** PyTorch
- **Deployment:** Google Colab (T4 GPU), scalable to cloud solutions.
