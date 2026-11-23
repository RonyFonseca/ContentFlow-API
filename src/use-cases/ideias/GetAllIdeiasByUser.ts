import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export default async function getAllIdeiasByUser({ userId }: { userId: string }) {
    const ideias = await prisma.idea.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (!ideias) {
        throw new AppError("No ideias found for this user", 404);
    }

    return ideias;
}