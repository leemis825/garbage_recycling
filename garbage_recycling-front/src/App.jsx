import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Main from "./pages/Main";
import Result from "./pages/Result";

function App() {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("894b880ff7674af20b0308b455a39a39");
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState({ file: null, url: "" });
  const [district, setDistrict] = useState("광주광역시 동구");

  const navigate = useNavigate();

  const handleAnalysis = async () => {
  console.log("handleAnalysis called");
  if (!uploadedImage.file) {
    alert("이미지를 먼저 업로드해주세요.");
    return;
  }
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("image", uploadedImage.file);

    const response = await axios.post("http://192.168.20.69:5000/predict", formData);
    console.log("API response:", response.data);

    navigate("/result", {
      state: {
        apiResult: response.data,
        district,
        imageUrl: uploadedImage.url,
      },
    });
  } catch (err) {
    console.error("API 호출 오류:", err);
    alert("분석 중 오류가 발생했습니다.");
  } finally {
    setLoading(false);
  }
};


  const handleReset = () => {
    setUploadedImage({ file: null, url: "" });
    navigate("/");
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
      <Route path="/result" element={<Result onAnalyzeAgain={handleReset} />} />
    </Routes>
  );
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
