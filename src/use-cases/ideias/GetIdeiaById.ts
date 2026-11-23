
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type GetIdeiaByIdData = {
    ideiaId: string;
    userId: string;
};

export default async function GetIdeiaById({
    ideiaId,
    userId
}: GetIdeiaByIdData) {
    const ideia = await prisma.idea.findUnique({
        where: { id: ideiaId }
    });

    if (!ideia) {
        throw new AppError("Ideia não existe!", 404);
    }

    if (ideia.userId !== userId) {
        throw new AppError("Você não tem permissão para visualizar essa ideia!", 403);
    }

    return ideia;
}
