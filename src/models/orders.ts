import { Pool } from 'mysql2/promise';
import Orders from '../interfaces/orders';

export default class ProductModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<Orders[]> {
    const query1 = 'SELECT o.id, o.userId, JSON_ARRAYAGG(p.id) as products FROM Trybesmith.Orders ';
    const query2 = 'as o JOIN Trybesmith.Products as p WHERE p.orderId = o.id GROUP BY o.id ';
    const query3 = 'ORDER BY o.userId; ';
    const query = query1 + query2 + query3;
    // JSON_ARRAYAAGG pega no manual abaixo
    // https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html
    const result = await this.connection
      .execute(query);
    const [rows] = result;
    return rows as Orders[];
  }
}