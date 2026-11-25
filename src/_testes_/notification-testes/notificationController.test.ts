
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getNotificationsMock } = vi.hoisted(() => ({
    getNotificationsMock: vi.fn(),
}));

vi.mock('../../use-cases/notification/GetNotifications.js', () => ({
    default: getNotificationsMock,
}));

import notificationController from '../../Controller/notificationController.js';

describe('notificationController', () => {
    let controller: notificationController;
    let req: any;
    let res: any;

    beforeEach(() => {
        vi.clearAllMocks();

        controller = new notificationController();

        req = {
            user: {
                userId: 'user-123',
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
    });

    it('deve retornar as notificações do usuário com status 200', async () => {
        const mockNotifications = [
            {
                id: 'notification-123',
                userId: 'user-123',
                postId: 'post-123',
                post: {
                    title: 'Meu post de teste',
                    date: '26/11/2026',
                },
            },
        ];

        getNotificationsMock.mockResolvedValue(mockNotifications);

        await controller.getNotifications(req, res);

        expect(getNotificationsMock).toHaveBeenCalledWith('user-123');

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            notifications: mockNotifications,
        });
    });


    it('deve retornar status 500 quando ocorrer um erro ao buscar notificações', async () => {
        getNotificationsMock.mockRejectedValue(
            new Error('Erro ao consultar o banco de dados')
        );

        await controller.getNotifications(req, res);

        expect(getNotificationsMock).toHaveBeenCalledWith('user-123');

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Erro interno ao buscar notificações.',
        });
    });

});
