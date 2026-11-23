
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import CreatePost from "../post/CreatePost.js";

type TransformInPostParams = {
    ideaId: string;
    userId: string;
    title: string;
    content: string;
    image?: string;
    status: string;
    categoryId?: string | null;
};

export default async function transformInPost(data: TransformInPostParams) {
    const { ideaId, userId, title, content, status, categoryId } = data;

    const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
    });

    if (!idea) {
        throw new AppError("Ideia não encontrada!", 404);
    }

    if (idea.userId !== userId) {
        throw new AppError("Você não tem permissão para transformar essa ideia!", 403);
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

    if (idea.isPlanned) {
        return;
    }

    const post = await CreatePost({
        title,
        content,
        type: "convert",
        status,
        date: new Date().toISOString(),
        ideaId: idea.id,
        userId,
        categoryName: categoryId ? (await prisma.category.findUnique({ where: { id: categoryId } }))!.name : "Sem categoria",
    });

    if(!post) {
        throw new AppError("Erro ao criar o post a partir da ideia!", 500);
    }

    await prisma.idea.update({
        where: { id: idea.id },
        data: { isPlanned: true },
    });

    return post
}
