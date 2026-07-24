import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestProduct } from './entities/request-product.entity';
import { Repository } from 'typeorm';
import { CreateRequestProductDto } from './dtos/create-request-product.dto';
import { JwtPayloadType } from '../utils/types';
import { UpdateRequestProductDto } from './dtos/update-request-product.dto';
import { SupplierService } from '../supplier/supplier.service';
import { UserRole } from '../utils/enums';
import { ProductService } from '../product/product.service';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectRepository(RequestProduct)
    private readonly requestProductRepository: Repository<RequestProduct>,
    private readonly supplierService: SupplierService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Creates a new request product.
   *
   * @throws {BadRequestException} If request product already exists.
   *
   * @param {CreateRequestProductDto} dto - Request product data.
   * @param {number} userId - User id.
   * @returns {Promise<{ ok: boolean; message: string; data: RequestProduct }>}
   */
  public async createRequestProduct(
    dto: CreateRequestProductDto,
    userId: number,
  ): Promise<{ ok: boolean; message: string; data: RequestProduct }> {
    const supplier = await this.supplierService.getSupplierByUserId(userId);

    const isExists = await this.requestProductRepository.exists({
      where: {
        title: dto.title,
        supplier: {
          id: supplier.id,
        },
      },
    });

    if (isExists) {
      throw new BadRequestException({
        ok: false,
        message: 'Request product already exists',
      });
    }

    const requestProduct = this.requestProductRepository.create({
      ...dto,
      supplier,
    });

    await this.requestProductRepository.save(requestProduct);

    return {
      ok: true,
      message: 'Request product created',
      data: requestProduct,
    };
  }

  /**
   * Retrieves all request products.
   *
   * @returns {Promise<{ ok: boolean, data: RequestProduct[] }>} - Object with ok property and array of request product data.
   */
  public async getAllRequestProducts(): Promise<{
    ok: boolean;
    data: RequestProduct[];
  }> {
    const requestProducts = await this.requestProductRepository.find({
      relations: {
        supplier: {
          user: true,
        },
      },
    });
    return { ok: true, data: requestProducts };
  }

  /**
   * Retrieves a request product by id.
   *
   * @throws {UnauthorizedException} If user is not allowed to access the request product.
   *
   * @param {number} id - Request product id.
   * @param {JwtPayloadType} payload - Payload of the jwt token.
   * @returns {Promise<{ ok: boolean; data: RequestProduct }>} - Object with ok property and request product data.
   */
  public async getRequestProduct(
    id: number,
    payload: JwtPayloadType,
  ): Promise<{ ok: boolean; data: RequestProduct }> {
    const requestProduct = await this.getRequestProductById(id);
    if (
      requestProduct.supplier.user.id !== payload.id &&
      payload.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException({
        ok: false,
        message: 'You are not allowed to access this request product',
      });
    }

    return { ok: true, data: requestProduct };
  }

  /**
   * Updates a request product by id.
   *
   * @throws {BadRequestException} If user is not allowed to access the request product.
   *
   * @param {number} id - Request product id.
   * @param {UpdateRequestProductDto} updateRequestProductDto - Request product data to update.
   * @param {JwtPayloadType} payload - Payload of the jwt token.
   * @returns {Promise<{ ok: boolean; message: string; data: RequestProduct }>} - Object with ok property, request product data and success message.
   */
  public async updateRequestProduct(
    id: number,
    updateRequestProductDto: UpdateRequestProductDto,
    payload: JwtPayloadType,
  ): Promise<{ ok: boolean; message: string; data: RequestProduct }> {
    const requestProduct = await this.getRequestProductById(id);
    if (
      requestProduct.supplier.user.id !== payload.id &&
      payload.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException({
        ok: false,
        message: 'You are not allowed to access this request product',
      });
    }

    const updatedRequestProduct = this.requestProductRepository.merge(
      requestProduct,
      updateRequestProductDto,
    );

    await this.requestProductRepository.save(updatedRequestProduct);
    return {
      ok: true,
      message: 'Request product updated successfully',
      data: updatedRequestProduct,
    };
  }

  /**
   * Deletes a request product by id.
   *
   * @throws {BadRequestException} If user is not allowed to access the request product.
   *
   * @param {number} id - Request product id.
   * @param {JwtPayloadType} payload - Payload of the jwt token.
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   */
  public async deleteRequestProduct(
    id: number,
    payload: JwtPayloadType,
  ): Promise<{ ok: boolean; message: string }> {
    const requestProduct = await this.getRequestProductById(id);
    if (
      requestProduct.supplier.user.id !== payload.id &&
      payload.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException({
        ok: false,
        message: 'You are not allowed to access this request product',
      });
    }

    await this.requestProductRepository.remove(requestProduct);
    return {
      ok: true,
      message: 'Request product deleted successfully',
    };
  }

  /**
   * Retrieves a request product by id.
   *
   * @throws {NotFoundException} If request product does not exist.
   *
   * @param {number} id - Request product id.
   * @returns {Promise<RequestProduct>} - Request product data.
   */
  private async getRequestProductById(id: number): Promise<RequestProduct> {
    const requestProduct = await this.requestProductRepository.findOne({
      where: { id },
      relations: {
        supplier: {
          user: true,
        },
      },
    });

    if (!requestProduct) {
      throw new NotFoundException({
        ok: false,
        message: 'Request product not found',
      });
    }

    return requestProduct;
  }

  public async acceptRequestProduct(id: number) {
    const requestProduct = await this.getRequestProductById(id);
    // TODO Create Product
    return { ok: true, message: 'TODO Later', product: 'TODO Later' };
  }
}
