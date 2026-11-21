
import prisma from "../../lib/prisma.js";

interface CreateImageData {
    path: string;
    mimeType: string;
    size: number;
    postId: string;
}

export default async function CreateImage(data: CreateImageData) {
    return await prisma.image.create({
        data: {
            path: data.path,
            mimeType: data.mimeType,
            size: data.size,
            postId: data.postId
        }
    });
}
