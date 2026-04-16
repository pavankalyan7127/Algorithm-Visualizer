import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Header({ onGenerateAnother }) {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;
  const showNav = path !== "/";
  const isVisualization = path === "/visualization";

  const activeTab =
    path === "/history" ? "history" : path === "/visualization" ? "visualization" : null;

  return (
    <header className="app-header">
      <div className="header-inner flex justify-between items-center">
        <div className="header-title text-4xl font-bold">AI Algorithm Visualizer</div>

        {showNav && (
          <nav className="header-nav">
           
           
            {isVisualization && onGenerateAnother && (
              <button
                className="header-nav-btn"
                onClick={onGenerateAnother}
              >
                Generate another algorithm
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

