import prisma from "../../lib/prisma.js";

export default async function CreateNotification() {
    // Calcula a data de amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Formata a data no padrão dd/MM/yyyy
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const year = tomorrow.getFullYear();

    const tomorrowDate = `${day}/${month}/${year}`;

    // Busca os posts programados para amanhã
    const posts = await prisma.post.findMany({
        where: {
            date: tomorrowDate,
        },
    });

    // Verifica cada post encontrado
    for (const post of posts) {
        // Verifica se já existe uma notificação para esse post
        const notificationExists = await prisma.notification.findFirst({
            where: {
                postId: post.id,
            },
        });

        // Cria a notificação somente se ela ainda não existir
        if (!notificationExists) {
            await prisma.notification.create({
                data: {
                    userId: post.userId,
                    postId: post.id,
                },
            });
        }
    }
}
