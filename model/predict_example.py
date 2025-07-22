from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np

# 공통 파일 경로
LABEL_PATH = "label_map.txt"
IMAGE_PATH = "550.jpg"
# "실제.jpg", "test.jpg"
# 모델 파일 목록
MODELS = {
    "2": "2_garbage_classifier_efficientnetb0.h5",
    "main": "garbage_classifier_efficientnetb0.h5"
}

# 라벨 로딩
with open(LABEL_PATH, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f]

# 이미지 전처리
print("🖼️ 이미지 로딩 중...")
img = load_img(IMAGE_PATH, target_size=(224, 224))
img_array = img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0)

# 모델별 예측 결과
print("🔍 모델별 예측 시작...\n")

for model_key, model_path in MODELS.items():
    print(f"📦 모델 [{model_key}] 로딩 중: {model_path}")
    model = load_model(model_path)

    predictions = model.predict(img_array)[0]
    predicted_class = class_names[np.argmax(predictions)]
    confidence = float(np.max(predictions))

    print(f"✅ 모델 [{model_key}] 예측 결과:")
    print(f"  → 클래스: {predicted_class}")
    print(f"  → 정확도: {confidence * 100:.2f}%\n")
