import React from "react";

export function AlgoDetails({ data }) {
  if (!data) return null;

  return (
    <div className="algo-details">
      <h3 className="text-[#9be15d] text-3xl flex flex-col items-center justify-center mb-4">{data.title}</h3>
      <p className="algo-summary text-base text-center py-2">{data.explanation}</p>

      <h4 className="text-[#9be15d] text-3xl flex flex-col items-center justify-center mb-4">Pseudocode</h4>
      <pre className="algo-pseudocode">{data.pseudocode}</pre>
    </div>
  );
}

