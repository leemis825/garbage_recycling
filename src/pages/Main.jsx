import { useState, useRef } from "react"
import { Upload, MapPin, Camera, Trash2 } from "lucide-react"
import "../css/Main.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Main = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [imgFile, setImgFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate();

  const districts = ["동구", "서구", "남구", "북구", "광산구"]

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImgFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    handleImageUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    handleImageUpload(file)
  }

  const resetImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 이미지 파일을 파이썬 백엔드로 전송하는 로직
  const analyzeImg = async () => {
    if (!selectedDistrict) {
      alert("거주 구를 선택해주세요.")
      return
    }
    if (!imgFile) {
      alert("분석할 쓰레기 사진을 업로드해주세요.")
      return
    }

    const formData = new FormData();
    formData.append("image", imgFile);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(res.data)

      // navigate("/result", { state: { result: res.data } });
    } catch (err) {
      console.error(err);
      alert("분석 실패");
    }
  }

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
          {/* 구 선택 */}
          <div className="form-section">
            <label className="form-label">
              <MapPin className="label-icon" />
              광주광역시 거주 구 선택
            </label>
            <select
              className="district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">구를 선택해주세요</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  광주광역시 {district}
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
              className={`upload-area ${isDragOver ? "drag-over" : ""} ${uploadedImage ? "has-image" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploadedImage && fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <div className="image-preview">
                  <img src={uploadedImage || "/placeholder.svg"} alt="업로드된 쓰레기 사진" className="preview-image" />
                  <button
                    className="remove-image-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      resetImage()
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload className="upload-icon" />
                  <p className="upload-text">클릭하거나 파일을 드래그해서 업로드하세요</p>
                  <p className="upload-hint">JPG, PNG, GIF 파일만 지원됩니다</p>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="file-input" />
          </div>

          {/* 선택된 정보 표시 */}
          {(selectedDistrict || uploadedImage) && (
            <div className="selected-info">
              <h3>선택된 정보</h3>
              <div className="info-items">
                {selectedDistrict && (
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <span>지역: 광주광역시 {selectedDistrict}</span>
                  </div>
                )}
                {uploadedImage && (
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
            onClick={analyzeImg}
            disabled={!selectedDistrict || !uploadedImage}
          >
            쓰레기 분석하기
          </button>
        </div>

        {/* 사용 방법 안내 */}
        <div className="guide-section">
          <h2>사용 방법</h2>
          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>구 선택</h3>
                <p>광주광역시에서 거주하시는 구를 선택해주세요. 구별로 분리배출 규정이 다를 수 있습니다.</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>사진 업로드</h3>
                <p>분리배출하고 싶은 쓰레기의 사진을 명확하게 촬영하여 업로드해주세요.</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>AI 분석</h3>
                <p>AI가 이미지를 분석하여 쓰레기 종류와 올바른 분리배출 방법을 알려드립니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 광주 쓰레기 분리배출 도우미</p>
      </footer>
    </div>
  )
}

export default Main