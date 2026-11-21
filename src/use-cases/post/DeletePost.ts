import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type DeletePostData = {
    idPost: string;
};

export default async function DeletePost(data: DeletePostData) {
    const { idPost } = data;

    if (!idPost) {
        throw new AppError("O ID do post é obrigatório!", 400);
    }

    const postExist = await prisma.post.findUnique({
        where: {
            id: idPost,
        },
    });

    if (!postExist) {
        throw new AppError(
            "Post não encontrado no banco de dados!",
            404
        );
    }

    await prisma.post.delete({
        where: {
            id: idPost,
        },
    });
}
