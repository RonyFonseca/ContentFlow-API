import prisma from "../lib/prisma.js";

class dashController {
    //Resumo estatístico dos posts por status
    async gerarResumo(req: any, res: any) {

        const userId = "62ce12e9-4f0b-4a92-9cf8-b7c3697112f1"; //token

        const myPosts = await prisma.post.findMany({
            where: {
                userId: userId,
            },
        });

        
        const resumo = {
            emAndamento: 0,
            pendente: 0,
            feito: 0,
        };

        for (const post of myPosts) {
            if (post.status === "Em andamento") {
                resumo.emAndamento++;
            } else if (post.status === "Pendente") {
                resumo.pendente++;
            } else if (post.status === "Feito") {
                resumo.feito++;
            }
        }

        return res.status(200).json({
            resumo,
            myPosts,
        });
    }
}

export default dashController;