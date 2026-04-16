import React from "react";

export function StepControls({
  hasData,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  canReset,
  isPlaying,
  onTogglePlay
}) {
  const btnClass =
    "px-5 py-2 my-6 rounded-xl border border-[#9CE060] bg-[#9CE060] text-black hover:bg-[#9be15d]/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="step-controls">
      <div className="step-controls-row">
        <button
          className={btnClass}
          onClick={onPrev}
          disabled={!hasData || stepIndex === 0}
        >
          ◀ Prev
        </button>
        <span className="step-counter">
          {hasData ? `Step ${stepIndex + 1} / ${totalSteps || 1}` : "No steps yet"}
        </span>
        <button
          className={btnClass}
          onClick={onNext}
          disabled={!hasData || stepIndex === (totalSteps || 1) - 1}
        >
          Next ▶
        </button>
      </div>
      <div className="step-controls-row ">
        
        <button className={btnClass} onClick={onReset} disabled={!canReset}>
          Reset
        </button>
        <button
          className={btnClass}
          onClick={onTogglePlay}
          disabled={!hasData || totalSteps <= 1}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}

