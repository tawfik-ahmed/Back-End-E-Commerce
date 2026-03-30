import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dtos/create-cart.dto';
import { UpdateCartDto } from './dtos/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,

    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new cart item.
   *
   * @param {CreateCartDto} createCartDto - Object containing cart item data to create.
   * @param {number} productId - Product id.
   * @param {number} userId - User id.
   * @returns {Promise<{ ok: boolean; data: CartItem }>} - Object with ok property and cart item data.
   */
  public async createCartItem(
    createCartDto: CreateCartDto,
    productId: number,
    userId: number,
  ) {
    const { quantity } = createCartDto;
    return this.dataSource.transaction(async (manager: EntityManager) => {
      let cart = await this.getCartByUserId(userId, manager);

      if (!cart) {
        cart = await this.createCart(userId, manager);
      }

      const product = await this.productService.getProductByIdWithoutRelations(
        productId,
        manager,
      );

      const cartItemRepo = manager.getRepository(CartItem);
      const cartRepo = manager.getRepository(Cart);

      let cartItem = await this.getCartItem(cart, product, manager);

      if (cartItem) {
        cartItem.quantity += quantity;
        cart.totalPrice = product.price * quantity;
      } else {
        cartItem = cartItemRepo.create({
          cart,
          product,
          quantity: createCartDto.quantity,
          price: product.price,
        });
        cart.totalPrice += product.price * quantity;
      }

      // update it later when add discount
      cart.totalPriceAfterDiscount = cart.totalPrice;

      Promise.all([cartItemRepo.save(cartItem), cartRepo.save(cart)]);
      return { ok: true, data: cartItem };
    });
  }

  /**
   * Retrieves a cart item by cart and product.
   *
   * @param {Cart} cart - Cart object.
   * @param {Product} product - Product object.
   * @param {EntityManager} [manager] - EntityManager instance.
   * @returns {Promise<CartItem>} - Cart item object.
   */
  public async getCartItem(
    cart: Cart,
    product: Product,
    manager?: EntityManager,
  ) {
    const repo = manager
      ? manager.getRepository(CartItem)
      : this.cartItemRepository;
    return repo.findOneBy({ cart, product });
  }

  /**
   * Retrieves a cart by user id.
   *
   * @param {number} userId - User id.
   * @param {EntityManager} [manager] - EntityManager instance.
   * @returns {Promise<Cart>} - Cart object.
   */
  public getCartByUserId(userId: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Cart) : this.cartRepository;
    return repo.findOneBy({ user: { id: userId } });
  }

  /**
   * Creates a new cart for a user.
   *
   * @param {number} userId - User id.
   * @param {EntityManager} [manager] - EntityManager instance.
   * @returns {Promise<Cart>} - Newly created cart object.
   */
  public async createCart(userId: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Cart) : this.cartRepository;
    const cart = repo.create({ user: { id: userId } });
    await repo.save(cart);
    return cart;
  }
}
