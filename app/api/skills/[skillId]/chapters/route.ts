import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { skillId: string }}
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const skillOwner = await db.skill.findUnique({
            where: {
                id: params.skillId,
                userId: userId,
            }
        });

        if (!skillOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                skillId: params.skillId,
                },
                orderBy: {
                position: "desc",
                },
            });
        
            const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        
            const chapter = await db.chapter.create({
                data: {
                title,
                skillId: params.skillId,
                position: newPosition,
                }
            });
        
            return NextResponse.json(chapter);

    } catch (error) {
        console.log("[CHAPTERS", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}