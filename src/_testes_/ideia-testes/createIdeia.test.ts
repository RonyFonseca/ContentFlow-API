
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock do Prisma
const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        idea: {
            create: vi.fn()
        }
    }
}));

// Mock das dependências
vi.mock("../../lib/prisma.js", () => ({
    default: prismaMock
}));

// Importação do Use Case
import CreateIdeia from "../../use-cases/ideias/CreateIdeia.js";

describe("CreateIdeia", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        prismaMock.idea.create.mockResolvedValue({
            id: "ideia-123",
            title: "Minha ideia",
            content: "Conteúdo da ideia",
            userId: "user-123"
        });
    });

    describe("Criação de ideia", () => {

        it("deve criar uma ideia com sucesso", async () => {
            const data = {
                title: "Minha ideia",
                content: "Conteúdo da ideia",
                userId: "user-123"
            };

            const result = await CreateIdeia(data);

            expect(prismaMock.idea.create).toHaveBeenCalledWith({
                data: {
                    title: data.title,
                    content: data.content,
                    userId: data.userId
                }
            });

            expect(result).toEqual({
                id: "ideia-123",
                title: "Minha ideia",
                content: "Conteúdo da ideia",
                userId: "user-123"
            });
        });

        it("deve remover espaços desnecessários do título e conteúdo", async () => {
            await CreateIdeia({
                title: "  Minha ideia  ",
                content: "  Conteúdo da ideia  ",
                userId: "user-123"
            });

            expect(prismaMock.idea.create).toHaveBeenCalledWith({
                data: {
                    title: "Minha ideia",
                    content: "Conteúdo da ideia",
                    userId: "user-123"
                }
            });
        });
    });

    describe("Validação dos dados", () => {

        it("deve lançar erro quando faltar o título", async () => {
            await expect(CreateIdeia({
                title: "",
                content: "Conteúdo da ideia",
                userId: "user-123"
            })).rejects.toThrow("Falta informação!");

            expect(prismaMock.idea.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando faltar o conteúdo", async () => {
            await expect(CreateIdeia({
                title: "Minha ideia",
                content: "",
                userId: "user-123"
            })).rejects.toThrow("Falta informação!");

            expect(prismaMock.idea.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando o título ultrapassar 30 caracteres", async () => {
            await expect(CreateIdeia({
                title: "A".repeat(31),
                content: "Conteúdo da ideia",
                userId: "user-123"
            })).rejects.toThrow("O título está muito longo!");

            expect(prismaMock.idea.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando o conteúdo ultrapassar 300 caracteres", async () => {
            await expect(CreateIdeia({
                title: "Minha ideia",
                content: "A".repeat(301),
                userId: "user-123"
            })).rejects.toThrow("O conteúdo está muito longo!");

            expect(prismaMock.idea.create).not.toHaveBeenCalled();
        });
    });
});
