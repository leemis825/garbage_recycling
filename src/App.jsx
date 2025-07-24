import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

// 페이지 컴포넌트 임포트
import Main from "./pages/Main";
import Result from "./pages/Result";

// 분리수거 정보 데이터 임포트
import { recyclingData } from "./recyclingData";

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

function App() {
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState({ file: null, url: '' });
  const [district, setDistrict] = useState("광주광역시 동구"); 

  const navigate = useNavigate();

  const handleAnalysis = async () => {
    if (!uploadedImage.file) {
      alert("이미지를 먼저 업로드해주세요.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      

      formData.append('image', uploadedImage.file); 

      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      
      setApiResult(response.data); 
      navigate('/result'); 

    } catch (err) {
      console.error("API 호출 오류:", err);
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setApiResult(null);
    setUploadedImage({ file: null, url: '' });
    navigate('/');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Main 
            loading={loading}
            onAnalysis={handleAnalysis}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            district={district}
            setDistrict={setDistrict}
          />
        } 
      />
      <Route 
        path="/result" 
        element={
          <Result 
            apiResult={apiResult}
            disposalInfo={apiResult ? recyclingData[apiResult.main.class] : null}
            uploadedImageURL={uploadedImage.url}
            district={district}
            onAnalyzeAgain={handleReset}
          />
        } 
      />
    </Routes>
  );
}

export default AppWrapper;
