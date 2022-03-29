import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import UsersService from '../services/users';

const secret = 'seusecretdetoken';

class ProductsController {
  constructor(private usersService = new UsersService()) { }

  public create = async (req: Request, res: Response) => {
    const user = req.body;

    const userCreated = await this.usersService.create(user);

    const token = jwt.sign({ data: userCreated }, secret);

    res.status(StatusCodes.CREATED).json({ token });
  };
}

export default ProductsController;