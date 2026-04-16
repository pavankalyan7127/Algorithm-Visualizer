import React from "react";

const RightSideTab = () => {
  return (
    <div className="bg-[#76a779ff]/40 rounded-2xl shadow-lg flex items-center justify-between p-10 w-full ">
      {/* Left side: Text info */}
      <div className="space-y-6 text-base w-2/3">
        <h2 className="text-white font-semibold text-4xl">Insights</h2>

        <div className="flex justify-center bg-[#0b0f0a] rounded-lg px-6 py-3 shadow-sm">
          <span className="text-[#9be15d]">Any Algorithm</span>
        </div>

        <div className="flex justify-center bg-[#0b0f0a] rounded-lg px-6 py-3 shadow-sm">
          <span className="text-[#9be15d]">Dynamic Animations</span>
        </div>

        <div className="flex justify-center bg-[#0b0f0a] rounded-lg px-6 py-3 shadow-sm">
          <span className="text-[#9be15d]">Step Explanations</span>
        </div>

        <div className="flex justify-center bg-[#0b0f0a] rounded-lg px-6 py-3 shadow-sm">
          <span className="text-[#9be15d]">Doubt Solver</span>
        </div>

        <div className="flex justify-center bg-[#0b0f0a] rounded-lg px-6 py-3 shadow-sm">
          <span className="text-[#9be15d]">Multi Structure Support</span>
        </div>
      </div>

      {/* Right side: Graphics */}
      <div className="flex flex-col items-center justify-center self-center space-y-6">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
          <img src="./src/assets/chip.png" className="w-14 h-14" />
        </div>
    
      
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
          <img src="./src/assets/data.png" className="w-25 h-25" />
        </div>
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
          <img src="./src/assets/exam.png" className="w-14 h-14" />
        </div>
      </div>
    </div>
  );
};

export default RightSideTab;
