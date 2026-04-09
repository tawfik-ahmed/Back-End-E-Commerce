import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { JwtPayloadType } from '../utils/types'; 
import { UserRole } from '../utils/enums'; 
import { ProductService } from '../product/product.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductService,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new review for a product.
   *
   * @throws {BadRequestException} If user has already reviewed this product.
   *
   * @param {CreateReviewDto} createReviewDto - Object containing review data to create.
   * @param {number} userId - User id.
   * @returns {Promise<{ ok: boolean; message: string; data: Review }>} - Object with ok property, review data and success message.
   */
  public async createProductReview(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<{ ok: boolean; message: string; data: Review }> {
    const { productId, rating, ...rest } = createReviewDto;

    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const isReviewExists = await this.hasUserReviewedProduct(
        productId,
        userId,
        manager,
      );

      if (isReviewExists) {
        throw new BadRequestException({
          ok: false,
          message: 'You have already reviewed this product already',
        });
      }

      const repo = manager.getRepository(Review);
      const review = repo.create({
        ...rest,
        rating,
        user: { id: userId },
        product: { id: productId },
      });

      await Promise.all([
        repo.save(review),
        this.productService.adjustProductRating(
          productId,
          'add',
          { newRating: rating },
          manager,
        ),
      ]);
      return { ok: true, message: 'Review created successfully', data: review };
    });
  }

  /**
   * Retrieves all reviews for a given product.
   *
   * @param {number} productId - Product id.
   * @returns {Promise<{ ok: boolean, data: Review[] }>} - Object with ok property and array of review data.
   */
  public async getAllProductReviews(
    productId: number,
  ): Promise<{ ok: boolean; data: Review[] }> {
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
    });

    return { ok: true, data: reviews };
  }

  /**
   * Retrieves a review by product id and user id.
   *
   * @param {number} productId - Product id.
   * @param {number} userId - User id.
   * @returns {Promise<{ ok: boolean, data: Review }>} - Object with ok property and review data.
   */
  public async getUserReviewForProduct(
    productId: number,
    userId: number,
  ): Promise<{ ok: boolean; data: Review }> {
    const review = await this.getReviewByIds(productId, userId);
    return { ok: true, data: review };
  }

  /**
   * Updates a review for a product.
   *
   * @throws {BadRequestException} If product id is provided in the updateReviewDto.
   * @throws {BadRequestException} If user is not authorized to update the review.
   *
   * @param {number} productId - Product id.
   * @param {number} userId - User id.
   * @param {UpdateReviewDto} updateReviewDto - Object containing review data to update.
   * @returns {Promise<{ ok: boolean, data: Review, message: string }>} - Object with ok property, review data and success message.
   */
  public async updateProductReview(
    productId: number,
    userId: number,
    updateReviewDto: UpdateReviewDto,
  ) {
    const { productId: prodId, ...rest } = updateReviewDto;
    if (prodId) {
      throw new BadRequestException({
        ok: false,
        message: 'Product id cannot be updated',
      });
    }

    const review = await this.getReviewByIds(productId, userId);

    if (review.user.id !== userId) {
      throw new BadRequestException({
        ok: false,
        message: 'You are not authorized to update this review',
      });
    }

    const oldRating = review.rating!;
    const updatedReview = this.reviewRepository.merge(review, {
      ...rest,
    });

    return this.dataSource.transaction(async (manager: EntityManager) => {
      await this.reviewRepository.save(updatedReview);

      if (rest?.rating !== null && oldRating !== rest.rating) {
        await this.productService.adjustProductRating(
          productId,
          'update',
          { oldRating, newRating: rest.rating },
          manager,
        );
      }

      return {
        ok: true,
        message: 'Review updated successfully',
        data: updatedReview,
      };
    });
  }

  /**
   * Deletes a review for a product.
   *
   * @throws {BadRequestException} If user is not authorized to delete the review.
   *
   * @param {number} productId - Product id.
   * @param {JwtPayloadType} payload - Payload of the jwt token.
   * @returns {Promise<{ ok: boolean, message: string }>} - Object with ok property and success message.
   */
  public async deleteProductReview(productId: number, payload: JwtPayloadType) {
    const { id: userId, role } = payload;

    const review = await this.getReviewByIds(productId, userId);

    if (review.user.id !== userId && role !== UserRole.ADMIN) {
      throw new BadRequestException({
        ok: false,
        message: 'You are not authorized to delete this review',
      });
    }

    return this.dataSource.transaction(async (manager: EntityManager) => {
      await Promise.all([
        this.reviewRepository.remove(review),
        this.productService.adjustProductRating(
          productId,
          'delete',
          { oldRating: review.rating! },
          manager,
        ),
      ]);
      return { ok: true, message: 'Review deleted successfully' };
    });
  }

  /**
   * Retrieves a review by product id and user id.
   *
   * @param {number} productId - Product id.
   * @param {number} userId - User id.
   * @param {EntityManager} [manager] - EntityManager instance.
   * @returns {Promise<Review>} - Review object.
   * @throws {NotFoundException} If review does not exist.
   */
  private async getReviewByIds(
    productId: number,
    userId: number,
    manager?: EntityManager,
  ): Promise<Review> {
    const repo = manager
      ? manager.getRepository(Review)
      : this.reviewRepository;
    const review = await repo.findOne({
      where: { product: { id: productId }, user: { id: userId } },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException({ ok: false, message: 'Review not found' });
    }

    return review;
  }

  /**
   * Checks if a review with the given product id and user id exists.
   *
   * @param {number} productId - Product id.
   * @param {number} userId - User id.
   * @returns {Promise<boolean>} - True if review exists, false otherwise.
   */
  private hasUserReviewedProduct(
    productId: number,
    userId: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repo = manager
      ? manager.getRepository(Review)
      : this.reviewRepository;
    return repo.exists({
      where: { product: { id: productId }, user: { id: userId } },
    });
  }
}
