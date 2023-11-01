import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function DELETE(
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
        userId: userId,
      },
      include: {
        lessons: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!skill) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const lesson of skill.lessons) {
      if (lesson.muxData?.assetId) {
        await Video.Assets.del(lesson.muxData.assetId);
      }
    }

    const deletedSkill = await db.skill.delete({
      where: {
        id: params.skillId,
      },
    });

    return NextResponse.json(deletedSkill);
  } catch (error) {
    console.log("[SKILL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { skillId: string } }
) {
  try {
    const { userId } = auth();
    const { skillId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const skill = await db.skill.update({
      where: {
        id: skillId,
        userId
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.log("[SKILL_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}