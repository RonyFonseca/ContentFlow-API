import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

type CreateCategoryData = {
    name: string;
    userId: string;
};

export default async function CreateCategory(data: CreateCategoryData) {
    const { userId } = data;
    const name = typeof data.name === "string" ? data.name.trim() : "";

    if (!name) {
        throw new AppError("Falta informação!", 400);
    }

    if (name.length > 30) {
        throw new AppError("O nome está muito longo!", 400);
    }

    const categoryExist = await prisma.category.findUnique({
        where: { userId_name: { userId, name } },
    });

    if (categoryExist) {
        throw new AppError("Categoria já existe!", 409);
    }

    return prisma.category.create({
        data: { name, userId },
    });
}
