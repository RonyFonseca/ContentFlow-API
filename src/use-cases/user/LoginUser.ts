import prisma from "../../lib/prisma.js";
import jwtGenerate from "../../utils/jwtGenerate.js";
import { verifyPassword } from "../../utils/passCrypted.js";
import AppError from "../../utils/AppError.js";

type LoginUserData = {
    email: string;
    password: string;
};

export default async function LoginUser(data: LoginUserData) {
    const { email, password } = data;

    if (!email || !password) {
        throw new AppError("Falta informação!", 400);
    }

    if (email.includes("@") === false) {
        throw new AppError("Email inválido!", 400);
    }

    const emailExist = await prisma.user.findMany({
        where: { email }
    });

    if (!emailExist.length) {
        throw new AppError("Usuário não está cadastrado!", 400);
    }

    const user = emailExist[0];

    try {
        const passwordMatch = await verifyPassword(
            password,
            user.password
        );

        if (!passwordMatch) {
            throw new AppError("Senha incorreta!", 400);
        }

        const token = await jwtGenerate(
            user.id,
            user.email,
            user.name
        );

        return {
            token,
            name: user.name,
            email: user.email,
            id: user.id
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw error;
    }
}
