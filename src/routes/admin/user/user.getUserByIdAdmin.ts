import { Request, Response } from 'express';
import User from '../../../models/user.model';

async function getUserByIdAdmin (req: Request, res: Response) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default getUserByIdAdmin;