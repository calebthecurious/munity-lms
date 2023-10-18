import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { skillId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const skill = await db.skill.findUnique({
      where: {
        id: params.skillId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!skill) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasPublishedChapter = skill.chapters.some((chapter) => chapter.isPublished);

    if (!skill.title || !skill.description || !skill.imageUrl || !skill.categoryId || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    const publishedSkill = await db.skill.update({
      where: {
        id: params.skillId,
        userId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedSkill);
  } catch (error) {
    console.log("[SKILL_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}