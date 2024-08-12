import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export async function studentAuth(req: Request, res: Response, next: NextFunction){
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send("Unauthorized");
        }

        const token = authHeader.split(" ")[1];

        const authSecret = process.env.CODEIAL_JWT_SECRET;

        if(!authSecret) {
            return res.status(500).send("Internal Server Error: Token Not Found");
        }

        const decoded = jwt.verify(token,  authSecret);
       
        // @ts-ignore
        req.student = decoded;

        next();
    } catch (error) {
        return res.status(401).send("Invalid Credentials");
    }
}