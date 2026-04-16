import React, { useState } from "react";
import Tag from "./Tag";
import RightSideTab from "./RightSideTab";


export function LandingPage({
  isCompareMode,
  setIsCompareMode,
  algorithm,
  onAlgorithmChange,
  onImageChange,
  selectedImageName,
  algorithm2,
  onAlgorithm2Change,
  onImage2Change,
  selectedImageName2,
  onGenerate
}) {
  const [showInputCard, setShowInputCard] = useState(false);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="grid grid-cols-2 items-center text-center py-5">
        {/* Left side */}
        <div className="mx-20">
          <Tag />
          <h1 className="text-6xl font-heading my-6 leading-tight">
             AI-Powered {" "} 
            <span className="text-[#9be15d]">Algorithm</span> <br />
            Visualization Platform
          </h1>
          <p className="text-gray-300 text-center text-lg mx-auto">
          Understand algorithms with dynamic visualizations and step-by-step explanations. 
Our AI generates animations for any algorithm and answers your doubts in real time 
to help you learn concepts clearly.
          </p>
        
          <button
            className="px-5 py-2 my-6 rounded-xl border border-[#9CE060] bg-[#9CE060] text-black hover:bg-[#9be15d]/10 hover:text-white"
            onClick={() => setShowInputCard(true)}
          >
            Get Started
          </button>
        </div>

        {/* Right side */}
        <div className="mx-10 flex justify-center">
          {showInputCard ? (
            <section className={`landing-input-card w-full ${isCompareMode ? 'overflow-auto' : ''}`}>
              <div className="flex bg-[#1a1f16] rounded-xl p-1 mb-2 shrink-0">
                <button 
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${!isCompareMode ? "bg-[#9ce060] text-black" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setIsCompareMode(false)}
                >
                  Normal Mode
                </button>
                <button 
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${isCompareMode ? "bg-[#9ce060] text-black" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setIsCompareMode(true)}
                >
                  Compare Mode
                </button>
              </div>

              <h2 className="text-white font-semibold text-2xl shrink-0">
                {isCompareMode ? "Compare Algorithms" : "Input your algorithm"}
              </h2>

              {!isCompareMode ? (
                <>
                  <textarea
                    value={algorithm}
                    onChange={(e) => onAlgorithmChange(e.target.value)}
                    placeholder="E.g. Perform merge sort on the array [5, 2, 9, 1, 7]..."
                    rows={3}
                  />
                  <div className="flex justify-between items-center gap-4 shrink-0">
                    <label className="file-upload">
                      <span>
                        {selectedImageName
                          ? `Image: ${selectedImageName}`
                          : "Upload image (optional)"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                      />
                    </label>
                    <button className="px-5 py-2 rounded-xl border border-[#9CE060] bg-[#9CE060] text-black hover:bg-[#9be15d]/10 hover:text-white font-semibold" onClick={onGenerate}>Generate</button>
                  </div>
                  <p className="text-red-300 text-lg text-center mt-4">
                Generation may take a <br /> few seconds while the AI analyzes your
                input.
              </p>

                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="border border-[#9CE060]/30 p-4 rounded-xl bg-[#000000]/20">
                    <h3 className="text-[#9be15d] text-sm font-bold mb-2">Algorithm 1</h3>
                    <textarea
                      value={algorithm}
                      onChange={(e) => onAlgorithmChange(e.target.value)}
                      placeholder="Algorithm 1 description..."
                      rows={2}
                    />
                    <label className="file-upload mt-2 w-full text-center flex justify-center text-sm px-3 py-1">
                      <span>
                        {selectedImageName
                          ? `Added: ${selectedImageName}`
                          : "+ Add Image"}
                      </span>
                      <input type="file" accept="image/*" onChange={onImageChange} />
                    </label>
                  </div>

                  <div className="border border-[#9CE060]/30 p-4 rounded-xl bg-[#000000]/20">
                    <h3 className="text-[#9be15d] text-sm font-bold mb-2">Algorithm 2</h3>
                    <textarea
                      value={algorithm2}
                      onChange={(e) => onAlgorithm2Change(e.target.value)}
                      placeholder="Algorithm 2 description..."
                      rows={2}
                    />
                    <label className="file-upload mt-2 w-full text-center flex justify-center text-sm px-3 py-1">
                      <span>
                        {selectedImageName2
                          ? `Added: ${selectedImageName2}`
                          : "+ Add Image"}
                      </span>
                      <input type="file" accept="image/*" onChange={onImage2Change} />
                    </label>
                  </div>
                  
                  <button className="px-5 py-2 w-full rounded-xl border border-[#9CE060] bg-[#9CE060] text-black hover:bg-[#9be15d]/10 hover:text-white font-semibold flex-shrink-0" onClick={onGenerate}>Compare Both</button>
                </div>
              )}
            </section>
          ) : (
            <RightSideTab />
          )}
        </div>
      </div>

       {/* Workflow Section */}
       <div className="mx-5  grid grid-cols-3 gap-10 mt-10">
        {/* Step 1 */}
        <div className="bg-[#1a1f16] p-8 rounded-2xl shadow-lg">
          <div className="w-10 h-10 flex items-center justify-center bg-[#9be15d] text-black font-bold rounded-full mb-4">
            1
          </div>
          <h3 className="text-xl font-semibold mb-2">Enter an algorithm</h3>
          <p className="text-gray-400 text-sm">
          Type the name of any algorithm you want to learn.
          Our system accepts a wide range of algorithms across multiple data structures.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#1a1f16] p-8 rounded-2xl shadow-lg">
          <div className="w-10 h-10 flex items-center justify-center bg-[#9be15d] text-black font-bold rounded-full mb-4">
            2
          </div>
          <h3 className="text-xl font-semibold mb-2">AI generates visualizations</h3>
          <p className="text-gray-400 text-sm">
          The AI analyzes the algorithm and produces step-by-step animation data
          to dynamically visualize the algorithm execution.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#1a1f16] p-8 rounded-2xl shadow-lg">
          <div className="w-10 h-10 flex items-center justify-center bg-[#9be15d] text-black font-bold rounded-full mb-4">
            3
          </div>
          <h3 className="text-xl font-semibold mb-2">Real-time doubt solving</h3>
          <p className="text-gray-400 text-sm">
          You can ask any question related to the algorithm, and the AI will answer it in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
