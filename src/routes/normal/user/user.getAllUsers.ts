import User from '../../../models/user.model';
import { Request, Response } from 'express';

export default async function getAllUsers (req: Request, res: Response) {
	try {
		const users = await User.findAll({
			attributes: ['id', 'username', 'victories', 'defeats']
		});
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}