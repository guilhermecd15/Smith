import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import jwt from 'jsonwebtoken';
import OrderCreated from '../interfaces/orderCreated';

const secret = 'seusecretdetoken';

const properties = ['Products'];

function validateProperties(products: OrderCreated): [boolean, string | null] {
  if (!Object.prototype.hasOwnProperty.call(products, properties[0].toLowerCase())) {
    return [false, properties[0]];
  }
  return [true, null];
}

function validateTypeLength(products: OrderCreated): [boolean, string | null] {
  const entries = Object.entries(products);
  for (let i = 0; i < entries.length; i += 1) {
    const [, value] = entries[i];
    if (!value.length) {
      return [false, properties[i]];
    }
  }
  return [true, null];
}

function validateTypeNumber(products: OrderCreated): [boolean, string | null] {
  const entries = Object.entries(products);
  for (let i = 0; i < entries.length; i += 1) {
    const [, value] = entries[i];
    if (typeof value[i] !== 'number') {
      return [false, properties[i]];
    }
  }
  return [true, null];
}

function validationProducts(req: Request, res: Response, next: NextFunction) {
  const products: OrderCreated = req.body;

  let [valid] = validateProperties(products);

  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Products is required' });
  }

  [valid] = validateTypeLength(products);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: 'Products can\'t be empty' });
  }

  [valid] = validateTypeNumber(products);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ error: 'Products must be an array of numbers' });
  }

  next();
}

function validationToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token not found' });
  }

  try {
    jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
}
export default { validationProducts, validationToken };
