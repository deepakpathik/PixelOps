import { useState, useEffect } from "react";
import { TrendingUp, Clock, Trophy, Gamepad2, Zap, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getGames, getWallet, getTransactions, submitScore, ApiGame, ApiTransaction } from "../services/api";

export function Dashboard() {
  const { user, isGuest } = useAuth();
  const [games, setGames] = useState<ApiGame[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [recentActivity, setRecentActivity] = useState<ApiTransaction[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  // Score submit modal state
  const [scoreModal, setScoreModal] = useState<{ game: ApiGame } | null>(null);
  const [scoreValue, setScoreValue] = useState("");
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [scoreSubmitting, setScoreSubmitting] = useState(false);
  const [scoreSuccess, setScoreSuccess] = useState(false);

  useEffect(() => {
    getGames(1, 9)
      .then(setGames)
      .catch(console.error)
      .finally(() => setGamesLoading(false));
  }, []);

  useEffect(() => {
    if (!isGuest) {
      getWallet()
        .then((w) => setBalance(w.balance))
        .catch(console.error);
        
      getTransactions(1, 5)
        .then(setRecentActivity)
        .catch(console.error);
    }
  }, [isGuest]);

  const openScoreModal = (game: ApiGame) => {
    if (isGuest) return;
    setScoreModal({ game });
    setScoreValue("");
    setScoreError(null);
    setScoreSuccess(false);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreModal) return;
    setScoreError(null);
    setScoreSubmitting(true);
    try {
      await submitScore(scoreModal.game.id, parseInt(scoreValue, 10));
      setScoreSuccess(true);
      setTimeout(() => setScoreModal(null), 1500);
    } catch (err: unknown) {
      setScoreError(err instanceof Error ? err.message : "Score submission failed");
    } finally {
      setScoreSubmitting(false);
    }
  };

  const formatBalance = (b: number | null) =>
    b === null ? "—" : b.toLocaleString();

  const gameFormatIcon: Record<string, string> = {
    HTML5: "🌐",
    WEBGL: "🎮",
    IFRAME: "🖼️",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Score Submit Modal */}
      {scoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl relative p-6">
            <button
              onClick={() => setScoreModal(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold mb-1">Submit Score</h3>
            <p className="text-sm text-zinc-500 mb-5">{scoreModal.game.title}</p>

            {scoreSuccess ? (
              <div className="py-6 text-center">
                <Trophy size={40} className="text-[#107C10] mx-auto mb-3" />
                <p className="font-bold text-white">Score submitted!</p>
              </div>
            ) : (
              <form onSubmit={handleScoreSubmit} className="space-y-4">
                {scoreError && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-sm">
                    {scoreError}
                  </p>
                )}
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Your Score</label>
                  <input
                    type="number"
                    min={0}
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    placeholder="Enter score"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-3 text-2xl font-bold font-mono focus:outline-none focus:border-[#107C10] transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={scoreSubmitting}
                  className="w-full bg-[#107C10] hover:bg-[#0d6b0d] disabled:opacity-50 text-white font-bold py-3 rounded-sm transition-colors"
                >
                  {scoreSubmitting ? "Submitting..." : "Submit Score"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hero / Profile Card */}
      <div className="pixelops-card p-8 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-1">
              {isGuest ? "Guest Player" : user?.username}
            </h2>
            <p className="text-zinc-500 capitalize">
              {isGuest ? "Unranked" : user?.role?.toLowerCase()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#107C10]">
              {formatBalance(balance)}
            </div>
            <div className="text-sm text-zinc-500">Coins Balance</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-zinc-900/50 rounded-md p-3 text-center">
            <div className="text-sm text-zinc-500 mb-1 flex items-center justify-center gap-1">
              <Gamepad2 size={14} /> Games
            </div>
            <div className="font-bold">{games.length}</div>
          </div>
          <div className="bg-zinc-900/50 rounded-md p-3 text-center">
            <div className="text-sm text-zinc-500 mb-1 flex items-center justify-center gap-1">
              <TrendingUp size={14} /> Role
            </div>
            <div className="font-bold capitalize">
              {isGuest ? "—" : user?.role?.toLowerCase()}
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-md p-3 text-center">
            <div className="text-sm text-zinc-500 mb-1 flex items-center justify-center gap-1">
              <Zap size={14} /> Status
            </div>
            <div className="font-bold text-[#107C10]">
              {isGuest ? "Guest" : "Active"}
            </div>
          </div>
        </div>
      </div>

      {/* Game Library */}
      <div>
        <h3 className="text-lg font-bold mb-4">Game Library</h3>
        {gamesLoading ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500">Loading games from server...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <Trophy size={48} className="text-zinc-800 mb-4" />
            <h4 className="text-lg font-medium text-zinc-300 mb-1">No Games Available</h4>
            <p className="text-zinc-500 max-w-sm">
              Games will appear here once a developer uploads them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="pixelops-card overflow-hidden cursor-pointer group"
                onClick={() => openScoreModal(game)}
              >
                <div className="aspect-video bg-zinc-900 flex items-center justify-center text-6xl group-hover:brightness-110 transition-all">
                  {gameFormatIcon[game.format] ?? "🕹️"}
                </div>
                <div className="p-5">
                  <h4 className="font-bold mb-1 group-hover:text-[#107C10] transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{game.description}</p>
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span className="px-2 py-0.5 bg-zinc-900 rounded-sm border border-zinc-800">
                      {game.format}
                    </span>
                    {!isGuest && (
                      <span className="text-[#107C10] font-medium">Click to submit score →</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        {!isGuest && recentActivity.length > 0 ? (
          <div className="pixelops-card divide-y divide-zinc-800/60">
            {recentActivity.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "REWARD" ? "bg-yellow-500/20 text-yellow-500" :
                    tx.type === "ENTRY_FEE" ? "bg-blue-500/20 text-blue-500" :
                    tx.type === "CREDIT" ? "bg-[#107C10]/20 text-[#107C10]" :
                    "bg-zinc-800 text-zinc-400"
                  }`}>
                    {tx.type === "REWARD" ? "🏆" : tx.type === "ENTRY_FEE" ? "⚔️" : "💰"}
                  </div>
                  <div>
                    <p className="font-bold">{tx.type.replace("_", " ")}</p>
                    <p className="text-xs text-zinc-500">{new Date(tx.createdAt).toLocaleString(undefined, {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}</p>
                  </div>
                </div>
                <div className={`font-bold font-mono ${tx.amount > 0 ? "text-[#107C10]" : "text-white"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <Clock size={48} className="text-zinc-800 mb-4" />
            <h4 className="text-lg font-medium text-zinc-300 mb-1">No Activity Found</h4>
            <p className="text-zinc-500 max-w-sm">
              Play a game and submit a score to see your history here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
