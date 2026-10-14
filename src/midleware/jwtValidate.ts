import jwt from "jsonwebtoken";
import { Response, Request } from "express"; 

export default async function jwtValidate(req: any, res: any, next: any){
    const tokenBearrer = req.headers.authorization; 

    if(!tokenBearrer){
        return res.status(400).json({error: "Token não foi enviado!"}); 
    }

    const token = tokenBearrer.split(" ")[1];

    try{
        const tokenValid = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = tokenValid;
        return next();
    }catch(error){
        return res.status(400).json({error:"Token inválido!"})

    }


}