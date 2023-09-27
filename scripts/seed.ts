const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                {name: "Academics & Science"},
                {name: "Arts"},
                {name: "Business & Finance"},
                {name: "Cooking"},
                {name: "DIY"},
                {name: "Fitness & Wellbeing"},
                {name: "Language"},
                {name: "Outdoor"},
            ]
        })
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}

main();