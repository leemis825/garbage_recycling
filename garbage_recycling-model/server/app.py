from flask import Flask, request, jsonify
from predict_pytorch import load_model, predict_image
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 경로 설정
# os.path.abspath를 사용하여 실행 위치에 상관없이 항상 정확한 절대 경로를 찾도록 수정합니다.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "model")
LABEL_PATH = os.path.join(MODEL_DIR, "label_map.txt")
MODEL_PATH = os.path.join(MODEL_DIR, "finetuned_resnet18.pth") # 새 모델 경로

# --- 모델 파일 존재 여부 확인 로직 추가 ---
# 서버가 시작될 때 모델 파일이 제 위치에 있는지 먼저 확인합니다.
if not os.path.exists(MODEL_PATH):
    # 파일이 없으면, 사용자에게 명확한 안내 메시지를 출력하고 서버 실행을 중단합니다.
    print("="*60)
    print("FATAL ERROR: Model file not found at the specified path.")
    print(f"Expected path: {MODEL_PATH}")
    print("Please make sure you have copied 'best_model.pth' from the")
    print("'garbage_recycling-model-2' project into the 'garbage_recycling-model/model' directory.")
    print("="*60)
    exit() # 프로그램 종료
# --- 확인 완료 ---

# 라벨 로딩
with open(LABEL_PATH, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f]

# 서버 시작 시 모델을 한 번만 불러옵니다.
print("Loading PyTorch ResNet18 model...")
pytorch_model = load_model(MODEL_PATH, num_classes=len(class_names))
print("PyTorch model loaded successfully.")

@app.route("/predict", methods=["POST"])
def predict_route():
    if "image" not in request.files or request.files["image"].filename == "":
        return jsonify({"error": "파일을 선택하세요."}), 400

    file = request.files["image"]

    try:
        image_bytes = file.read()
        predicted_class, confidence = predict_image(image_bytes, pytorch_model, class_names)
        
        # 프론트엔드가 기대하는 JSON 형식으로 결과 구성
        result = {
            "main": { "class": predicted_class, "confidence": confidence },
            "best": { "class": predicted_class, "confidence": confidence }
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"예측 중 오류 발생: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

