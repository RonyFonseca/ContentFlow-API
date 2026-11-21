
import prisma from "../../lib/prisma.js";
import jwtGenerate from "../../utils/jwtGenerate.js";
import { hashPassword } from "../../utils/passCrypted.js";
import AppError from "../../utils/AppError.js";

type CreateUserData = {
    name: string;
    email: string;
    password: string;
};

export default async function CreateUser(data: CreateUserData) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new AppError("Falta informação!", 400);
    }

    if (email.includes("@") === false) {
        throw new AppError("Email inválido!", 400);
    }

    const isUper = email === email.toUpperCase();

    if (isUper) {
        throw new AppError(
            "Email deve conter letras minúsculas!",
            400
        );
    }

    if (!(password.length + 1 > 8 && password.length < 10)) {
        throw new AppError(
            "A senha deve conter no mínimo 8 caracteres!",
            400
        );
    }

    const passwordHashed = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHashed
        }
    });

    const token = await jwtGenerate(
        user.id,
        user.email,
        user.name
    );

    return {
        token,
        name: user.name
    };
}
