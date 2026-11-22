
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { uploadMock, getPublicUrlMock } = vi.hoisted(() => ({
  uploadMock: vi.fn(),
  getPublicUrlMock: vi.fn(),
}));

vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: uploadMock,
        getPublicUrl: getPublicUrlMock,
      })),
    },
  },
}));

import {uploadImage} from '../../use-cases/img/UploadImage.js';

describe('uploadImage', () => {
  const mockFile = {
    fieldname: 'image',
    originalname: 'foto.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('imagem de teste'),
  } as Express.Multer.File;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar upload de imagem com sucesso', async () => {
    uploadMock.mockResolvedValue({
      data: { path: 'imagem.jpg' },
      error: null,
    });

    getPublicUrlMock.mockReturnValue({
      data: {
        publicUrl: 'https://supabase.com/imagem.jpg',
      },
    });

    const result = await uploadImage(mockFile);

    expect(result).toEqual({
      path: 'imagem.jpg',
      url: 'https://supabase.com/imagem.jpg',
    });

    expect(uploadMock).toHaveBeenCalledOnce();
    expect(getPublicUrlMock).toHaveBeenCalledWith(
      'imagem.jpg',
    );
  });

  it('deve rejeitar formatos de imagem não permitidos', async () => {
    const invalidFile = {
      ...mockFile,
      mimetype: 'application/pdf',
    } as Express.Multer.File;

    await expect(uploadImage(invalidFile))
      .rejects.toThrow('Formato de imagem não permitido!');

    expect(uploadMock).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o Supabase falhar no upload', async () => {
    uploadMock.mockResolvedValue({
      data: null,
      error: { message: 'Storage unavailable' },
    });

    await expect(uploadImage(mockFile))
      .rejects.toThrow('Erro ao enviar imagem: Storage unavailable');
  });

  it('deve aceitar imagens PNG', async () => {
    const pngFile = {
      ...mockFile,
      mimetype: 'image/png',
    } as Express.Multer.File;

    uploadMock.mockResolvedValue({
      data: { path: 'imagem.png' },
      error: null,
    });

    getPublicUrlMock.mockReturnValue({
      data: { publicUrl: 'https://supabase.com/imagem.png' },
    });

    const result = await uploadImage(pngFile);

    expect(result.path).toBe('imagem.png');
    expect(uploadMock).toHaveBeenCalledOnce();
  });
});
