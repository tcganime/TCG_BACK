import {Request, Response} from 'express';
import User from '../../../models/user.model';

async function profileUser(req: Request, res: Response) {
    try {
        const user = await User.findByPk(req.body.id, {
            attributes: ['id', 'username', 'profile_picture', 'victories', 'defeats']
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({message: `/user/profile: Internal Error: ${err.message}`});
    }
}

export default profileUser;