import { useEffect } from "react";
import { Check, AlertTriangle } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md flex items-center space-x-2 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      } text-white z-10`}
    >
      {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
      <span>{message}</span>
    </div>
  );
};

export default Notification;
