import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";


import { TitleForm } from "./_components/title-form"
import { DescriptionForm } from "./_components/description-form";

const SkillPage = async ({
    params
}: {
    params: {skillId: string}
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const skill = await db.skill.findUnique({
        where: {
            id: params.skillId,
        }
    });

    if (!skill) {
        return redirect("/")
    }

    const requiredFields = [
        skill.title,
        skill.description,
        skill.imageUrl,
        skill.price,
        skill.categoryId,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Skill Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Customize your skill
                        </h2>
                    </div>
                    <TitleForm
                        initialData={skill}
                        skillId={skill.id}
                    />
                    <DescriptionForm
                        initialData={skill}
                        skillId={skill.id}
                    />
                </div>
            </div>
        </div>
    );
}

export default SkillPage;