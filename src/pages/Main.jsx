import { UploadCloud, MapPin, Camera, X, Info, Trash2 } from "lucide-react";
import "../css/Main.css"; 

const Main = ({
  loading,
  onAnalysis,
  uploadedImage,
  setUploadedImage,
  district,
  setDistrict,
}) => {
  const districts = ["광주광역시 동구", "광주광역시 서구", "광주광역시 남구", "광주광역시 북구", "광주광역시 광산구"];

  // 파일 업로드 처리 함수
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage({
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };

  // 이미지 제거 함수
  const handleRemoveImage = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setUploadedImage({ file: null, url: "" });
  };

  return (
    // className을 CSS 파일에 맞게 'app-container'로 수정
    <div className="app-container">
      {/* className을 CSS 파일에 맞게 'header'로 수정 */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Trash2 className="logo-icon" />
            <h1>광주 쓰레기 분리배출 도우미</h1>
          </div>
          <p className="subtitle">쓰레기 사진을 업로드하고 거주 구를 선택해주세요</p>
        </div>
      </header>

      <main className="main-content">
        {/* className을 CSS 파일에 맞게 'form-container'로 수정 */}
        <div className="form-container">
          {/* 구 선택 */}
          <div className="form-section">
            <label className="form-label">
              <MapPin className="label-icon" />
              광주광역시 거주 구 선택
            </label>
            <select
              className="district-select"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">구를 선택해주세요</option>
              {districts.map((d) => (
                <option key={d} value={`${d}`}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 이미지 업로드 */}
          <div className="form-section">
            <label className="form-label">
              <Camera className="label-icon" />
              쓰레기 사진 업로드
            </label>
            <div
              className={`upload-area ${uploadedImage.url ? "has-image" : ""}`}
              onClick={() => !uploadedImage.url && document.getElementById('file-upload').click()}
            >
              {uploadedImage.url ? (
                <div className="image-preview">
                  <img src={uploadedImage.url} alt="업로드된 쓰레기" className="preview-image" />
                  <button className="remove-image-btn" onClick={handleRemoveImage}>
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <UploadCloud className="upload-icon" />
                  <p className="upload-text">클릭하거나 파일을 드래그해서 업로드하세요</p>
                </div>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* 선택된 정보 표시 */}
          {(district || uploadedImage.url) && (
            <div className="selected-info">
              <h3>선택된 정보</h3>
              <div className="info-items">
                {district && (
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <span>지역: {district}</span>
                  </div>
                )}
                {uploadedImage.url && (
                  <div className="info-item">
                    <Camera className="info-icon" />
                    <span>사진: 업로드 완료</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 분석 버튼 */}
          <button
            className="analyze-btn"
            onClick={onAnalysis}
            disabled={!district || !uploadedImage.file || loading}
          >
            {loading ? "분석 중..." : "쓰레기 분석하기"}
          </button>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 광주 쓰레기 분리배출 도우미</p>
      </footer>
    </div>
  );
};

export default Main;
