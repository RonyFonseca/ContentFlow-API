
import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        idea: {
            findUnique: vi.fn(),
            update: vi.fn()
        }
    }
}));

vi.mock("../../lib/prisma.js", () => ({
    default: prismaMock
}));

import EditIdeia from "../../use-cases/ideias/EditIdeia.js";

describe("EditIdeia", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        prismaMock.idea.findUnique.mockResolvedValue({
            id: "ideia-123",
            title: "Título antigo",
            content: "Conteúdo antigo",
            userId: "user-123"
        });

        prismaMock.idea.update.mockResolvedValue({
            id: "ideia-123",
            title: "Título atualizado",
            content: "Conteúdo atualizado",
            userId: "user-123"
        });
    });

    it("deve editar uma ideia com sucesso", async () => {
        const data = {
            ideiaId: "ideia-123",
            title: "Título atualizado",
            content: "Conteúdo atualizado",
            userId: "user-123"
        };

        const result = await EditIdeia(data);

        expect(prismaMock.idea.findUnique).toHaveBeenCalledWith({
            where: { id: data.ideiaId }
        });

        expect(prismaMock.idea.update).toHaveBeenCalledWith({
            where: { id: data.ideiaId },
            data: {
                title: data.title,
                content: data.content
            }
        });

        expect(result.title).toBe("Título atualizado");
    });

    it("deve remover espaços desnecessários dos dados", async () => {
        await EditIdeia({
            ideiaId: "ideia-123",
            title: "  Novo título  ",
            content: "  Novo conteúdo  ",
            userId: "user-123"
        });

        expect(prismaMock.idea.update).toHaveBeenCalledWith({
            where: { id: "ideia-123" },
            data: {
                title: "Novo título",
                content: "Novo conteúdo"
            }
        });
    });

    it("deve lançar erro quando faltar o título", async () => {
        await expect(EditIdeia({
            ideiaId: "ideia-123",
            title: "",
            content: "Conteúdo",
            userId: "user-123"
        })).rejects.toThrow("Falta informação!");

        expect(prismaMock.idea.update).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando faltar o conteúdo", async () => {
        await expect(EditIdeia({
            ideiaId: "ideia-123",
            title: "Título",
            content: "",
            userId: "user-123"
        })).rejects.toThrow("Falta informação!");

        expect(prismaMock.idea.update).not.toHaveBeenCalled();
    });

    it("deve rejeitar título com mais de 30 caracteres", async () => {
        await expect(EditIdeia({
            ideiaId: "ideia-123",
            title: "A".repeat(31),
            content: "Conteúdo",
            userId: "user-123"
        })).rejects.toThrow("O título está muito longo!");

        expect(prismaMock.idea.update).not.toHaveBeenCalled();
    });

    it("deve rejeitar conteúdo com mais de 300 caracteres", async () => {
        await expect(EditIdeia({
            ideiaId: "ideia-123",
            title: "Título",
            content: "A".repeat(301),
            userId: "user-123"
        })).rejects.toThrow("O conteúdo está muito longo!");

        expect(prismaMock.idea.update).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando a ideia não existir", async () => {
        prismaMock.idea.findUnique.mockResolvedValue(null);

        await expect(EditIdeia({
            ideiaId: "ideia-inexistente",
            title: "Título",
            content: "Conteúdo",
            userId: "user-123"
        })).rejects.toThrow("Ideia não existe!");

        expect(prismaMock.idea.update).not.toHaveBeenCalled();
    });

    it("deve impedir a edição por outro usuário", async () => {
        await expect(EditIdeia({
            ideiaId: "ideia-123",
            title: "Título",
            content: "Conteúdo",
            userId: "outro-usuario"
        })).rejects.toThrow("Você não tem permissão para editar essa ideia!");

        expect(prismaMock.idea.update).not.toHaveBeenCalled();
    });
});
