import { TrendingUp, Clock, Trophy } from "lucide-react";

export function Dashboard() {
  const games: any[] = [];

  const recentActivity: any[] = [];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-6">
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
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-[#107C10]" />
            <span className="text-sm text-zinc-500">Global Rank</span>
          </div>
          <div className="text-2xl font-bold">-</div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-[#107C10]" />
            <span className="text-sm text-zinc-500">Total Score</span>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
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
        <div className="grid grid-cols-3 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden hover:border-[#107C10] transition-colors cursor-pointer group"
            >
              <div className="aspect-video bg-zinc-900 flex items-center justify-center text-6xl">
                {game.image}
              </div>
              <div className="p-4">
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
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm divide-y divide-zinc-800">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 rounded flex items-center justify-center">
                  <Clock size={18} className="text-zinc-500" />
                </div>
                <div>
                  <div className="font-medium">{activity.game}</div>
                  <div className="text-sm text-zinc-500">{activity.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-zinc-500">Score</div>
                  <div className="font-bold">{activity.score.toLocaleString()}</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-sm text-sm font-medium ${
                    activity.result === "Victory"
                      ? "bg-[#107C10] text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {activity.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
