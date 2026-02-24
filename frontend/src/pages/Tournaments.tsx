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
            className={`px-4 py-2 rounded-sm font-medium transition-colors ${
              view === "list"
                ? "bg-[#107C10] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("bracket")}
            className={`px-4 py-2 rounded-sm font-medium transition-colors ${
              view === "bracket"
                ? "bg-[#107C10] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Bracket
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="space-y-3">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-zinc-950 border border-zinc-800 rounded-sm p-5 hover:border-[#107C10] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{tournament.name}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-sm ${
                        tournament.status === "LIVE"
                          ? "bg-[#107C10] text-white"
                          : tournament.status === "UPCOMING"
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-500">{tournament.game}</div>
                </div>

                <button className="px-6 py-2 bg-[#107C10] hover:bg-[#0d6b0d] text-white font-medium rounded-sm transition-colors">
                  {tournament.status === "LIVE" ? "Watch" : tournament.status === "UPCOMING" ? "Join" : "View Results"}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-zinc-500" />
                  <div>
                    <div className="text-xs text-zinc-500">Start Time</div>
                    <div className="text-sm font-medium">{tournament.startDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} className="text-zinc-500" />
                  <div>
                    <div className="text-xs text-zinc-500">Players</div>
                    <div className="text-sm font-medium">{tournament.players}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Coins size={16} className="text-zinc-500" />
                  <div>
                    <div className="text-xs text-zinc-500">Entry Fee</div>
                    <div className="text-sm font-medium">{tournament.entryFee.toLocaleString()} coins</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-[#107C10]" />
                  <div>
                    <div className="text-xs text-zinc-500">Prize Pool</div>
                    <div className="text-sm font-bold text-[#107C10]">{tournament.prize.toLocaleString()} coins</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-6">
          <h3 className="text-lg font-bold mb-6">Cyber Strike Championship - Live Bracket</h3>

          <div className="space-y-6">
            {["Finals", "Semi-Finals", "Quarter-Finals"].map((round) => (
              <div key={round}>
                <div className="text-sm font-medium text-zinc-500 mb-3">{round}</div>
                <div className="space-y-2">
                  {bracketMatches
                    .filter((m) => m.round === round)
                    .map((match) => (
                      <div
                        key={`${match.round}-${match.match}`}
                        className="bg-zinc-900 border border-zinc-800 rounded-sm p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div
                              className={`flex items-center justify-between py-2 px-3 rounded mb-1 ${
                                match.winner === match.player1
                                  ? "bg-[#107C10]/20 border border-[#107C10]"
                                  : "bg-zinc-950"
                              }`}
                            >
                              <span className="font-medium">{match.player1}</span>
                              {match.winner === match.player1 && (
                                <Trophy size={14} className="text-[#107C10]" />
                              )}
                            </div>
                            <div
                              className={`flex items-center justify-between py-2 px-3 rounded ${
                                match.winner === match.player2
                                  ? "bg-[#107C10]/20 border border-[#107C10]"
                                  : "bg-zinc-950"
                              }`}
                            >
                              <span className="font-medium">{match.player2}</span>
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
        </div>
      )}
    </div>
  );
}
