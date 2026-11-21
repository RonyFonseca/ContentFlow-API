import LoginUser from "../use-cases/user/LoginUser.js";
import CreateUser from "../use-cases/user/CreateUser.js";
import AppError from "../utils/AppError.js";

class userController {

  async loginUser(req:any , res:any){
    const {email, password} = req.body; 

    try{
      const user = await LoginUser({ email, password });

      return res.status(200).json({
          message: "Usuário logado",
          token: user.token,
          name: user.name,
          email: user.email,
          id: user.id
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      return res.status(400).json(error);
    }
  }

  async createUser(req: any, res: any) {
    const {name, email, password} = req.body; 

    try {
      const user = await CreateUser({ name, email, password });
      
      return res.status(201).json({
          message: "Usuário criado com sucesso!",
          token: user.token,
          name: user.name
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default userController;