import { auth } from "@clerk/nextjs";
import { Lesson, Skill, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SkillProgress } from "@/components/skill-progress";

import { SkillSidebarItem } from "./skill-sidebar-item";

interface SkillSidebarProps {
  skill: Skill & {
    lessons: (Lesson & {
      userProgress: UserProgress[] | null;
    })[]
  };
  progressCount: number;
};

export const SkillSidebar = async ({
  skill,
  progressCount,
}: SkillSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_skillId: {
        userId,
        skillId: skill.id,
      }
    }
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">
          {skill.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <SkillProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {skill.lessons.map((lesson) => (
          <SkillSidebarItem
            key={lesson.id}
            id={lesson.id}
            label={lesson.title}
            isCompleted={!!lesson.userProgress?.[0]?.isCompleted}
            skillId={skill.id}
            isLocked={!lesson.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}