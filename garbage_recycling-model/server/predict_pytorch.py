import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

# 이미지 전처리를 위한 Transform 정의
val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# 새로운 ResNet18 모델을 불러오는 함수
def load_model(model_path, num_classes):
    model = models.resnet18(weights=None) 
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

# 이미지를 받아 예측 결과와 신뢰도를 반환하는 함수
def predict_image(image_bytes, model, class_names):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = val_transform(image).unsqueeze(0)
    
    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)
        
        predicted_class = class_names[predicted_idx.item()]
        confidence_score = f"{confidence.item() * 100:.2f}%"
        
    return predicted_class, confidence_score
