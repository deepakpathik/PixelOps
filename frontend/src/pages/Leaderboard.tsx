import { TrendingUp, TrendingDown, Minus, Trophy, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getGames, getLeaderboard, ApiGame, ApiLeaderboardEntry } from "../services/api";

export function Leaderboard() {
  const { user } = useAuth();
  const [games, setGames] = useState<ApiGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [players, setPlayers] = useState<ApiLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all games for game selector
  useEffect(() => {
    getGames(1, 50)
      .then((g) => {
        setGames(g);
        if (g.length > 0) setSelectedGameId(g[0].id);
      })
      .catch(console.error);
  }, []);

  // Load leaderboard whenever selected game changes
  useEffect(() => {
    if (!selectedGameId) return;
    setLoading(true);
    setPlayers([]);
    getLeaderboard(selectedGameId, 1, 20)
      .then(setPlayers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedGameId]);

  const selectedGame = games.find((g) => g.id === selectedGameId);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
          <p className="text-zinc-500">Top players ranked by high score</p>
        </div>

        {/* Game Selector */}
        {games.length > 0 && (
          <div className="relative">
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="appearance-none bg-zinc-950 border border-zinc-800 text-white rounded-md pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[#107C10] transition-colors cursor-pointer"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-500">Syncing rankings...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && players.length === 0 && (
        <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
          <Trophy size={48} className="text-zinc-800 mb-4" />
          <h4 className="text-xl font-medium text-zinc-300 mb-2">
            {games.length === 0 ? "No Games Available" : "No Scores Yet"}
          </h4>
          <p className="text-zinc-500 max-w-md">
            {games.length === 0
              ? "No games found on the server."
              : `No scores have been submitted for ${selectedGame?.title ?? "this game"} yet.`}
          </p>
        </div>
      )}

      {/* Leaderboard Table */}
      {!loading && players.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-sm">
          {selectedGame && (
            <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/40 flex items-center gap-2">
              <Trophy size={16} className="text-[#107C10]" />
              <span className="font-semibold text-sm">{selectedGame.title}</span>
              <span className="text-xs text-zinc-500 ml-1">{selectedGame.format}</span>
            </div>
          )}
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40">
                <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider w-24">
                  Rank
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="text-right py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-center py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider w-32">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {players.map((player) => {
                const isCurrentUser = user?.username === player.username;
                const trend = player.rank <= 3 ? "up" : "same";
                return (
                  <tr
                    key={player.rank}
                    className={`transition-colors ${
                      isCurrentUser
                        ? "bg-[#107C10]/10 hover:bg-[#107C10]/20"
                        : "hover:bg-zinc-900/50"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div
                        className={`text-lg font-bold ${
                          player.rank <= 3
                            ? "text-[#107C10]"
                            : isCurrentUser
                            ? "text-white"
                            : "text-zinc-400"
                        }`}
                      >
                        #{player.rank}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800">
                          <span className="text-sm font-bold text-zinc-400">
                            {player.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div
                          className={`font-semibold ${isCurrentUser ? "text-white" : "text-zinc-200"}`}
                        >
                          {player.username}
                        </div>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 bg-[#107C10] text-xs font-bold text-white rounded-sm">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="text-lg font-bold font-mono">
                        {player.score.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {trend === "up" ? (
                          <>
                            <TrendingUp size={16} className="text-[#107C10]" />
                            <span className="text-sm font-bold text-[#107C10]">Top</span>
                          </>
                        ) : (
                          <>
                            <Minus size={16} className="text-zinc-600" />
                            <span className="text-sm font-bold text-zinc-600">—</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
