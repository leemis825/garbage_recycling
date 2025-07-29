import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Recycle,
  MapPin,
  Camera,
  Info,
  AlertCircle,
} from "lucide-react";
import { recyclingData } from "../recyclingData";
import "../css/Result.css";

const Result = ({ onAnalyzeAgain }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [apiResult, setApiResult] = useState(null);
  const [disposalInfo, setDisposalInfo] = useState(null);
  const [district, setDistrict] = useState("광주광역시 동구");
  const [imageUrl, setImageUrl] = useState("/default_waste_image.png");

  useEffect(() => {
  console.log("location.state:", location.state);
  console.log("location.search:", location.search);

  // location.state가 있으면 우선 사용
  if (location.state && location.state.apiResult) {
    setApiResult(location.state.apiResult);
    setDistrict(location.state.district || "광주광역시 동구");
    setImageUrl(location.state.imageUrl || "/default_waste_image.png");

    const disposal = recyclingData[location.state.apiResult.main.class];
    setDisposalInfo(disposal || null);
    return;
  }

  // location.state 없으면 쿼리 파라미터에서 읽기
  const params = new URLSearchParams(location.search);

  const apiResultRaw = params.get("result");
  let parsedResult = null;
  try {
    if (apiResultRaw) {
      // decodeURIComponent 제거!
      parsedResult = JSON.parse(apiResultRaw);
      console.log("파싱된 result:", parsedResult);
    }
  } catch (e) {
    console.error("쿼리 파라미터 result 파싱 실패:", e);
    parsedResult = null;
  }

  const districtParam = params.get("district");
  const imageUrlParam = params.get("image");

  console.log("district param:", districtParam);
  console.log("image param:", imageUrlParam);

  if (parsedResult) {
    setApiResult(parsedResult);
    setDisposalInfo(recyclingData[parsedResult.main.class] || null);
    setDistrict(districtParam || "광주광역시 동구");
    setImageUrl(imageUrlParam || "/default_waste_image.png");
  } else {
    console.warn("분석 결과 데이터가 없습니다. 메인페이지로 이동합니다.");
    navigate("/", { replace: true });
  }
}, [location, navigate]);




  if (!apiResult || !disposalInfo) {
    return null;
  }

  // 신뢰도 계산 (0~100%)
  const confidence = parseFloat(apiResult?.main?.confidence);
  const confidencePercent = isNaN(confidence)
    ? "0"
    : Math.round(confidence); // 소수점 없이 정수로

  const handleKakaoShare = () => {
    if (window.Kakao) {
      const stepsText = disposalInfo.steps
        .map(
          (step) =>
            `${step.step}\n${step.title}\n${step.description}`
        )
        .join("\n\n");

      const scheduleText = disposalInfo.schedule
        ? `수거 일정 정보\n수거 요일: ${disposalInfo.schedule.day}\n수거 시간: ${disposalInfo.schedule.time}\n배출 장소: ${disposalInfo.schedule.location}`
        : "";

      const tipsText = disposalInfo.tips && disposalInfo.tips.length > 0
        ? `분리수거 팁\n${disposalInfo.tips.join("\n")}`
        : "";

      const descriptionText = `
분리수거 품목: ${disposalInfo.title}

분리수거 방법

${stepsText}

${scheduleText}

${tipsText}
      `.trim();

      const BASE_URL = "http://192.168.20.69:5173";

      // apiResult, district, imageUrl를 쿼리 파라미터로 인코딩하여 URL 생성
      const shareUrl = `${BASE_URL}/result?result=${encodeURIComponent(JSON.stringify(apiResult))}&district=${encodeURIComponent(district)}&image=${encodeURIComponent(imageUrl)}`;

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `분리수거: ${disposalInfo.title}`,
          description: descriptionText,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [], // 버튼 비활성화
      });
    } else {
      alert("카카오톡 공유 기능을 사용할 수 없습니다.");
    }
  };

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
            <img
              src={imageUrl}
              alt="분석된 쓰레기 사진"
              className="result-image"
            />
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
              <div className="confidence-badge">
                신뢰도 {confidencePercent}%
              </div>
            </div>
            <div className="category-info">
              <div
                className="category-badge"
                style={{ backgroundColor: disposalInfo.color }}
              >
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

        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
          }}
        >
          <button
            onClick={handleKakaoShare}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "#FFEB00",
              border: "none",
              fontWeight: "bold",
            }}
          >
            카카오톡으로 공유하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default Result;
