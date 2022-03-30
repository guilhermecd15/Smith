import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import OrdersService from '../services/orders';

const secret = 'seusecretdetoken';

class OrdersController {
  constructor(private ordersService = new OrdersService()) { }

  public getAll = async (_req: Request, res: Response) => {
    const orders = await this.ordersService.getAll();
    res.status(StatusCodes.OK).json(orders);
  };

  public create = async (req: Request, res: Response) => {
    const { products } = req.body;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== 'object') {
      return res.end();
    }

    const userId = await this.ordersService.create(decoded, products);
    const objOrder = {
      userId,
      products,
    };
    res.status(StatusCodes.CREATED).json({ order: objOrder });
  };
}

export default OrdersController;