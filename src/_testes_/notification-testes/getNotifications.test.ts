
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { notificationFindManyMock } = vi.hoisted(() => ({
    notificationFindManyMock: vi.fn(),
}));

vi.mock('../../lib/prisma.js', () => ({
    default: {
        notification: {
            findMany: notificationFindManyMock,
        },
    },
}));

import GetNotifications  from '../../use-cases/notification/GetNotifications.js';

describe('GetNotifications', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve retornar as notificações do usuário com título e data do post', async () => {

        const mockNotifications = [
            {
                id: 'notification-123',
                userId: 'user-123',
                postId: 'post-123',
                createdAt: new Date('2026-11-25T12:00:00'),
                post: {
                    title: 'Meu post de teste',
                    date: '26/11/2026',
                },
            },
        ];

        notificationFindManyMock.mockResolvedValue(mockNotifications);

        const result = await GetNotifications('user-123');

        // Verifica se buscou somente as notificações do usuário
        expect(notificationFindManyMock).toHaveBeenCalledWith({
            where: {
                userId: 'user-123',
            },
            include: {
                post: {
                    select: {
                        title: true,
                        date: true,
                    },
                },
            },
        });

        // Verifica se retornou as notificações encontradas
        expect(result).toEqual(mockNotifications);
    });


    it('deve retornar uma lista vazia quando o usuário não possuir notificações', async () => {

        notificationFindManyMock.mockResolvedValue([]);

        const result = await GetNotifications('user-123');

        expect(notificationFindManyMock).toHaveBeenCalledWith({
            where: {
                userId: 'user-123',
            },
            include: {
                post: {
                    select: {
                        title: true,
                        date: true,
                    },
                },
            },
        });

        expect(result).toEqual([]);
    });


});
