import React from "react";
import { StepControls } from "./StepControls.jsx";
import { StepsCard } from "./StepsCard.jsx";
import { RightPanel } from "./RightPanel.jsx";
import { VisualizationCanvas } from "./VisualizationCanvas.jsx";

export function MainPage({
  data,
  stepIndex,
  onPrevStep,
  onNextStep,
  onResetSteps,
  canReset,
  isPlaying,
  onTogglePlay,
  currentExplanation,
  rightPanelTab,
  onRightPanelTabChange,
  stuQuestion,
  onStuQuestionChange,
  messages,
  isChatLoading,
  onSendChat,
  currentArray,
  activeIndices,
  isCompareMode
}) {
  const hasData = Boolean(data);
  const totalSteps = data?.steps?.length || 0;

  return (
    <div className={`main-page ${isCompareMode ? 'compare-layout' : ''}`}>
      <div className="main-left-top">
        {isCompareMode && hasData && (
          <h2 className="text-[#f5f5f5] text-2xl text-center font-medium mb-1">
            {data.title || "Algorithm"}
          </h2>
        )}
        <div className="visualization-card">
          {hasData ? (
            <VisualizationCanvas
              data={data}
              stepIndex={stepIndex}
              currentArray={currentArray}
              activeIndices={activeIndices}
              isCompareMode={isCompareMode}
            />
          ) : (
            <p className="placeholder-text">
              Generate an algorithm on the landing page to see its visualization
              here.
            </p>
          )}
        </div>
      </div>

      {!isCompareMode && (
        <RightPanel
          data={data}
          rightPanelTab={rightPanelTab}
          onChangeTab={onRightPanelTabChange}
          stuQuestion={stuQuestion}
          onStuQuestionChange={onStuQuestionChange}
          messages={messages}
          isChatLoading={isChatLoading}
          onSendChat={onSendChat}
        />
      )}

      <div className="main-left-bottom">
        <StepControls
          hasData={hasData}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          onPrev={onPrevStep}
          onNext={onNextStep}
          onReset={onResetSteps}
          canReset={canReset}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
        />
        <StepsCard currentExplanation={currentExplanation} />
      </div>
    </div>
  );
}

