import { Router } from 'express';
import ProductsController from '../controllers/products';
import validationProduct from '../middlewares/products';
import UsersController from '../controllers/users';
import validationUser from '../middlewares/users';
import OrdersController from '../controllers/orders';
import validationLogin from '../middlewares/login';

const router = Router();

const productsController = new ProductsController();
const usersController = new UsersController();
const ordersController = new OrdersController();

router.get('/products', productsController.getAll);
router.post('/products', validationProduct, productsController.create);
router.post(
  '/users', 
  validationUser.validationProperities,
  validationUser.validationType,
  validationUser.validationValues, 
  usersController.create,
);

router.get('/orders', ordersController.getAll);
router.post('/login', validationLogin, usersController.login);

export default router;