import { supabase } from '../../lib/supabase.js';
import { randomUUID } from 'crypto';

export async function uploadImage(file: Express.Multer.File) {
  const extension = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }[file.mimetype];

  if (!extension) {
    throw new Error('Formato de imagem não permitido!');
  }

  const fileName = `${randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from('content-img')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao enviar imagem: ${error.message}`);
  }

  const { data: publicUrl } = supabase.storage
    .from('content-img')
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrl.publicUrl,
  };
}
