
import prisma from '../../lib/prisma.js';
import GetImageUrl from '../img/GetImageUrl.js';
import AppError from '../../utils/AppError.js';

interface GetPostByIdData {
    idPost: string;
    userId: string;
}

export default async function GetPostById(data: GetPostByIdData) {
    const post = await prisma.post.findFirst({
        where: {
            id: data.idPost,
            userId: data.userId,
        },
        include: {
            images: true,
        },
    });

    if (!post) {
        throw new AppError('Post não encontrado!', 404);
    }

    return {
        ...post,
        images: post.images.map(image => ({
            ...image,
            url: GetImageUrl(image.path),
        })),
    };
}
