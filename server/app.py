from flask import Flask, request, render_template
from tensorflow.keras.models import load_model as tf_load_model
from tensorflow.keras.utils import load_img, img_to_array
from predict_pytorch import load_model as torch_load_model, predict_image as torch_predict_image
import numpy as np
import os
from io import BytesIO

app = Flask(__name__)

# 디렉토리 설정
BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "../model")
LABEL_PATH = os.path.join(MODEL_DIR, "./label_map.txt")

# 모델 파일 매핑
MODEL_MAP = {
    "2": "2_garbage_classifier_efficientnetb0.h5",
    "main": "garbage_classifier_efficientnetb0.h5",
    "best": "best_mobilenetv2.pth"
}

# 라벨 파일 로딩
with open(LABEL_PATH, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f]

# TensorFlow 전처리 함수
def preprocess_image(file_storage):
    image_stream = BytesIO(file_storage.read())
    img = load_img(image_stream, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route("/", methods=["GET", "POST"])
def index():
    result = {}
    error = None

    if request.method == "POST":
        if "file" not in request.files or request.files["file"].filename == "":
            error = "파일을 선택하세요."
            return render_template("index.html", error=error)

        file = request.files["file"]

        try:
            img_array = preprocess_image(file)  # TensorFlow 전처리
            
            for model_key, model_file in MODEL_MAP.items():
                model_path = os.path.join(MODEL_DIR, model_file)
                print(f"모델 로딩 중: {model_key} ({model_file})")

                # TensorFlow 모델
                if model_file.endswith(".h5"):
                    model = tf_load_model(model_path)
                    preds = model.predict(img_array)[0]
                    predicted_class = class_names[np.argmax(preds)]
                    confidence = f"{np.max(preds) * 100:.2f}%"

                # PyTorch 모델
                elif model_file.endswith(".pth"):
                    file.stream.seek(0)  # 다시 읽기 위해 스트림 커서 초기화
                    image_bytes = file.read()
                    model = torch_load_model(model_path, num_classes=len(class_names))
                    predicted_class, confidence = torch_predict_image(image_bytes, model, class_names)

                print(f" {model_key} 모델 예측 결과: {predicted_class} ({confidence})")

                result[model_key] = {
                    "class_": predicted_class,
                    "confidence": confidence
                }

            print(" 최종 예측 결과 딕셔너리:", result)
            return render_template("index.html", result=result)

        except Exception as e:
            error = f"예측 중 오류 발생: {str(e)}"
            print(" 예측 오류:", error)
            return render_template("index.html", error=error)

    return render_template("index.html", result=result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

