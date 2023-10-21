import { Category, Skill } from "@prisma/client";

import { SkillCard } from "@/components/skill-card";

type SkillWithProgressWithCategory = Skill & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface SkillsListProps {
  items: SkillWithProgressWithCategory[];
}

export const SkillsList = ({
  items
}: SkillsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <SkillCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No skills found
        </div>
      )}
    </div>
  )
}