import { db } from "@/lib/db";
import { Skill, Purchase } from "@prisma/client";

type PurchaseWithSkill = Purchase & {
    skill: Skill;
};

const groupBySkill = (purchases: PurchaseWithSkill[]) => {
    const grouped: { [skillTitle: string]: number} = {};

    purchases.forEach((purchase) => {
        const skillTitle = purchase.skill.title;
        if (!grouped[skillTitle]) {
            grouped[skillTitle] = 0;
        }
        grouped[skillTitle] += purchase.skill.price!;
    });

    return grouped;
}

export const getAnalytics = async (userId: string) => {
    try {
        const purchases = await db.purchase.findMany({
            where: {
                skill: {
                    userId: userId
                }
            },
            include: {
                skill: true,
            }
        });

        const groupedEarnings = groupBySkill(purchases);
        const data = Object.entries(groupedEarnings).map(([skillTitle, total]) => ({
            name: skillTitle,
            total: total,
        }));

        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalLessons = purchases.length;

        return {
            data,
            totalRevenue,
            totalLessons,
        }
        
    } catch (error) {
        console.log("[GET_ANALYTICS", error);
        return {
            data: [],
            totalRevenue: 0,
            totalLessons: 0
        }
    }
}