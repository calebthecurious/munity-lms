import { Menu } from "lucide-react";
import { Chapter, Skill, UserProgress } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { SkillSidebar } from "./skill-sidebar";

interface SkillMobileSidebarProps {
  skill: Skill & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

export const SkillMobileSidebar = ({ 
  skill,
  progressCount,
}: SkillMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <SkillSidebar
          skill={skill}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}