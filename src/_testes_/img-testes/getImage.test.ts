
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getPublicUrlMock } = vi.hoisted(() => ({
    getPublicUrlMock: vi.fn(),
}));

vi.mock('../../lib/supabase.js', () => ({
    supabase: {
        storage: {
            from: vi.fn(() => ({
                getPublicUrl: getPublicUrlMock,
            })),
        },
    },
}));

import GetImageUrl from '../../use-cases/img/GetImageUrl.js';
import { supabase } from '../../lib/supabase.js';

describe('GetImageUrl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve retornar a URL pública da imagem', () => {
        getPublicUrlMock.mockReturnValue({
            data: {
                publicUrl: 'https://projeto.supabase.co/storage/v1/object/public/content-img/foto.jpg',
            },
        });

        const result = GetImageUrl('foto.jpg');

        expect(result).toBe(
            'https://projeto.supabase.co/storage/v1/object/public/content-img/foto.jpg'
        );

        expect(getPublicUrlMock).toHaveBeenCalledWith('foto.jpg');
    });

    it('deve utilizar o bucket content-img', () => {
    getPublicUrlMock.mockReturnValue({
        data: {
            publicUrl: 'https://projeto.supabase.co/foto.jpg',
        },
    });

    GetImageUrl('foto.jpg');

    expect(supabase.storage.from).toHaveBeenCalledWith('content-img');
});
});
