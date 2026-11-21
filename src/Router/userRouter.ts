
import express from 'express';
import userController from '../Controller/userController.js';

const router = express.Router();
const userControllerInstance = new userController();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários do ContentFlow
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realizar login
 *     description: Autentica um usuário e realiza o login.
 *     tags: [Usuários]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais incorretas
 *       500:
 *         description: Erro interno
 */
router.post('/login', userControllerInstance.loginUser);

/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Criar usuário
 *     description: Realiza o cadastro de um novo usuário.
 *     tags: [Usuários]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rony
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Usuário já cadastrado
 *       500:
 *         description: Erro interno
 */
router.post('/createUser', userControllerInstance.createUser);


export default router;
