import type { SwiperOptions } from 'swiper/types';

/**
 * Shared Swiper configuration for all carousel components.
 * Each component should also import:
 *   import 'swiper/css';
 *   import 'swiper/css/pagination';
 */
export const defaultSwiperProps: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 16,
  grabCursor: true,
  pagination: {
    clickable: true,
    bulletClass: 'swiper-bullet',
    bulletActiveClass: 'swiper-bullet--active',
  },
  breakpoints: {
    768: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 16 },
  },
};
