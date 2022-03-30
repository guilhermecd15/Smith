import connection from '../models/connection';
import OrdersModel from '../models/orders';
import Order from '../interfaces/orders';
import Token from '../interfaces/token';

class OrdersService {
  public model: OrdersModel;

  constructor() {
    this.model = new OrdersModel(connection);
  }

  public async getAll(): Promise<Order[]> {
    const orders = await this.model.getAll();
    return orders;
  }

  public create(token: Token, products: number[]): Promise<void | number> {
    return this.model.create(token, products);
  }
}

export default OrdersService;