import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UpdateSupplierDto } from './dtos/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entites/supplier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  /**
   * Creates a new supplier.
   *
   * @throws {BadRequestException} If supplier already exists.
   *
   * @param {CreateSupplierDto} createSupplierDto - Supplier data.
   * @returns {Promise<{ ok: boolean; message: string; data: Supplier }>} - Object with ok property, supplier data and success message.
   */
  public async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<{ ok: boolean; message: string; data: Supplier }> {
    const isExists = await this.supplierRepository.exists({
      where: { name: createSupplierDto.name },
    });

    if (isExists) {
      throw new BadRequestException({
        ok: false,
        message: 'Supplier already exists',
      });
    }

    const supplier = this.supplierRepository.create(createSupplierDto);
    await this.supplierRepository.save(supplier);

    return {
      ok: true,
      message: 'Supplier created successfully',
      data: supplier,
    };
  }

  /**
   * Retrieves all suppliers.
   *
   * @returns {Promise<{ ok: boolean; data: Supplier[] }>} - Object with ok property and array of supplier data.
   */
  public async getAllSuppliers(): Promise<{ ok: boolean; data: Supplier[] }> {
    const suppliers = await this.supplierRepository.find();
    return { ok: true, data: suppliers };
  }

  /**
   * Retrieves a supplier by id.
   *
   * @throws {NotFoundException} If supplier does not exist.
   *
   * @param {number} id - Supplier id.
   * @returns {Promise<{ ok: boolean; data: Supplier }>} - Object with ok property and supplier data.
   */
  public async getSupplier(id: number) {
    const supplier = await this.getSupplierById(id);
    return { ok: true, data: supplier };
  }

  /**
   * Updates a supplier by id.
   *
   * @throws {NotFoundException} If supplier does not exist.
   *
   * @param {number} id - Supplier id.
   * @param {UpdateSupplierDto} updateSupplierDto - Supplier data to update.
   * @returns {Promise<{ ok: boolean; message: string; data: Supplier }>} - Object with ok property, supplier data and success message.
   */
  public async updateSupplier(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ) {
    const supplier = await this.getSupplierById(id);
    const updatedSupplier = this.supplierRepository.merge(
      supplier,
      updateSupplierDto,
    );
    await this.supplierRepository.save(updatedSupplier);
    return {
      ok: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    };
  }

  /**
   * Deletes a supplier by id.
   *
   * @throws {NotFoundException} If supplier does not exist.
   *
   * @param {number} id - Supplier id.
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   */
  public async deleteSupplier(id: number) {
    const supplier = await this.getSupplierById(id);
    await this.supplierRepository.remove(supplier);
    return { ok: true, message: 'Supplier deleted successfully' };
  }

  /**
   * Retrieves a supplier by id.
   *
   * @throws {NotFoundException} If supplier does not exist.
   *
   * @param {number} id - Supplier id.
   * @returns {Promise<Supplier>} - Supplier object.
   */
  private async getSupplierById(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new NotFoundException({ ok: false, message: 'Supplier not found' });
    }

    return supplier;
  }
}
