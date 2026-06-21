import { CheckCircle, Clock, ShoppingCart, XOctagon } from "lucide-react"; // Using Lucide Icons for modern, light icons
import React, { FC, memo } from "react";

// --- 1. Type Definitions ---

interface StatData {
  title: string;
  value: string | number;
  change: string; // e.g., "34.7%"
  isPositive: boolean;
  comparedText: string;
  icon: FC<React.SVGProps<SVGSVGElement>>; // Type for the icon component
}

interface StatCardProps extends StatData { }

// --- 2. Reusable StatCard Component ---

const StatCard: FC<StatCardProps> = memo(
  ({ title, value, change, isPositive, comparedText, icon: Icon }) => {
    const changeColor = isPositive ? "text-green-500" : "text-red-500";
    const arrowIcon = isPositive ? "↑" : "↓"; // Simple text arrow for clarity

    return (
      <div className="bg-[#F9F9F9] p-4 rounded-none shadow-xs  flex flex-col justify-between h-24 sm:h-auto">
        {/* Header/Title */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
          {/* More Menu (Simulated) */}
          <button className="text-gray-400 hover:text-gray-700 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>

        {/* Value and Icon Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Icon Circle (Red background from the image) */}
            <div className="bg-primary p-3 rounded-none flex items-center justify-center shadow-md">
              <Icon className="h-6 w-6 text-white" />
            </div>
            {/* Value */}
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>

          {/* Change Indicator */}
          <div
            className={`flex items-center text-sm font-semibold ${changeColor}`}
          >
            {arrowIcon} {change}
          </div>
        </div>

        {/* Comparison Text */}
        <p className="text-xs text-right text-gray-500">{comparedText}</p>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

// --- 3. Main Dashboard Section Component ---

const statsData: StatData[] = [
  {
    title: "Total Orders",
    value: 500,
    change: "34.7%",
    isPositive: true,
    comparedText: "Compared to Jan 2024",
    icon: ShoppingCart,
  },
  {
    title: "Active Orders",
    value: 10,
    change: "34.7%",
    isPositive: true,
    comparedText: "Compared to Jan 2024",
    icon: Clock, // Use Clock for active/in-progress
  },
  {
    title: "Completed Orders",
    value: 3000,
    change: "34.7%",
    isPositive: true,
    comparedText: "Compared to Jan 2024",
    icon: CheckCircle,
  },
  {
    title: "Reject Design",
    value: 50,
    change: "34.7%",
    isPositive: false, // The image shows a red arrow pointing down
    comparedText: "Compared to Jan 2024",
    icon: XOctagon, // Use XOctagon for rejected/negative count
  },
];

export const StatsSection: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsSection;
