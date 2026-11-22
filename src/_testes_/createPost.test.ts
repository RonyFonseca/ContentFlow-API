import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Criando os mocks
const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        user: {
            findUnique: vi.fn()
        },
        category: {
            findFirst: vi.fn()
        },
        post: {
            create: vi.fn()
        }
    }
}));

// 2. Mock das dependências externas
vi.mock("../lib/prisma.js", () => ({
    default: prismaMock
}));

// 3. Importação do caso de uso
import CreatePost from "../use-cases/post/CreatePost.js";

describe("CreatePost", () => {

    const data = {
        title: "Meu post",
        content: "Conteúdo do post",
        type: "reels",
        status: "draft",
        date: "2026-11-21",
        userId: "user-123",
        categoryId: "category-123"
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Configuração dos retornos dos mocks
        prismaMock.user.findUnique.mockResolvedValue({
            id: "user-123"
        });

        prismaMock.category.findFirst.mockResolvedValue({
            id: "category-123",
            name: "Tecnologia",
            userId: "user-123"
        });

        prismaMock.post.create.mockResolvedValue({
            id: "post-123",
            ...data
        });
    });

    describe("Utilização de categoria", () => {

        it("deve criar um post com uma categoria cadastrada", async () => {
            const result = await CreatePost(data);

            // Verifica se a categoria pertence ao usuário
            expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
                where: { id: data.categoryId, userId: data.userId }
            });

            // Verifica a criação no banco
            expect(prismaMock.post.create).toHaveBeenCalledWith({
                data: {
                    title: data.title,
                    content: data.content,
                    userId: data.userId,
                    status: data.status,
                    type: data.type,
                    date: data.date,
                    categoryId: data.categoryId
                }
            });

            // Verifica o retorno do caso de uso
            expect(result.categoryId).toBe("category-123");
        });

        it("deve lançar erro quando a categoria não existir para o usuário", async () => {
            prismaMock.category.findFirst.mockResolvedValue(null);

            await expect(CreatePost(data)).rejects.toThrow(
                "Categoria não encontrada!"
            );

            expect(prismaMock.post.create).not.toHaveBeenCalled();
        });
    });
});
