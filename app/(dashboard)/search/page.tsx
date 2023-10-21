import { db } from "@/lib/db";
import { Categories } from "./_componenets/categories";
import SearchInput from "@/components/search-input";

import { auth } from "@clerk/nextjs";
import { getSkills } from "@/actions/get-skill";
import { redirect } from "next/navigation";
import { SkillsList } from "@/components/skill-list";

interface SearchPageProps {
    searchParams: {
        title: string;
        category: string;
    }
};

const SearchPage = async ({
    searchParams
}: SearchPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const categories = await db.category.findMany
    ({
        orderBy: {
            name: "asc"
        }
    });

    const skills = await getSkills({
        userId
    })

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>

            <div className="p-6 space-y-4">
                <Categories
                    items={categories}
                />
                <SkillsList
                    items={skills}
                />
            </div>
        </>
    );
}
 
export default SearchPage;