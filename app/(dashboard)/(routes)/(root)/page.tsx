import { getDashboardSkills } from "@/actions/get-dashboard-skills";
import { SkillsList } from "@/components/skill-list";
import { auth } from "@clerk/nextjs"
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    completedSkills,
    skillsInProgress
  } = await getDashboardSkills(userId);
  
  
  return (
      <div className="p-6 space-y-4">
        <div className="grid  grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard 
            icon={Clock}
            label="In Progress"
            numberOfItems={skillsInProgress.length}
          />
          <InfoCard 
            icon={CheckCircle}
            label="Completed!"
            numberOfItems={skillsInProgress.length}
            variant="success"
          />
        </div>
        
        <SkillsList
            items={[...skillsInProgress, ...completedSkills]}
          />

        
      </div>
    )
}
