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
            lessons: {
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
    
    return redirect(`/skills/${skill.id}/lessons/${skill.lessons[0].id}`)

}

export default SkillIdPage;