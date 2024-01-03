import { Request, Response } from 'express';
import Card from '../../../models/card.model';

function cardDebug(req: Request, res: Response) {
  Card.findAll()
    .then((cards) => {
      res.status(200).json(cards);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}

export default cardDebug;