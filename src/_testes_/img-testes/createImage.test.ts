
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
}));


vi.mock('../../lib/prisma.js', () => ({
  default: {
    image: {
      create: createMock,
    },
  },
}));

import CreateImage from '../../use-cases/img/CreateImage.js';

describe('CreateImage', () => {
  const imageData = {
    path: 'images/foto.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    postId: 'post-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar uma referência de imagem no banco', async () => {
    const mockImage = {
      id: 'image-123',
      ...imageData,
      createdAt: new Date(),
    };

    createMock.mockResolvedValue(mockImage);

    const result = await CreateImage(imageData);

    expect(result).toEqual(mockImage);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        path: imageData.path,
        mimeType: imageData.mimeType,
        size: imageData.size,
        postId: imageData.postId,
      },
    });
  });

  it('deve propagar erros do Prisma', async () => {
    createMock.mockRejectedValue(
      new Error('Erro ao criar imagem')
    );

    await expect(CreateImage(imageData))
      .rejects.toThrow('Erro ao criar imagem');
  });
});
