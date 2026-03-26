import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async createReview(createReviewDto: CreateReviewDto) {
    // TODO: create review
  }

  public async getAllReviews() {
    // TODO: get all reviews
  }

  /**
   * Retrieves a review by id.
   *
   * @throws {NotFoundException} If review does not exist.
   *
   * @returns {Promise<{ ok: boolean, data: Review }>} - Object with ok property and review data.
   */
  public async getReview(id: number) {
    const review = await this.getReviewById(id);
    return { ok: true, data: review };
  }

  public async updateReview(id: number, updateReviewDto: UpdateReviewDto) {
    // TODO: update review
  }

  public async deleteReview(id: number) {
    // TODO: delete review
  }

  /**
   * Retrieves a review by id.
   *
   * @throws {NotFoundException} If review does not exist.
   *
   * @private
   *
   * @param {number} id - Review id.
   * @param {EntityManager} [manager] - Entity manager.
   * @returns {Promise<Review>} - Review object.
   */
  private async getReviewById(id: number, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(Review)
      : this.reviewRepository;
    const review = await repo.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException({ ok: false, message: 'Review not found' });
    }

    return review;
  }
}
