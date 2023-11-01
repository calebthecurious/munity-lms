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
        userId,
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

    if (!lesson) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (lesson.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          lessonId: params.lessonId,
        }
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          }
        });
      }
    }

    const deletedLesson = await db.lesson.delete({
      where: {
        id: params.lessonId
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

    return NextResponse.json(deletedLesson);
  } catch (error) {
    console.log("[LESSON_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { skillId: string; lessonId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

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

    const lesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        skillId: params.skillId,
      },
      data: {
        ...values,
      }
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          lessonId: params.lessonId,
        }
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          }
        });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          lessonId: params.lessonId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        }
      });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.log("[SKILLS_LESSON_ID]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}