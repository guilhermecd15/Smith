import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../interfaces/users';

const properties = ['Username', 'Password'];

function validateProperties(user: User): [boolean, string | null] {
  for (let i = 0; i < properties.length; i += 1) {
    if (!Object.prototype.hasOwnProperty.call(user, properties[i].toLowerCase())) {
      return [false, properties[i]];
    }
  }
  return [true, null];
}

function validationLogin(req: Request, res: Response, next: NextFunction) {
  const user: User = req.body;

  const [valid, property] = validateProperties(user);

  if (!valid) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: `${property} is required` });
  }

  next();
}

export default validationLogin;