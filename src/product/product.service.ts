import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entites/product.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { ProductImage } from './entites/product-image.entity';
import { ProductColor } from './entites/product-color.entity';
import { CategoryService } from '../category/category.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { BrandService } from 'src/brand/brand.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,

    private readonly dataSource: DataSource,

    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly brandService: BrandService,
  ) {}

  /**
   * Creates a new product.
   *
   * @throws {BadRequestException} If product already exists.
   *
   * @param {CreateProductDto} createProductDto - Product data.
   * @returns {Promise<{ ok: boolean; data: Product; message: string }>} - Object with ok property, product data and success message.
   */
  public async createProduct(createProductDto: CreateProductDto) {
    const {
      title,
      colors,
      images,
      categoryId,
      subCategoryId,
      brandId,
      ...rest
    } = createProductDto;

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const productRepository = manager.getRepository(Product);

      const isExists = await productRepository.exists({
        where: { title },
      });

      if (isExists) {
        throw new BadRequestException({
          ok: false,
          message: 'Product already exists',
        });
      }

      const [category, subCategory, brand] =
        await this.getCategorySubCategoryBrandEntities(
          categoryId,
          subCategoryId,
          brandId,
          manager,
        );
      let colorsEntities: ProductColor[] = [];

      if (colors && colors?.length > 0) {
        await this.upsertColors(colors, manager);
        colorsEntities = await this.getColorsEntites(colors, manager);
      }

      let imagesEntities: ProductImage[] = [];

      if (images && images?.length > 0) {
        await this.upsertImages(images, manager);
        imagesEntities = await this.getImagesEntites(images, manager);
      }

      const product = productRepository.create({
        title,
        ...rest,
        category,
        subCategory,
        brand,
        images: imagesEntities,
        colors: colorsEntities,
      });
      await productRepository.save(product);

      return {
        ok: true,
        data: product,
        message: 'Product created successfully',
      };
    });
  }

  /**
   * Retrieves all products.
   *
   * @returns {Promise<{ ok: boolean, data: Product[] }>} - Object with ok property and array of product data.
   */
  public async getAllProducts() {
    const products = await this.productRepository.find();
    return { ok: true, data: products };
  }

  /**
   * Retrieves a product by id.
   *
   * @param {number} id - Product id.
   * @returns {Promise<{ ok: boolean, data: Product }>} - Object with ok property and product data.
   */
  public async getProduct(id: number) {
    const product = await this.getProductById(id);
    return { ok: true, data: product };
  }

  /**
   * Updates a product by id.
   *
   * @throws {BadRequestException} If product with this title already exists.
   *
   * @param {number} id - Product id.
   * @param {UpdateProductDto} updateProductDto - Product data to update.
   * @returns {Promise<{ ok: boolean, data: Product, message: string }>} - Object with ok property, product data and success message.
   */
  public async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      let product = await this.getProductById(id, manager);

      const {
        title,
        colors,
        images,
        categoryId,
        subCategoryId,
        brandId,
        ...rest
      } = updateProductDto;

      const productRepository = manager.getRepository(Product);

      if (title && title !== product.title) {
        const isExists = await productRepository.exists({
          where: { title },
        });

        if (isExists) {
          throw new BadRequestException({
            ok: false,
            message: 'Product with this title already exists',
          });
        }
      }

      const [category, subCategory, brand] =
        await this.getCategorySubCategoryBrandEntities(
          categoryId ?? product.category.id,
          subCategoryId ?? product.subCategory.id,
          brandId ?? product.brand.id,
          manager,
        );

      if (colors && colors?.length > 0) {
        await this.upsertColors(colors, manager);
        product.colors = await this.getColorsEntites(colors, manager);
      }

      if (images && images?.length > 0) {
        await this.upsertImages(images, manager);
        product.images = await this.getImagesEntites(images, manager);
      }

      product = productRepository.merge(product, {
        title,
        ...rest,
        category,
        subCategory,
        brand,
      });
      await productRepository.save(product);

      return {
        ok: true,
        data: product,
        message: 'Product updated successfully',
      };
    });
  }

  /**
   * Deletes a product by id.
   *
   * @throws {BadRequestException} If product does not exist.
   *
   * @param {number} id - Product id.
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   */
  public async deleteProduct(id: number) {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
    return { ok: true, message: 'Product deleted successfully' };
  }

  /**
   * Retrieves a product by id.
   *
   * @throws {BadRequestException} If product does not exist.
   *
   * @param {number} id - Product id.
   * @returns {Promise<Product>} - Product object.
   */
  private async getProductById(id: number, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Product)
      : this.productRepository;
    const product = await repo.findOne({ where: { id } });

    if (!product) {
      throw new BadRequestException({
        ok: false,
        message: 'Product not found',
      });
    }

    return product;
  }

  /**
   * Retrieves category, subcategory and brand entities by their ids.
   *
   * @throws {BadRequestException} If any of the entities does not exist.
   *
   * @param {number} categoryId - Category id.
   * @param {number} subCategoryId - SubCategory id.
   * @param {number} brandId - Brand id.
   *
   * @returns {Promise<[Category, SubCategory, Brand]>} - Array with category, subcategory and brand entities.
   */
  private async getCategorySubCategoryBrandEntities(
    categoryId: number,
    subCategoryId: number,
    brandId: number,
    manager: EntityManager,
  ) {
    const [category, subCategory, brand] = await Promise.all([
      this.categoryService.getCategoryById(categoryId, manager),
      this.subCategoryService.getSubCategoryById(subCategoryId, manager),
      this.brandService.getOneBrandById(brandId, manager),
    ]);

    let missing: string[] = [];

    if (!category) {
      missing.push('Category');
    }

    if (!subCategory) {
      missing.push('SubCategory');
    }

    if (!brand) {
      missing.push('Brand');
    }

    if (!category || !subCategory || !brand) {
      throw new BadRequestException({
        ok: false,
        message: `${missing.join(', ')} not found`,
      });
    }

    return [category, subCategory, brand];
  }

  /**
   * Inserts or updates product colors in the database.
   *
   * @param {string[]} colors - Array of product color names.
   * @returns {Promise<void>} - Promise which resolves when the operation is completed.
   */
  private async upsertColors(colors: string[], manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(ProductColor)
      : this.productColorRepository;
    return repo.upsert(
      colors.map((color) => ({ name: color })),
      ['name'],
    );
  }

  /**
   * Retrieves product colors from the database.
   *
   * @param {string[]} colors - Array of product color names.
   * @returns {Promise<ProductColor[]>} - Promise which resolves with an array of product color entities.
   */
  private async getColorsEntites(colors: string[], manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(ProductColor)
      : this.productColorRepository;
    return repo.find({ where: { name: In(colors) } });
  }

  /**
   * Inserts or updates product images in the database.
   *
   * @param {string[]} images - Array of product image urls.
   * @returns {Promise<void>} - Promise which resolves when the operation is completed.
   */
  private upsertImages(images: string[], manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(ProductImage)
      : this.productImageRepository;
    return repo.upsert(
      images.map((url) => ({ url })),
      ['url'],
    );
  }

  /**
   * Retrieves product images from the database.
   *
   * @param {string[]} images - Array of product image urls.
   * @returns {Promise<ProductImage[]>} - Promise which resolves with an array of product image entities.
   */
  private getImagesEntites(images: string[], manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(ProductImage)
      : this.productImageRepository;
    return repo.find({ where: { url: In(images) } });
  }
}
