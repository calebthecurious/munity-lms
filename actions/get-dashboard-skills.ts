import { Category, Chapter, Skill } from "@prisma/client";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

type SkillWithProgressWithCategory = Skill & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardSkills = {
  completedSkills: SkillWithProgressWithCategory[];
  skillsInProgress: SkillWithProgressWithCategory[];
}

export const getDashboardSkills = async (userId: string): Promise<DashboardSkills> => {
  try {
    const purchasedSkills = await db.purchase.findMany({
      where: {
        userId: userId,
        },
        select: {
            skill: {
            include: {
                category: true,
                chapters: {
                where: {
                    isPublished: true,
                }
                }
            }
            }
        }
    });

    const skills = purchasedSkills.map((purchase) => purchase.skill) as SkillWithProgressWithCategory[];

    for (let skill of skills) {
      const progress = await getProgress(userId, skill.id);
      skill["progress"] = progress;
    }

    const completedSkills = skills.filter((skill) => skill.progress === 100);
    const skillsInProgress = skills.filter((skill) => (skill.progress ?? 0) < 100);

    return {
      completedSkills,
      skillsInProgress,
    }
  } catch (error) {
    console.log("[GET_DASHBOARD_SKILLS]", error);
    return {
      completedSkills: [],
      skillsInProgress: [],
    }
  }
}