import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

// import { isGuide } from "@/lib/guide";
 
const f = createUploadthing();
        
    const handleAuth = () => {
    const { userId } = auth();
    // const isAuthorized = isGuide(userId);

    if (!userId) throw new Error("Unauthorized");
    return { userId };
}

// || !isAuthorized

export const ourFileRouter = {
    skillImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    skillAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {})
    } satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;