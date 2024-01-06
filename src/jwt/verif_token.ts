import { Request, Response, NextFunction } from 'express';
import secret_key from './secret_key';
import * as jwt from 'jsonwebtoken';
import User from '../models/user.model';


async function userStillExists(id: number) : Promise<boolean> {
    let user = await User.findByPk(id);

    if (!user) return false;
    return true;
}

function verifyAdminToken(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, secret_key.getSecretKey, (err: any, decoded: {id: number, admin: boolean, refresh: boolean}) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        if (decoded.refresh) return res.status(403).json({ message: 'Forbidden' });
        if (!decoded.admin) return res.status(403).json({ message: 'Forbidden' });

        userStillExists(decoded.id).then((exists) => {
            if (!exists) return res.status(403).json({ message: 'Forbidden' });
            next();
        });
    });
}

function VerifToken (req: Request, res: Response, next: Function) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, secret_key.getSecretKey, (err: any, decoded: {id: number, admin: boolean, refresh: boolean}) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        if (decoded.refresh) return res.status(403).json({ message: 'Forbidden' });
        
        userStillExists(decoded.id).then((exists) => {
            if (!exists) return res.status(403).json({ message: 'Forbidden' });
            next();
        });
    });
}

function VerifTokenPassId(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, secret_key.getSecretKey, (err: any, decoded: {id: number, admin: boolean, refresh: boolean}) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        if (decoded.refresh) return res.status(403).json({ message: 'Forbidden' });
        req.body.id = decoded.id;

        userStillExists(decoded.id).then((exists) => {
            if (!exists) return res.status(403).json({ message: 'Forbidden' });
            next();
        });
    });
}

export { verifyAdminToken, VerifToken, VerifTokenPassId };