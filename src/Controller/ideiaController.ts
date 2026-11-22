import GetAllIdeiasByUser from "../use-cases/ideias/GetAllIdeiasByUser.js";
import getIdeiaById from "../use-cases/ideias/GetIdeiaById.js";
import CreateIdeia from "../use-cases/ideias/CreateIdeia.js";
import DeleteIdeia from "../use-cases/ideias/DeleteIdeia.js";
import EditIdeia from "../use-cases/ideias/EditIdeia.js";
import TransformIdeiaIntoPost from "../use-cases/ideias/TranformInPost.js";


import { uploadImage } from "../use-cases/img/UploadImage.js";
import CreateImage from "../use-cases/img/CreateImage.js";
import { Request, Response } from "express";

export default class IdeiaController {

    async getAllIdeiasByUser(req: Request, res: Response) {
        const userId = req.user!.id;

        const ideias = await GetAllIdeiasByUser({ userId });

        return res.status(200).json(ideias);
    }

    async getIdeiaById(req: Request, res: Response) {
        const ideiaId = req.params.id;
        const userId = req.user!.id;

        const ideia = await getIdeiaById({ userId });

        const ideiaById = ideia.find((i) => i.id === ideiaId);

        if (!ideiaById) {
            return res.status(404).json({ message: "Ideia not found" });
        }

        return res.status(200).json(ideiaById);
    }


    async create(req: Request, res: Response) {
        const { title, content } = req.body;
        const userId = req.user!.id;

        const ideia = await CreateIdeia({ title, content, userId });

        return res.status(201).json(ideia);
    }           

    async edit(req: Request, res: Response) {
        const { title, content } = req.body;
        const ideiaId = req.params.id;
        const userId = req.user!.id;

        const ideia = await EditIdeia({ ideiaId, title, content, userId });

        return res.status(200).json(ideia);
    }

    async delete(req: Request, res: Response) {
        const ideiaId = req.params.id;
        const userId = req.user!.id;

        await DeleteIdeia({ ideiaId, userId });

        return res.status(204).send();
    }

    
    
    async transformInPost(req: Request, res: Response) {
        const { type, status, date, categoryId } = req.body;
        const ideaId = req.params.id;
        const userId = req.user!.id;

        const image = req.file;

        let imageUploadResult;

        if (image) {
            imageUploadResult = await uploadImage(image);
        }

        const post = await TransformIdeiaIntoPost({
            ideaId,
            userId,
            status,
            type,
            date,
            categoryId
        });

        if (image && imageUploadResult) {
            await CreateImage({
                path: imageUploadResult.path,
                mimeType: image.mimetype,
                size: image.size,
                postId: post.id
            });
        }

        return res.status(201).json(post);
    }

}
