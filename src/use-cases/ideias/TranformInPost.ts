
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import CreatePost from "../post/CreatePost.js";

type TransformInPostParams = {
    ideaId: string;
    userId: string;
    status: string;
    categoryId?: string | null;
};

export default async function transformInPost(data: TransformInPostParams) {
    const { ideaId, userId, status, categoryId } = data;

    if (!status?.trim()) {
        throw new AppError("Falta informação para criar o post!", 400);
    }

    const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
    });

    if (!idea) {
        throw new AppError("Ideia não encontrada!", 404);
    }

    if (idea.userId !== userId) {
        throw new AppError("Você não tem permissão para transformar essa ideia!", 403);
    }

    if (idea.isPlanned) {
        throw new AppError("Essa ideia já foi transformada em post!", 400);
    }

    let categoryName = "Sem categoria";

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

        categoryName = category.name;
    } else if (idea.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: idea.categoryId },
        });

        if (category) {
            categoryName = category.name;
        }
    }

    const post = await CreatePost({
        title: idea.title,
        content: idea.content,
        type: "convert",
        status,
        date: new Date().toISOString(),
        ideaId: idea.id,
        userId,
        categoryName,
    });

    if (!post) {
        throw new AppError("Erro ao criar o post a partir da ideia!", 500);
    }

    await prisma.idea.update({
        where: { id: idea.id },
        data: { isPlanned: true },
    });

    return post;
}
