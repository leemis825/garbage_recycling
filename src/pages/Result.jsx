import { ArrowLeft, CheckCircle, Recycle, MapPin, Camera, Info, AlertCircle } from "lucide-react";
import "../css/Result.css";

const Result = ({
  apiResult,
  disposalInfo,
  uploadedImageURL,
  district,
  onAnalyzeAgain,
}) => {
  if (!apiResult || !disposalInfo) {
    return (
      <div className="result-container error-page">
        <h2>잘못된 접근입니다.</h2>
        <p>분석 결과가 없습니다. 메인 페이지에서 분석을 먼저 진행해주세요.</p>
        <button className="analyze-again-btn" onClick={onAnalyzeAgain}>
          <ArrowLeft className="btn-icon" />
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <header className="result-header">
        <button className="back-btn" onClick={onAnalyzeAgain}>
          <ArrowLeft className="back-icon" />
          다시 분석하기
        </button>
        <h1>분석 결과</h1>
      </header>

      <main className="result-content">
        <div className="image-section">
          <div className="uploaded-image">
            <img src={uploadedImageURL} alt="분석된 쓰레기 사진" className="result-image" />
          </div>
          <div className="basic-info">
            <div className="location-info">
              <MapPin className="location-icon" />
              <span>{district}</span>
            </div>
            <div className="analysis-time">
              <Camera className="camera-icon" />
              <span>분석 완료: {new Date().toLocaleString("ko-KR")}</span>
            </div>
          </div>
        </div>

        <div className="analysis-result">
          <div className="result-header-section">
            <CheckCircle className="success-icon" />
            <h2>분석 완료!</h2>
          </div>
          <div className="result-card">
            <div className="waste-type">
              <h3>{disposalInfo.title}</h3>
              <div className="confidence-badge">신뢰도 {apiResult.main.confidence}</div>
            </div>
            <div className="category-info">
              <div className="category-badge" style={{ backgroundColor: disposalInfo.color }}>
                {disposalInfo.category}
              </div>
            </div>
          </div>
        </div>

        <div className="disposal-section">
          <div className="section-header">
            <Recycle className="section-icon" />
            <h2>분리수거 방법</h2>
          </div>
          <div className="disposal-steps">
            {disposalInfo.steps?.map((step) => (
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

        {disposalInfo.schedule && (
          <div className="schedule-section">
            <div className="section-header">
              <AlertCircle className="section-icon" />
              <h3>수거 일정 정보</h3>
            </div>
            <div className="schedule-card">
              <div className="schedule-item">
                <strong>수거 요일:</strong> {disposalInfo.schedule.day}
              </div>
              <div className="schedule-item">
                <strong>수거 시간:</strong> {disposalInfo.schedule.time}
              </div>
              <div className="schedule-item">
                <strong>배출 장소:</strong> {disposalInfo.schedule.location}
              </div>
            </div>
          </div>
        )}

        {disposalInfo.tips && disposalInfo.tips.length > 0 && (
          <div className="tips-section">
            <div className="section-header">
              <Info className="section-icon" />
              <h3>분리수거 팁</h3>
            </div>
            <div className="tips-list">
              {disposalInfo.tips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <span className="tip-bullet">💡</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Result;
