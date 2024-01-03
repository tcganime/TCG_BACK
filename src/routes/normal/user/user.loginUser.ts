import { Request, Response } from 'express';
import User from '../../../models/user.model';
import bcrypt from 'bcrypt';
import { createJWT, createRefreshToken } from '../../../jwt/creation_token';


async function loginUser (req: Request, res: Response) {
	try {
		const { credential, password } = req.body;

		// check if credential is an email or a username
		let is_email = credential.includes('@');

		if (!credential || !password) return res.status(400).json({ message: '/user/login: Missing parameters' });

		const user: User = await User.findOne({
			where: (is_email) ? { email: credential } : { username: credential },
			attributes: ['username', 'password', 'id', 'admin']
		});

		if (!user) return res.status(404).json({ message: '/user/login: User not found' });

		bcrypt.compare(password, user.password, function (err, result) {
			if (result)
				res.status(200).json({
					token: createJWT(user.id, user.admin),
					refresh_token: createRefreshToken(user.id, user.admin)
				});
			else (
				res.status(401).json({ message: '/user/login: Wrong password' })
			);
		});

	} catch (err) {
		res.status(500).json({ message: `/user/login: Internal Error: ${err.message}` });
	}
}

export default loginUser;