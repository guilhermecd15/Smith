import User from './users';

interface Token {
  data: User,
  iat: number,
}

export default Token;