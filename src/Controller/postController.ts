import GetAllPostsById from "../use-cases/post/GetAllPostsById.js";
import CreatePost from "../use-cases/post/CreatePost.js";
import DeletePost from "../use-cases/post/DeletePost.js";
import UpdatePostStatus from "../use-cases/post/UpdatePostStatus.js";
import UpdatePostCategory from "../use-cases/post/UpdatePostCategory.js";

import AppError from "../utils/AppError.js";
import { uploadImage } from "../use-cases/img/UploadImage.js";
import CreateImage from "../use-cases/img/CreateImage.js";
import GetPostById from "../use-cases/post/GetPostById.js";

class postController {
    async getAllPostsById(req: any, res: any) {
        const userId = req.user.userId; 

        const posts = await GetAllPostsById(userId);

        return res.status(200).json({ posts });
    }

    async getPostById(req: any, res: any) {
        const {idPost} = req.params;

        if (!idPost) {
            return res.status(400).json({ error: "ID do post não fornecido." });
        }

        try {
            const post = await GetPostById({
                idPost,
                userId: req.user.userId
            });

            return res.status(200).json({ post });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            console.error("Erro ao buscar post:", error);

            return res.status(500).json({
                error: error,
            });
        }
    }   

    async createPost(req: any, res: any) {
        const {
            title,
            content,
            type,
            status,
            date,
            categoryName
        } = req.body;

        const userId = req.user.userId;

        try {
            const image = req.file;
            const imageUploadResult = await uploadImage(image);

            const post = await CreatePost({
                title,
                content,
                userId,
                status,
                type,
                date,
                categoryName,
            });

            await CreateImage({
                path: imageUploadResult.path,
                mimeType: image.mimetype,
                size: image.size,
                postId: post.id
            });

            return res.status(201).json({
                message: "Post criado com sucesso!",
                post
            });

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    error: error.message
                });
            }

            console.error("Erro ao criar post:", error);

            return res.status(500).json({
                error: "Erro interno ao criar post."
            });
        }
}

    async deletePost(req: any, res: any) {
        const {idPost} = req.params;
        const userId = req.user.userId;

        try {
            await DeletePost({idPost, userId});

            return res.status(200).json({ 
                message: "Post deletado com sucesso!" 
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ 
                    error: error.message 
                });
            }

            console.error("Erro ao deletar post:", error);

            return res.status(500).json({ 
                error: error,
            });
        }
    }

    async updatePost(req: any, res: any) {
        const {idPost} = req.params;
        const {status} = req.body;

        try {
            await UpdatePostStatus({ idPost, status });

            return res.status(200).json({ 
                message: "Status do post atualizado com sucesso!"
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            
            console.error("Erro ao atualizar status do post:", error);
            
            return res.status(500).json({ 
                error: error,
            });
        }
    }

    async updatePostCategory(req: any, res: any) {
        const {idPost} = req.params;
        const {categoryId} = req.body;

        const userId = req.user.userId;

        try {
            await UpdatePostCategory({ idPost, categoryId, userId });

            return res.status(200).json({ 
                message: "Categoria do post atualizada com sucesso!"
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }

            console.error("Erro ao atualizar categoria do post:", error);

            return res.status(500).json({ 
                error: error,
            });
        }
    }
}

export default postController;