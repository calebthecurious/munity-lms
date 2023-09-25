'use client';

import { Layout, Compass, BarChart, List } from "lucide-react"
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const learnerRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    }
]

const guideRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/guide/skills",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/guide/analytics",
    }
]

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isGuidePage = pathname?.includes("/guide");

    const routes = isGuidePage ? guideRoutes : learnerRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}

