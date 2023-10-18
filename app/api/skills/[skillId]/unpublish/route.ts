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
    });

    if (!skill) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedSkill = await db.skill.update({
      where: {
        id: params.skillId,
        userId,
      },
      data: {
        isPublished: false,
      }
    });

    return NextResponse.json(unpublishedSkill);
  } catch (error) {
    console.log("[SKILL_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}