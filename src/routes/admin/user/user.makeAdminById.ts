import { Request, Response } from 'express';
import User from '../../../models/user.model';

async function makeAdminById (req: Request, res: Response) {
    try {
        let requester = await User.findByPk(req.body.id);
        let user = await User.findByPk(req.params.id);

        if (!requester) return res.status(404).json({ message: 'User not found' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if ((!requester.superadmin) && (user.admin)) return res.status(403).json({ message: 'Forbidden' });

        user.admin = true;

        let savedUser = await user.save();
        if (!savedUser) return res.status(500).json({ message: 'Error saving user' });
        res.status(201).json({ message: 'User is now admin' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default makeAdminById;