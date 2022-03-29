import connection from '../models/connection';
import UsersModel from '../models/users';
import User from '../interfaces/users';

class UsersService {
  public model: UsersModel;

  constructor() {
    this.model = new UsersModel(connection);
  }

  public create(user: User): Promise<User> {
    return this.model.create(user);
  }
}

export default UsersService;