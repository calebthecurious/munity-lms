import { Category, Skill } from "@prisma/client";

import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type SkillWithProgressWithCategory = Skill & {
    category: Category | null;
    lessons: { id: string}[];
    progress: number | null;
};

type GetSkills = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getSkills = async ({
    userId,
    title,
    categoryId,
}: GetSkills): Promise<SkillWithProgressWithCategory[]> => {
    try {
        const skills = await db.skill.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                lessons: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                created: "desc",
            }
        });

        const skillsWIthProgress: SkillWithProgressWithCategory[] = await Promise.all(
            skills.map(async skill => {
                if (skill.purchases.length === 0) {
                    return {
                        ...skill,
                        progress: null,
                    }
                }

                const progressPercentage = await getProgress(userId, skill.id);

                return {
                    ...skill,
                    progress: progressPercentage,
                };
            })
        );

        return skillsWIthProgress
    } catch (error) {
        console.log("[GET_SKILL]", error);
        return [];
    }
}