
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getPostByIdMock } = vi.hoisted(() => ({
    getPostByIdMock: vi.fn(),
}));

vi.mock('../../use-cases/post/GetPostById.js', () => ({
    default: getPostByIdMock,
}));

import postController from '../../Controller/postController.js';
import AppError from '../../utils/AppError.js';

describe('getPostById', () => {
    let controller: postController;
    let req: any;
    let res: any;

    beforeEach(() => {
        vi.clearAllMocks();

        controller = new postController();

        req = {
            params: { idPost: 'post-123' },
            user: { userId: 'user-123' },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
    });

    it('deve retornar 400 quando o ID não for informado', async () => {
        req.params.idPost = undefined;

        await controller.getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'ID do post não fornecido.',
        });

        expect(getPostByIdMock).not.toHaveBeenCalled();
    });

    it('deve retornar 200 quando encontrar o post', async () => {
        const mockPost = {
            id: 'post-123',
            title: 'Meu post',
            content: 'Conteúdo de teste',
            images: [],
        };

        getPostByIdMock.mockResolvedValue(mockPost);

        await controller.getPostById(req, res);

        expect(getPostByIdMock).toHaveBeenCalledWith({
            idPost: 'post-123',
            userId: 'user-123',
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            post: mockPost,
        });
    });

    it('deve retornar o status e a mensagem do AppError', async () => {
        getPostByIdMock.mockRejectedValue(
            new AppError('Post não encontrado!', 404)
        );

        await controller.getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Post não encontrado!',
        });
    });

    it('deve retornar 500 quando ocorrer um erro inesperado', async () => {
        const error = new Error('Erro interno');

        getPostByIdMock.mockRejectedValue(error);

        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await controller.getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error });

        consoleSpy.mockRestore();
    });
});
