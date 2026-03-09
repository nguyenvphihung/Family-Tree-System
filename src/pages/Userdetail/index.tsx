import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, Volume2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface GameData {
  question: string;
  answers: string[];
  imageUrl?: string;
}

const UserDetail = () => {
  const navigate = useNavigate();
  const { treeId } = useParams();

  // ✅ Demo Mode
  const [demoMode, setDemoMode] = useState(false);

  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Game States
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [volumeOn, setVolumeOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  // ✅ Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      const res = await fetch("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetchGameData();
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  // ✅ Load demo data
  const loadDemoData = () => {
    setDemoMode(true);
    setGameData({
      question: "Ai là người sáng lập gia tộc của chúng ta?",
      answers: ["Ông Nguyễn Văn A", "Ông Nguyễn Văn B", "Ông Nguyễn Văn C", "Ông Nguyễn Văn D"],
      imageUrl: "https://via.placeholder.com/400x300?text=Family+Ancestor",
    });
    setPlayers([
      { id: "1", name: "Nguyễn Văn A", score: 1000, rank: 1, isCurrentUser: true },
      { id: "2", name: "Trần Thị B", score: 950, rank: 2 },
      { id: "3", name: "Phạm Văn C", score: 900, rank: 3 },
      { id: "4", name: "Hoàng Thị D", score: 850, rank: 4 },
      { id: "5", name: "Vũ Văn E", score: 800, rank: 5 },
    ]);
    setLoading(false);
  };

  // Fetch game data
  useEffect(() => {
    if ((isAuthenticated || demoMode) && treeId) {
      if (!demoMode) {
        fetchGameData();
      }
    }
  }, [isAuthenticated, demoMode, treeId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const fetchGameData = async () => {
    if (!treeId) {
      setError("Invalid tree ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const res = await fetch(`/trees/${treeId}/game`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setGameData(data.gameData);
      setPlayers(data.players);
      setError(null);
      setTimeLeft(30);
      setSelectedAnswer(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const callApi = async (answer: string) => {
    setSelectedAnswer(answer);
    setIsAnswering(true);

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`/trees/${treeId}/game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answer }),
      });

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      console.log("Result:", data);

      if (data.players) setPlayers(data.players);

      if (data.success) {
        setTimeout(() => fetchGameData(), 2000);
      }
    } catch (error) {
      console.error("API error:", error);
      setError("Lỗi khi gửi đáp án");
      setIsAnswering(false);
    }
  };

  // ✅ Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#161e2e] flex items-center justify-center">
        <div className="text-white text-lg">Đang kiểm tra đăng nhập...</div>
      </div>
    );
  }

  // ✅ Not Authenticated & Not Demo Mode
  if (!isAuthenticated && !demoMode) {
    return (
      <div className="min-h-screen bg-[#161e2e] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-2xl font-bold mb-4">
            ❌ Bạn cần đăng nhập để vào trò chơi!
          </div>
          <p className="text-gray-300 mb-6">
            Vui lòng đăng nhập để tiếp tục hoặc xem demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              🔐 Đăng nhập
            </button>
            <button
              onClick={loadDemoData}
              className="bg-green-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-600 transition"
            >
              👁️ Xem Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161e2e] flex items-center justify-center">
        <div className="text-white text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#161e2e] flex items-center justify-center">
        <div className="text-red-500 text-lg">Lỗi: {error}</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-[#161e2e] flex items-center justify-center">
        <div className="text-white text-lg">Không có dữ liệu trò chơi</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161e2e] flex items-center justify-center p-4">
      {/* ✅ Demo Mode Badge */}
      {demoMode && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-full">
          🎭 DEMO MODE
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-xl overflow-hidden shadow-lg">
        {/* Scoreboard Section */}
        <div className="bg-[#a3c9fa] w-full md:w-1/3 p-6">
          <h2 className="text-xl font-bold text-yellow-600 mb-4 text-center md:text-left">
            🏆 BẢNG XẾP HẠNG
          </h2>
          <ul className="space-y-3">
            {players.map((player) => (
              <li
                key={player.id}
                className={`flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm transition ${
                  player.isCurrentUser ? "border-3 border-yellow-400 bg-yellow-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      player.rank === 1
                        ? "bg-yellow-500"
                        : player.rank === 2
                        ? "bg-gray-400"
                        : player.rank === 3
                        ? "bg-orange-600"
                        : "bg-blue-500"
                    }`}
                  >
                    {player.rank}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {player.name}
                    {player.isCurrentUser && " (Bạn)"}
                  </span>
                </div>
                <span className="font-bold text-blue-600">{player.score}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Game/Question Section */}
        <div className="bg-[#232b3e] w-full md:w-2/3 p-6 flex flex-col relative">
          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-white font-bold text-lg">⏱️ {timeLeft}s</div>
            <div className="flex gap-3">
              <button
                className={`rounded-full p-2 transition ${
                  micOn ? "bg-white" : "bg-red-500"
                }`}
                title="Mic"
                onClick={() => setMicOn(!micOn)}
              >
                <Mic
                  size={20}
                  className={micOn ? "text-[#59698d]" : "text-white"}
                />
              </button>
              <button
                className={`rounded-full p-2 transition ${
                  volumeOn ? "bg-white" : "bg-red-500"
                }`}
                title="Volume"
                onClick={() => setVolumeOn(!volumeOn)}
              >
                <Volume2
                  size={20}
                  className={volumeOn ? "text-[#59698d]" : "text-white"}
                />
              </button>
            </div>
          </div>

          {/* Question */}
          <div className="text-white text-lg font-semibold mb-8 text-center p-4 bg-[#1a2235] rounded-lg min-h-20 flex items-center justify-center">
            {gameData.question}
          </div>

          {/* Answers */}
          <div className="space-y-4 mb-8 flex-1">
            {gameData.answers.map((ans, idx) => (
              <button
                key={idx}
                className={`w-full rounded-lg px-4 py-3 text-white font-semibold transition ${
                  selectedAnswer === ans
                    ? "bg-green-500 border-2 border-green-400"
                    : "bg-[#2f3d52] border border-[#3e4a64] hover:bg-[#3e4a64]"
                } ${isAnswering ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (demoMode) {
                    setSelectedAnswer(ans);
                    setTimeout(() => {
                      setSelectedAnswer(null);
                      setTimeLeft(30);
                    }, 1500);
                  } else {
                    callApi(ans);
                  }
                }}
                disabled={isAnswering}
              >
                {ans}
              </button>
            ))}
          </div>

          {/* Image Placeholder */}
          {gameData.imageUrl ? (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={gameData.imageUrl}
                alt="Game"
                className="w-full h-40 object-cover"
              />
            </div>
          ) : (
            <div className="mb-6 bg-white rounded-lg p-6 text-center">
              <div className="bg-gray-200 h-40 rounded-md flex items-center justify-center text-gray-500">
                Image Placeholder
              </div>
            </div>
          )}

          {/* Leave Button */}
          <button
            className="bg-red-500 text-white font-bold px-6 py-2 rounded-full hover:bg-red-600 transition w-full"
            onClick={() => {
              if (demoMode) {
                setDemoMode(false);
              } else {
                navigate("/");
              }
            }}
          >
            🚪 Rời khỏi
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;