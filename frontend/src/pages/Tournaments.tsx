import { Calendar, Users, Trophy, Coins } from "lucide-react";
import { useState } from "react";

export function Tournaments() {
  const [view, setView] = useState<"list" | "bracket">("list");

  const tournaments: any[] = [];
  const bracketMatches: any[] = [];

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
            onClick={() => setView("bracket")}
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

      {view === "list" ? (
        <div className="space-y-4">
          {tournaments.length === 0 ? (
            <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
              <Trophy size={48} className="text-zinc-800 mb-4" />
              <h4 className="text-xl font-medium text-zinc-300 mb-2">No Tournaments Available</h4>
              <p className="text-zinc-500 max-w-md">There are no scheduled tournaments at the moment. Check back later for upcoming events.</p>
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="pixelops-card p-6"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-sm ${
                          tournament.status === "LIVE"
                            ? "bg-[#107C10]/20 text-[#107C10] border border-[#107C10]/30"
                            : tournament.status === "UPCOMING"
                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {tournament.status}
                      </span>
                    </div>
                  <div className="text-sm font-medium text-zinc-500">{tournament.game}</div>
                </div>

                <button className="px-8 py-2.5 bg-[#107C10] text-white font-bold rounded-md pixelops-btn shadow-lg shadow-[#107C10]/20">
                  {tournament.status === "LIVE" ? "Watch" : tournament.status === "UPCOMING" ? "Join" : "Results"}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md border border-zinc-800/50">
                  <Calendar size={20} className="text-zinc-400" />
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Start Time</div>
                    <div className="text-sm font-bold text-zinc-200">{tournament.startDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md border border-zinc-800/50">
                  <Users size={20} className="text-zinc-400" />
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Players</div>
                    <div className="text-sm font-bold text-zinc-200">{tournament.players}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-md border border-zinc-800/50">
                  <Coins size={20} className="text-zinc-400" />
                  <div>
                    <div className="text-xs text-zinc-500 mb-0.5">Entry Fee</div>
                    <div className="text-sm font-bold text-zinc-200 font-mono">{tournament.entryFee.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#107C10]/5 rounded-md border border-[#107C10]/20">
                  <Trophy size={20} className="text-[#107C10]" />
                  <div>
                    <div className="text-xs text-[#107C10] font-medium mb-0.5">Prize Pool</div>
                    <div className="text-sm font-bold text-[#107C10] font-mono">{tournament.prize.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      ) : (
        <div className="pixelops-card p-10">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Trophy size={28} className="text-[#107C10]" />
            Cyber Strike Championship - Bracket
          </h3>

          {bracketMatches.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Users size={48} className="text-zinc-800 mb-4" />
              <h4 className="text-xl font-medium text-zinc-300 mb-2">Bracket Not Generated</h4>
              <p className="text-zinc-500 max-w-md">The bracket will be visible once the tournament starts and initial matchmaking is complete.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {["Finals", "Semi-Finals", "Quarter-Finals"].map((round) => (
                <div key={round}>
                  <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 pl-2 border-l-2 border-[#107C10]">{round}</div>
                  <div className="space-y-3">
                    {bracketMatches
                      .filter((m) => m.round === round)
                      .map((match) => (
                        <div
                          key={`${match.round}-${match.match}`}
                          className="bg-zinc-900/50 border border-zinc-800 rounded-md p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-1">
                              <div
                                className={`flex items-center justify-between py-2 px-4 rounded-sm transition-colors ${
                                  match.winner === match.player1
                                    ? "bg-[#107C10]/20 border border-[#107C10]/50"
                                    : "bg-zinc-950 font-medium text-zinc-400"
                                }`}
                              >
                                <span className={match.winner === match.player1 ? "text-white font-bold" : ""}>{match.player1}</span>
                                {match.winner === match.player1 && (
                                  <Trophy size={14} className="text-[#107C10]" />
                                )}
                              </div>
                              <div
                                className={`flex items-center justify-between py-2 px-4 rounded-sm transition-colors ${
                                  match.winner === match.player2
                                    ? "bg-[#107C10]/20 border border-[#107C10]/50"
                                    : "bg-zinc-950 font-medium text-zinc-400"
                                }`}
                              >
                                <span className={match.winner === match.player2 ? "text-white font-bold" : ""}>{match.player2}</span>
                                {match.winner === match.player2 && (
                                  <Trophy size={14} className="text-[#107C10]" />
                                )}
                              </div>
                            </div>
                          </div>
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
