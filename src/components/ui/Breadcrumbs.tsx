"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* Home breadcrumb */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600"
          >
            <Home className="w-4 h-4 me-2" />
            Home
          </Link>
        </li>

        {items.map((item, idx) => (
          <li key={idx}>
            <div className="flex items-center">
              <ChevronRight className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-red-600 md:ms-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
