"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname} from "next/navigation";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link"
import SearchInput from "./search-input";


export const NavbarRoutes = () => {
    const pathname = usePathname();


    const isGuidePage = pathname?. startsWith("/guide");
    const isLearnerPage = pathname?.includes("/chapter");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isGuidePage || isLearnerPage ? (
                    <Link href="/">
                        <Button>
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ): (
                    <Link href="/guide/skills">
                        <Button size="sm" variant="ghost">
                            Guide Mode
                        </Button>
                    </Link>
                )}
                <UserButton 
                    afterSignOutUrl="/"
                />
            </div>
        </>
    )
}