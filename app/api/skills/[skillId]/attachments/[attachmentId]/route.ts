import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { skillId: string, attachmentId: string } }
    ) {
    try {
        const { userId } = auth();

        if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
        }

        const skillOwner = await db.skill.findUnique({
        where: {
            id: params.skillId,
            userId: userId
        }
        });

        if (!skillOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
        where: {
            skillId: params.skillId,
            id: params.attachmentId,
        }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

