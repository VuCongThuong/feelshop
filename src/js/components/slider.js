import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Thumbs, Scrollbar, EffectFade, FreeMode, EffectCoverflow, EffectCreative } from 'swiper/modules';
window.swiperInitialized = true;
window.Swiper = Swiper;
window.sliders = {};
window.slidersThumbs = {};

document.addEventListener("DOMContentLoaded", () => {

    function createSwiper(element, name, options, pagination) {
        let thumbs = null;
        let swiperThumbs = null;
        
        if (element.dataset.thumbs) {
            const elementThumbs = document.querySelector(`[data-slider-thumbs][data-name="thumbs-${name}"]`);
            if(elementThumbs) {

                const optionsThumbs = JSON.parse(elementThumbs.dataset.options || "{}");

                swiperThumbs = new Swiper(elementThumbs, {
                    modules: [Navigation, Pagination, Autoplay, Thumbs, Scrollbar, EffectFade, FreeMode, EffectCoverflow, EffectCreative],
                    watchSlidesProgress: true,
                    lazy: true,
                    navigation: {
                        nextEl: `[data-slider-next][data-name="thumbs-${name}"]`,
                        prevEl: `[data-slider-prev][data-name="thumbs-${name}"]`,
                    },
                    ...optionsThumbs,
                });

                window.slidersThumbs[name] = swiperThumbs;

                swiperThumbs.on('click', (swiper, event) => {
                  const clickedIndex = swiper.clickedIndex;

                  if (clickedIndex !== undefined && clickedIndex !== null) {
                    const { slidesPerView } = swiperThumbs.params;
                    const totalSlides = swiperThumbs.slides.length;
                    const firstVisibleIndex = swiperThumbs.activeIndex;
                    const lastVisibleIndex = firstVisibleIndex + slidesPerView - 1;

                    if (clickedIndex >= lastVisibleIndex) {
                      const targetIndex = Math.min(clickedIndex + Math.floor(slidesPerView / 2), totalSlides - 1);
                      swiperThumbs.slideTo(targetIndex);
                    } else if (clickedIndex <= firstVisibleIndex) {
                      const targetIndex = Math.max(clickedIndex - Math.floor(slidesPerView / 2), 0);
                      swiperThumbs.slideTo(targetIndex);
                    }
                  }
                });

                thumbs = { swiper: swiperThumbs };
            }
        }

        const updateTransform = (swiper, isInitial = false) => {
            const config = {
                scale: swiper.params.customScale || 0.78431372549,
                slideWidth: swiper.params.slideWidth || 510,
                desiredSpace: swiper.params.desiredSpace || 40,
                transitionDuration: '1000ms'
            };

            const scaledWidth = config.slideWidth * config.scale;
            const naturalGapOrigin = (config.slideWidth - scaledWidth) / 2;
            const translateDistance = (naturalGapOrigin - config.desiredSpace) / config.scale;

            const getTransform = (distanceFromActive) => {
                if (distanceFromActive === 0) {
                    return 'scale(1)';
                }

                if (Math.abs(distanceFromActive) === 1) {
                    const direction = distanceFromActive > 0 ? -1 : 1;
                    return `scale(${config.scale}) translateX(${direction * translateDistance}px)`;
                }

                const naturalGapScale = (naturalGapOrigin - config.desiredSpace) * Math.abs(distanceFromActive) +
                    (naturalGapOrigin * Math.abs(distanceFromActive)) - 
                    config.desiredSpace - (naturalGapOrigin - config.desiredSpace);
                    
                const translate = (naturalGapScale / config.scale) * (distanceFromActive > 0 ? -1 : 1);
                return `scale(${config.scale}) translateX(${translate}px)`;
            };

            swiper.slides.forEach((slide, index) => {
                const distanceFromActive = index - swiper.activeIndex;
                
                if (isInitial) {
                    slide.style.transition = 'none';
                    slide.style.transform = getTransform(distanceFromActive);
                    
                    slide.offsetHeight;
                    
                    requestAnimationFrame(() => {
                        slide.style.transition = config.transitionDuration;
                    });
                } else {
                    slide.style.transition = config.transitionDuration;
                    slide.style.transform = getTransform(distanceFromActive);
                }
            });
        };

        let navigationCustom = element.dataset.navigationCustom;

        const getNavigationElements = () => {
            if(navigationCustom) {
                if (window.innerWidth < 768) {
                    return {
                        nextEl: `[data-slider-next][data-name="${name}"][data-type="mobile"]`,
                        prevEl: `[data-slider-prev][data-name="${name}"][data-type="mobile"]`
                    };
                } else {
                    return {
                        nextEl: `[data-slider-next][data-name="${name}"][data-type="desktop"]`,
                        prevEl: `[data-slider-prev][data-name="${name}"][data-type="desktop"]`
                    };
                }
            } else {
                return {
                    nextEl: `[data-slider-next][data-name="${name}"]`,
                    prevEl: `[data-slider-prev][data-name="${name}"]`
                };
            }
        };

        const navigation = getNavigationElements();

        const useCustomPagination = element.dataset.progress === 'true';
        const customPagination = document.querySelector(`.swiper-custom-pagination[data-name="${name}"]`);
        
        const slider = new Swiper(element, {
            modules: [Navigation, Pagination, Autoplay, Thumbs, Scrollbar, EffectFade, FreeMode, EffectCoverflow, EffectCreative],
            watchSlidesProgress: true,
            lazy: true,
            speed: 1000,
            navigation: {
                nextEl: navigation.nextEl,
                prevEl: navigation.prevEl,
            },
            pagination: useCustomPagination ? {
              el: customPagination.querySelector('.swiper-progress-bar'),
              type: 'progressbar',
            } : pagination,
            thumbs: thumbs,
            ...options,
            on: {
                init: function() {
                    if(element.dataset.customSlider) {
                        setTimeout(() => {
                            updateTransform(this, true);
                        }, 0);
                    }

                    if (useCustomPagination) {
                        customPagination.classList.add('w-init');
                    }
                },
                slideChange: function() {
                    if(element.dataset.customSlider) {
                        updateTransform(this);
                    }
                }
            }
        });

        window.sliders[name] = slider;

        let currentBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';

        window.addEventListener("resize", () => {
            const newBreakpoint = window.innerWidth < 768 ? 'mobile' : 'desktop';

            if (newBreakpoint !== currentBreakpoint) {
                currentBreakpoint = newBreakpoint;

                if(navigationCustom) {
                    const navigation = getNavigationElements();
                    window.sliders[name].params.navigation.nextEl = navigation.nextEl;
                    window.sliders[name].params.navigation.prevEl = navigation.prevEl;
                    
                    slider.destroy(true, true);
                    createSwiper(element, name, options, pagination);
                }
            }
        });


        if(swiperThumbs != null) {
            slider.on('slideChange', () => {
                const activeIndex = slider.activeIndex;
                const { slidesPerView } = swiperThumbs.params;
                const totalSlides = swiperThumbs.slides.length;
                const firstVisibleIndex = swiperThumbs.activeIndex;
                const lastVisibleIndex = firstVisibleIndex + slidesPerView - 1;

                if (activeIndex < firstVisibleIndex) {
                    const targetIndex = Math.max(activeIndex - Math.floor(slidesPerView / 2), 0);
                    swiperThumbs.slideTo(targetIndex);
                } else if (activeIndex > lastVisibleIndex) {
                    const targetIndex = Math.min(activeIndex + Math.floor(slidesPerView / 2), totalSlides - 1);
                    swiperThumbs.slideTo(targetIndex);
                }
            });
        }

        if (element.dataset.triggerStartEndItem) {
            slider.on('click', (swiper, event) => {
              const clickedIndex = swiper.clickedIndex;

              if (clickedIndex !== undefined && clickedIndex !== null) {
                const { slidesPerView } = slider.params;
                const totalSlides = slider.slides.length;
                const firstVisibleIndex = slider.activeIndex;
                const lastVisibleIndex = firstVisibleIndex + slidesPerView - 1;

                if (clickedIndex >= lastVisibleIndex) {
                  const targetIndex = Math.min(clickedIndex + Math.floor(slidesPerView / 2), totalSlides - 1);
                  slider.slideTo(targetIndex);
                } else if (clickedIndex <= firstVisibleIndex) {
                  const targetIndex = Math.max(clickedIndex - Math.floor(slidesPerView / 2), 0);
                  slider.slideTo(targetIndex);
                }
              }
            });
        }

        const toggleHiddenButtons = () => {
            const nextEl = document.querySelector(`[data-slider-next][data-name="${name}"]`);
            const prevEl = document.querySelector(`[data-slider-prev][data-name="${name}"]`);
            const parentEl = nextEl?.parentElement;

            if (nextEl?.classList.contains('swiper-button-disabled') && prevEl?.classList.contains('swiper-button-disabled')) {
                parentEl?.classList.add('w-hidden');
            } else {
                parentEl?.classList.remove('w-hidden');
            }
        };

        slider.on('breakpoint resize init', toggleHiddenButtons);
    }

    document.querySelectorAll("[data-slider]").forEach((element) => {
        const name = element.dataset.name;
        const options = JSON.parse(element.dataset.options || "{}");
        let pagination = element.dataset.pagination;

        if (pagination) {
            const paginationElement = document.querySelector(`[data-slider-pagination][data-name="${name}"]`);

            if (pagination === "custom") {
                pagination = {
                    el: `[data-slider-pagination][data-name="${name}"]`,
                    clickable: true,
                    type: paginationElement?.dataset.type || "bullets",
                    renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`,
                    renderFraction: (currentClass, totalClass) => `<span class="${currentClass}"></span> - <span class="${totalClass}"></span>`,
                    formatFractionCurrent: (number) => `0${number}`.slice(-2),
                    formatFractionTotal: (number) => `0${number}`.slice(-2),
                };
            } else if (pagination === "true") {
                pagination = {
                    el: `.swiper-pagination[data-name="${name}"]`,
                    clickable: true,
                    renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`,
                };
            }
        } else {
            pagination = {
                el: null
            };
        }

        const destroy = element.dataset.destroy;
        
        const initSlider = () => {
            if (!element.classList.contains('swiper-initialized')) {
                createSwiper(element, name, options, pagination);
            }
        };

        if (destroy) {
            const widthThreshold = destroy === "mobile" ? 768 : parseInt(destroy, 10);
            const checkAndInit = () => {
                if ((destroy === "mobile" && window.innerWidth >= widthThreshold) || (destroy !== "mobile" && window.innerWidth < widthThreshold)) {
                    initSlider();
                }
            };
            checkAndInit();
            window.addEventListener("resize", checkAndInit);
        } else {
            initSlider();
        }
        
    });
});