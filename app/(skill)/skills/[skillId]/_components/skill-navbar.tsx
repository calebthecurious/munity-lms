import { Lesson, Skill, UserProgress } from "@prisma/client"

import { NavbarRoutes } from "@/components/navbar-routes";

import { SkillMobileSidebar } from "./skill-mobile-sidebar";

interface SkillNavbarProps {
  skill: Skill & {
    lessons: (Lesson & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

export const SkillNavbar = ({
  skill,
  progressCount,
}: SkillNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <SkillMobileSidebar
        skill={skill}
        progressCount={progressCount}
      />
      <NavbarRoutes />      
    </div>
  )
}