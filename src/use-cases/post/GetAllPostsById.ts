import prisma from "../../lib/prisma.js";

export default async function GetAllPostsById(userId: string) {
    const posts = await prisma.post.findMany({
        where: {
            userId,
        },
        include: {
            category: true,
        },
    });

    return posts;
}
