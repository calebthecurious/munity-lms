import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const skill = await db.skill.create({
            data: {
                userId,
                title
            }
        });

        return NextResponse.json(skill);

    } catch (error) {
        console.log("[SKILLS]", error);
        return new NextResponse("Internal Error", { status: 500})
    }
}