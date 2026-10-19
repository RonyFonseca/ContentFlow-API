import prisma from "../lib/prisma.js";
import jwtGenerate from "../utils/jwtGenerate.js";
import { hashPassword, verifyPassword } from "../utils/passCrypted.js";

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


    try{
      const passwordMatch = await verifyPassword(password, emailExist[0].password); 
      if(!passwordMatch) {
        return res.status(400).json({error: "Senha incorreta!"})
      }

      const token = await jwtGenerate(emailExist[0].id, emailExist[0].email, emailExist[0].name); 

      return res.status(200).json({message: "Usuário logado", token, name: emailExist[0].name, email: emailExist[0].email, id: emailExist[0].id});
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

    if(!(password.length+1 > 6 && password.length < 10)) {
      return res.status(400).json({ error: "A senha deve conter no mínimo 6 caracteres!"});
    }

    //validação de criar usuário mas o email dele ja existe ta em falta emmmm!!!

    try {
      const passwordHashed = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHashed,
        },
      });

      const token = await jwtGenerate(user.id, user.email, user.name);
      return res.status(201).json({message: "Usuário criado com sucesso!", token, name: user.name});
    } catch (error) {
      return res.status(500).json({ error: error});
    }
  }

}

export default userController;