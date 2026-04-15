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

  // Mock XP System for UI matching
  const [availableXp, setAvailableXp] = useState(12847);
  const [xpInput, setXpInput] = useState("");
  const [isConverting, setIsConverting] = useState(false);

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

  const handleConvert = () => {
    const xp = parseInt(xpInput);
    if (isNaN(xp) || xp <= 0 || xp > availableXp) return;
    
    setIsConverting(true);
    setTimeout(() => {
      setAvailableXp(prev => prev - xp);
      const coins = Math.floor(xp / 10);
      if (wallet) {
        setWallet({ ...wallet, balance: wallet.balance + coins });
      }
      setXpInput("");
      setIsConverting(false);
    }, 800);
  };

  if (isGuest) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Wallet & Rewards</h2>
          <p className="text-zinc-500">Manage your coins and convert XP</p>
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Wallet & Rewards</h2>
        <p className="text-zinc-500">Manage your coins and convert XP</p>
      </div>

      {/* Hero Balance Block */}
      <div className="pixelops-card p-8 mb-8 flex items-center justify-between border-t-2 border-[#107C10]">
        <div>
          <div className="text-sm font-bold text-zinc-500 mb-2 uppercase tracking-wider">Available Balance</div>
          {loading ? (
            <div className="w-6 h-6 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="text-5xl font-bold mb-2 font-mono text-white tracking-tight">
                {wallet?.balance.toLocaleString() ?? "0"}
              </div>
              <div className="text-sm text-zinc-500 flex items-center gap-2">
                coins <span className="text-[#107C10] font-bold flex items-center"><ArrowUpRight size={14} className="mr-1" /> +15% this week</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#107C10] hover:bg-[#0d6b0d] text-white font-bold rounded-sm shadow-[0_0_15px_rgba(16,124,16,0.2)] transition-all">
            <ArrowDownLeft size={18} /> Deposit
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white font-bold rounded-sm transition-all">
            <ArrowUpRight size={18} /> Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* XP Conversion */}
        <div className="col-span-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            XP <ArrowUpRight size={16} className="text-zinc-500" /> Coins Conversion
          </h3>
          <div className="pixelops-card p-6 border-zinc-800 bg-black">
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">XP Amount</label>
                <input
                  type="number"
                  value={xpInput}
                  onChange={(e) => setXpInput(e.target.value)}
                  placeholder="0"
                  max={availableXp}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-3 text-lg font-mono focus:outline-none focus:border-[#107C10] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Coins Received</label>
                <div className="w-full bg-zinc-950 border border-zinc-900 rounded-sm px-4 py-3 text-lg font-mono text-[#107C10]">
                  {xpInput ? Math.floor(parseInt(xpInput || "0") / 10) : "0"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 mb-6 text-sm text-zinc-500">
              <span>Conversion rate: 10 XP = 1 coin</span>
              <span>Available XP: <strong className="text-white font-mono">{availableXp.toLocaleString()}</strong></span>
            </div>
            
            <button
              onClick={handleConvert}
              disabled={isConverting || !xpInput || parseInt(xpInput) <= 0 || parseInt(xpInput) > availableXp}
              className="w-full py-4 bg-[#107C10] hover:bg-[#0d6b0d] disabled:opacity-50 disabled:hover:bg-[#107C10] text-white font-bold rounded-sm shadow-lg transition-all"
            >
              {isConverting ? "Converting..." : "Convert XP to Coins"}
            </button>
          </div>
        </div>

        {/* Statistics list */}
        <div className="col-span-1">
          <h3 className="text-lg font-bold mb-4">Statistics</h3>
          <div className="flex flex-col gap-4">
            <div className="pixelops-card p-5 bg-black border-zinc-800">
              <div className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Total Earned</div>
              <div className="text-2xl font-bold text-white font-mono">{totalEarned.toLocaleString()}</div>
            </div>
            <div className="pixelops-card p-5 bg-black border-zinc-800">
              <div className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Total Spent</div>
              <div className="text-2xl font-bold text-white font-mono">{totalSpent.toLocaleString()}</div>
            </div>
            <div className="pixelops-card p-5 bg-black border-zinc-800">
              <div className="text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Conversions</div>
              <div className="text-2xl font-bold text-white font-mono">18</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
        {loading ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center bg-black border-zinc-800">
            <TrendingUp size={48} className="text-zinc-800 mb-4" />
            <h4 className="text-xl font-medium text-zinc-300 mb-2">No Transactions Yet</h4>
            <p className="text-zinc-500 max-w-md">
              Play games, join tournaments, or earn rewards to see your transaction history here.
            </p>
          </div>
        ) : (
          <div className="bg-black border border-zinc-800 rounded-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950">
                  <th className="text-left py-4 px-6 text-xs font-bold text-zinc-600 uppercase tracking-wider w-16">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {transactions.map((tx) => {
                  const cfg = TX_TYPE_CONFIG[tx.type] ?? TX_TYPE_CONFIG.DEBIT;
                  return (
                    <tr key={tx.id} className="hover:bg-zinc-900/40 transition-colors group">
                      <td className="py-4 px-6">
                        <div
                          className={`w-8 h-8 rounded-sm flex items-center justify-center ${cfg.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                        >
                          {cfg.icon}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-zinc-300 text-sm">
                          {cfg.label} <span className="text-zinc-600 font-normal ml-2">transaction details hidden</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div
                          className={`text-sm font-bold font-mono ${
                            cfg.isCredit ? "text-[#107C10]" : "text-white"
                          }`}
                        >
                          {cfg.isCredit ? "+" : "-"}{tx.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="text-xs text-zinc-500">
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
