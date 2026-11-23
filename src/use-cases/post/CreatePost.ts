
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type CreatePostData = {
    title: string;
    content: string;
    type: string;
    status: string;
    date: string;
    userId: string;
    ideaId?: string;
    categoryName: string;
};

export default async function CreatePost(data: CreatePostData) {
    const {
        title,
        content,
        type,
        status,
        date,
        userId,
        ideaId,
        categoryName
    } = data;


    const userExist = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!userExist) {
        throw new AppError("O autor não existe!", 404);
    }


    let category = await prisma.category.findUnique({
        where: {
            userId_name: {
                userId,
                name: categoryName,
            },
        },
    });


    if (!category) {
        category = await prisma.category.create({
            data: {
                name: categoryName,
                userId,
            },
        });
    }


    return prisma.post.create({
        data: {
            title,
            content,
            userId,
            status,
            type,
            date,
            categoryId: category.id,
            ideaId
        },
    });
}

