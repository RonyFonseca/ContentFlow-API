import prisma from "../lib/prisma.js";

class postController {
    async getAllPostsById(req: any, res: any) {
        const userId = req.user.userId; // Log the user ID to verify it's being passed correctly

        const posts = await prisma.post.findMany({
            where: {
            userId
        }});
        return res.status(200).json({ posts });
    }

    async createPost(req: any, res: any) {
        const {title, content, type, status, date} = req.body;

        const userId = req.user.userId; // Log the user ID to verify it's being passed correctly

        if(!title || !content || !type || !status || !date) {
            return res.status(400).json({ error: "Falta informação!"});
        }

        if(title.length > 40) {
            return res.status(400).json({ error: "O título está muito longo!"});
        }

        if(content.length > 200) {
            return res.status(400).json({ error: "O conteúdo está muito longo!"});
        }
        
        if(type.length > 15) {
            return res.status(400).json({ error: "O tipo está muito longo!"});
        }

        const userExist = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!userExist) {
            return res.status(400).json({ error: "O autor não existe!"});
        }

        try {
            const post = await prisma.post.create({
                data: {
                    title,
                    content,
                    userId,
                    status,
                    type,
                    date,
                },
            });
            return res.status(201).json({ message: "Post criado com sucesso!", post });
        } catch (error) {
            console.error("Erro ao criar post:", error);
            return res.status(500).json({ error: error});
        }
    }

    async deletePost(req: any, res: any) {
        const {idPost} = req.params;

        if(!idPost) {
            return res.status(400).json({ error: "O ID do post é obrigatório!"});
        }

        const postExist = await prisma.post.findUnique({
            where: {
                id: idPost,
            },
        });

        if(!postExist) {
            return res.status(404).json({ error: "Post não encontrado no banco de dados!"});
        }

        //validar se o post é meu

        try {
            await prisma.post.delete({
                where: {
                    id: idPost,
                },
            });
            return res.status(200).json({ message: "Post deletado com sucesso!"});
        } catch (error) {
            return res.status(500).json({ error: error});
        }
    }

    async updatePost(req: any, res: any) {
        const {idPost} = req.params;
        const {status} = req.body;

        if(!idPost) {
            return res.status(400).json({ error: "O ID do post é obrigatório!"});
        }

        const postExist = await prisma.post.findUnique({
            where: {
                id: idPost,
            },
        }); 

        if(!postExist) {
            return res.status(404).json({ error: "Post não encontrado no banco de dados!"});
        }

        try {
            await prisma.post.update({
                where: {
                    id: idPost,
                },
                data: {
                    status,
                },
            });
            return res.status(200).json({ message: "Status do post atualizado com sucesso!"});
        } catch (error) {
            return res.status(500).json({ error: error});
        }
    }
}

export default postController;