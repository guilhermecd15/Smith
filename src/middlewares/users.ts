import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Product from '../interfaces/products';

const properties = ['Username', 'Classe', 'Level', 'Password'];
const propertiesMin = [2, 2, 0, 7];

function validateProperties(product: Product): [boolean, string | null] {
  for (let i = 0; i < properties.length; i += 1) {
    if (!Object.prototype.hasOwnProperty.call(product, properties[i].toLowerCase())) {
      return [false, properties[i]];
    }
  }
  return [true, null];
}

function validateTypeLevel(product: Product): [boolean, string | null] {
  const entries = Object.entries(product);
  for (let i = 0; i < entries.length; i += 1) {
    const [properity, value] = entries[i];
    const properityM = properity[0].toUpperCase() + properity.slice(1);
    if (properityM === 'Level' && typeof value !== 'number') {
      return [false, properityM];
    }
  }
  return [true, null];
}

function validateType(product: Product): [boolean, string | null] {
  const entries = Object.entries(product);
  for (let i = 0; i < entries.length; i += 1) {
    const [properity, value] = entries[i];
    const properityM = properity[0].toUpperCase() + properity.slice(1);
    if (properityM !== 'Level' && typeof value !== 'string') {
      return [false, properityM];
    }
  }
  return [true, null];
}

function validateValuesLevel(product: Product): [boolean, string | null, number] {
  const entries = Object.entries(product);
  for (let i = 0; i < entries.length; i += 1) {
    const [properity, value] = entries[i];
    const properityM = properity[0].toUpperCase() + properity.slice(1);
    const index = properties.indexOf(properityM);
    if (properityM === 'Level' && value <= 0) {
      return [false, properityM, propertiesMin[index]];
    }
  }
  return [true, null, 0];
}

function validateValues(product: Product): [boolean, string | null, number] {
  const entries = Object.entries(product);
  for (let i = 0; i < entries.length; i += 1) {
    const [properity, value] = entries[i];
    const properityM = properity[0].toUpperCase() + properity.slice(1);
    const index = properties.indexOf(properityM);
    if (properityM !== 'Level' && value.length <= propertiesMin[index]) {
      return [false, properityM, propertiesMin[index]];
    }
  }
  return [true, null, 0];
}

function validationProperities(req: Request, res: Response, next: NextFunction) {
  const product: Product = req.body;

  const [valid, property] = validateProperties(product);

  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: `${property} is required` });
  }

  next();
}

function validationType(req: Request, res: Response, next: NextFunction) {
  const product: Product = req.body;

  let [valid, property] = validateType(product);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: `${property} must be a string`,
    });
  }

  [valid, property] = validateTypeLevel(product);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: `${property} must be a number`,
    });
  }

  next();
}

function validationValues(req: Request, res: Response, next: NextFunction) {
  const product: Product = req.body;

  let [valid, properityM, i] = validateValues(product);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: `${properityM} must be longer than ${i} characters`,
    });
  }

  [valid, properityM, i] = validateValuesLevel(product);

  if (!valid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: `${properityM} must be greater than 0`,
    });
  }

  next();
}

export default { validationType, validationProperities, validationValues };