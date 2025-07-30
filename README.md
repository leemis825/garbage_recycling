# 이건 무슨 재활용 쓰레기 일까?
## ♻️ Garbage Classifier: AI 기반 쓰레기 분류 서비스

**Garbage Classifier**는 사용자가 업로드한 쓰레기 이미지를 분석하여  
어떤 종류로 분리수거해야 하는지 알려주는 AI 기반 분류 웹 애플리케이션입니다.

실제 생활 환경에서 수집한 다양한 이미지(찌그러진 캔, 일회용 컵, 비닐 등)를 기반으로 학습된  
PyTorch 모델을 통해 **보다 현실에 가까운 예측**이 가능하도록 설계했습니다.

---

<div align="center">

### <회원 가입>

<img width="529" height="544" alt="Image" src="https://github.com/user-attachments/assets/94f61aac-c6f2-4540-8267-ac6983839617" />
<br/>

### <로그인>
<img width="421" height="352" alt="Image" src="https://github.com/user-attachments/assets/b219770e-1656-4da5-88f7-06da0a20528e" />
<br/>  

### <사이트 접속> 
<img width="1319" height="641" alt="Image" src="https://github.com/user-attachments/assets/1f1c83ab-7856-4540-827b-8bec181cca1d" />
<br/>

### <사진 업로드 및 분석 결과>
<img width="1318" height="629" alt="Image" src="https://github.com/user-attachments/assets/35af91eb-80cc-4019-8ea4-3e84f8b50583" />
<br/>

### <분석 결과에 따른 상세 정보> 
<img width="1002" height="564" alt="Image" src="https://github.com/user-attachments/assets/4783e683-4b11-4a85-81d8-ac3fbab03ca0" />
<br/>

### <내 분석 기록 정보>
<img width="1134" height="685" alt="Image" src="https://github.com/user-attachments/assets/4a0b5307-2c60-4beb-b60f-2874dc7e8b32" />
<br/>

### <분석 정보 공유>
<img width="1086" height="759" alt="Image" src="https://github.com/user-attachments/assets/6c394925-955a-4c04-a516-45fef8a46f6a" />
<br/>

### <공유 링크>
<img width="551" height="634" alt="Image" src="https://github.com/user-attachments/assets/7c3506bf-85c6-4087-8033-e62bf21e040c" />
<br/>
</div>

---
### 최종 반영 모델: ResNet18 (Fine-tuned)

본 프로젝트에서는 PyTorch 기반의 사전학습된 ResNet18 모델을 활용하여 분리수거 이미지 분류 모델을 구축했습니다.  
기본적으로 사전 학습된 ResNet18을 로드한 뒤, 총 6개 클래스(cardboard, glass, metal, paper, plastic, trash)에 대해 Fine-tuning을 진행하였습니다.

---
#### 클래스 분류
- cardboard (골판지)
- glass (유리병)
- metal (캔류)
- paper (종이)
- plastic (플라스틱류: 컵, 빨대 등)
- trash (기타 일반쓰레기 또는 분류 불가능 항목)


#### Fine-tuning 세부 사항:
- **기반 모델**: torchvision.models.resnet18(pretrained=False)
- **클래스 수**: 6
- **추가 학습 데이터**: 현실에서 수집한 실제 분리수거 이미지 (각 클래스당 5장 이상)
- **학습 방식**: 기존 best_model.pth (ResNet18 구조)의 파라미터 로드 후, 새로운 이미지로 5 epoch 추가 학습
- **최종 저장 경로**: `/garbage/finetuned_resnet18.pth`

#### 기대 효과:
- 정형화된 학습 이미지뿐만 아니라, 실제 현실에 가까운 찌그러진 캔, 다양한 색상 빨대, 카페 음료컵 등도 높은 정확도로 분류 가능
- MobileNetV2 기반 이전 모델 대비 **일반화 성능 개선**

---

📁 최종 모델은 해당 저장소의 `/garbage_recycling-model/server/` 디렉토리에 저장되어 있으며, 추론에 사용됩니다.

---
## 🧠 모델링 과정 요약
- 사용 환경 : 코랩 

### 1️⃣ 초기 모델: MobileNetV2 (transfer learning)
- **사용 모델**: MobileNetV2 (`torchvision.models.mobilenet_v2(pretrained=True)`)
- **분류 클래스 수**: 6개 (`cardboard`, `glass`, `metal`, `paper`, `plastic`, `trash`)
- **성능**: Validation Accuracy 약 **74%**
- **문제점**
  - 학습에는 성공했지만, 실제 현실 이미지(찌그러진 캔, 다양한 색상 빨대, 컵 등)에 대해 예측 정확도가 낮았음
  - 정형화된 이미지에서는 잘 작동하지만 **일반화 성능이 부족**함

---

### 2️⃣ 대체 모델: ResNet18 (fine-tuned)
- **사용 모델**: ResNet18 (`torchvision.models.resnet18(pretrained=False)`)
- **사전 학습 가중치 사용 여부**: ❌ (대신 기존 `best_model.pth`에서 커스텀 학습 모델 로드)
- **Fine-tuning 방식**:
  - 기존 학습된 `best_model.pth`(ResNet18 구조)의 가중치를 불러옴
  - 새로 수집한 현실 사진(각 클래스별 최소 5장)로 5 epoch 추가 학습
- **최종 모델 성능**: 현실 이미지 예측 시 정확도 및 분류 안정성 **눈에 띄게 향상**
  - 예: 찌그러진 알루미늄 캔 → `metal`, 투명 플라스틱 컵 → `plastic` 등 분류 성공률 증가

---

### 3️⃣ 최종 저장 모델
- **모델 파일**: `finetuned_resnet18.pth`
- **기반 구조**: ResNet18
- **적용 위치**: `/garbage_recycling-model/server/` 내 `predict.py`에서 불러와 추론 수행

---

### 🔍 결정 이유 및 모델 변경 요약

| 항목           | MobileNetV2                      | ResNet18 (최종 선택)           |
|----------------|----------------------------------|-------------------------------|
| 구조 복잡도     | 경량 구조                         | 중간 구조                       |
| 학습 속도       | 빠름                               | 적당함                          |
| 초기 성능       | 높은 정확도 (정형 이미지 기준)         | 현실 이미지에 더 강한 일반화    |
| 문제점         | 현실 이미지 예측 불안정              | 현실 적응력 우수                 |
| 최종 선택 이유  | 정형화된 데이터만 잘 분류함            | **일반화 + 실제 적용력 우수**   |

---
### 사용한 개발 툴
* Front-End : React, Vite, JavaScript
* Back-End : Flask, Python, SpringBoot
* AI 모델링 : PyTorch, ResNet18 (fine-tuned) 
* DB : MySQL
* 버전 관리 및 협업 : GitHub, 디스코드
* 개발 환경(IDE) : Visual Studio Code
---
### 개발 공통 사항 
* 변수 이름 표기법</br>
  : 함수/변수 → camelCase </br>
  : 클래스명 → PascalCase
