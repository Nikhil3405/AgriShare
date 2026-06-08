import { useEffect, useRef, useState } from "react";
import { 
  Bell, 
  CheckCheck, 
  Tractor, 
  User, 
  Info, 
  Calendar, 
  CheckCircle2, 
  Inbox,
  Loader2
} from "lucide-react";
import notificationService from "../../services/notificationService";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.results || data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) => notificationService.markAsRead(n.id)),
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes("booking") || msg.includes("rent")) return <Tractor size={16} />;
    if (msg.includes("approve") || msg.includes("confirm")) return <CheckCircle2 size={16} />;
    if (msg.includes("date") || msg.includes("time")) return <Calendar size={16} />;
    if (msg.includes("profile") || msg.includes("account")) return <User size={16} />;
    return <Info size={16} />;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${
          open ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <Bell size={22} className={unreadCount > 0 ? "animate-in swing duration-1000" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] text-white items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h3 className="font-black text-slate-900 tracking-tight">Notifications</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {unreadCount} Unread messages
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[450px] overflow-y-auto no-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Loader2 className="mx-auto h-8 w-8 text-primary/20 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox size={32} className="text-slate-200" />
                </div>
                <h4 className="text-slate-900 font-bold">All caught up!</h4>
                <p className="text-slate-400 text-xs mt-1">No new activity to show right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleRead(notification.id)}
                    className={`group px-5 py-4 cursor-pointer transition-all ${
                      !notification.is_read 
                        ? "bg-emerald-50/40 hover:bg-emerald-50/60" 
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                        !notification.is_read 
                        ? "bg-white border-emerald-100 text-primary shadow-sm" 
                        : "bg-slate-50 border-transparent text-slate-400"
                      }`}>
                        {getNotificationIcon(notification.message)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm leading-relaxed break-words ${
                            !notification.is_read ? "text-slate-900 font-bold" : "text-slate-600 font-medium"
                          }`}>
                            {notification.message}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter">
                          <Clock size={10} />
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

// Simple clock icon for internal use
const Clock = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default NotificationBell;