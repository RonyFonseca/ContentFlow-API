
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type EditPostData = {
    id: string;
    title: string;
    content: string;
    type: string;
    status: string;
    date: string;
    userId: string;
    imageUrl?: string | null;
    ideaId?: string | null;
    categoryName: string;
};

export default async function EditPost(data: EditPostData) {
    const {
        title,
        content,
        type,
        status,
        date,
        userId,
        ideaId,
        categoryName,
    } = data;

    const postExist = await prisma.post.findUnique({
        where: { id: data.id },
    });

    if (!postExist) {
        throw new AppError("Post não existe!", 404);
    }

    if (postExist.userId !== userId) {
        throw new AppError(
            "Você não tem permissão para editar esse post!",
            403
        );
    }

    // Preserva a ideia atual caso o frontend não envie ideaId
    const novaIdeiaId =
        ideaId === undefined ? postExist.ideaId : ideaId;

    // Valida a nova ideia, caso exista
    if (novaIdeiaId) {
        const ideiaExist = await prisma.idea.findUnique({
            where: { id: novaIdeiaId },
        });

        if (!ideiaExist) {
            throw new AppError("Ideia não existe!", 404);
        }

        if (ideiaExist.userId !== userId) {
            throw new AppError(
                "Você não tem permissão para utilizar essa ideia!",
                403
            );
        }

        // Impede que uma ideia já vinculada a outro post seja reutilizada
        if (
            novaIdeiaId !== postExist.ideaId &&
            await prisma.post.findUnique({
                where: { ideaId: novaIdeiaId },
            })
        ) {
            throw new AppError(
                "Essa ideia já está vinculada a outro post!",
                409
            );
        }
    }

    // Busca ou cria a categoria
    let category = await prisma.category.findUnique({
        where: {
            userId_name: {
                userId,
                name: categoryName.trim(),
            },
        },
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: categoryName.trim(),
                userId,
            },
        });
    }

    // Atualiza o post
    const postUpdated = await prisma.post.update({
        where: { id: data.id },
        data: {
            title: title.trim(),
            content: content.trim(),
            type: type.trim(),
            status: status.trim(),
            date: date.trim(),
            categoryId: category.id,
            ideaId: novaIdeiaId,
        },
    });

    // Atualiza a ideia somente se continuar sendo a mesma
    if (
        postExist.ideaId &&
        postExist.ideaId === novaIdeiaId
    ) {
        await prisma.idea.update({
            where: {
                id: postExist.ideaId,
            },
            data: {
                title: title.trim(),
                content: content.trim(),
                categoryId: category.id,
            },
        });
    }

    // Desvincula as imagens da ideia anterior do post
    if (
        postExist.ideaId &&
        postExist.ideaId !== novaIdeiaId
    ) {
        await prisma.image.updateMany({
            where: {
                ideaId: postExist.ideaId,
                postId: postUpdated.id,
            },
            data: {
                postId: null,
            },
        });
    }

    // Associa as imagens da nova ideia ao post
    if (novaIdeiaId) {
        await prisma.image.updateMany({
            where: {
                ideaId: novaIdeiaId,
                OR: [
                    { postId: null },
                    { postId: postUpdated.id },
                ],
            },
            data: {
                postId: postUpdated.id,
            },
        });
    }

    return postUpdated;
}
