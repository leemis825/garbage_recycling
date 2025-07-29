from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

# 공통 파일 경로
LABEL_PATH = "label_map.txt"
IMAGE_PATH = "550.jpg"
MODELS = {
    "2": "2_garbage_classifier_efficientnetb0.h5",
    "main": "garbage_classifier_efficientnetb0.h5",
    "best": "finetuned_mobilenetv2.pth"  # ← PyTorch 모델
}

# 라벨 로딩
with open(LABEL_PATH, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f]

# TensorFlow 이미지 전처리 (공통)
print(" 이미지 로딩 중...")
img = load_img(IMAGE_PATH, target_size=(224, 224))
img_array = img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)

# PyTorch용 이미지 전처리용 bytes
with open(IMAGE_PATH, "rb") as f:
    image_bytes = f.read()

# PyTorch 함수 정의
def load_labels(label_path):
    with open(label_path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f]

def load_pytorch_model(model_path, num_classes):
    model = models.mobilenet_v2(pretrained=False)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    return model

def predict_with_pytorch(model, image_bytes, class_names):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5]*3, [0.5]*3)
    ])
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
        pred_idx = torch.argmax(output).item()
        confidence = torch.softmax(output, dim=1)[0][pred_idx].item()

    return class_names[pred_idx], f"{confidence * 100:.2f}%"

# 모델별 예측
print("\n 모델별 예측 시작...\n")

for model_key, model_path in MODELS.items():
    print(f"모델 [{model_key}] 로딩 중: {model_path}")

    if model_path.endswith(".h5"):
        model = load_model(model_path)
        preds = model.predict(img_array)[0]
        predicted_class = class_names[np.argmax(preds)]
        confidence = float(np.max(preds))
    
    elif model_path.endswith(".pth"):
        model = load_pytorch_model(model_path, num_classes=len(class_names))
        predicted_class, confidence = predict_with_pytorch(model, image_bytes, class_names)
    
    print(f" 모델 [{model_key}] 예측 결과:")
    print(f"  → 클래스: {predicted_class}")
    print(f"  → 정확도: {confidence}\n")
