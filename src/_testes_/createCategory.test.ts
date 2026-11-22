import { describe, it, expect, vi, beforeEach } from "vitest";

// 1. Criando os mocks
const { prismaMock } = vi.hoisted(() => ({
    prismaMock: {
        category: {
            findUnique: vi.fn(),
            create: vi.fn()
        }
    }
}));

// 2. Mock das dependências externas
vi.mock("../lib/prisma.js", () => ({
    default: prismaMock
}));

// 3. Importação do caso de uso
import CreateCategory from "../use-cases/category/CreateCategory.js";

describe("CreateCategory", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        // Configuração dos retornos dos mocks
        prismaMock.category.findUnique.mockResolvedValue(null);

        prismaMock.category.create.mockResolvedValue({
            id: "category-123",
            name: "Tecnologia",
            userId: "user-123"
        });
    });

    describe("Criação de categoria", () => {

        it("deve criar uma categoria com sucesso", async () => {
            const data = {
                name: "Tecnologia",
                userId: "user-123"
            };

            const result = await CreateCategory(data);

            // Verifica a criação no banco
            expect(prismaMock.category.create).toHaveBeenCalledWith({
                data: {
                    name: data.name,
                    userId: data.userId
                }
            });

            // Verifica o retorno do caso de uso
            expect(result).toEqual({
                id: "category-123",
                name: "Tecnologia",
                userId: "user-123"
            });
        });
    });

    describe("Validação dos dados", () => {

        it("deve lançar erro quando o nome não for informado", async () => {
            const data = {
                name: "",
                userId: "user-123"
            };

            await expect(CreateCategory(data)).rejects.toThrow(
                "Falta informação!"
            );

            expect(prismaMock.category.create).not.toHaveBeenCalled();
        });
    });
});
