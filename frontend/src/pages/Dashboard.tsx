import { TrendingUp, Clock, Trophy } from "lucide-react";

export function Dashboard() {
  const games: any[] = [];

  const recentActivity: any[] = [];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="pixelops-card p-8 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-1">Level 0</h2>
            <p className="text-zinc-500">Unranked</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#107C10]">0</div>
            <div className="text-sm text-zinc-500">Total XP</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Progress to Next Level</span>
            <span className="text-white font-medium">0 / 0 XP</span>
          </div>
          <div className="h-3 bg-zinc-900 rounded-sm overflow-hidden">
            <div
              className="h-full bg-[#107C10] transition-all"
              style={{ width: "0%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="pixelops-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-[#107C10]" />
            <span className="text-sm text-zinc-500">Global Rank</span>
          </div>
          <div className="text-2xl font-bold">-</div>
        </div>

        <div className="pixelops-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-[#107C10]" />
            <span className="text-sm text-zinc-500">Total Score</span>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>

        <div className="pixelops-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-[#107C10]" />
            <span className="text-sm text-zinc-500">Win Rate</span>
          </div>
          <div className="text-2xl font-bold">0.0%</div>
        </div>
      </div>

      {/* Game Library */}
      <div>
        <h3 className="text-lg font-bold mb-4">Game Library</h3>
        {games.length === 0 ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <Trophy size={48} className="text-zinc-800 mb-4" />
            <h4 className="text-lg font-medium text-zinc-300 mb-1">No Games Available</h4>
            <p className="text-zinc-500 max-w-sm">Games are currently being loaded from the server. Please stand by for deployment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="pixelops-card overflow-hidden cursor-pointer group"
              >
                <div className="aspect-video bg-zinc-900 flex items-center justify-center text-6xl group-hover:brightness-110 transition-all">
                  {game.image}
                </div>
                <div className="p-5">
                  <h4 className="font-bold mb-2 group-hover:text-[#107C10] transition-colors">
                    {game.name}
                  </h4>
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>{game.plays.toLocaleString()} plays</span>
                    <span>{game.wins} wins</span>
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
        {recentActivity.length === 0 ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <Clock size={48} className="text-zinc-800 mb-4" />
            <h4 className="text-lg font-medium text-zinc-300 mb-1">No Activity Found</h4>
            <p className="text-zinc-500 max-w-sm">Play a game or complete a tournament to see your history logged here.</p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-md divide-y divide-zinc-800 shadow-sm">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-5 hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center">
                    <Clock size={18} className="text-zinc-500" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{activity.game}</div>
                    <div className="text-sm text-zinc-500">{activity.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-zinc-500">Score</div>
                    <div className="font-bold text-white">{activity.score.toLocaleString()}</div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-sm text-sm font-medium ${
                      activity.result === "Victory"
                        ? "bg-[#107C10]/20 text-[#107C10]"
                        : "bg-zinc-800/50 text-zinc-400"
                    }`}
                  >
                    {activity.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
