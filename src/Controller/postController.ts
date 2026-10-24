import GetAllPostsById from "../use-cases/post/GetAllPostsById.js";
import CreatePost from "../use-cases/post/CreatePost.js";
import DeletePost from "../use-cases/post/DeletePost.js";
import UpdatePostStatus from "../use-cases/post/UpdatePostStatus.js";

import AppError from "../utils/AppError.js";

class postController {
    async getAllPostsById(req: any, res: any) {
        const userId = req.user.userId; 

        const posts = await GetAllPostsById(userId);

        return res.status(200).json({ posts });
    }

    async createPost(req: any, res: any) {
        const {title, content, type, status, date} = req.body;

        const userId = req.user.userId;

        try {
            const post = await CreatePost({
                title,
                content,
                userId,
                status,
                type,
                date,
            });
            return res.status(201).json({ message: "Post criado com sucesso!", post });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            console.error("Erro ao criar post:", error);

            return res.status(500).json({ 
                error: error,
            });
        }
    }

    async deletePost(req: any, res: any) {
        const {idPost} = req.params;

        try {
            await DeletePost({ idPost });

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
}

export default postController;