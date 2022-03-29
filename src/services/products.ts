import connection from '../models/connection';
import ProductModel from '../models/products';
import Product from '../interfaces/products';

class ProductsService {
  public model: ProductModel;

  constructor() {
    this.model = new ProductModel(connection);
  }

  public async getAll(): Promise<Product[]> {
    const Products = await this.model.getAll();
    return Products;
  }

  public create(product: Product): Promise<Product> {
    return this.model.create(product);
  }
}

export default ProductsService;