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
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-6 mb-6">
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

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#107C10] hover:bg-[#0d6b0d] text-white font-medium rounded-sm transition-colors flex items-center gap-2">
              <ArrowDownLeft size={16} />
              Deposit
            </button>
            <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-medium rounded-sm transition-colors flex items-center gap-2">
              <ArrowUpRight size={16} />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* XP Conversion */}
        <div className="col-span-2">
          <h3 className="text-lg font-bold mb-4">XP → Coins Conversion</h3>
          <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-zinc-500 mb-2 block">XP Amount</label>
                <input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-3 text-lg font-medium focus:outline-none focus:border-[#107C10] transition-colors"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-500 mb-2 block">Coins Received</label>
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-3 text-lg font-bold text-[#107C10]">
                  {coinsFromXp.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-500 mb-4">
              Conversion rate: 10 XP = 1 coin • Available XP: 0
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
              className="w-full px-4 py-3 bg-[#107C10] hover:bg-[#0d6b0d] text-white font-medium rounded-sm transition-colors"
            >
              Convert XP to Coins
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h3 className="text-lg font-bold mb-4">Statistics</h3>
          <div className="space-y-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
              <div className="text-sm text-zinc-500 mb-1">Total Earned</div>
              <div className="text-xl font-bold">0</div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
              <div className="text-sm text-zinc-500 mb-1">Total Spent</div>
              <div className="text-xl font-bold">0</div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
              <div className="text-sm text-zinc-500 mb-1">Conversions</div>
              <div className="text-xl font-bold">0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 text-sm font-medium text-zinc-500">Type</th>
                <th className="text-left p-4 text-sm font-medium text-zinc-500">Description</th>
                <th className="text-right p-4 text-sm font-medium text-zinc-500">Amount</th>
                <th className="text-right p-4 text-sm font-medium text-zinc-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900 transition-colors"
                >
                  <td className="p-4">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        tx.type === "deposit" ? "bg-[#107C10]/20" : "bg-zinc-800"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <ArrowDownLeft size={16} className="text-[#107C10]" />
                      ) : (
                        <ArrowUpRight size={16} className="text-zinc-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{tx.description}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div
                      className={`text-lg font-bold ${
                        tx.amount > 0 ? "text-[#107C10]" : "text-zinc-400"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-zinc-500">{tx.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
