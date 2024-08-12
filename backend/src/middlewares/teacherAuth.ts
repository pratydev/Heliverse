import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export async function teacherAuth(req: Request, res: Response, next: NextFunction){
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const authSecret = process.env.CODEIAL_JWT_SECRET;

        if(!authSecret) {
            return res.status(500).json({
                message: "Internal Server Error: Token Not Found"
            });
        }

        const decoded = jwt.verify(token,  authSecret);
       
        // @ts-ignore
        req.teacher = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid Credentials"
        });
    }
}