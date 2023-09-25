import { Button } from "@/components/ui/button";
import Link from "next/link"

const SkillsPage = () => {
    return (
        <div className="">
            <div className="p-6">
                <Link href="/guide/create">
                    <Button>
                        New Skill
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default SkillsPage;