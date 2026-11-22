
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        idea: {
            findMany: vi.fn()
        }
    }
}));

vi.mock("../../lib/prisma.js", () => ({
    default: prismaMock
}));

import GetAllIdeiasByUser from "../../use-cases/ideias/GetAllIdeiasByUser.js";

describe("GetAllIdeiasByUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        prismaMock.idea.findMany.mockResolvedValue([
            {
                id: "ideia-123",
                title: "Primeira ideia",
                content: "Conteúdo 1",
                userId: "user-123"
            },
            {
                id: "ideia-456",
                title: "Segunda ideia",
                content: "Conteúdo 2",
                userId: "user-123"
            }
        ]);
    });

    it("deve listar todas as ideias do usuário", async () => {
        const result = await GetAllIdeiasByUser({
            userId: "user-123"
        });

        expect(prismaMock.idea.findMany).toHaveBeenCalledWith({
            where: {
                userId: "user-123"
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        expect(result).toHaveLength(2);
        expect(result[0].title).toBe("Primeira ideia");
    });

    it("deve retornar uma lista vazia quando o usuário não possuir ideias", async () => {
        prismaMock.idea.findMany.mockResolvedValue([]);

        const result = await GetAllIdeiasByUser({
            userId: "user-123"
        });

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    it("deve filtrar as ideias pelo usuário informado", async () => {
        await GetAllIdeiasByUser({
            userId: "outro-usuario"
        });

        expect(prismaMock.idea.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    userId: "outro-usuario"
                }
            })
        );
    });
});
