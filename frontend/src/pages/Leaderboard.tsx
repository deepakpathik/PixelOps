import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "alltime">("weekly");

  const players: any[] = [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
        <p className="text-zinc-500">Top players ranked by total score</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-950 border border-zinc-800 rounded-sm p-1 w-fit">
        <button
          onClick={() => setActiveTab("daily")}
          className={`px-6 py-2 rounded-sm font-medium transition-colors ${
            activeTab === "daily"
              ? "bg-[#107C10] text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={`px-6 py-2 rounded-sm font-medium transition-colors ${
            activeTab === "weekly"
              ? "bg-[#107C10] text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setActiveTab("alltime")}
          className={`px-6 py-2 rounded-sm font-medium transition-colors ${
            activeTab === "alltime"
              ? "bg-[#107C10] text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          All-Time
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-sm font-medium text-zinc-500 w-20">Rank</th>
              <th className="text-left p-4 text-sm font-medium text-zinc-500">Player</th>
              <th className="text-right p-4 text-sm font-medium text-zinc-500">Score</th>
              <th className="text-center p-4 text-sm font-medium text-zinc-500 w-32">Trend</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.rank}
                className={`border-b border-zinc-800 last:border-0 transition-colors ${
                  player.isCurrentUser
                    ? "bg-[#107C10]/10 border-[#107C10]/30"
                    : "hover:bg-zinc-900"
                }`}
              >
                <td className="p-4">
                  <div
                    className={`text-lg font-bold ${
                      player.rank <= 3 ? "text-[#107C10]" : player.isCurrentUser ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    #{player.rank}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 rounded flex items-center justify-center">
                      <span className="text-sm font-medium text-zinc-500">
                        {player.player.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="font-medium">{player.player}</div>
                    {player.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-[#107C10] text-xs font-bold rounded-sm">
                        YOU
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="text-lg font-bold">{player.score.toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    {player.trend === "up" && (
                      <>
                        <TrendingUp size={16} className="text-[#107C10]" />
                        <span className="text-sm font-medium text-[#107C10]">+{player.change}</span>
                      </>
                    )}
                    {player.trend === "down" && (
                      <>
                        <TrendingDown size={16} className="text-red-500" />
                        <span className="text-sm font-medium text-red-500">-{player.change}</span>
                      </>
                    )}
                    {player.trend === "same" && (
                      <>
                        <Minus size={16} className="text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-500">0</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
