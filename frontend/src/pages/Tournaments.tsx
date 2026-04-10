import { Calendar, Users, Trophy, Coins, Swords } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTournaments,
  getTournamentBracket,
  joinTournament,
  ApiTournament,
  ApiMatch,
} from "../services/api";

const STATUS_STYLE: Record<string, string> = {
  CREATED: "bg-zinc-800 text-zinc-400 border border-zinc-700",
  OPEN: "bg-blue-600/20 text-blue-400 border border-blue-500/30",
  ONGOING: "bg-[#107C10]/20 text-[#107C10] border border-[#107C10]/30",
  COMPLETED: "bg-zinc-800/50 text-zinc-400 border border-zinc-700",
  ARCHIVED: "bg-zinc-800/30 text-zinc-600 border border-zinc-700/50",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Tournaments() {
  const { isGuest } = useAuth();
  const [view, setView] = useState<"list" | "bracket">("list");
  const [tournaments, setTournaments] = useState<ApiTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Bracket state
  const [selectedTournament, setSelectedTournament] = useState<ApiTournament | null>(null);
  const [bracketMatches, setBracketMatches] = useState<ApiMatch[]>([]);
  const [bracketLoading, setBracketLoading] = useState(false);

  useEffect(() => {
    getTournaments(1, 20)
      .then(setTournaments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (tournament: ApiTournament) => {
    if (isGuest) return;
    setJoining(tournament.id);
    setJoinError(null);
    try {
      await joinTournament(tournament.id);
      // Refresh list
      const updated = await getTournaments(1, 20);
      setTournaments(updated);
    } catch (err: unknown) {
      setJoinError(err instanceof Error ? err.message : "Failed to join tournament");
    } finally {
      setJoining(null);
    }
  };

  const openBracket = async (tournament: ApiTournament) => {
    setSelectedTournament(tournament);
    setView("bracket");
    setBracketLoading(true);
    setBracketMatches([]);
    try {
      const matches = await getTournamentBracket(tournament.id);
      setBracketMatches(Array.isArray(matches) ? matches : []);
    } catch {
      setBracketMatches([]);
    } finally {
      setBracketLoading(false);
    }
  };

  const actionLabel = (t: ApiTournament) => {
    if (t.status === "ONGOING" || t.status === "COMPLETED") return "Bracket";
    if (t.status === "OPEN") return "Join";
    return "View";
  };

  const handleAction = (t: ApiTournament) => {
    if (t.status === "ONGOING" || t.status === "COMPLETED") {
      openBracket(t);
    } else if (t.status === "OPEN") {
      handleJoin(t);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Tournaments</h2>
          <p className="text-zinc-500">Compete for glory and rewards</p>
        </div>

        <div className="flex gap-1 bg-zinc-950 border border-zinc-800 rounded-sm p-1">
          <button
            onClick={() => setView("list")}
            className={`px-6 py-2 rounded-md font-bold transition-all duration-200 ${
              view === "list"
                ? "bg-[#107C10] text-white shadow-md shadow-[#107C10]/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => {
              if (view !== "bracket") {
                if (!selectedTournament && tournaments.length > 0) {
                  const active = tournaments.find((t) => t.status === "ONGOING" || t.status === "COMPLETED") || tournaments[0];
                  openBracket(active);
                } else {
                  setView("bracket");
                }
              }
            }}
            className={`px-6 py-2 rounded-md font-bold transition-all duration-200 ${
              view === "bracket"
                ? "bg-[#107C10] text-white shadow-md shadow-[#107C10]/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            Bracket View
          </button>
        </div>
      </div>

      {joinError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
          {joinError}
        </div>
      )}

      {view === "list" ? (
        <div className="space-y-4">
          {loading ? (
            <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-500">Loading tournaments...</p>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
              <Trophy size={48} className="text-zinc-800 mb-4" />
              <h4 className="text-xl font-medium text-zinc-300 mb-2">No Tournaments Available</h4>
              <p className="text-zinc-500 max-w-md">
                There are no scheduled tournaments at the moment. Check back later.
              </p>
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div key={tournament.id} className="pixelops-card p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-sm ${STATUS_STYLE[tournament.status] ?? ""}`}>
                        {tournament.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction(tournament)}
                    disabled={
                      joining === tournament.id ||
                      (isGuest && tournament.status === "OPEN") ||
                      tournament.status === "CREATED" ||
                      tournament.status === "ARCHIVED"
                    }
                    className="px-8 py-2.5 bg-[#107C10] hover:bg-[#0d6b0d] disabled:opacity-50 text-white font-bold rounded-md shadow-lg shadow-[#107C10]/20 transition-colors"
                  >
                    {joining === tournament.id ? "Joining..." : actionLabel(tournament)}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md border border-zinc-800/50">
                    <Calendar size={20} className="text-zinc-400" />
                    <div>
                      <div className="text-xs text-zinc-500 mb-0.5">Start</div>
                      <div className="text-sm font-bold text-zinc-200">
                        {formatDate(tournament.startDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md border border-zinc-800/50">
                    <Calendar size={20} className="text-zinc-400" />
                    <div>
                      <div className="text-xs text-zinc-500 mb-0.5">End</div>
                      <div className="text-sm font-bold text-zinc-200">
                        {formatDate(tournament.endDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md border border-zinc-800/50">
                    <Coins size={20} className="text-zinc-400" />
                    <div>
                      <div className="text-xs text-zinc-500 mb-0.5">Entry Fee</div>
                      <div className="text-sm font-bold text-zinc-200 font-mono">
                        {tournament.entryFee.toLocaleString()} coins
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[#107C10]/5 rounded-md border border-[#107C10]/20">
                    <Swords size={20} className="text-[#107C10]" />
                    <div>
                      <div className="text-xs text-[#107C10] font-medium mb-0.5">Status</div>
                      <div className="text-sm font-bold text-[#107C10]">{tournament.status}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="pixelops-card p-10">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Trophy size={28} className="text-[#107C10]" />
            {selectedTournament?.name ?? "Select a Tournament"}
          </h3>
          <p className="text-zinc-500 text-sm mb-8">Tournament Bracket</p>

          {bracketLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-500">Loading bracket...</p>
            </div>
          ) : bracketMatches.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Users size={48} className="text-zinc-800 mb-4" />
              <h4 className="text-xl font-medium text-zinc-300 mb-2">Bracket Not Generated</h4>
              <p className="text-zinc-500 max-w-md">
                {selectedTournament
                  ? "The bracket will be visible once the tournament starts."
                  : "Click 'Bracket' on an active tournament to view its matches."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bracketMatches.map((match, idx) => (
                <div key={match.id} className="bg-zinc-900/50 border border-zinc-800 rounded-md p-4">
                  <div className="text-xs text-zinc-500 mb-3 font-bold uppercase tracking-wider">
                    Round {match.roundNumber} — Match {idx + 1}
                  </div>
                  <div className="space-y-2">
                    {[match.player1Id, match.player2Id].map((pid) => (
                      <div
                        key={pid}
                        className={`flex items-center justify-between py-2 px-4 rounded-sm ${
                          match.winnerId === pid
                            ? "bg-[#107C10]/20 border border-[#107C10]/50"
                            : "bg-zinc-950 text-zinc-400"
                        }`}
                      >
                        <span className={match.winnerId === pid ? "text-white font-bold" : ""}>
                          {pid.slice(0, 8)}...
                        </span>
                        {match.winnerId === pid && (
                          <Trophy size={14} className="text-[#107C10]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
