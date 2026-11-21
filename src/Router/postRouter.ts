
import express from 'express';
import postController from '../Controller/postController.js';
import middleware from '../midleware/jwtValidate.js';

const router = express.Router();
const postControllerInstance = new postController();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Gerenciamento de publicações
 */

/**
 * @swagger
 * /getAllPostsById:
 *   get:
 *     summary: Buscar posts do usuário logado
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Posts encontrados
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro interno
 */
router.get(
  '/getAllPostsById',
  middleware,
  postControllerInstance.getAllPostsById
);

/**
 * @swagger
 * /createPost:
 *   post:
 *     summary: Criar uma publicação
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       201:
 *         description: Publicação criada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro interno
 */
router.post(
  '/createPost',
  middleware,
  postControllerInstance.createPost
);

/**
 * @swagger
 * /posts/{idPost}/status:
 *   patch:
 *     summary: Atualizar status de uma publicação
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: idPost
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da publicação
 *
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Publicação não encontrada
 */
router.patch(
  '/posts/:idPost/status',
  postControllerInstance.updatePost
);

/**
 * @swagger
 * /posts/{idPost}/category:
 *   patch:
 *     summary: Alterar a categoria de uma publicação
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPost
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da publicação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId]
 *             properties:
 *               categoryId:
 *                 type: string
 *                 nullable: true
 *                 description: ID da categoria, ou null para remover
 *
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Publicação ou categoria não encontrada
 */
router.patch(
  '/posts/:idPost/category',
  middleware,
  postControllerInstance.updatePostCategory
);

/**
 * @swagger
 * /posts/{idPost}/delete:
 *   delete:
 *     summary: Remover uma publicação
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: idPost
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da publicação
 *
 *     responses:
 *       200:
 *         description: Publicação removida
 *       404:
 *         description: Publicação não encontrada
 *       500:
 *         description: Erro interno
 */
router.delete(
  '/posts/:idPost/delete',
  postControllerInstance.deletePost
);

export default router;
