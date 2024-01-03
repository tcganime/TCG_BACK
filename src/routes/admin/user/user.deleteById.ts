import { Request, Response } from 'express';
import User from '../../../models/user.model';

async function deleteById (req: Request, res: Response) {
    try {
      let user = await User.findByPk(req.params.id);
      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export default deleteById;