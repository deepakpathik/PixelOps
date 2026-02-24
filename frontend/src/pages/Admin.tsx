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
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <metric.icon size={18} className="text-zinc-500" />
              <span className="text-xs text-[#107C10] font-medium">{metric.change}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className="text-xs text-zinc-500">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Fraud Flags */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Fraud Detection Alerts</h3>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-sm">
              {fraudFlags.length} ACTIVE
            </span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-3 text-xs font-medium text-zinc-500">Player</th>
                  <th className="text-left p-3 text-xs font-medium text-zinc-500">Reason</th>
                  <th className="text-center p-3 text-xs font-medium text-zinc-500">Severity</th>
                  <th className="text-right p-3 text-xs font-medium text-zinc-500">Time</th>
                </tr>
              </thead>
              <tbody>
                {fraudFlags.map((flag) => (
                  <tr
                    key={flag.id}
                    className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-medium text-sm">{flag.player}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-zinc-400">{flag.reason}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded-sm ${
                            flag.severity === "critical"
                              ? "bg-red-500 text-white"
                              : flag.severity === "high"
                              ? "bg-orange-500 text-white"
                              : "bg-yellow-500 text-black"
                          }`}
                        >
                          {flag.severity.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="text-xs text-zinc-500">{flag.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-sm divide-y divide-zinc-800">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="text-sm font-medium truncate pr-2">{activity.player}</div>
                  <div className="text-xs text-zinc-500 whitespace-nowrap">{activity.time}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">{activity.action}</div>
                  {activity.amount !== 0 && (
                    <div
                      className={`text-xs font-bold ${
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
        </div>
      </div>

      {/* System Logs */}
      <div>
        <h3 className="text-lg font-bold mb-4">System Logs</h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 h-64 overflow-y-auto">
          <div className="space-y-2 font-mono text-xs">
            {systemLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-zinc-600">{log.time}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-sm font-bold ${
                    log.type === "error"
                      ? "bg-red-500/20 text-red-400"
                      : log.type === "warning"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : log.type === "success"
                      ? "bg-[#107C10]/20 text-[#107C10]"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {log.type.toUpperCase()}
                </span>
                <span className="text-zinc-400 flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
