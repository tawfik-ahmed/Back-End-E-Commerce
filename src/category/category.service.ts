import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { EntityManager, Repository } from 'typeorm';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Creates a new category.
   *
   * @throws {BadRequestException} If category already exists.
   *
   * @param {CreateCategoryDto} createCategoryDto - Category data.
   * @returns {Promise<{ ok: boolean; data: Category; message: string }>} - Object with ok property, category data and success message.
   */
  public async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ ok: boolean; data: Category; message: string }> {
    const { name, image } = createCategoryDto;
    const isExists = await this.categoryRepository.exists({ where: { name } });

    if (isExists) {
      throw new BadRequestException({
        ok: false,
        message: 'Category already exists',
      });
    }

    const category = this.categoryRepository.create({ name, image });
    await this.categoryRepository.save(category);

    return {
      ok: true,
      data: category,
      message: 'Category created successfully',
    };
  }

  /**
   * Retrieves all categories.
   *
   * @returns {Promise<{ ok: boolean; data: Category[] }>} - Object with ok property and array of category data.
   */
  public async getAllCategories(): Promise<{ ok: boolean; data: Category[] }> {
    const categories = await this.categoryRepository.find();
    return { ok: true, data: categories };
  }

  /**
   * Retrieves a category by id.
   *
   * @param {number} id - Category id.
   * @returns {Promise<{ ok: boolean, data: Category }>} - Object with ok property and category data.
   */
  public async getCategory(
    id: number,
  ): Promise<{ ok: boolean; data: Category }> {
    const category = await this.getCategoryById(id);

    return {
      ok: true,
      data: category,
    };
  }

  /**
   * Update a category by id.
   *
   * @throws {NotFoundException} If category does not exist.
   *
   * @param {number} id - Category id.
   * @param {UpdateCategoryDto} updateCategoryDto - Category data to update.
   * @returns {Promise<{ ok: boolean, data: Category, message: string }>} - Object with ok property and category data.
   */
  public async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ ok: boolean; data: Category; message: string }> {
    if (!updateCategoryDto?.image && !updateCategoryDto?.name) {
      throw new BadRequestException({
        ok: false,
        message: 'Please provide data to update',
      });
    }

    const category = await this.getCategoryById(id);
    const updatedCategory = this.categoryRepository.merge(
      category,
      updateCategoryDto,
    );
    await this.categoryRepository.save(updatedCategory);

    return {
      ok: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    };
  }

  /**
   * Removes a category by id.
   *
   * @throws {NotFoundException} If category does not exist.
   *
   * @param {number} id - Category id.
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   */
  public async removeCategory(
    id: number,
  ): Promise<{ ok: boolean; message: string }> {
    const category = await this.getCategoryById(id);
    await this.categoryRepository.remove(category);

    return {
      ok: true,
      message: 'Category deleted successfully',
    };
  }

  /**
   * Retrieves a category by id.
   *
   * @throws {NotFoundException} If category does not exist.
   *
   * @param {number} id - Category id.
   * @returns {Promise<Category>} - Category object.
   */
  public async getCategoryById(
    id: number,
    manager?: EntityManager,
  ): Promise<Category> {
    const repo = manager
      ? manager.getRepository(Category)
      : this.categoryRepository;
    const category = await repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException({ ok: false, message: 'Category not found' });
    }

    return category;
  }
}
