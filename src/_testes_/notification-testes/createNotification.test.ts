import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach,
} from 'vitest';

const {
    findManyMock,
    notificationFindFirstMock,
    notificationCreateMock,
} = vi.hoisted(() => ({
    findManyMock: vi.fn(),
    notificationFindFirstMock: vi.fn(),
    notificationCreateMock: vi.fn(),
}));

vi.mock('../../lib/prisma.js', () => ({
    default: {
        post: {
            findMany: findManyMock,
        },
        notification: {
            findFirst: notificationFindFirstMock,
            create: notificationCreateMock,
        },
    },
}));

import CreateNotification from '../../use-cases/notification/CreateNotification.js';

describe('CreateNotification', () => {

    beforeEach(() => {
        vi.clearAllMocks();

        // Simula a data atual: 25/11/2026
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 10, 25, 12, 0, 0));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('deve gerar notificação quando a data do post for amanhã', async () => {

        const mockPost = {
            id: 'post-123',
            title: 'Meu post de teste',
            content: 'Conteúdo de teste',
            date: '26/11/2026',
            status: 'Planejado',
            userId: 'user-123',
        };

        findManyMock.mockResolvedValue([mockPost]);

        notificationFindFirstMock.mockResolvedValue(null);

        notificationCreateMock.mockResolvedValue({
            id: 'notification-123',
            userId: 'user-123',
            postId: 'post-123',
        });

        await CreateNotification();

        // Verifica se buscou os posts com publicação amanhã
        expect(findManyMock).toHaveBeenCalledWith({
            where: {
                date: '26/11/2026',
            },
        });

        // Verifica se consultou notificações existentes
        expect(notificationFindFirstMock).toHaveBeenCalled();

        // Verifica se criou uma notificação
        expect(notificationCreateMock).toHaveBeenCalledTimes(1);
    });

    it('não deve criar uma notificação quando já existir uma para o post', async () => {
        const mockPost = {
            id: 'post-123',
            title: 'Meu post de teste',
            content: 'Conteúdo de teste',
            date: '26/11/2026',
            status: 'Planejado',
            userId: 'user-123',
        };

        findManyMock.mockResolvedValue([mockPost]);

        // Simula uma notificação que já existe
        notificationFindFirstMock.mockResolvedValue({
            id: 'notification-123',
            userId: 'user-123',
            postId: 'post-123',
        });

        await CreateNotification();

        // Verifica se o sistema consultou a notificação existente
        expect(notificationFindFirstMock).toHaveBeenCalledWith({
            where: {
                postId: 'post-123',
            },
        });

        // Verifica se NÃO criou uma nova notificação
        expect(notificationCreateMock).not.toHaveBeenCalled();
    });


    it('não deve criar notificações quando não existem posts para amanhã', async () => {
        // Simula que nenhum post foi encontrado
        findManyMock.mockResolvedValue([]);

        await CreateNotification();

        // Verifica se o sistema buscou os posts
        expect(findManyMock).toHaveBeenCalledWith({
            where: {
                date: '26/11/2026',
            },
        });

        // Verifica se não tentou consultar notificações existentes
        expect(notificationFindFirstMock).not.toHaveBeenCalled();

        // Verifica se nenhuma notificação foi criada
        expect(notificationCreateMock).not.toHaveBeenCalled();
    });

});
