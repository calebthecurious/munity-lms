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

        const lastLesson = await db.lesson.findFirst({
            where: {
                skillId: params.skillId,
                },
                orderBy: {
                position: "desc",
                },
            });
        
            const newPosition = lastLesson ? lastLesson.position + 1 : 1;
        
            const lesson = await db.lesson.create({
                data: {
                title,
                skillId: params.skillId,
                position: newPosition,
                }
            });
        
            return NextResponse.json(lesson);

    } catch (error) {
        console.log("[LESSONS", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}