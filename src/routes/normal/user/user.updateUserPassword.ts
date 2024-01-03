import { Request, Response } from 'express';
import { check_password } from '../../../functions/check_functions';
import User from '../../../models/user.model';
import bcrypt from 'bcrypt';

async function updateUserPassword(req: Request, res: Response) {
	try {
		const { password } = req.body;

		if (!password) return res.status(400).json({ message: '/user/update/password: Missing parameters' });

		if (!check_password(password)) return res.status(401).json({ message: '/user/update/password: Password wrong format' });

		const user: User = await User.findByPk(req.body.id);

		if (!user) return res.status(404).json({ message: '/user/update/password: User not found' });

		const updateUser = await user.update({
			password: bcrypt.hashSync(password, 10)
		});

		if (!updateUser) return res.status(500).json({ message: '/user/update/password: Internal Error' });
		res.status(201).json({ message: '/user/update/password: User password updated' });

	} catch (err) {
		res.status(500).json({ message: `/user/update/password: Internal Error: ${err.message}` });
	}
}

export default updateUserPassword;