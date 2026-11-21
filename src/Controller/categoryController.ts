import CreateCategory from "../use-cases/category/CreateCategory.js";

import AppError from "../utils/AppError.js";

class categoryController {
    async createCategory(req: any, res: any) {
        const { name } = req.body;

        const userId = req.user.userId;

        try {
            const category = await CreateCategory({ name, userId });

            return res.status(201).json({ message: "Categoria criada com sucesso!", category });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            console.error("Erro ao criar categoria:", error);

            return res.status(500).json({
                error: error,
            });
        }
    }
}

export default categoryController;
