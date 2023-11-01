import { db } from "@/lib/db";

export const getProgress = async (
    userId: string,
    skillId: string, 
): Promise<number> => {
    try {
        const publishedLessons = await db.lesson.findMany({
            where: {
                skillId: skillId,
                isPublished: true,
            },
            select: {
                id: true,
            }
        });

        const publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

        const validCompletedLessons = await db.userProgress.count({
            where: {
                userId: userId,
                lessonId: {
                    in: publishedLessonIds,
                },
                isCompleted: true
            }
        });

        const progressPercentage = (validCompletedLessons / publishedLessonIds.length) * 100;

        return progressPercentage;

    } catch( error ) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}