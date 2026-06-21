// sidebarData.ts - Updated & Serialized

import {
  BarChart3,
  FileWarning,
  Layers,
  LayoutDashboard,
  MapPin,
  Package,
  ShoppingCart // Sale এর জন্য সেরা আইকন
  ,



  Truck,
  User,
  UserCircle,
  Users
} from "lucide-react";

export const sidebarMenu = [
  // 1. Overview
  {
    type: "link",
    id: 1,
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/dashboard",
  },

  // 2. User & Access Management
  {
    type: "dropdown",
    key: "user-management",
    id: 2,
    label: "User Management",
    icon: <Users size={20} />,
    items: [
      {
        href: "/dashboard/admin-management?role=admin",
        label: "Admin Management",
      },
      {
        href: "/dashboard/admin-management?role=moderator",
        label: "Moderator Management",
      },
    ],
  },

  // 3. CRM
  // {
  //   type: "dropdown",
  //   key: "customer",
  //   id: 3,
  //   label: "Customer Management",
  //   icon: <UserCircle size={20} />,
  //   items: [
  //     { href: "/dashboard/documents", label: "Create Customer" },
  //     { href: "/dashboard/companies", label: "Customer List" },
  //   ],
  // },

  // 4. Core Inventory & Products
  {
    type: "dropdown",
    key: "product-mgmt",
    id: 4,
    label: "Product Management",
    icon: <Layers size={20} />,
    items: [
      { href: "/dashboard/inventory-management", label: "All products" },
    ],
  },
  {
    type: "dropdown",
    key: "products-setup",
    id: 5,
    label: "Products Setup",
    icon: <Package size={20} />,
    items: [
      { href: "/dashboard/inventory-management/add", label: "Add Products" },
      { href: "/dashboard/products/category", label: "Category List" },
      { href: "/dashboard/products/company", label: "Company List" },
      { href: "/dashboard/products/units", label: "Unit List" },
    ],
  },

  // 5. Sales Operations
  // {
  //   type: "dropdown",
  //   key: "sale",
  //   id: 6,
  //   label: "Sale",
  //   icon: <ShoppingCart size={20} />, // Truck এর বদলে ShoppingCart ব্যবহার করা হয়েছে
  //   items: [
  //     { href: "/dashboard/sale/create-sale", label: "Create Sale" },
  //     { href: "/dashboard/sale", label: "Sale List" },
  //   ],
  // },

  // 6. Logistics
  {
    type: "dropdown",
    key: "delivery",
    id: 7,
    label: "Delivery Management",
    icon: <Truck size={20} />,
    items: [
      { href: "/dashboard/delivery", label: "Delivery Men" },
      { href: "/dashboard/delivery/loading-sheets", label: "Loading Sheets" },
      { href: "/dashboard/delivery/settlements", label: "Daily Settlements" },
    ],
  },

  // 7. Damage & Claims
  {
    type: "dropdown",
    key: "damage",
    id: 8,
    label: "Damage Items",
    icon: <FileWarning size={20} />,
    items: [
      { href: "/dashboard/damage/damage-list", label: "Damage List" },
      { href: "/dashboard/damage/damage-stock", label: "Damage Stock" },
    ],
  },

  // 8. Analytics & Insights
  {
    type: "dropdown",
    key: "reports",
    id: 9,
    label: "Reports",
    icon: <BarChart3 size={20} />,
    items: [
      { href: "/dashboard/report-analysis/current-stock", label: "Current Stock" },
      { href: "/dashboard/report-analysis/damage-stock", label: "Damage Stock" },
      { href: "/dashboard/report-analysis/product-summary", label: "Product Summary" },
      { href: "/dashboard/report-analysis/daily-summary", label: "Daily Summary" },
      { href: "/dashboard/report-analysis/daily-sale-report", label: "Daily Sale Report" },
      { href: "/dashboard/report-analysis/daily-sale-product-report", label: "Daily Sale Product Report" },
      { href: "/dashboard/report-analysis/damage-report", label: "Damage Report" },
    ],
  },

  // 9. Settings
  {
    type: "link",
    id: 10,
    label: "Area Setup",
    icon: <MapPin size={20} />,
    href: "/dashboard/area",
  },
  {
    type: "link",
    id: 11,
    label: "Profile",
    icon: <User size={20} />,
    href: "/dashboard/profile",
  },
];