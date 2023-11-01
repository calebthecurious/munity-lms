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

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        skillId: params.skillId,
      }
    });

    const muxData = await db.muxData.findUnique({
      where: {
        lessonId: params.lessonId,
      }
    });

    if (!lesson || !muxData || !lesson.title || !lesson.description || !lesson.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        skillId: params.skillId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedLesson);
  } catch (error) {
    console.log("[LESSON_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}