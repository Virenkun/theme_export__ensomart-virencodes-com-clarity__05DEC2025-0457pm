/**
 * Premium Product Page Enhancements
 * Adds smooth animations and enhanced interactions
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPageEnhancements);
  } else {
    initProductPageEnhancements();
  }

  function initProductPageEnhancements() {
    // Intersection Observer for scroll animations
    initScrollAnimations();
    
    // Enhanced image gallery interactions
    initGalleryEnhancements();
    
    // Sticky add to cart for mobile
    initStickyAddToCart();
    
    // Price animation on variant change
    initPriceAnimations();
    
    // Image zoom preview on hover
    initImageZoomPreview();
  }

  /**
   * Scroll-triggered animations using Intersection Observer
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.product-details > .group-block > *, ' +
      '.product-recommendations .product-card, ' +
      '.feature-card, ' +
      '.trust-badge-item'
    );

    if (!animatedElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay based on element index
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((el) => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });

    // Add CSS for animations
    addAnimationStyles();
  }

  /**
   * Add dynamic animation styles
   */
  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .animate-ready {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      .price-updating {
        animation: priceFlash 0.3s ease-out;
      }
      
      @keyframes priceFlash {
        0% { opacity: 0.5; transform: scale(0.98); }
        50% { opacity: 0.8; }
        100% { opacity: 1; transform: scale(1); }
      }
      
      .image-zoom-active {
        cursor: zoom-in;
      }
      
      .sticky-add-to-cart {
        position: fixed;
        bottom: -100%;
        left: 0;
        right: 0;
        background: var(--color-background, #fff);
        padding: 1rem;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
        z-index: 100;
        transition: bottom 0.3s ease;
        display: none;
      }
      
      .sticky-add-to-cart.visible {
        bottom: 0;
      }
      
      @media screen and (min-width: 750px) {
        .sticky-add-to-cart {
          display: none !important;
        }
      }
      
      @media screen and (max-width: 749px) {
        .sticky-add-to-cart {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .sticky-add-to-cart .sticky-price {
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .sticky-add-to-cart .sticky-button {
          flex: 1;
          max-width: 200px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Enhanced gallery interactions
   */
  function initGalleryEnhancements() {
    const gallery = document.querySelector('media-gallery');
    if (!gallery) return;

    // Add smooth transition class
    gallery.classList.add('gallery-enhanced');

    // Thumbnail click enhancement
    const thumbnails = gallery.querySelectorAll('.slideshow-controls--thumbnails button');
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        // Add ripple effect
        createRipple(thumb, event);
      });
    });
  }

  /**
   * Create ripple effect on click
   */
  function createRipple(element, event) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(201, 160, 80, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out;
      pointer-events: none;
      left: ${event.clientX - rect.left - size/2}px;
      top: ${event.clientY - rect.top - size/2}px;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Sticky add to cart for mobile
   */
  function initStickyAddToCart() {
    const buyButtons = document.querySelector('.buy-buttons-block');
    if (!buyButtons) return;

    // Create sticky bar
    const stickyBar = document.createElement('div');
    stickyBar.className = 'sticky-add-to-cart';
    
    const priceEl = document.querySelector('.product-details .price');
    const price = priceEl ? priceEl.textContent : '';
    
    stickyBar.innerHTML = `
      <div class="sticky-price">${price}</div>
      <button class="sticky-button button" onclick="document.querySelector('.buy-buttons-block [name=add]')?.click()">
        Add to Cart
      </button>
    `;
    
    document.body.appendChild(stickyBar);

    // Show/hide based on scroll position
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stickyBar.classList.remove('visible');
        } else {
          stickyBar.classList.add('visible');
        }
      });
    }, { threshold: 0 });

    observer.observe(buyButtons);
  }

  /**
   * Price animation on variant change
   */
  function initPriceAnimations() {
    const priceContainer = document.querySelector('[ref="priceContainer"]');
    if (!priceContainer) return;

    // Watch for price changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          priceContainer.classList.add('price-updating');
          setTimeout(() => {
            priceContainer.classList.remove('price-updating');
          }, 300);
        }
      });
    });

    observer.observe(priceContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * Image zoom preview on hover
   */
  function initImageZoomPreview() {
    const productImages = document.querySelectorAll('.product-media-container--image:not(.product-media-container--zoomable)');
    
    productImages.forEach((container) => {
      const img = container.querySelector('img');
      if (!img) return;

      container.classList.add('image-zoom-active');
      
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = 'scale(1.5)';
      });

      container.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.transformOrigin = 'center center';
      });
    });
  }

  // Add ripple animation keyframes
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

})();

