import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type CreatePostData = {
    title: string;
    content: string;
    type: string;
    status: string;
    date: any;
    userId: string;
};

export default async function CreatePost(data: CreatePostData) {
    const { title, content, type, status, date, userId } = data;

    if (!title || !content || !type || !status || !date) {
        throw new AppError("Falta informação!", 400);
    }

    if (title.length > 40) {
        throw new AppError("O título está muito longo!", 400);
    }

    if (content.length > 200) {
        throw new AppError("O conteúdo está muito longo!", 400);
    }

    if (type.length > 15) {
        throw new AppError("O tipo está muito longo!", 400);
    }

    const userExist = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!userExist) {
        throw new AppError("O autor não existe!", 400);
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            userId,
            status,
            type,
            date,
        },
    });

    return post;
}
