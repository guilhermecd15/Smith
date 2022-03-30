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

  public login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const users = await this.usersService.getAll();
    const user = users.find((u) => u.username === username);
    
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Username or password invalid' });
    }

    if (user && user.password !== password) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Username or password invalid' });
    }

    const token = jwt.sign({ data: user }, secret);

    return res.status(StatusCodes.OK).json({ token });
  };
}

export default ProductsController;