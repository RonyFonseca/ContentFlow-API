
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        user: {
            findUnique: vi.fn(),
        },
        category: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        post: {
            create: vi.fn(),
        },
    },
}));

vi.mock("../../lib/prisma.js", () => ({
    default: prismaMock,
}));

import CreatePost from "../../use-cases/post/CreatePost.js";

describe("CreatePost", () => {
    const data = {
        title: "Meu post",
        content: "Conteúdo do post",
        type: "reels",
        status: "draft",
        date: "2026-11-21",
        userId: "user-123",
        categoryName: "Tecnologia",
    };

    const categoryMock = {
        id: "category-123",
        name: "Tecnologia",
        userId: "user-123",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        prismaMock.user.findUnique.mockResolvedValue({
            id: "user-123",
        });

        prismaMock.category.findUnique.mockResolvedValue(categoryMock);

        prismaMock.category.create.mockResolvedValue(categoryMock);

        prismaMock.post.create.mockResolvedValue({
            id: "post-123",
            ...data,
            categoryId: "category-123",
        });
    });

    it("deve criar um post reutilizando uma categoria existente", async () => {
        const result = await CreatePost(data);

        expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
            where: {
                userId_name: {
                    userId: data.userId,
                    name: data.categoryName,
                },
            },
        });

        expect(prismaMock.category.create).not.toHaveBeenCalled();

        expect(prismaMock.post.create).toHaveBeenCalledWith({
            data: {
                title: data.title,
                content: data.content,
                userId: data.userId,
                status: data.status,
                type: data.type,
                date: data.date,
                categoryId: categoryMock.id,
            },
        });

        expect(result.categoryId).toBe("category-123");
    });

    it("deve criar uma categoria quando ela ainda não existir", async () => {
        prismaMock.category.findUnique.mockResolvedValue(null);

        const result = await CreatePost(data);

        expect(prismaMock.category.create).toHaveBeenCalledWith({
            data: {
                name: data.categoryName,
                userId: data.userId,
            },
        });

        expect(prismaMock.post.create).toHaveBeenCalledWith({
            data: {
                title: data.title,
                content: data.content,
                userId: data.userId,
                status: data.status,
                type: data.type,
                date: data.date,
                categoryId: categoryMock.id,
            },
        });

        expect(result.categoryId).toBe("category-123");
    });

    it("deve lançar erro quando a categoria não for informada", async () => {
        await expect(
            CreatePost({
                ...data,
                categoryName: "",
            })
        ).rejects.toThrow("Falta informação!");

        expect(prismaMock.category.findUnique).not.toHaveBeenCalled();
        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando o usuário não existir", async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        await expect(CreatePost(data)).rejects.toThrow(
            "O autor não existe!"
        );

        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando faltar informação obrigatória", async () => {
        await expect(
            CreatePost({
                ...data,
                title: "",
            })
        ).rejects.toThrow("Falta informação!");

        expect(prismaMock.post.create).not.toHaveBeenCalled();
    });
});
