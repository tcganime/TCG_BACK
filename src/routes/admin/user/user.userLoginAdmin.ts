import { Request, Response } from "express";
import User from "../../../models/user.model";
import bcrypt from 'bcrypt';
import { createJWT, createRefreshToken } from "../../../jwt/creation_token";

async function userLoginAdmin(req: Request, res: Response) {
    try {
        if (!req.body.credential) return res.status(400).send({ message: "Credential is required" });
        if (!req.body.password) return res.status(400).send({ message: "Password is required" });

        let user = await User.findOne({
            where: (req.body.credential.includes('@')) ? { email: req.body.credential } : { username: req.body.credential },
            attributes: ['password', 'id', 'admin']
        });

        if (!user) return res.status(404).send({ message: "User not found" });

        let comparePassword = bcrypt.compareSync(req.body.password, user.password);
        if (!comparePassword) return res.status(401).send({ message: "Wrong password" });
        if (!user.admin) return res.status(401).send({ message: "User is not admin" });

        return res.status(200).json({
            token: createJWT(user.id, user.admin),
            refresh_token: createRefreshToken(user.id, user.admin)
        });

    } catch (error) {
        res.status(500).send({ message: `/admin/user/login - ${error.message}` });
    }
}

export default userLoginAdmin;