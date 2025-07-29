import { UploadCloud, MapPin, Camera, Trash2 } from "lucide-react";
import "../css/Main.css"; 
import axios from "axios";

const Main = ({
  loading,
  onAnalysis,
  uploadedImage,
  setUploadedImage,
  district,
  setDistrict,
}) => {
  const districts = ["광주광역시 동구", "광주광역시 서구", "광주광역시 남구", "광주광역시 북구", "광주광역시 광산구"];

  const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    try {
      // 서버에 업로드
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://192.168.20.69:8080/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const savedFilename = response.data; // 서버가 리턴한 저장 파일명
      const serverImageUrl = `http://192.168.20.69:8080/images/${savedFilename}`;

      // 기존 클라이언트 URL 해제
      if (uploadedImage.url) {
        URL.revokeObjectURL(uploadedImage.url);
      }

      setUploadedImage({
        file,
        url: serverImageUrl,  // 서버 이미지 URL로 변경
      });
    } catch (error) {
      alert("이미지 업로드 실패");
      console.error(error);
    }
  }
};



  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (uploadedImage.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage({ file: null, url: "" });
  };

  return (
    <div className="app-container">
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
        <div className="form-container">
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
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">
              <Camera className="label-icon" />
              쓰레기 사진 업로드
            </label>
            <div
              tabIndex={0}
              className={`upload-area ${uploadedImage.url ? "has-image" : ""}`}
              onClick={() => !uploadedImage.url && document.getElementById('file-upload').click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!uploadedImage.url) document.getElementById('file-upload').click();
                }
              }}
            >
              {uploadedImage.url ? (
                <div className="image-preview">
                  <img src={uploadedImage.url} alt="업로드된 쓰레기" className="preview-image" />
                  <button
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                    aria-label="사진 제거"
                  >
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
