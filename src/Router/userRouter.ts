import express from 'express';
import userController from '../Controller/userController.js';

const router = express.Router();
const userControllerInstance = new userController();

router.post('/login', userControllerInstance.loginUser)
router.post('/createUser', userControllerInstance.createUser);
router.delete('/deleteUser/:id', userControllerInstance.deleteUser);

export default router;