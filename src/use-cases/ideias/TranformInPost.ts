
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type TransformInPostParams = {
    ideaId: string;
    userId: string;
    status: string;
    type: string;
    date: string;
    image?: string;
    categoryId?: string | null;
};

export default async function transformInPost(data: TransformInPostParams) {
    const { ideaId, userId, status, type, date, categoryId } = data;

    const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
    });

    if (!idea) {
        throw new AppError("Ideia não encontrada!", 404);
    }

    if (idea.userId !== userId) {
        throw new AppError("Você não tem permissão para transformar essa ideia!", 403);
    }

    if (!status || !type || !date) {
        throw new AppError("Falta informação para criar o post!", 400);
    }

    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId,
            },
        });

        if (!category) {
            throw new AppError("Categoria não encontrada!", 404);
        }
    }

    return prisma.$transaction(async (tx) => {
        const post = await tx.post.create({
            data: {
                title: idea.title,
                content: idea.content,
                status,
                type,
                date,
                userId,
                categoryId: categoryId ?? idea.categoryId,
                ideaId: idea.id,
            },
        });

        return post;
    });
}
