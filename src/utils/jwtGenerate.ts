import jwt from 'jsonwebtoken';

export default async function jwtGenerate(userId: string, email: string, name: string) {
    const token = jwt.sign({userId, email, name}, process.env.JWT_SECRET!, {expiresIn: '7d'});
    return token; 
}