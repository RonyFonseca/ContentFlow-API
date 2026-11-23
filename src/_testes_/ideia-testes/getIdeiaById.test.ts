
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        idea: {
            findUnique: vi.fn()
        }
    }
}));

vi.mock("../../lib/prisma.js", () => ({
    default: prismaMock
}));

import GetIdeiaById from "../../use-cases/ideias/GetIdeiaById.js";

describe("GetIdeiaById", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        prismaMock.idea.findUnique.mockResolvedValue({
            id: "ideia-123",
            title: "Minha ideia",
            content: "Conteúdo da ideia",
            userId: "user-123"
        });
    });

    it("deve buscar uma ideia pelo seu ID", async () => {
        const result = await GetIdeiaById({
            ideiaId: "ideia-123",
            userId: "user-123"
        });

        expect(prismaMock.idea.findUnique).toHaveBeenCalledWith({
            where: {
                id: "ideia-123"
            }
        });

        expect(result.id).toBe("ideia-123");
        expect(result.title).toBe("Minha ideia");
    });

    it("deve lançar erro quando a ideia não existir", async () => {
        prismaMock.idea.findUnique.mockResolvedValue(null);

        await expect(GetIdeiaById({
            ideiaId: "ideia-inexistente",
            userId: "user-123"
        })).rejects.toThrow("Ideia não existe!");
    });

    it("deve impedir que outro usuário visualize a ideia", async () => {
        await expect(GetIdeiaById({
            ideiaId: "ideia-123",
            userId: "outro-usuario"
        })).rejects.toThrow(
            "Você não tem permissão para visualizar essa ideia!"
        );
    });
});
