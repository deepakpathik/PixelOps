import { useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, Trophy, Zap, Swords, Wallet, X } from "lucide-react";
import { ApiNotification, markNotificationRead, markAllNotificationsRead } from "../services/api";

interface NotificationPanelProps {
  notifications: ApiNotification[];
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

function notifIcon(message: string) {
  if (message.includes("🏆") || message.includes("Rank")) return <Trophy size={16} className="text-yellow-400" />;
  if (message.includes("⚡") || message.includes("Score")) return <Zap size={16} className="text-[#107C10]" />;
  if (message.includes("Tournament") || message.includes("🎯")) return <Swords size={16} className="text-blue-400" />;
  if (message.includes("coin") || message.includes("💰") || message.includes("Reward")) return <Wallet size={16} className="text-orange-400" />;
  if (message.includes("🚨") || message.includes("fraud")) return <Bell size={16} className="text-red-400" />;
  return <Bell size={16} className="text-zinc-400" />;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Strip emoji prefixes for clean display text
function cleanMessage(msg: string) {
  return msg.replace(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, "").trim();
}

export function NotificationPanel({
  notifications,
  unreadCount,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      onMarkRead(id);
    } catch {}
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      onMarkAllRead();
    } catch {}
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-14 right-0 z-50 w-96 bg-zinc-950 border border-zinc-800 rounded-md shadow-2xl shadow-black/60 overflow-hidden"
      style={{ maxHeight: "80vh" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-zinc-400" />
          <span className="font-bold text-white text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[#107C10] text-white text-[10px] font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-[#107C10] transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              <span>All read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 52px)" }}>
        {notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <Bell size={32} className="text-zinc-800 mb-3" />
            <p className="text-zinc-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 transition-colors group ${
                  !n.isRead
                    ? "bg-[#107C10]/5 hover:bg-[#107C10]/10"
                    : "hover:bg-zinc-900/40"
                }`}
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    !n.isRead ? "bg-zinc-800" : "bg-zinc-900"
                  }`}
                >
                  {notifIcon(n.message)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      !n.isRead ? "text-white font-medium" : "text-zinc-400"
                    }`}
                  >
                    {cleanMessage(n.message)}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1">{timeAgo(n.createdAt)}</p>
                </div>

                {/* Unread dot + mark-read button */}
                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#107C10]" />
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-[#107C10]"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
