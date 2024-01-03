import { Request, Response } from 'express';
import User from '../../../models/user.model';

async function makeAdminById (req: Request, res: Response) {
    try {
        let user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.admin = true;

        let savedUser = await user.save();
        if (!savedUser) return res.status(500).json({ message: 'Error saving user' });
        res.status(201).json({ message: 'User is now admin' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default makeAdminById;