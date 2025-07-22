from flask import Flask, request, render_template
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np
import os
from io import BytesIO

app = Flask(__name__)

# 디렉토리 설정
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "../model")
LABEL_PATH = os.path.join(MODEL_DIR, "label_map.txt")

# 모델 파일 매핑
MODEL_MAP = {
    "2": "2_garbage_classifier_efficientnetb0.h5",
    "main": "garbage_classifier_efficientnetb0.h5"
}

# 라벨 파일 로딩
with open(LABEL_PATH, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f]

# 이미지 전처리 함수
def preprocess_image(file_storage):
    image_stream = BytesIO(file_storage.read())
    img = load_img(image_stream, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files or request.files["file"].filename == "":
        return render_template("index.html", error="파일을 선택하세요.")

    file = request.files["file"]
    try:
        img_array = preprocess_image(file)

        result = {}
        for model_key, model_file in MODEL_MAP.items():
            model_path = os.path.join(MODEL_DIR, model_file)
            model = load_model(model_path)
            preds = model.predict(img_array)[0]
            predicted_class = class_names[np.argmax(preds)]
            confidence = f"{np.max(preds) * 100:.2f}%"
            result[model_key] = {
                "class_": predicted_class,
                "confidence": confidence
            }

        return render_template("index.html", result=result)

    except Exception as e:
        return render_template("index.html", error=str(e))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
