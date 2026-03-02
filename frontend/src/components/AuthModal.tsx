import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    if (activeTab === "login") {
      login(username);
    } else {
      signup(username);
    }
    setUsername("");
    setPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-sm shadow-2xl relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex border-b border-zinc-800">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === "login"
                ? "text-[#107C10] border-b-2 border-[#107C10]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === "signup"
                ? "text-[#107C10] border-b-2 border-[#107C10]"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {activeTab === "login" ? "Welcome back, Operator" : "Join the Mission"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your gamertag"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-[#107C10] transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-[#107C10] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#107C10] hover:bg-[#0d6b0d] text-white font-bold py-3 rounded-sm transition-colors mt-6"
            >
              {activeTab === "login" ? "Deploy Now" : "Create Profile"}
            </button>
          </form>
          
          <p className="text-xs text-zinc-600 text-center mt-6">
            By proceeding, you agree to the PixelOps Terms of Command and Privacy Intel Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
