import { ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logActivity } from "../services/activityLogger";

export function Wallet() {
  const { isGuest } = useAuth();
  const [xpAmount, setXpAmount] = useState("");

  const transactions: any[] = [];

  const conversionRate = 10;
  const coinsFromXp = xpAmount ? Math.floor(Number(xpAmount) / conversionRate) : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Wallet & Rewards</h2>
        <p className="text-zinc-500">Manage your coins and convert XP</p>
      </div>

      {/* Balance Card */}
      <div className="pixelops-card p-8 mb-6 bg-gradient-to-br from-zinc-950 to-zinc-900 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-zinc-500 mb-2">Available Balance</div>
            <div className="text-4xl font-bold mb-1">0</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">coins</span>
              <span className="text-zinc-500 flex items-center gap-1">
                <TrendingUp size={14} />
                0% this week
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-2 bg-[#107C10] text-white font-bold rounded-md flex items-center gap-2 pixelops-btn shadow-lg shadow-[#107C10]/20">
              <ArrowDownLeft size={18} />
              Deposit
            </button>
            <button className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-md flex items-center gap-2 pixelops-btn hover:border-white">
              <ArrowUpRight size={18} />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* XP Conversion */}
        <div className="col-span-2">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">XP Conversion Network</h3>
          <div className="pixelops-card p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-zinc-500 mb-2 block">XP Amount</label>
                <input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-3 text-2xl font-bold focus:outline-none focus:border-[#107C10] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-500 mb-2 block">Coins Received</label>
                <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-2xl font-bold text-[#107C10] font-mono flex items-center">
                  {coinsFromXp.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 bg-zinc-900/50 p-3 rounded-md">
              <span><strong>Current Rate:</strong> {conversionRate} XP = 1 coin</span>
              <span><strong>Available XP:</strong> <span className="text-white font-bold">0</span></span>
            </div>

            <button 
              onClick={() => {
                const activity = {
                  type: "Wallet Conversion",
                  metadata: { convertedXp: xpAmount, receivedCoins: coinsFromXp },
                  timestamp: new Date().toISOString()
                };
                logActivity(activity, !isGuest);
                setXpAmount("");
              }}
              className="w-full px-4 py-4 bg-[#107C10] text-white font-bold rounded-md pixelops-btn text-lg shadow-lg shadow-[#107C10]/20"
            >
              Convert XP to Coins
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h3 className="text-xl font-bold mb-4">Statistics</h3>
          <div className="space-y-4">
            <div className="pixelops-card p-5">
              <div className="text-sm text-zinc-500 mb-1">Total Earned</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="pixelops-card p-5">
              <div className="text-sm text-zinc-500 mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="pixelops-card p-5">
              <div className="text-sm text-zinc-500 mb-1">Conversions Completed</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-bold mb-4">Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="pixelops-card p-12 flex flex-col items-center justify-center text-center">
            <TrendingUp size={48} className="text-zinc-800 mb-4" />
            <h4 className="text-xl font-medium text-zinc-300 mb-2">No Transactions Yet</h4>
            <p className="text-zinc-500 max-w-md">Deposit coins or convert XP to see your transaction history here.</p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40">
                  <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          tx.type === "deposit" || tx.amount > 0 ? "bg-[#107C10]/20" : "bg-zinc-800/80"
                        }`}
                      >
                        {tx.type === "deposit" || tx.amount > 0 ? (
                          <ArrowDownLeft size={18} className="text-[#107C10]" />
                        ) : (
                          <ArrowUpRight size={18} className="text-zinc-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-zinc-200">{tx.description}</div>
                      <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{tx.type}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div
                        className={`text-lg font-bold font-mono ${
                          tx.amount > 0 ? "text-[#107C10]" : "text-white"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="text-sm font-medium text-zinc-400">{tx.date}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
