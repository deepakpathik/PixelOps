import { TrendingUp, CheckCircle, XCircle, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFraudFlags, resolveFraudFlag, ApiFraudFlag } from "../services/api";

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
  const [fraudFlags, setFraudFlags] = useState<ApiFraudFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  const isAdmin = !isGuest && user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    getFraudFlags()
      .then(setFraudFlags)
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const pendingFlags = fraudFlags.filter((f) => f.status === "PENDING");

  const metrics = [
    { label: "Active Flags", value: pendingFlags.length.toString(), icon: Shield },
    { label: "Total Flags", value: fraudFlags.length.toString(), icon: TrendingUp },
    { label: "Confirmed", value: fraudFlags.filter((f) => f.status === "CONFIRMED").length.toString(), icon: XCircle },
    { label: "Cleared", value: fraudFlags.filter((f) => f.status === "REJECTED").length.toString(), icon: CheckCircle },
  ];

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
            Admin and Moderator roles required to access this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-zinc-500">Fraud detection and system management</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="pixelops-card p-5">
            <div className="flex items-center justify-between mb-3">
              <metric.icon size={20} className="text-zinc-400" />
            </div>
            <div className="text-3xl font-bold mb-1 text-white font-mono">{metric.value}</div>
            <div className="text-sm font-medium text-zinc-500">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Fraud Flags */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Fraud Detection Alerts</h3>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-sm ${
              pendingFlags.length > 0
                ? "bg-red-500/20 text-red-500"
                : "bg-[#107C10]/20 text-[#107C10]"
            }`}
          >
            {pendingFlags.length} PENDING
          </span>
        </div>

        {loading ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500">Loading fraud flags...</p>
          </div>
        ) : fraudFlags.length === 0 ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#107C10]/10 flex items-center justify-center mb-4">
              <TrendingUp size={32} className="text-[#107C10]" />
            </div>
            <h4 className="text-xl font-medium text-white mb-2">Systems Status: Secure</h4>
            <p className="text-zinc-500 max-w-sm">
              No fraud flags detected. All score submissions are within normal parameters.
            </p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40">
                  <th className="text-left py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Score ID
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="text-center py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-center py-3 px-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {fraudFlags.map((flag) => (
                  <tr key={flag.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="font-mono text-xs text-zinc-400">
                        {flag.score?.id?.slice(0, 12) ?? flag.id.slice(0, 12)}...
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-sm font-medium text-zinc-300">{flag.reason}</div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-md ${STATUS_STYLE[flag.status] ?? ""}`}
                        >
                          {flag.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="text-xs font-medium text-zinc-500">
                        {formatDate(flag.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      {flag.status === "PENDING" && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleResolve(flag.id, "CONFIRMED")}
                            disabled={resolving === flag.id}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded-sm border border-red-500/30 disabled:opacity-50 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleResolve(flag.id, "REJECTED")}
                            disabled={resolving === flag.id}
                            className="px-3 py-1 bg-[#107C10]/20 hover:bg-[#107C10]/30 text-[#107C10] text-xs font-bold rounded-sm border border-[#107C10]/30 disabled:opacity-50 transition-colors"
                          >
                            Clear
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

      {/* System Logs terminal */}
      <div>
        <h3 className="text-xl font-bold mb-4">System Logs</h3>
        <div className="bg-zinc-950 border border-[#1a1a1a] rounded-md p-5 h-48 overflow-y-auto font-mono text-xs">
          <div className="text-zinc-600">&gt; Fraud detection pipeline active</div>
          <div className="text-zinc-600">&gt; Score validator chain: ScoreRangeValidator → RateLimitValidator</div>
          <div className="text-zinc-600">&gt; Total flags in DB: {fraudFlags.length}</div>
          <div className="text-zinc-600">&gt; Pending review: {pendingFlags.length}</div>
          <div className="text-[#107C10]">&gt; System status: NOMINAL</div>
        </div>
      </div>
    </div>
  );
}
