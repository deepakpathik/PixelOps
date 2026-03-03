import { TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react";
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
      {players.length === 0 ? (
        <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
          <Trophy size={48} className="text-zinc-800 mb-4" />
          <h4 className="text-xl font-medium text-zinc-300 mb-2">No Leaderboard Data</h4>
          <p className="text-zinc-500 max-w-md">The servers are currently syncing player records. Check back soon when the rankings go live.</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40">
                <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider w-24">Rank</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Player</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Score</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider w-32">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {players.map((player) => (
                <tr
                  key={player.rank}
                  className={`transition-colors ${
                    player.isCurrentUser
                      ? "bg-[#107C10]/10 hover:bg-[#107C10]/20"
                      : "hover:bg-zinc-900/50"
                  }`}
                >
                  <td className="py-4 px-6">
                    <div
                      className={`text-lg font-bold ${
                        player.rank <= 3 ? "text-[#107C10]" : player.isCurrentUser ? "text-white" : "text-zinc-400"
                      }`}
                    >
                      #{player.rank}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800">
                        <span className="text-sm font-bold text-zinc-400">
                          {player.player.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className={`font-semibold ${player.isCurrentUser ? "text-white" : "text-zinc-200"}`}>{player.player}</div>
                      {player.isCurrentUser && (
                        <span className="px-2 py-0.5 bg-[#107C10] text-xs font-bold text-white rounded-sm">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="text-lg font-bold font-mono">{player.score.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {player.trend === "up" && (
                        <>
                          <TrendingUp size={16} className="text-[#107C10]" />
                          <span className="text-sm font-bold text-[#107C10]">+{player.change}</span>
                        </>
                      )}
                      {player.trend === "down" && (
                        <>
                          <TrendingDown size={16} className="text-red-500" />
                          <span className="text-sm font-bold text-red-500">-{player.change}</span>
                        </>
                      )}
                      {player.trend === "same" && (
                        <>
                          <Minus size={16} className="text-zinc-600" />
                          <span className="text-sm font-bold text-zinc-600">0</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
