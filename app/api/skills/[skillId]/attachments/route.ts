import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { skillId: string}}
) {
    try {
        const { userId } = auth();
        const { url } = await req.json();

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
            return new NextResponse("Unauthorized", { status: 401});
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                skillId: params.skillId,
            }
        });

        return NextResponse.json(attachment);
        } catch (error) {
            console.log("SKILL_ID_ATTACHMENTS", error);
            return new NextResponse("Internal Error", { status: 500 });
        }
    }
