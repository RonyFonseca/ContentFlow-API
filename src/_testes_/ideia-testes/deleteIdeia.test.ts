
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        idea: {
            findUnique: vi.fn(),
            delete: vi.fn()
        }
    }
}));

vi.mock("../../lib/prisma.js", () => ({
    default: prismaMock
}));

import DeleteIdeia from "../../use-cases/ideias/DeleteIdeia.js";

describe("DeleteIdeia", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        prismaMock.idea.findUnique.mockResolvedValue({
            id: "ideia-123",
            userId: "user-123"
        });

        prismaMock.idea.delete.mockResolvedValue({
            id: "ideia-123",
            userId: "user-123"
        });
    });

    it("deve excluir uma ideia com sucesso", async () => {
        const result = await DeleteIdeia({
            ideiaId: "ideia-123",
            userId: "user-123"
        });

        expect(prismaMock.idea.findUnique).toHaveBeenCalledWith({
            where: { id: "ideia-123" }
        });

        expect(prismaMock.idea.delete).toHaveBeenCalledWith({
            where: { id: "ideia-123" }
        });

        expect(result.id).toBe("ideia-123");
    });

    it("deve lançar erro quando a ideia não existir", async () => {
        prismaMock.idea.findUnique.mockResolvedValue(null);

        await expect(DeleteIdeia({
            ideiaId: "ideia-inexistente",
            userId: "user-123"
        })).rejects.toThrow("Ideia não existe!");

        expect(prismaMock.idea.delete).not.toHaveBeenCalled();
    });

    it("deve impedir a exclusão por outro usuário", async () => {
        await expect(DeleteIdeia({
            ideiaId: "ideia-123",
            userId: "outro-usuario"
        })).rejects.toThrow("Você não tem permissão para deletar essa ideia!");

        expect(prismaMock.idea.delete).not.toHaveBeenCalled();
    });
});
