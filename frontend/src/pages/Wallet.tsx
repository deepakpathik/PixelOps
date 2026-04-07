import { ArrowUpRight, ArrowDownLeft, TrendingUp, RefreshCw, Gift, Swords } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getWallet, getTransactions, ApiWallet, ApiTransaction } from "../services/api";

const TX_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; isCredit: boolean }
> = {
  CREDIT: {
    label: "Credit",
    icon: <ArrowDownLeft size={18} className="text-[#107C10]" />,
    color: "bg-[#107C10]/20",
    isCredit: true,
  },
  REWARD: {
    label: "Reward",
    icon: <Gift size={18} className="text-[#107C10]" />,
    color: "bg-[#107C10]/20",
    isCredit: true,
  },
  REFUND: {
    label: "Refund",
    icon: <RefreshCw size={18} className="text-blue-400" />,
    color: "bg-blue-500/20",
    isCredit: true,
  },
  DEBIT: {
    label: "Debit",
    icon: <ArrowUpRight size={18} className="text-zinc-400" />,
    color: "bg-zinc-800/80",
    isCredit: false,
  },
  ENTRY_FEE: {
    label: "Entry Fee",
    icon: <Swords size={18} className="text-orange-400" />,
    color: "bg-orange-500/20",
    isCredit: false,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Wallet() {
  const { isGuest } = useAuth();
  const [wallet, setWallet] = useState<ApiWallet | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }
    Promise.all([getWallet(), getTransactions(1, 50)])
      .then(([w, txs]) => {
        setWallet(w);
        setTransactions(txs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isGuest]);

  const totalEarned = transactions
    .filter((t) => TX_TYPE_CONFIG[t.type]?.isCredit)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => !TX_TYPE_CONFIG[t.type]?.isCredit)
    .reduce((sum, t) => sum + t.amount, 0);

  if (isGuest) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Wallet & Rewards</h2>
          <p className="text-zinc-500">Manage your coins and rewards</p>
        </div>
        <div className="pixelops-card p-16 flex flex-col items-center justify-center text-center">
          <TrendingUp size={48} className="text-zinc-800 mb-4" />
          <h4 className="text-xl font-medium text-zinc-300 mb-2">Login Required</h4>
          <p className="text-zinc-500 max-w-md">
            Please log in to view your wallet balance and transaction history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Wallet & Rewards</h2>
        <p className="text-zinc-500">Manage your coins and rewards</p>
      </div>

      {/* Balance Card */}
      <div className="pixelops-card p-8 mb-6 bg-gradient-to-br from-zinc-950 to-zinc-900 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-zinc-500 mb-2">Available Balance</div>
            {loading ? (
              <div className="w-6 h-6 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <div className="text-4xl font-bold mb-1 font-mono">
                  {wallet?.balance.toLocaleString() ?? "0"}
                </div>
                <div className="text-sm text-zinc-500">coins</div>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-xs text-zinc-500 mb-1">Total Earned</div>
              <div className="text-lg font-bold text-[#107C10] font-mono">
                +{totalEarned.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500 mb-1">Total Spent</div>
              <div className="text-lg font-bold text-zinc-300 font-mono">
                -{totalSpent.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="pixelops-card p-5">
          <div className="text-sm text-zinc-500 mb-1">Total Earned</div>
          <div className="text-2xl font-bold text-white font-mono">
            {totalEarned.toLocaleString()}
          </div>
        </div>
        <div className="pixelops-card p-5">
          <div className="text-sm text-zinc-500 mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-white font-mono">
            {totalSpent.toLocaleString()}
          </div>
        </div>
        <div className="pixelops-card p-5">
          <div className="text-sm text-zinc-500 mb-1">Transactions</div>
          <div className="text-2xl font-bold text-white font-mono">
            {transactions.length}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-bold mb-4">Transaction History</h3>
        {loading ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <TrendingUp size={48} className="text-zinc-800 mb-4" />
            <h4 className="text-xl font-medium text-zinc-300 mb-2">No Transactions Yet</h4>
            <p className="text-zinc-500 max-w-md">
              Play games, join tournaments, or earn rewards to see your transaction history here.
            </p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40">
                  <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {transactions.map((tx) => {
                  const cfg = TX_TYPE_CONFIG[tx.type] ?? TX_TYPE_CONFIG.DEBIT;
                  return (
                    <tr key={tx.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${cfg.color}`}
                        >
                          {cfg.icon}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-zinc-200">{cfg.label}</div>
                        <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                          {tx.type}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div
                          className={`text-lg font-bold font-mono ${
                            cfg.isCredit ? "text-[#107C10]" : "text-white"
                          }`}
                        >
                          {cfg.isCredit ? "+" : "-"}
                          {tx.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="text-sm font-medium text-zinc-400">
                          {formatDate(tx.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
