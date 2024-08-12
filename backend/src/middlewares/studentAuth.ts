import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface StudentAuth extends Request {
    student?: {
        id: number;
        name: string;
        email: string;
    };
}

export async function studentAuth(req: StudentAuth, res: Response, next: NextFunction){
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
       
        req.student = decoded as { id: number; name: string; email: string };

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid Credentials"
        });
    }
}