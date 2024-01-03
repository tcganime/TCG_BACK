import { Request, Response } from "express";
import User from "../../../models/user.model";

async function userDebug(req: Request, res: Response) {
    try {
      let users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export default userDebug;