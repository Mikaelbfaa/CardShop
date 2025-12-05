import { productPaths } from './product.paths';
import { cartPaths } from './cart.paths';
import { orderPaths } from './order.paths';
import { adminPaths } from './admin.paths';
import { userPaths } from './user.paths';

export const paths = {
    ...productPaths,
    ...cartPaths,
    ...orderPaths,
    ...adminPaths,
    ...userPaths,
};
