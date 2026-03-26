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

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  /**
   * Creates a new review for a product.
   *
   * @param {CreateReviewDto} createReviewDto - Review data.
   * @param {number} userId - User id.
   * @returns {Promise<{ ok: boolean; message: string; data: Review }>} - Object with ok property, success message and review data.
   */
  public async createReview(createReviewDto: CreateReviewDto, userId: number): Promise<{ ok: boolean; message: string; data: Review }> {
    const { productId, ...rest } = createReviewDto;
    const isExistsReview = await this.hasUserReviewedProduct(productId, userId);

    if (isExistsReview) {
      throw new BadRequestException({
        ok: false,
        message: 'You have already reviewed this product already',
      });
    }

    const review = this.reviewRepository.create({
      ...rest,
      user: { id: userId },
      product: { id: productId },
    });
    await this.reviewRepository.save(review);

    return { ok: true, message: 'Review created successfully', data: review };
  }

  /**
   * Retrieves all reviews for a given product.
   *
   * @param {number} productId - Product id.
   * @returns {Promise<{ ok: boolean, data: Review[] }>} - Object with ok property and array of review data.
   */
  public async getAllProductReviews(productId: number): Promise<{ ok: boolean; data: Review[] }> {
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
  public async getUserReviewForProduct(productId: number, userId: number): Promise<{ ok: boolean; data: Review }> {
    const review = await this.getReviewByIds(productId, userId);
    return { ok: true, data: review };
  }

  public async updateReview(id: number, updateReviewDto: UpdateReviewDto) {
    // TODO: update review
  }

  public async deleteReview(id: number) {
    // TODO: delete review
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
  private hasUserReviewedProduct(productId: number, userId: number): Promise<boolean> {
    return this.reviewRepository.exists({
      where: { product: { id: productId }, user: { id: userId } },
    });
  }
}
