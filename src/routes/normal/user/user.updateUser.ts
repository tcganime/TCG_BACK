import { Request, Response } from 'express';
import { check_email } from '../../../functions/check_functions';
import User from '../../../models/user.model';

async function updateUser (req: Request, res: Response) {
	try {
		const { username, email, profile_picture } = req.body;

		if (!username || !email || !profile_picture) return res.status(400).json({ message: '/user/update: Missing parameters' });

		if (!check_email(email)) return res.status(401).json({ message: '/user/update: Email wrong format' });

		const user = await User.findByPk(req.body.id);

		if (!user) return res.status(404).json({ message: '/user/update: User not found' });

		const updateUser = await User.update({ username, email, profile_picture }, { where: { id: req.body.id } });

		res.status(201).json({ message: '/user/update: User updated' });
	} catch (err) {
		res.status(500).json({ message: `/user/update: Internal Error: ${err.message}` });
	}
}

export default updateUser;