import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH (
    req: Request,
        { params }: {params: { skillId: string }}
) {
    try {
        const { userId } = auth()
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
        return new NextResponse("Internal Error", { status: 500});
    }
}