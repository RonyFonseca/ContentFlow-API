import express from 'express';
import IdeiaController from '../Controller/ideiaController.js';
import jwt from "../midleware/jwtValidate.js";
import {upload} from "../midleware/upload.js";

const ideiaController = new IdeiaController();

/**
 * @swagger
 * tags:
 *   name: Ideias
 *   description: Gerenciamento de ideias do ContentFlow
 */

const router = express.Router();

/**
 * @swagger
 * /getAllIdeiasByUser:
 *   get:
 *     summary: Obter todas as ideias de um usuário
 *     description: Retorna todas as ideias associadas a um usuário específico.
 *     tags: [Ideias]
 *
 *     responses:
 *       200:
 *         description: Lista de ideias
 *       404:
 *         description: Nenhuma ideia encontrada para o usuário
 *       500:
 *         description: Erro interno
 */
router.get('/getAllIdeiasByUser', jwt, ideiaController.getAllIdeiasByUser);


/**
 * @swagger
 * /getIdeiaById/{id}:
 *   get:
 *     summary: Obter uma ideia por ID
 *     description: Retorna uma ideia específica com base no seu ID.
 *     tags: [Ideias]
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da ideia a ser obtida
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Ideia encontrada
 *       404:
 *         description: Ideia não encontrada
 *       500:
 *         description: Erro interno
 */
router.get('/getIdeiaById/:id', jwt, ideiaController.getIdeiaById);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Criar ideia
 *     description: Cria uma nova ideia.
 *     tags: [Ideias]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Minha Ideia
 *               content:
 *                 type: string
 *                 example: Conteúdo da minha ideia.
 *
 *     responses:
 *       201:
 *         description: Ideia criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
router.post('/create', jwt, ideiaController.create);

/**
 * @swagger
 * /edit/{id}:
 *   put:
 *     summary: Editar ideia
 *     description: Edita uma ideia existente.
 *     tags: [Ideias]
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da ideia a ser editada
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Minha Ideia Editada
 *               content:
 *                 type: string
 *                 example: Conteúdo da minha ideia editado.
 *
 *     responses:
 *       200:
 *         description: Ideia editada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Ideia não encontrada
 *       500:
 *         description: Erro interno
 */
router.put('/edit/:id', jwt, ideiaController.edit);

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Excluir ideia
 *     description: Exclui uma ideia existente.
 *     tags: [Ideias]
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da ideia a ser excluída
 *         required: true
 *         schema:
 *           type: string
 *utils
 *     responses:
 *       200:
 *         description: Ideia excluída com sucesso
 *       404:
 *         description: Ideia não encontrada
 *       500:
 *         description: Erro interno
 */
router.delete('/delete/:id', jwt, ideiaController.delete);

/**
 * @swagger
 * /transformInPost/{id}:
 *   post:
 *     summary: Transformar ideia em post
 *     description: Transforma uma ideia existente em um post.
 *     tags: [Ideias]
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da ideia a ser transformada
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Ideia transformada em post com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Ideia não encontrada
 *       500:
 *         description: Erro interno
 */
router.post('/transformInPost/:id', jwt, upload.single('image'), ideiaController.transformInPost);

export default router;
