import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getLesson } from "@/actions/get-lesson";
import { Banner } from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";
import { SkillEnrollButton } from "./_components/skill-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { SkillProgressButton } from "./_components/skill-progress-button";

const LessonIdPage = async ({
    params
}: {
    params: {skillId: string; lessonId: string}
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    } 

    const {
        lesson,
        skill,
        muxData,
        attachments,
        nextLesson,
        userProgress,
        purchase,
    } = await getLesson({
        userId,
        lessonId: params.lessonId,
        skillId: params.skillId
    })

    if(!lesson || !skill) {
        return redirect("/"); 
    }

    const isLocked = !lesson.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner 
                    variant="success"
                    label="You've already completed this lesson"
                />            
                )}
            {isLocked && (
                <Banner 
                    variant="warning"
                    label="You may need to pay for this lesson"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        lessonId={params.lessonId}
                        title={lesson.title}
                        skillId={params.skillId}
                        nextLessonId={nextLesson?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">
                            {lesson.title}
                        </h2>
                        {purchase ? (
                            <SkillProgressButton
                                lessonId={params.lessonId}
                                skillId={params.skillId}
                                nextLessonId={nextLesson?.id}
                                isCompleted={!!userProgress?.isCompleted}
                            />
                        ) : (
                            <SkillEnrollButton
                                skillId={params.skillId}
                                price={skill.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={lesson.description!} />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a 
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                    >
                                        <File />
                                        <p className="line-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LessonIdPage;