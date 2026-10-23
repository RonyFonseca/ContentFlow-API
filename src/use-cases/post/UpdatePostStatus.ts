import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type UpdatePostData = {
    idPost: string;
    status?: string;
};

export default async function UpdatePost(data: UpdatePostData) {
    const { idPost, status } = data;

    if (!idPost) {
        throw new AppError("O ID do post é obrigatório!", 400);
    }

    const postExist = await prisma.post.findUnique({
        where: { id: idPost }
    });

    if (!postExist) {
        throw new AppError(
            "Post não encontrado no banco de dados!",
            404
        );
    }

    await prisma.post.update({
        where: { id: idPost },
        data: { status }
    });
}
