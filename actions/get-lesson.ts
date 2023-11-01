import { db } from "@/lib/db";
import { Attachment, Lesson } from "@prisma/client";

interface GetLessonProps {
    userId: string;
    skillId: string;
    lessonId: string;
};

export const getLesson = async ({
    userId,
    skillId,
    lessonId,
}: GetLessonProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_skillId: {
                    userId, 
                    skillId,
                }
            }
        });

        const skill = await db.skill.findUnique({
            where: {
                isPublished: true,
                id: skillId,
            },
            select: {
                price: true,
            }
        });

        const lesson = await db.lesson.findUnique({
            where: {
                id: lessonId,
                isPublished: true,
            }
        });

        if (!lesson || !skill) {
            throw new Error("Lesson or Skill not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextLesson: Lesson | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    skillId: skillId,
                }
            })
        }

        if (lesson.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    lessonId: lessonId,
                }
            });

            nextLesson = await db.lesson.findFirst({
                where: {
                    skillId: skillId,
                    isPublished: true,
                    position: {
                        gt: lesson?.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            })
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId, 
                    lessonId,
                }
            }
        });

        return {
            lesson,
            skill,
            muxData,
            attachments,
            nextLesson,
            userProgress,
            purchase,
        };

    } catch (error) {
        console.log("[GET_LESSON", error);
        return {
            lesson: null,
            skill: null,
            muxData: null,
            attachments: [],
            nextLesson: null,
            userProgress: null,
            purchase: null,
        }
    }
}