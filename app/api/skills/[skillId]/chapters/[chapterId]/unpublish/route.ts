import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { skillId: string; chapterId: string } }
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

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        skillId: params.skillId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedChaptersInSkill = await db.chapter.findMany({
      where: {
        skillId: params.skillId,
        isPublished: true,
      }
    });

    if (!publishedChaptersInSkill.length) {
      await db.skill.update({
        where: {
          id: params.skillId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}