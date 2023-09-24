import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ['/test']
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"],
}
