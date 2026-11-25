import prisma from "../../lib/prisma.js";

export default async function GetNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
        where: {
            userId,
        },
        include: {
            post: {
                select: {
                    title: true,
                    date: true,
                },
            },
        },
    });

    return notifications;
}
