import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";

import { Header } from "./components/Header.jsx";
import { LandingPage } from "./components/LandingPage.jsx";
import { MainPageContainer } from "./components/MainPageContainer.jsx";
import { HistoryPage } from "./components/HistoryPage.jsx";
import { LoadingOverlay } from "./components/LoadingOverlay.jsx";

export default function App() {
  const [isCompareMode, setIsCompareMode] = useState(false);

  // Normal mode state
  const [algorithm, setAlgorithm] = useState("");
  const [image, setImage] = useState(null);
  const [data, setData] = useState(null);

  // Compare mode state
  const [algorithm2, setAlgorithm2] = useState("");
  const [image2, setImage2] = useState(null);
  const [compareData, setCompareData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (isCompareMode) {
      if ((!algorithm.trim() && !image) || (!algorithm2.trim() && !image2)) return;
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("algorithm1", algorithm);
        if (image) formData.append("image1", image);
        formData.append("algorithm2", algorithm2);
        if (image2) formData.append("image2", image2);

        const res = await fetch("api/compare", {
          method: "POST",
          body: formData
        });

        const rawJson = await res.json();
        
        const json1 = { ...rawJson.data1, steps: Array.isArray(rawJson.data1?.steps) ? rawJson.data1.steps : [] };
        const json2 = { ...rawJson.data2, steps: Array.isArray(rawJson.data2?.steps) ? rawJson.data2.steps : [] };

        setCompareData({ data1: json1, data2: json2 });
        navigate("/visualization");
      } catch (err) {
        console.error("Failed to fetch compare visualization", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!algorithm.trim() && !image) return;
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("algorithm", algorithm);
        if (image) formData.append("image", image);

        const res = await fetch("api/response", {
          method: "POST",
          body: formData
        });

        const rawJson = await res.json();

        const json = {
          ...rawJson,
          steps: Array.isArray(rawJson.steps) ? rawJson.steps : []
        };

        setData(json);
        navigate("/visualization");
      } catch (err) {
        console.error("Failed to fetch visualization", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const goToLanding = () => {
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Header onGenerateAnother={goToLanding} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                isCompareMode={isCompareMode}
                setIsCompareMode={setIsCompareMode}
                algorithm={algorithm}
                onAlgorithmChange={setAlgorithm}
                onImageChange={(e) => setImage(e.target.files[0])}
                selectedImageName={image ? image.name : ""}
                algorithm2={algorithm2}
                onAlgorithm2Change={setAlgorithm2}
                onImage2Change={(e) => setImage2(e.target.files[0])}
                selectedImageName2={image2 ? image2.name : ""}
                onGenerate={handleGenerate}
              />
            }
          />

          <Route
            path="/visualization"
            element={
              isCompareMode ? (
                compareData ? (
                  <div className="flex w-full h-[calc(100vh-140px)] gap-6 overflow-hidden">
                    <div className="flex-[1] min-w-[300px] overflow-auto border-r border-[#9ce060]/30 pr-3">
                      <MainPageContainer data={compareData.data1} algoIndex={1} isCompareMode={true} />
                    </div>
                    <div className="flex-[1] min-w-[300px] overflow-auto pl-3">
                      <MainPageContainer data={compareData.data2} algoIndex={2} isCompareMode={true} />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                data ? (
                  <MainPageContainer data={data} algoIndex={1} />
                ) : (
                  <Navigate to="/" replace />
                )
              )
            }
          />

          <Route path="/history" element={<HistoryPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}
