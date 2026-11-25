import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type EditIdeiaData = {
    ideiaId: string;
    title: string;
    content: string;
    userId: string;
};  

export default async function EditIdeia(data: EditIdeiaData) {
    const { ideiaId, userId} = data;
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const content = typeof data.content === "string" ? data.content.trim() : "";

    if (!title || !content) {
        throw new AppError("Falta informação!", 400);
    }

    if (title.length > 30) {
        throw new AppError("O título está muito longo!", 400);
    }

    if (content.length > 300) {
        throw new AppError("O conteúdo está muito longo!", 400);
    }  

    const ideiaExist = await prisma.idea.findUnique({
        where: { id: ideiaId },
    });

    if (!ideiaExist) {
        throw new AppError("Ideia não existe!", 404);
    }

    if (ideiaExist.userId !== userId) {
        throw new AppError("Você não tem permissão para editar essa ideia!", 403);
    }

    await prisma.post.updateMany({
        where: { ideaId: ideiaId },
        data: { title, content },
    });

    const ideiaUpdated = await prisma.idea.update({
        where: { id: ideiaId },
        data: { title, content },
    });

  
    return ideiaUpdated;
}

