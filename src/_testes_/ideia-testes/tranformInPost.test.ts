
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock, postCreateMock } = vi.hoisted(() => ({
    prismaMock: {
        idea: {
            findUnique: vi.fn()
        },
        category: {
            findFirst: vi.fn()
        },
        $transaction: vi.fn()
    },
    postCreateMock: vi.fn()
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
            categoryId: null
        });

        prismaMock.category.findFirst.mockResolvedValue({
            id: "category-123",
            name: "Tecnologia",
            userId: "user-123"
        });

        postCreateMock.mockResolvedValue({
            id: "post-123",
            title: "Minha ideia",
            content: "Conteúdo da ideia",
            status: "Planejado",
            type: "Instagram",
            date: "2026-11-25",
            userId: "user-123",
            categoryId: null,
            ideaId: "ideia-123"
        });

        prismaMock.$transaction.mockImplementation(async (callback) => {
            return callback({
                post: {
                    create: postCreateMock
                }
            });
        });
    });

    const validData = {
        ideaId: "ideia-123",
        userId: "user-123",
        status: "Planejado",
        type: "Instagram",
        date: "2026-11-25"
    };

    it("deve transformar uma ideia em post com sucesso", async () => {
        const result = await TransformInPost(validData);

        expect(prismaMock.idea.findUnique).toHaveBeenCalledWith({
            where: {
                id: "ideia-123"
            }
        });

        expect(prismaMock.$transaction).toHaveBeenCalled();

        expect(postCreateMock).toHaveBeenCalledWith({
            data: {
                title: "Minha ideia",
                content: "Conteúdo da ideia",
                status: "Planejado",
                type: "Instagram",
                date: "2026-11-25",
                userId: "user-123",
                categoryId: null,
                ideaId: "ideia-123"
            }
        });

        expect(result.id).toBe("post-123");
    });

    it("deve lançar erro quando a ideia não existir", async () => {
        prismaMock.idea.findUnique.mockResolvedValue(null);

        await expect(
            TransformInPost(validData)
        ).rejects.toThrow("Ideia não encontrada!");

        expect(prismaMock.$transaction).not.toHaveBeenCalled();
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

        expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando faltar o status", async () => {
        await expect(
            TransformInPost({
                ...validData,
                status: ""
            })
        ).rejects.toThrow("Falta informação para criar o post!");

        expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando faltar o tipo", async () => {
        await expect(
            TransformInPost({
                ...validData,
                type: ""
            })
        ).rejects.toThrow("Falta informação para criar o post!");

        expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando faltar a data", async () => {
        await expect(
            TransformInPost({
                ...validData,
                date: ""
            })
        ).rejects.toThrow("Falta informação para criar o post!");

        expect(prismaMock.$transaction).not.toHaveBeenCalled();
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

        expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("deve manter a categoria da ideia quando nenhuma nova categoria for informada", async () => {
        prismaMock.idea.findUnique.mockResolvedValue({
            id: "ideia-123",
            title: "Minha ideia",
            content: "Conteúdo da ideia",
            userId: "user-123",
            categoryId: "category-antiga"
        });

        await TransformInPost(validData);

        expect(postCreateMock).toHaveBeenCalledWith({
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

        expect(postCreateMock).toHaveBeenCalledWith({
            data: expect.objectContaining({
                categoryId: "category-123"
            })
        });
    });
});
