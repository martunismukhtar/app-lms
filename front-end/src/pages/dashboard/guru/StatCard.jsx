import { Users } from "lucide-react";

const StatCard = ({ title, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Users className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;
