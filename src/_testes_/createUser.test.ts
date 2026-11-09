
import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Criando os mocks
const { prismaMock, jwtGenerateMock, hashPasswordMock } = vi.hoisted(() => ({
    prismaMock: {
        user: {
            create: vi.fn()
        }
    },
    jwtGenerateMock: vi.fn(),
    hashPasswordMock: vi.fn()
}));

// 2. Mock das dependências externas
vi.mock("../lib/prisma.js", () => ({
    default: prismaMock
}));

vi.mock("../utils/jwtGenerate.js", () => ({
    default: jwtGenerateMock
}));

vi.mock("../utils/passCrypted.js", () => ({
    hashPassword: hashPasswordMock
}));

// 3. Importação do caso de uso
import CreateUser from "../use-cases/user/CreateUser.js";

describe("CreateUser", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        // Configuração dos retornos dos mocks
        hashPasswordMock.mockResolvedValue("hashed-password");

        jwtGenerateMock.mockResolvedValue("fake-jwt-token");

        prismaMock.user.create.mockResolvedValue({
            id: "user-123",
            name: "Rony",
            email: "rony@email.com",
            password: "hashed-password"
        });
    });

    describe("Criação de usuário", () => {

        it("deve criar um usuário com sucesso", async () => {
            const data = {
                name: "Rony",
                email: "rony@email.com",
                password: "12345678"
            };

            const result = await CreateUser(data);

            // Verifica a criptografia da senha
            expect(hashPasswordMock).toHaveBeenCalledWith(
                data.password
            );

            // Verifica a criação no banco
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    name: data.name,
                    email: data.email,
                    password: "hashed-password"
                }
            });

            // Verifica a geração do token
            expect(jwtGenerateMock).toHaveBeenCalledWith(
                "user-123",
                data.email,
                data.name
            );

            // Verifica o retorno do caso de uso
            expect(result).toEqual({
                token: "fake-jwt-token",
                name: data.name
            });
        });
    });

    describe("Validação dos dados", () => {

        it("deve lançar erro quando faltar alguma informação", async () => {
            const data = {
                name: "",
                email: "rony@email.com",
                password: "12345678"
            };

            await expect(CreateUser(data)).rejects.toThrow(
                "Falta informação!"
            );

            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando o email for inválido", async () => {
            const data = {
                name: "Rony",
                email: "ronyemail.com",
                password: "12345678"
            };

            await expect(CreateUser(data)).rejects.toThrow(
                "Email inválido!"
            );

            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando o email estiver totalmente em maiúsculo", async () => {
            const data = {
                name: "Rony",
                email: "RONY@EMAIL.COM",
                password: "12345678"
            };

            await expect(CreateUser(data)).rejects.toThrow(
                "Email deve conter letras minúsculas!"
            );

            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando a senha possuir menos de 8 caracteres", async () => {
            const data = {
                name: "Rony",
                email: "rony@email.com",
                password: "1234567"
            };

            await expect(CreateUser(data)).rejects.toThrow(
                "A senha deve conter no mínimo 8 caracteres!"
            );

            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando a senha possuir mais de 9 caracteres", async () => {
            const data = {
                name: "Rony",
                email: "rony@email.com",
                password: "1234567890"
            };

            await expect(CreateUser(data)).rejects.toThrow(
                "A senha deve conter no mínimo 8 caracteres!"
            );

            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });
    });
});
