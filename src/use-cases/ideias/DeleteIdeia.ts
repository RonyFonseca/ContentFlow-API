import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type DeleteIdeiaData = {
    ideiaId: string;
    userId: string;
};

export default async function DeleteIdeia(data: DeleteIdeiaData) {
    const { ideiaId, userId } = data;

    const ideiaExist = await prisma.idea.findUnique({
        where: { id: ideiaId },
    });

    if (!ideiaExist) {
        throw new AppError("Ideia não existe!", 404);
    }

    if (ideiaExist.userId !== userId) {
        throw new AppError("Você não tem permissão para deletar essa ideia!", 403);
    }

    return prisma.idea.delete({
        where: { id: ideiaId },
    });
}