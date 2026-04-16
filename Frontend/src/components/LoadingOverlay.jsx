import React from "react";

export function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay ">
      <div className="loading-card">
        <div className="spinner" />
        <p className="text-black py-5" >Generating visualization...</p>
      </div>
    </div>
  );
}

