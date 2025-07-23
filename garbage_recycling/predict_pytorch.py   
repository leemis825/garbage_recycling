import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os

# ✅ 클래스 이름 (학습 시 사용한 순서로)
class_names = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

# ✅ 전처리 정의 (val과 동일)
val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ✅ 모델 정의
def load_model(model_path):
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, len(class_names))
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

# ✅ 이미지 예측
def predict_image(model, image_path):
    image = Image.open(image_path).convert("RGB")
    input_tensor = val_transform(image).unsqueeze(0)  # 배치 차원 추가
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, 1)
        predicted_class = class_names[predicted.item()]
    return predicted_class

# ✅ 예시 실행
if __name__ == "__main__":
    model = load_model("best_model.pth")

    # 테스트할 이미지 경로
    test_images = ["test_images/plastic14.jpg", "test_images/t.jpg"]

    for img_path in test_images:
        if os.path.exists(img_path):
            result = predict_image(model, img_path)
            print(f"🧪 {os.path.basename(img_path)} → {result}")
        else:
            print(f"⚠️ 파일 없음: {img_path}")
