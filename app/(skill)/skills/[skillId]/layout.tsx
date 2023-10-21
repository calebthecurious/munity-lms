import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import { SkillSidebar } from "./_components/skill-sidebar";
import { SkillNavbar } from "./_components/skill-navbar";

const SkillLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: { skillId: string };
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const skill = await db.skill.findUnique({
        where: {
            id: params.skillId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId
                        }
                    }
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

    const progressCount = await getProgress(userId, skill.id)


    return (
        <div className="g-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <SkillNavbar
                    skill={skill}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <SkillSidebar
                    skill={skill}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    )   
}

export default SkillLayout;