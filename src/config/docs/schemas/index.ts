import { productSchemas } from './product.schemas';
import { userSchemas } from './user.schemas';
import { cartSchemas } from './cart.schemas';
import { orderSchemas } from './order.schemas';

export const schemas = {
    ...productSchemas,
    ...userSchemas,
    ...cartSchemas,
    ...orderSchemas,
};
