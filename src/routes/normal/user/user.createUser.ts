import {Request, Response} from 'express';
import User from '../../../models/user.model';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { check_password, check_email } from '../../../functions/check_functions';

async function createUser(req: Request, res: Response) {
	try {
		const { username, email, password, profile_picture } = req.body;

		if (!username) return res.status(400).json({ message: '/user/create: Username is required' });
		if (!password) return res.status(400).json({ message: '/user/create: Password is required' });
		if (!email) return res.status(400).json({ message: '/user/create: Email is required' });

		if (!check_password(password)) return res.status(400).json({ message: '/user/create: Password is not valid' });
		if (!check_email(email)) return res.status(400).json({ message: '/user/create: Email is not valid' });

		const findUser = await User.findOne({
			where: {
				[Op.or]: [
					{ username: username },
					{ email: email }
				]
			}
		});

		if (findUser) return res.status(409).json({ message: '/user/create: User already exists' });
		let new_password = bcrypt.hashSync(password, 10)

		let _profile_picture = profile_picture ? profile_picture : null;

		await User.create({
			username: username,
			email: email,
			password: new_password,
			profile_picture: _profile_picture,
		});

		res.status(201).json({ message: '/user/create: User created' });

	} catch (err) {
		console.log(err.message)
		res.status(500).json({ message: `/user/create: Internal Error: ${err.message}` });
	}
};

export default createUser;