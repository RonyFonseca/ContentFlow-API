import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";


type CreateIdeiaData = {
    title: string;
    content: string;
    userId: string;
};

export default async function CreateIdeia(data: CreateIdeiaData) {
    const { userId } = data;
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


    return prisma.idea.create({
        data: { title, content, userId },
    });
}