
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock, createPostMock } = vi.hoisted(() => ({
    prismaMock: {
        idea: {
            findUnique: vi.fn(),
            update: vi.fn()
        },
        category: {
            findFirst: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn()
        },
        user: {
            findUnique: vi.fn()
        },
        post: {
            create: vi.fn()
        }
    },
    createPostMock: vi.fn()
}));

vi.mock("../../lib/prisma.js", () => ({
    default: prismaMock
}));

import TransformInPost from "../../use-cases/ideias/TranformInPost.js";

describe("TransformInPost", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        prismaMock.idea.findUnique.mockResolvedValue({
            id: "ideia-123",
            title: "Minha ideia",
            content: "Conteúdo da ideia",
            userId: "user-123",
            categoryId: null,
            isPlanned: false
        });

        prismaMock.category.findFirst.mockResolvedValue({
            id: "category-123",
            name: "Tecnologia",
            userId: "user-123"
        });

        prismaMock.category.findUnique.mockResolvedValue({
            id: "category-123",
            name: "Tecnologia",
            userId: "user-123"
        });

        prismaMock.user.findUnique.mockResolvedValue({
            id: "user-123"
        });

        prismaMock.category.create.mockResolvedValue({
            id: "category-123",
            name: "Sem categoria",
            userId: "user-123"
        });

        prismaMock.post.create.mockImplementation(async ({ data }) => ({
            id: "post-123",
            ...data
        }));

        prismaMock.idea.update.mockResolvedValue({
            id: "ideia-123",
            isPlanned: true
        });
    });

    const validData = {
        ideaId: "ideia-123",
        userId: "user-123",
        status: "Planejado"
    };

    it("deve transformar uma ideia em post com sucesso", async () => {
        const result = await TransformInPost(validData);

        expect(prismaMock.idea.findUnique).toHaveBeenCalledWith({
            where: {
                id: "ideia-123"
            }
        });

        expect(prismaMock.post.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                title: "Minha ideia",
                content: "Conteúdo da ideia",
                status: "Planejado",
                type: "convert",
                userId: "user-123",
                ideaId: "ideia-123"
            })
        });

        expect(prismaMock.idea.update).toHaveBeenCalledWith({
            where: {
                id: "ideia-123"
            },
            data: {
                isPlanned: true
            }
        });

        expect(result.id).toBe("post-123");
    });

    it("deve lançar erro quando a ideia não existir", async () => {
        prismaMock.idea.findUnique.mockResolvedValue(null);

        await expect(
            TransformInPost(validData)
        ).rejects.toThrow("Ideia não encontrada!");

        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });

    it("deve impedir a transformação por outro usuário", async () => {
        await expect(
            TransformInPost({
                ...validData,
                userId: "outro-usuario"
            })
        ).rejects.toThrow(
            "Você não tem permissão para transformar essa ideia!"
        );

        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando faltar o status", async () => {
        await expect(
            TransformInPost({
                ...validData,
                status: ""
            })
        ).rejects.toThrow("Falta informação para criar o post!");

        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando a ideia já estiver planejada", async () => {
        prismaMock.idea.findUnique.mockResolvedValue({
            id: "ideia-123",
            title: "Minha ideia",
            content: "Conteúdo da ideia",
            userId: "user-123",
            categoryId: null,
            isPlanned: true
        });

        await expect(
            TransformInPost(validData)
        ).rejects.toThrow("Essa ideia já foi transformada em post!");

        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });

    it("deve validar se a categoria pertence ao usuário", async () => {
        await TransformInPost({
            ...validData,
            categoryId: "category-123"
        });

        expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
            where: {
                id: "category-123",
                userId: "user-123"
            }
        });
    });

    it("deve lançar erro quando a categoria não existir para o usuário", async () => {
        prismaMock.category.findFirst.mockResolvedValue(null);

        await expect(
            TransformInPost({
                ...validData,
                categoryId: "category-inexistente"
            })
        ).rejects.toThrow("Categoria não encontrada!");

        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });

    it("deve manter a categoria da ideia quando nenhuma nova categoria for informada", async () => {
        prismaMock.idea.findUnique.mockResolvedValue({
            id: "ideia-123",
            title: "Minha ideia",
            content: "Conteúdo da ideia",
            userId: "user-123",
            categoryId: "category-antiga",
            isPlanned: false
        });

        prismaMock.category.findUnique.mockResolvedValue({
            id: "category-antiga",
            name: "Marketing",
            userId: "user-123"
        });

        await TransformInPost(validData);

        expect(prismaMock.post.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                categoryId: "category-antiga"
            })
        });
    });

    it("deve utilizar a nova categoria quando ela for informada", async () => {
        await TransformInPost({
            ...validData,
            categoryId: "category-123"
        });

        expect(prismaMock.post.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                categoryId: "category-123"
            })
        });
    });
});
