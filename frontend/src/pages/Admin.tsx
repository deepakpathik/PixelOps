import {
  TrendingUp,
  CheckCircle,
  XCircle,
  Shield,
  Gamepad2,
  PlusCircle,
  Trash2,
  Library,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getFraudFlags,
  resolveFraudFlag,
  ApiFraudFlag,
  getGames,
  createGame,
  deleteGame,
  ApiGame,
} from "../services/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
  REVIEWED: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  CONFIRMED: "bg-red-500/20 text-red-500 border border-red-500/30",
  REJECTED: "bg-[#107C10]/20 text-[#107C10] border border-[#107C10]/30",
};

export function Admin() {
  const { user, isGuest } = useAuth();
  const isAdmin = !isGuest && user?.role === "ADMIN";

  const [activeTab, setActiveTab] = useState<"overview" | "games" | "fraud">("overview");

  // Fraud state
  const [fraudFlags, setFraudFlags] = useState<ApiFraudFlag[]>([]);
  const [fraudLoading, setFraudLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  // Games State
  const [games, setGames] = useState<ApiGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  
  // Game Importer Form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFormat, setNewFormat] = useState("HTML5");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    
    // Fetch fraud flags
    getFraudFlags()
      .then(setFraudFlags)
      .catch(console.error)
      .finally(() => setFraudLoading(false));

    // Fetch ALL games (including inactive) for admin
    getGames(1, 100, true)
      .then(setGames)
      .catch(console.error)
      .finally(() => setGamesLoading(false));
  }, [isAdmin]);

  const handleResolve = async (id: string, action: "CONFIRMED" | "REJECTED") => {
    setResolving(id);
    try {
      await resolveFraudFlag(id, action);
      const updated = await getFraudFlags();
      setFraudFlags(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setResolving(null);
    }
  };

  const handleImportGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    setIsImporting(true);
    try {
      await createGame(newTitle, newDesc, newFormat);
      setNewTitle("");
      setNewDesc("");
      setNewFormat("HTML5");
      // Refresh list
      const updated = await getGames(1, 100, true);
      setGames(updated);
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : "Failed to import game.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGame(id);
      const updated = await getGames(1, 100, true);
      setGames(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-zinc-500">System monitoring and management</p>
        </div>
        <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
          <Shield size={48} className="text-zinc-800 mb-4" />
          <h4 className="text-xl font-medium text-zinc-300 mb-2">Access Restricted</h4>
          <p className="text-zinc-500 max-w-md">
            Admin and Developer roles required to access this panel.
          </p>
        </div>
      </div>
    );
  }

  const pendingFlags = fraudFlags.filter((f) => f.status === "PENDING");
  const activeGames = games.filter((g) => g.isActive);
  const archivedGames = games.filter((g) => !g.isActive);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Admin Console</h2>
          <p className="text-zinc-500">Platform management, games, and security</p>
        </div>
        
        {/* Top Tabs aligned like Tournaments */}
        <div className="flex gap-1 bg-zinc-950 border border-zinc-800 rounded-sm p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2 rounded-md font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-[#107C10] text-white shadow-md shadow-[#107C10]/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <TrendingUp size={16} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`px-5 py-2 rounded-md font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "games"
                ? "bg-[#107C10] text-white shadow-md shadow-[#107C10]/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Gamepad2 size={16} /> Game Catalog
          </button>
          <button
            onClick={() => setActiveTab("fraud")}
            className={`px-5 py-2 rounded-md font-bold transition-all duration-200 flex items-center gap-2 ${
              activeTab === "fraud"
                ? "bg-[#107C10] text-white shadow-md shadow-[#107C10]/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <Shield size={16} /> Security
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-4 gap-6">
            <div className="pixelops-card p-6">
              <div className="text-sm font-medium text-zinc-500 mb-2 flex items-center gap-2"><Gamepad2 size={16} /> Active Library</div>
              <div className="text-4xl font-bold text-white font-mono">{activeGames.length}</div>
            </div>
            <div className="pixelops-card p-6 border-zinc-800">
              <div className="text-sm font-medium text-zinc-500 mb-2 flex items-center gap-2"><Library size={16} /> Archived Titles</div>
              <div className="text-4xl font-bold text-zinc-400 font-mono">{archivedGames.length}</div>
            </div>
            <div className="pixelops-card p-6 border-red-500/30">
              <div className="text-sm font-medium text-red-500 mb-2 flex items-center gap-2"><AlertCircle size={16} /> Pending Flags</div>
              <div className="text-4xl font-bold text-red-500 font-mono">{pendingFlags.length}</div>
            </div>
            <div className="pixelops-card p-6">
              <div className="text-sm font-medium text-zinc-500 mb-2 flex items-center gap-2"><CheckCircle size={16} /> Total Audits</div>
              <div className="text-4xl font-bold text-white font-mono">{fraudFlags.length}</div>
            </div>
          </div>
          
          <div className="pixelops-card p-8 bg-zinc-900/40">
            <h3 className="text-xl font-bold mb-3">System Health</h3>
            <div className="space-y-3 font-mono text-sm text-zinc-400">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span>Database Connectivity</span>
                <span className="text-[#107C10] font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span>Fraud Detection Pipeline</span>
                <span className="text-[#107C10] font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Storage Cluster</span>
                <span className="text-[#107C10] font-bold">NOMINAL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "games" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-3 gap-6">
            
            {/* Importer Form */}
            <div className="col-span-1">
              <div className="pixelops-card p-6 border-t-2 border-t-[#107C10]">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-[#107C10]" /> Install New Game
                </h3>
                <form onSubmit={handleImportGame} className="space-y-4">
                  {importError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-sm">
                      {importError}
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Title</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#107C10] transition-colors"
                      placeholder="e.g. Cyber Punk Infinity"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Description</label>
                    <textarea 
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-white outline-none focus:border-[#107C10] transition-colors resize-none h-24"
                      placeholder="High-octane arcade experience..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block flex items-center justify-between">
                      Engine Format
                    </label>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-3 py-2 text-white outline-none focus:border-[#107C10]"
                    >
                      <option value="HTML5">HTML5 Canvas</option>
                      <option value="WEBGL">WebGL / Unity</option>
                      <option value="IFRAME">Embedded IFrame</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isImporting}
                    className="w-full py-3 mt-2 bg-[#107C10] hover:bg-[#0d6b0d] disabled:opacity-50 text-white font-bold rounded-sm shadow-lg shadow-[#107C10]/20 transition-all active:scale-[0.98]"
                  >
                    {isImporting ? "Importing to Registry..." : "Deploy Game"}
                  </button>
                </form>
              </div>
            </div>

            {/* Library Table */}
            <div className="col-span-2">
              <div className="pixelops-card p-6 h-full flex flex-col">
                <h3 className="text-lg font-bold mb-4">Master Game Library</h3>
                {gamesLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="text-zinc-500">Syncing registry...</span>
                  </div>
                ) : games.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                    <Gamepad2 size={32} className="mb-2 opacity-50" />
                    <p>No games in registry. Import a game to start.</p>
                  </div>
                ) : (
                  <div className="overflow-y-auto pr-2" style={{ maxHeight: '600px' }}>
                    <div className="grid gap-3">
                      {games.map(game => (
                        <div key={game.id} className={`flex items-center justify-between p-4 rounded-sm border ${game.isActive ? 'bg-zinc-900 border-zinc-800' : 'bg-red-950/10 border-red-900/30'}`}>
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-white truncate">{game.title}</h4>
                              {!game.isActive && <span className="text-[10px] bg-red-500/20 text-red-500 font-bold px-2 py-0.5 rounded-sm">ARCHIVED</span>}
                              <span className="text-[10px] border border-zinc-700 bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded-sm">{game.format}</span>
                            </div>
                            <p className="text-xs text-zinc-500 truncate">{game.description}</p>
                            <div className="text-[10px] text-zinc-600 mt-2 font-mono">ID: {game.id}</div>
                          </div>
                          
                          {game.isActive && (
                            <button
                              onClick={() => handleDeleteGame(game.id)}
                              disabled={deletingId === game.id}
                              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-colors border border-transparent hover:border-red-500/20 disabled:opacity-50"
                              title="Archive Game"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "fraud" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="pixelops-card p-6">
            <h3 className="text-lg font-bold mb-4">Security Audits</h3>

            {fraudLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500">Running advanced diagnostics...</p>
              </div>
            ) : fraudFlags.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#107C10]/10 flex items-center justify-center mb-4">
                  <TrendingUp size={32} className="text-[#107C10]" />
                </div>
                <h4 className="text-xl font-medium text-white mb-2">Systems Status: Secure</h4>
                <p className="text-zinc-500 max-w-sm">
                  No anomalous activity detected.
                </p>
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/40">
                      <th className="text-left py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Score ID</th>
                      <th className="text-left py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Reason</th>
                      <th className="text-center py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                      <th className="text-center py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {fraudFlags.map((flag) => (
                      <tr key={flag.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="py-3 px-5 font-mono text-xs text-zinc-400">
                          {flag.score?.id?.slice(0, 12) ?? flag.id.slice(0, 12)}...
                        </td>
                        <td className="py-3 px-5 text-sm font-medium text-zinc-300">{flag.reason}</td>
                        <td className="py-3 px-5">
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 text-xs font-bold rounded-md ${STATUS_STYLE[flag.status] ?? ""}`}>
                              {flag.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-right text-xs font-medium text-zinc-500">
                          {formatDate(flag.createdAt)}
                        </td>
                        <td className="py-3 px-5">
                          {flag.status === "PENDING" && (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleResolve(flag.id, "CONFIRMED")}
                                disabled={resolving === flag.id}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded-sm border border-red-500/30 disabled:opacity-50 transition-colors"
                              >
                                Burn
                              </button>
                              <button
                                onClick={() => handleResolve(flag.id, "REJECTED")}
                                disabled={resolving === flag.id}
                                className="px-3 py-1 bg-[#107C10]/20 hover:bg-[#107C10]/30 text-[#107C10] text-xs font-bold rounded-sm border border-[#107C10]/30 disabled:opacity-50 transition-colors"
                              >
                                Forgive
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
