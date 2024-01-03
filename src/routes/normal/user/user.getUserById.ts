import { Request, Response } from 'express';
import User from '../../../models/user.model';

async function getUserById(req: Request, res: Response) {
	try {
		const user = await User.findByPk(req.params.id, {
			attributes: ['id', 'username', 'profile_picture', 'victories', 'defeats']
		});

		if (!user) return res.status(404).json({ message: 'User not found' });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export default getUserById;