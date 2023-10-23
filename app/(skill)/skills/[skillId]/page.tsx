import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const SkillIdPage = async ({
    params
}: {
    params: {skillId:string;}
}) => {
    const skill = await db.skill.findUnique({
        where: {
            id: params.skillId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    if (!skill) {
        return redirect("/");
    }
    
    return redirect(`/skills/${skill.id}/chapters/${skill.chapters[0].id}`)

}

export default SkillIdPage;