import prisma from "../lib/prisma.js";
import jwtGenerate from "../utils/jwtGenerate.js";

class userController {

  async loginUser(req:any , res:any){
    const {email, password} = req.body; 

    if(!email || !password){
      return res.status(400).json({error: "Falta informação!"})
    }

    if(email.includes("@") === false) {
      return res.status(400).json({ error: "Email inválido!"});
    }

    const emailExist = await prisma.user.findMany({where: {email:email}})

    if(!emailExist.length) {
      return res.status(400).json({error: "Usuário não está cadastrado!"})
    }

    const token = await jwtGenerate(emailExist[0].id, emailExist[0].email, emailExist[0].name); 

    try{
      return res.status(200).json({message: "Usuário logado", token, name: emailExist[0].name});
    }catch(error){
      return res.status(400).json(error);
    }

  }



  async createUser(req: any, res: any) {
    const {name, email, password} = req.body; 

    if(!name || !email || !password) {
      return res.status(400).json({ error: "Falta informação!"});
    }

    if(email.includes("@") === false) {
      return res.status(400).json({ error: "Email inválido!"});
    }

    const isUper = email === email.toUpperCase();

    if(isUper){
      return res.status(400).json({ error: "Email deve conter letras minúsculas!"});
    }

    const names: Array<string> = name.split(" ");

    if(names.length > 1) {
      return res.status(400).json({ error: "O nome deve conter apenas o primeiro!"});
    }

    if(!(password.length+1 > 6 && password.length < 10)) {
      return res.status(400).json({ error: "A senha deve conter no mínimo 6 caracteres!"});
    }

    try {
      const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
        },
      });

      const token = await jwtGenerate(user.id, user.email, user.name);

      return res.status(201).json({message: "Usuário criado com sucesso!", token, name: user.name});
    } catch (error) {
      return res.status(500).json({ error: error});
    }
  }

  async deleteUser(req: any, res: any) {
    const {id} = req.params;

    //validação (id)
    if(!id) {
      return res.status(400).json({ error: "O ID do usuário é obrigatório!"});
    }

    try {
      const userExist = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if(!userExist) {
        return res.status(404).json({ error: "Usuário não encontrado no banco de dados!"});
      }

      await prisma.user.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json("Usuário deletado com sucesso!");

    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao deletar usuário!"});
    }}
}

export default userController;