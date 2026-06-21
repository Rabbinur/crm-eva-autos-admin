import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const formatDate = (date: Date | null | string): string =>
  date
    ? new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "N/A";

export const formatShortDate = (dateVal: Date | null | string): string => {
  if (!dateVal) return "N/A";
  const dateObj = new Date(dateVal);
  if (isNaN(dateObj.getTime())) return String(dateVal);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatLabel = (label: string) => {
  // Replace underscores with spaces, then capitalize each word
  return label
    .replace(/_/g, " ")               // replace _ with space
    .replace(/\b\w/g, char => char.toUpperCase()); // capitalize first letter of each word
}


export const buildQueryParams = (params: { from?: string; to?: string }) => {
  const query = new URLSearchParams();

  if (params.from) query.append("from", params.from);
  if (params.to) query.append("to", params.to);

  return query.toString();
};
