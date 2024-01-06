import { Request, Response } from 'express';
import User from '../../../models/user.model';

async function deleteById (req: Request, res: Response) {
    try {

      if (req.body.id != req.params.id) return res.status(403).json({ message: 'Forbidden' })

      let user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.admin) {
        let deleter = await User.findByPk(req.body.id);
        if (!deleter) return res.status(404).json({ message: 'User not found' });

        if (!deleter.superadmin) return res.status(403).json({ message: 'Forbidden' })
      }

      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export default deleteById;