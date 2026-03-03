import { Users, Gamepad2, Trophy, TrendingUp } from "lucide-react";

export function Admin() {
  const metrics = [
    { label: "Active Players", value: "0", change: "+0.0%", icon: Users },
    { label: "Games Played", value: "0", change: "+0.0%", icon: Gamepad2 },
    { label: "Tournaments", value: "0", change: "+0.0%", icon: Trophy },
    { label: "Total Revenue", value: "$0", change: "+0.0%", icon: TrendingUp },
  ];

  const fraudFlags: any[] = [];
  const systemLogs: any[] = [];
  const recentActivity: any[] = [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-zinc-500">System monitoring and management</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="pixelops-card p-5">
            <div className="flex items-center justify-between mb-3">
              <metric.icon size={20} className="text-zinc-400" />
              <span className="text-xs bg-[#107C10]/10 text-[#107C10] font-bold px-2 py-1 rounded-sm">{metric.change}</span>
            </div>
            <div className="text-3xl font-bold mb-1 text-white">{metric.value}</div>
            <div className="text-sm font-medium text-zinc-500">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Fraud Flags */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Fraud Detection Alerts</h3>
            <span className={`px-3 py-1 text-xs font-bold rounded-sm ${fraudFlags.length > 0 ? "bg-red-500/20 text-red-500" : "bg-[#107C10]/20 text-[#107C10]"}`}>
              {fraudFlags.length} ACTIVE
            </span>
          </div>

          {fraudFlags.length === 0 ? (
            <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#107C10]/10 flex items-center justify-center mb-4">
                <TrendingUp size={32} className="text-[#107C10]" />
              </div>
              <h4 className="text-xl font-medium text-white mb-2">Systems Status: Secure</h4>
              <p className="text-zinc-500 max-w-sm">No active fraud flags detected. The matchmaking and wallet integrity monitors are currently running nominally.</p>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/40">
                    <th className="text-left py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Player</th>
                    <th className="text-left py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Reason</th>
                    <th className="text-center py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Severity</th>
                    <th className="text-right py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {fraudFlags.map((flag) => (
                    <tr
                      key={flag.id}
                      className="hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="py-3 px-5">
                        <div className="font-semibold text-white text-sm">{flag.player}</div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="text-sm font-medium text-zinc-400">{flag.reason}</div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex justify-center">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-md ${
                              flag.severity === "critical"
                                ? "bg-red-500/20 text-red-500 border border-red-500/30"
                                : flag.severity === "high"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                            }`}
                          >
                            {flag.severity.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="text-xs font-medium text-zinc-500">{flag.time}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="pixelops-card p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                <Users size={20} className="text-zinc-500" />
              </div>
              <h4 className="text-sm font-medium text-zinc-300 mb-1">Awaiting Traffic</h4>
              <p className="text-xs text-zinc-500">Real-time player actions will populate here.</p>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-md divide-y divide-zinc-800 shadow-sm">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-zinc-900/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-semibold text-white truncate pr-2">{activity.player}</div>
                    <div className="text-xs font-medium text-zinc-500 whitespace-nowrap">{activity.time}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-400">{activity.action}</div>
                    {activity.amount !== 0 && (
                      <div
                        className={`text-xs font-bold font-mono ${
                          activity.amount > 0 ? "text-[#107C10]" : "text-red-400"
                        }`}
                      >
                        {activity.amount > 0 ? "+" : ""}
                        {activity.amount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Logs */}
      <div>
        <h3 className="text-xl font-bold mb-4">System Logs</h3>
        <div className="bg-zinc-950 border border-[#1a1a1a] rounded-md p-5 h-64 overflow-y-auto">
          {systemLogs.length === 0 ? (
             <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-sm">
                {"> Listening for events..."}
             </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="text-zinc-600 whitespace-nowrap">{log.time}</span>
                  <span
                    className={`px-2 py-0.5 rounded-sm font-bold min-w-20 text-center ${
                      log.type === "error"
                        ? "bg-red-500/20 text-red-500 border border-red-500/20"
                        : log.type === "warning"
                        ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/20"
                        : log.type === "success"
                        ? "bg-[#107C10]/20 text-[#107C10] border border-[#107C10]/20"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-zinc-300 flex-1 leading-relaxed">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
