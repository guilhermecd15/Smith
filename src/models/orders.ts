import { Pool, ResultSetHeader } from 'mysql2/promise';
import Order from '../interfaces/orders';
import Token from '../interfaces/token';

export default class OrdersModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<Order[]> {
    const query1 = 'SELECT o.id, o.userId, JSON_ARRAYAGG(p.id) as products FROM Trybesmith.Orders ';
    const query2 = 'as o JOIN Trybesmith.Products as p WHERE p.orderId = o.id GROUP BY o.id ';
    const query3 = 'ORDER BY o.userId; ';
    const query = query1 + query2 + query3;
    // JSON_ARRAYAAGG pega no manual abaixo
    // https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html
    const result = await this.connection
      .execute(query);
    const [rows] = result;
    return rows as Order[];
  }

  public async create(token: Token, products: number[]) {
    const idUser = token.data.id;
    const result = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.Orders (userId) VALUES (?)',
      [idUser],
    );
    const [dataInserted] = result;
    const { insertId } = dataInserted;
    products.forEach(async (p) => {
      await this.connection
        .execute<ResultSetHeader>(
        'UPDATE Trybesmith.Products SET orderId = ? where id = ?',
        [insertId, p],
      );
    });

    return idUser;
  }
}