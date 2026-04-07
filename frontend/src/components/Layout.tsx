import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router";
import { Home, Trophy, Swords, Wallet, Settings, Search, User, Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";
import { getNotifications } from "../services/api";

export function Layout() {
  const { user, isGuest, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll notifications every 30s when logged in
  useEffect(() => {
    if (isGuest) return;
    const fetchNotifs = () => {
      getNotifications(1, 50)
        .then((notifs) => setUnreadCount(notifs.filter((n) => !n.isRead).length))
        .catch(() => {});
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30_000);
    return () => clearInterval(interval);
  }, [isGuest]);

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/tournaments", icon: Swords, label: "Tournaments" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/admin", icon: Settings, label: "Admin" },
  ];

  return (
    <div className="h-screen bg-black text-white flex">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <aside className="w-60 bg-zinc-950 border-r border-zinc-800 flex flex-col">
        <div className="h-16 px-6 flex items-center border-b border-zinc-800">
          <img src="/logo.png" alt="PixelOps Logo" className="h-10 w-full object-contain object-left" />
        </div>

        <nav className="flex-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-1 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-[#107C10] text-white font-semibold shadow-md"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/80 hover:translate-x-1"
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div 
          className={`p-4 border-t border-zinc-800 transition-all duration-200 ${
            isGuest ? "cursor-pointer hover:bg-zinc-900 hover:border-zinc-700" : ""
          }`}
          onClick={() => isGuest && setIsAuthModalOpen(true)}
        >
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <User size={16} className={isGuest ? "text-zinc-500" : "text-[#107C10]"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {isGuest ? "Guest Player" : user?.username}
              </div>
              <div className="text-xs text-zinc-500">
                {isGuest ? "Click to Login" : user?.role?.toLowerCase()}
              </div>
            </div>
            {!isGuest && (
              <button 
                onClick={(e) => { e.stopPropagation(); logout(); }}
                className="p-1.5 text-zinc-500 hover:text-white rounded-md transition-all duration-200 hover:bg-zinc-800 pixelops-btn"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 gap-4">
          <div className="flex-1 mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search games, tournaments, players..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#107C10] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">

          <button className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-zinc-900 transition-all duration-200 relative pixelops-btn">
            <Bell size={20} className="text-zinc-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#107C10] rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <button 
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:ring-2 ring-[#107C10] transition-all duration-200 pixelops-btn"
            onClick={() => isGuest && setIsAuthModalOpen(true)}
          >
            <User size={18} className={isGuest ? "text-zinc-400" : "text-[#107C10]"} />
          </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
