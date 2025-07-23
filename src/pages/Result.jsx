import { useState } from "react"
import { ArrowLeft, CheckCircle, AlertCircle, Recycle, MapPin, Camera, Info } from "lucide-react"
import "../css/Result.css"

const Result = () => {

  // 더미 데이터 (실제로는 props나 상태로 받아올 예정)
  const [analysisData] = useState({
    image: "/placeholder.svg?height=300&width=400",
    district: "광주광역시 서구",
    wasteType: "플라스틱 병",
    confidence: 95,
    category: "재활용품",
    color: "#10b981",
  })

  const [disposalMethod] = useState({
    steps: [
      
      {
        step: 1,
        title: "내용물 비우기",
        description: "병 안의 내용물을 완전히 비워주세요.",
        icon: "🚰",
      },
      {
        step: 2,
        title: "라벨 제거",
        description: "플라스틱 병에 붙어있는 라벨을 제거해주세요.",
        icon: "🏷️",
      },
      {
        step: 3,
        title: "물로 헹구기",
        description: "병 내부를 깨끗한 물로 한 번 헹궈주세요.",
        icon: "💧",
      },
      {
        step: 4,
        title: "뚜껑 분리",
        description: "플라스틱 뚜껑은 별도로 분리해서 배출해주세요.",
        icon: "🔄",
      },
      {
        step: 5,
        title: "재활용품 배출",
        description: "투명 플라스틱 전용 수거함에 배출해주세요.",
        icon: "♻️",
      },
    ],
    tips: [
      "라벨이 잘 떨어지지 않으면 따뜻한 물에 담가두세요.",
      "뚜껑과 병은 재질이 다르므로 반드시 분리해주세요.",
      "찌그러뜨리지 말고 원형을 유지한 채로 배출하세요.",
    ],
    schedule: {
      day: "화요일, 금요일",
      time: "오후 6시 ~ 오후 10시",
      location: "아파트 재활용 수거함",
    },
  })

  const handleGoBack = () => {
    // 뒤로가기 기능 (실제로는 router.back() 등 사용)
    console.log("뒤로가기")
  }

  const handleAnalyzeAgain = () => {
    // 다시 분석하기 기능
    console.log("다시 분석하기")
  }

  return (

    <div className="result-container">
      <header className="result-header">
        <button className="back-btn" onClick={handleGoBack}>
          <ArrowLeft className="back-icon" />
          뒤로가기
        </button>
        <h1>분석 결과</h1>
      </header>

      <main className="result-content">
        {/* 이미지 및 기본 정보 */}
        <div className="image-section">
          <div className="uploaded-image">
            <img src={analysisData.image || "/placeholder.svg"} alt="분석된 쓰레기 사진" className="result-image" />
          </div>
          <div className="basic-info">
            <div className="location-info">
              <MapPin className="location-icon" />
              <span>{analysisData.district}</span>
            </div>
            <div className="analysis-time">
              <Camera className="camera-icon" />
              <span>분석 완료: {new Date().toLocaleString("ko-KR")}</span>
            </div>
          </div>
        </div>

        {/* 분석 결과 */}
        <div className="analysis-result">
          <div className="result-header-section">
            <CheckCircle className="success-icon" />
            <h2>분석 완료!</h2>
          </div>

          <div className="result-card">
            <div className="waste-type">
              <h3>{analysisData.wasteType}</h3>
              <div className="confidence-badge">신뢰도 {analysisData.confidence}%</div>
            </div>
            <div className="category-info">
              <div className="category-badge" style={{ backgroundColor: analysisData.color }}>
                {analysisData.category}
              </div>
            </div>
          </div>
        </div>

        {/* 분리수거 방법 */}
        <div className="disposal-section">
          <div className="section-header">
            <Recycle className="section-icon" />
            <h2>분리수거 방법</h2>
          </div>

          <div className="disposal-steps">
            {disposalMethod.steps.map((step) => (
              <div key={step.step} className="disposal-step">
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <div className="step-header">
                    <span className="step-number">{step.step}</span>
                    <h4>{step.title}</h4>
                  </div>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 수거 일정 정보 */}
        <div className="schedule-section">
          <div className="section-header">
            <AlertCircle className="section-icon" />
            <h3>수거 일정 정보</h3>
          </div>
          <div className="schedule-card">
            <div className="schedule-item">
              <strong>수거 요일:</strong> {disposalMethod.schedule.day}
            </div>
            <div className="schedule-item">
              <strong>수거 시간:</strong> {disposalMethod.schedule.time}
            </div>
            <div className="schedule-item">
              <strong>배출 장소:</strong> {disposalMethod.schedule.location}
            </div>
          </div>
        </div>

        {/* 추가 팁 */}
        <div className="tips-section">
          <div className="section-header">
            <Info className="section-icon" />
            <h3>분리수거 팁</h3>
          </div>
          <div className="tips-list">
            {disposalMethod.tips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-bullet">💡</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button className="analyze-again-btn" onClick={handleAnalyzeAgain}>
            <Camera className="btn-icon" />
            다시 분석하기
          </button>
        </div>
      </main>
    </div>
  )
}

export default Result