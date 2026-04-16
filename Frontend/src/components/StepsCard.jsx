import React from "react";

export function StepsCard({ currentExplanation }) {
  return (
    <div className="steps-card ">
      <h3 className="text-[#9be15d] text-3xl flex flex-col items-center justify-center">Step explanation</h3>
      {currentExplanation ? (
        <p className="text-xl text-center py-5">{currentExplanation}</p>
      ) : (
        <p className="placeholder-text">
          Use the step controls to walk through the algorithm.
        </p>
      )}
    </div>
  );
}

