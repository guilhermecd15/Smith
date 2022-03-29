import { Router } from 'express';
import ProductsController from '../controllers/products';
import validationProduct from '../middlewares/products';

const router = Router();

const productsController = new ProductsController();

router.get('/products', productsController.getAll);
router.post('/products', validationProduct, productsController.create);

export default router;