import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Product from '../interfaces/products';

const properties = ['Name', 'Amount'];

function validateProperties(product: Product): [boolean, string | null] {
  for (let i = 0; i < properties.length; i += 1) {
    if (!Object.prototype.hasOwnProperty.call(product, properties[i].toLowerCase())) {
      return [false, properties[i]];
    }
  }
  return [true, null];
}

function validateType(product: Product): [boolean, string | null] {
  const entries = Object.entries(product);
  for (let i = 0; i < entries.length; i += 1) {
    const [, value] = entries[i];
    if (typeof value !== 'string') {
      return [false, properties[i]];
    }
  }
  return [true, null];
}

function validateValues(product: Product): [boolean, string | null] {
  const entries = Object.entries(product);
  for (let i = 0; i < entries.length; i += 1) {
    const [, value] = entries[i];
    if (value.length <= 2) {
      return [false, properties[i]];
    }
  }
  return [true, null];
}

function validationProduct(req: Request, res: Response, next: NextFunction) {
  const product: Product = req.body;

  let [valid, property] = validateProperties(product);

  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: `${property} is required` });
  }

  [valid, property] = validateType(product);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error:
      `${property} must be a string` });
  }

  [valid, property] = validateValues(product);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error:
      `${property} must be longer than 2 characters` });
  }

  next();
}

export default validationProduct;