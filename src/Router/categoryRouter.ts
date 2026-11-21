import express from 'express';
import categoryController from '../Controller/categoryController.js';
import middleware from '../midleware/jwtValidate.js';

const router = express.Router();
const categoryControllerInstance = new categoryController();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gerenciamento de categorias
 */

/**
 * @swagger
 * /createCategory:
 *   post:
 *     summary: Criar uma categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       409:
 *         description: Categoria já existe
 *       500:
 *         description: Erro interno
 */
router.post(
  '/createCategory',
  middleware,
  categoryControllerInstance.createCategory
);

export default router;
