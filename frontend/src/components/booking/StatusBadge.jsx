import { 
  Clock, 
  CheckCircle2, 
  Play, 
  CheckSquare, 
  XCircle, 
  Ban, 
  RotateCcw,
  AlertCircle
} from "lucide-react";

const statusConfig = {
  pending: {
    color: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock,
    label: "Pending Approval"
  },
  approved: {
    color: "bg-blue-50 text-blue-700 border-blue-100",
    icon: CheckCircle2,
    label: "Approved"
  },
  in_use: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    icon: Play,
    label: "In Use"
  },
  completed: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CheckSquare,
    label: "Completed"
  },
  rejected: {
    color: "bg-rose-50 text-rose-700 border-rose-100",
    icon: XCircle,
    label: "Rejected"
  },
  cancelled: {
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Ban,
    label: "Cancelled"
  },
  return_requested: {
    color: "bg-orange-50 text-orange-700 border-orange-100",
    icon: RotateCcw,
    label: "Return Requested"
  },
};

const StatusBadge = ({ status }) => {
  // Fallback for safety
  const config = statusConfig[status] || {
    color: "bg-gray-50 text-gray-600 border-gray-100",
    icon: AlertCircle,
    label: status?.replaceAll("_", " ") || "Unknown"
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all duration-300 shadow-sm ${config.color}`}
    >
      <Icon size={12} className="shrink-0" />
      <span className="capitalize tracking-tight">
        {config.label}
      </span>
    </span>
  );
};

export default StatusBadge;