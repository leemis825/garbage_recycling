# 쓰레기 분류 모델 설명

## 모델 정보
- 모델명: `garbage_classifier_mobilenetv2.h5`
- Input Shape: `(224, 224, 3)`
- Output: Softmax, 클래스 총 6개

## 클래스 목록 (label_map.txt)
1. cardboard
2. glass
3. metal
4. paper
5. plastic
6. trash

## 사용 예시 (predict_example.py 참고)
```python
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
...

## 전처리 조건
* 이미지 크기 : 224*224
* 픽셀 정규화 : 1./255

## 기타 정보
* 학습 방법 : MobileNetV2 기반 Transfer Learning + Fine-Tuning
* 최종 정확도 : train , val 