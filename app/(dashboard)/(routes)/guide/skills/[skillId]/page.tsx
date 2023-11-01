import { auth } from "@clerk/nextjs";
import { CircleDollarSign, LayoutDashboard, ListChecks, File } from "lucide-react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";


import { TitleForm } from "./_components/title-form"
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { LessonsForm } from "./_components/lessons-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";

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
            userId
        },
        include: {
            lessons: {
                orderBy: {
                    position: "asc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                }
            }
        }
    });

    const categories = await db.category.findMany({
        orderBy: {
      
            name: "asc"
        },
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
        skill.lessons.some(lesson => lesson.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
        {!skill.isPublished && (
            <Banner 
                label="This skill is not published. It will not be visible to learners"
            />
        )}
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
                    <Actions 
                        disabled={!isComplete}
                        skillId={params.skillId}
                        isPublished={skill.isPublished}
                    />
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
                        <ImageForm
                            initialData={skill}
                            skillId={skill.id}
                        />
                        <CategoryForm
                            initialData={skill}
                            skillId={skill.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-wl">
                                    Skill Lessons
                                </h2>
                            </div>
                            <LessonsForm
                                initialData={skill}
                                skillId={skill.id}
                />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className="text-xl">
                                    Share your skills
                                </h2>
                            </div>
                            <PriceForm
                                initialData={skill}
                                skillId={skill.id}
                            />   
                        </div>             
                        <div className="flex items-center-gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={skill}
                            skillId={skill.id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SkillPage;