import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type UpdatePostCategoryData = {
    idPost: string;
    categoryId: string | null;
    userId: string;
};

export default async function UpdatePostCategory(data: UpdatePostCategoryData) {
    const { idPost, categoryId, userId } = data;

    if (!idPost || categoryId === undefined) {
        throw new AppError("Falta informação!", 400);
    }

    const postExist = await prisma.post.findFirst({
        where: { id: idPost, userId },
    });

    if (!postExist) {
        throw new AppError(
            "Post não encontrado no banco de dados!",
            404
        );
    }

    if (categoryId) {
        const categoryExist = await prisma.category.findFirst({
            where: { id: categoryId, userId },
        });

        if (!categoryExist) {
            throw new AppError("Categoria não encontrada!", 404);
        }
    }

    await prisma.post.update({
        where: { id: idPost },
        data: { categoryId },
    });
}
