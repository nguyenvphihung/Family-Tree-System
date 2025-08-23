import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, Volume2 } from "lucide-react";

const players = [
  "Tên người chơi 1",
  "Tên người chơi 2",
  "Tên người chơi 3",
  "Tên người chơi 4",
  "Tên người chơi 5",
];

const UserDetail = () => {
  const navigate = useNavigate();
  const { treeId } = useParams(); // lấy treeId từ URL

  const question = "Câu hỏi mẫu: Đây là câu hỏi gì?";
  const answers = ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"];

  // Hàm gọi API demo
  const callApi = async (answer: string) => {
    try {
      const res = await fetch(`/trees/${treeId}/game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) {
        throw new Error("API lỗi: " + res.status);
      }

      const data = await res.json();
      console.log("Kết quả API:", data);
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  // State cho mic và volume
  const [micOn, setMicOn] = useState(true);
  const [volumeOn, setVolumeOn] = useState(true);

  const toggleMic = () => {
    setMicOn(!micOn);
    console.log("Mic:", !micOn ? "Bật" : "Tắt");
  };

  const toggleVolume = () => {
    setVolumeOn(!volumeOn);
    console.log("Volume:", !volumeOn ? "Bật" : "Tắt");
  };

  return (
    <div className="min-h-screen bg-[#161e2e] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-xl overflow-hidden shadow-lg">
        {/* Scoreboard Section */}
        <div className="bg-[#a3c9fa] w-full md:w-1/3 p-6">
          <h2 className="text-xl font-bold text-yellow-300 mb-4 text-center md:text-left">
            BẢNG XẾP HẠNG
          </h2>
          <ul className="space-y-3">
            {players.map((name, idx) => (
              <li
                key={idx}
                className={`flex items-center bg-white rounded-lg px-4 py-2 shadow-sm ${
                  idx === 0 ? "border-2 border-yellow-400" : ""
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-red-600 inline-block mr-3"></span>
                <span className="font-semibold text-gray-800">{name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Game/Question Section */}
        <div className="bg-[#232b3e] w-full md:w-2/3 p-6 relative flex flex-col">
          {/* Top Right Buttons */}
          <div className="absolute top-4 right-4 flex gap-3 items-center">
            <button
              className="bg-white rounded-full p-2"
              title="Mic"
              onClick={toggleMic}
            >
              <Mic
                size={20}
                className={`${
                  micOn ? "text-[#59698d]" : "text-red-500"
                } transition`}
              />
            </button>
            <button
              className="bg-white rounded-full p-2"
              title="Volume"
              onClick={toggleVolume}
            >
              <Volume2
                size={20}
                className={`${
                  volumeOn ? "text-[#59698d]" : "text-red-500"
                } transition`}
              />
            </button>
          </div>

          {/* Main Question & Answers Area */}
          <div className="flex flex-col items-center justify-center flex-1 py-8">
            <div className="text-white text-lg font-semibold mb-6 text-center">
              {question}
            </div>
            <div className="space-y-4 w-full max-w-md mx-auto mb-6">
              {answers.map((ans, idx) => (
                <button
                  key={idx}
                  className="w-full rounded-lg px-4 py-3 bg-[#232b3e] text-white border border-[#3e4a64] text-sm font-semibold hover:bg-green-600 transition"
                  onClick={() => callApi(ans)}
                >
                  {ans}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-lg p-6 text-center text-black font-bold mt-4 w-full max-w-md mx-auto text-sm">
              <div className="text-gray-500 mb-2">Image Placeholder</div>
              <div className="bg-gray-200 h-40 rounded-md"></div>
            </div>
          </div>

          {/* Bottom Left Button (Leave) */}
          <div className="absolute bottom-4 right-4">
            <button
              className="bg-red-500 rounded-full px-5 py-2 text-white font-bold hover:bg-red-600 transition"
              onClick={() => navigate("/")}
              title="Rời khỏi"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
