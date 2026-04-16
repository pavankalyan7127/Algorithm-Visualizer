import React, { useState, useEffect } from "react";
import { MainPage } from "./MainPage.jsx";

export function MainPageContainer({ data, algoIndex, isCompareMode }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentArray, setCurrentArray] = useState([]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [currentExplanation, setCurrentExplanation] = useState("");

  const [stuQuestion, setStuQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState("algo");

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (data && data.structure?.initialData && stepIndex === 0) {
      setCurrentArray(data.structure.initialData);
    }
    
    if (!data || !data.steps) return;

    const step = data.steps[stepIndex];
    if (!step) return;

    if (step.data) setCurrentArray(step.data);

    if (step.activeIndices) setActiveIndices(step.activeIndices);
    else setActiveIndices([]);

    if (step.explanation) setCurrentExplanation(step.explanation);
    else setCurrentExplanation("");
  }, [stepIndex, data]);

  // auto-play effect
  useEffect(() => {
    if (!isPlaying) return;
    if (!data || !data.steps || data.steps.length <= 1) return;

    if (stepIndex >= data.steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const id = setTimeout(() => {
      setStepIndex((prev) =>
        prev < data.steps.length - 1 ? prev + 1 : prev
      );
    }, 1000);

    return () => clearTimeout(id);
  }, [isPlaying, stepIndex, data]);

  const nextStep = () => {
    if (!data) return;

    if (isPlaying) setIsPlaying(false);

    if (stepIndex < data.steps.length - 1) setStepIndex(stepIndex + 1);
  };

  const prevStep = () => {
    if (isPlaying) setIsPlaying(false);
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const resetSteps = () => {
    if (!data) return;
    setIsPlaying(false);
    setStepIndex(0);
  };

  const togglePlay = () => {
    if (!data || !data.steps || data.steps.length <= 1) return;

    // if starting playback from the last step, jump back to the first
    if (!isPlaying && stepIndex >= data.steps.length - 1) {
      setStepIndex(0);
    }

    setIsPlaying((prev) => !prev);
  };

  const handleChat = async () => {
    if (!stuQuestion.trim()) return;

    const question = stuQuestion;
    setStuQuestion("");
    setChatMessages((prev) => [...prev, { role: "user", text: question }]);
    setIsChatLoading(true);

    try {
      const res = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stepIndex,
          question,
          algoIndex: algoIndex || 1
        })
      });

      const json = await res.json();

      const answerText = json.output || JSON.stringify(json);
      setChatMessages((prev) => [...prev, { role: "ai", text: answerText }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "ai", text: "Error: failed to fetch response" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <MainPage
      data={data}
      stepIndex={stepIndex}
      onPrevStep={prevStep}
      onNextStep={nextStep}
      onResetSteps={resetSteps}
      canReset={
        !!data &&
        !!data.steps &&
        data.steps.length > 0 &&
        stepIndex === data.steps.length - 1
      }
      isPlaying={isPlaying}
      onTogglePlay={togglePlay}
      currentExplanation={currentExplanation}
      rightPanelTab={rightPanelTab}
      onRightPanelTabChange={setRightPanelTab}
      stuQuestion={stuQuestion}
      onStuQuestionChange={setStuQuestion}
      messages={chatMessages}
      isChatLoading={isChatLoading}
      onSendChat={handleChat}
      currentArray={currentArray}
      activeIndices={activeIndices}
      isCompareMode={isCompareMode}
    />
  );
}
