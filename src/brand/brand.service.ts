import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { UpdateBrandDto } from './dtos/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  /**
   * Creates a new brand.
   *
   * @throws {BadRequestException} If brand already exists.
   *
   * @param {CreateBrandDto} createBrandDto - Brand data.
   * @returns {Promise<{ ok: boolean; message: string; data: Brand }>} - Object with ok property, brand data and success message.
   */
  public async createBrand(
    createBrandDto: CreateBrandDto,
  ): Promise<{ ok: boolean; message: string; data: Brand }> {
    const isExists = await this.brandRepository.exists({
      where: { name: createBrandDto.name },
    });

    if (isExists) {
      throw new BadRequestException({
        ok: false,
        message: 'Brand already exists',
      });
    }

    const brand = this.brandRepository.create(createBrandDto);
    await this.brandRepository.save(brand);
    return { ok: true, message: 'Brand created successfully', data: brand };
  }

  /**
   * Retrieves all brands.
   *
   * @returns {Promise<{ ok: boolean, data: Brand[] }>} - Object with ok property and array of brand data.
   */
  public async getAllBrands(): Promise<{ ok: boolean; data: Brand[] }> {
    const brands = await this.brandRepository.find();
    return { ok: true, data: brands };
  }

  /**
   * Retrieves a brand by id.
   *
   * @throws {NotFoundException} If brand does not exist.
   *
   * @param {number} id - Brand id.
   * @returns {Promise<{ ok: boolean; data: Brand }>} - Object with ok property and brand data.
   */
  public async getOneBrand(id: number): Promise<{ ok: boolean; data: Brand }> {
    const brand = await this.getOneBrandById(id);
    return { ok: true, data: brand };
  }

  /**
   * Update a brand by id.
   *
   * @throws {NotFoundException} If brand does not exist.
   *
   * @param {number} id - Brand id.
   * @param {UpdateBrandDto} updateBrandDto - Brand data to update.
   * @returns {Promise<{ ok: boolean; message: string; data: Brand }>} - Object with ok property, brand data and success message.
   */
  public async updateBrand(
    id: number,
    updateBrandDto: UpdateBrandDto,
  ): Promise<{ ok: boolean; message: string; data: Brand }> {
    const brand = await this.getOneBrandById(id);
    const updatedBrand = this.brandRepository.merge(brand, updateBrandDto);
    await this.brandRepository.save(updatedBrand);
    return {
      ok: true,
      message: 'Brand updated successfully',
      data: updatedBrand,
    };
  }

  /**
   * Deletes a brand by id.
   *
   * @throws {NotFoundException} If brand does not exist.
   *
   * @param {number} id - Brand id.
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   */
  public async deleteBrand(
    id: number,
  ): Promise<{ ok: boolean; message: string }> {
    const brand = await this.getOneBrandById(id);
    await this.brandRepository.remove(brand);
    return { ok: true, message: 'Brand deleted successfully' };
  }

  /**
   * Retrieves a brand by id.
   *
   * @throws {NotFoundException} If brand does not exist.
   *
   * @param {number} id - Brand id.
   * @returns {Promise<Brand>} - Brand object.
   */
  private async getOneBrandById(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException({ ok: false, message: 'Brand not found' });
    }

    return brand;
  }
}
