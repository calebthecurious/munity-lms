import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { skillId: string; lessonId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownSkill = await db.skill.findUnique({
      where: {
        id: params.skillId,
        userId
      }
    });

    if (!ownSkill) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        skillId: params.skillId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedLessonsInSkill = await db.lesson.findMany({
      where: {
        skillId: params.skillId,
        isPublished: true,
      }
    });

    if (!publishedLessonsInSkill.length) {
      await db.skill.update({
        where: {
          id: params.skillId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(unpublishedLesson);
  } catch (error) {
    console.log("[LESSON_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}