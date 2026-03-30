import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { EntityManager, Repository } from 'typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * Creates a new SubCategory.
   *
   * @throws {BadRequestException} If SubCategory already exists.
   *
   * @param {CreateSubCategoryDto} createSubCategoryDto - SubCategory data.
   * @returns {Promise<{ ok: boolean; data: SubCategory; message: string }>} - Object with ok property, SubCategory data and success message.
   */
  public async createSubCategory(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<{ ok: boolean; data: SubCategory; message: string }> {
    const { name, image, categoryId } = createSubCategoryDto;

    const isExists = await this.subCategoryRepository.exists({
      where: { name },
    });

    if (isExists) {
      throw new BadRequestException({
        ok: false,
        message: 'SubCategory exists',
      });
    }

    const category = await this.categoryService.getCategoryById(categoryId);
    const subCategory = this.subCategoryRepository.create({
      name,
      image,
      category,
    });

    await this.subCategoryRepository.save(subCategory);
    return {
      ok: true,
      data: subCategory,
      message: 'SubCategory created successfully',
    };
  }

  /**
   * Retrieves all SubCategories.
   *
   * @returns {Promise<{ ok: boolean; data: SubCategory[] }>} - Object with ok property and array of SubCategory data.
   */
  public async getAllCategories(): Promise<{
    ok: boolean;
    data: SubCategory[];
  }> {
    const subCategories = await this.subCategoryRepository.find({
      relations: ['category'],
    });
    return { ok: true, data: subCategories };
  }

  /**
   * Retrieves a SubCategory by id.
   *
   * @param {number} id - SubCategory id.
   * @returns {Promise<{ ok: boolean, data: SubCategory }>} - Object with ok property and SubCategory data.
   */
  public async getSubCategory(
    id: number,
  ): Promise<{ ok: boolean; data: SubCategory }> {
    const SubCategory = await this.getSubCategoryById(id);

    return {
      ok: true,
      data: SubCategory,
    };
  }

  /**
   * Update a SubCategory by id.
   *
   * @throws {BadRequestException} If no data is provided to update.
   *
   * @param {number} id - SubCategory id.
   * @param {UpdateSubCategoryDto} updateSubCategoryDto - SubCategory data to update.
   * @returns {Promise<{ ok: boolean; data: SubCategory; message: string }>} - Object with ok property, SubCategory data and success message.
   */
  public async updateSubCategory(
    id: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<{ ok: boolean; data: SubCategory; message: string }> {
    if (
      !updateSubCategoryDto.image &&
      !updateSubCategoryDto.name &&
      !updateSubCategoryDto.categoryId
    ) {
      throw new BadRequestException({
        ok: false,
        message: 'Please provide data to update',
      });
    }

    const subCategory = await this.getSubCategoryById(id);
    let updatedSubCategory: SubCategory;

    if (updateSubCategoryDto.categoryId) {
      const category = await this.categoryService.getCategoryById(
        updateSubCategoryDto.categoryId,
      );

      const { categoryId, ...subCategoryData } = updateSubCategoryDto;
      updatedSubCategory = this.subCategoryRepository.merge(subCategory, {
        ...subCategoryData,
        category,
      });
    } else {
      updatedSubCategory = this.subCategoryRepository.merge(
        subCategory,
        updateSubCategoryDto,
      );
    }

    await this.subCategoryRepository.save(updatedSubCategory);
    return {
      ok: true,
      data: updatedSubCategory,
      message: 'SubCategory updated successfully',
    };
  }

  /**
   * Removes a SubCategory by id.
   *
   * @throws {NotFoundException} If SubCategory does not exist.
   *
   * @param {number} id - SubCategory id.
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   */
  public async removeSubCategory(
    id: number,
  ): Promise<{ ok: boolean; message: string }> {
    const SubCategory = await this.getSubCategoryById(id);
    await this.subCategoryRepository.remove(SubCategory);

    return {
      ok: true,
      message: 'SubCategory deleted successfully',
    };
  }

  /**
   * Retrieves a SubCategory by id.
   *
   * @throws {NotFoundException} If SubCategory does not exist.
   *
   * @param {number} id - SubCategory id.
   * @returns {Promise<SubCategory>} - SubCategory object.
   */
  public async getSubCategoryById(
    id: number,
    manager?: EntityManager,
  ): Promise<SubCategory> {
    const repo = manager
      ? manager.getRepository(SubCategory)
      : this.subCategoryRepository;
    const subCategory = await repo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!subCategory) {
      throw new NotFoundException({
        ok: false,
        message: 'SubCategory not found',
      });
    }

    return subCategory;
  }
}
