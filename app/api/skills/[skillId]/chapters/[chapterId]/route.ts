import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {params: { skillId: string; chapterId: string }}
) {
    try {
        const { userId } = auth();
        const {isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        const ownSkill = await db.skill.findUnique({
            where: {
                id: params.skillId,
                userId
            }
        });

        if (!ownSkill) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                skillId: params.skillId,
            },
            data: {
            ...values
            }
        });

    } catch (error) {
        console.log("[SKILL_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}
