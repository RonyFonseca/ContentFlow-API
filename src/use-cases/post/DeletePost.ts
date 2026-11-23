import prisma from '../../lib/prisma.js';
import { supabase } from '../../lib/supabase.js';
import AppError from '../../utils/AppError.js';

interface DeletePostData {
    idPost: string;
    userId: string;
}

export default async function DeletePost(data: DeletePostData) {

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


    const imagePaths = post.images.map(image => image.path);

    if (imagePaths.length > 0) {
        const { error } = await supabase.storage
            .from('content-img')
            .remove(imagePaths);

        if (error) {
            throw new AppError(
                `Erro ao excluir imagens: ${error.message}`,
                500
            );
        }
    }

    await prisma.post.delete({
        where: {
            id: data.idPost,
        },
    });

    if(post.ideaId) {
        await prisma.idea.update({
            where: { id: post.ideaId },
            data: { isPlanned: false },
        });
    }
}