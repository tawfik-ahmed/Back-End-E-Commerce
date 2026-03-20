import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dtos/create-tax.dto';
import { Repository } from 'typeorm';
import { Tax } from './tax.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(Tax) private readonly taxRepository: Repository<Tax>,
  ) {}

  /**
   * Creates or updates a tax.
   *
   * If the tax does not exist, creates a new one with the given data.
   * If the tax already exists, updates it if the given data is different.
   * If the given data is the same as the existing tax, returns a message indicating no changes were detected.
   *
   * @param {CreateTaxDto} createTaxDto - Tax data to create or update.
   * @returns {Promise<{ ok: boolean; message: string; data?: Tax }>} - Object with ok property, message and tax data if updated.
   */
  public async createOrUpdateTax(
    createTaxDto: CreateTaxDto,
  ): Promise<{ ok: boolean; message: string; data?: Tax }> {
    const tax = await this.taxRepository.find();

    if (tax.length === 0) {
      const newTax = this.taxRepository.create(createTaxDto);
      await this.taxRepository.save(newTax);
      return { ok: true, message: 'Tax created successfully', data: newTax };
    }

    if (
      tax[0].taxPrice === createTaxDto.taxPrice &&
      tax[0].shippingPrice === createTaxDto.shippingPrice
    ) {
      return { ok: true, message: 'No changes detected' };
    }

    const updatedTax = this.taxRepository.merge(tax[0], createTaxDto);
    await this.taxRepository.save(updatedTax);
    return { ok: true, message: 'Tax updated successfully', data: updatedTax };
  }

  /**
   * Retrieves all taxes.
   *
   * @returns {Promise<{ ok: boolean; data: Tax[] }>} - Object with ok property and array of tax data.
   */
  public async getAllTaxes(): Promise<{ ok: boolean; data: Tax[] }> {
    const taxes = await this.taxRepository.find();
    return { ok: true, data: taxes };
  }

  /**
   * Resets the tax to its default values.
   *
   * @returns {Promise<{ ok: boolean; message: string }>} - Object with ok property and success message.
   * @throws {Promise<{ ok: boolean; message: string }>} - Object with ok property and error message if tax is not found.
   */
  public async resetTax(): Promise<{ ok: boolean; message: string }> {
    const tax = await this.taxRepository.find();

    if (tax.length === 0) {
      return { ok: false, message: 'Tax not found' };
    }

    tax[0].taxPrice = 0;
    tax[0].shippingPrice = 0;
    await this.taxRepository.save(tax);

    return { ok: true, message: 'Tax reset successfully' };
  }
}
