/**
 * Skyline Group Texas - Optimized JavaScript
 * Handles animations and scroll-triggered effects
 */
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    counterDuration: 1500,
    counterThreshold: 0.3,
    animationThreshold: 0.25,
    supportsIntersectionObserver: 'IntersectionObserver' in window
  };

  // Cache DOM elements
  const elements = {
    counters: null,
    metricsSection: null,
    stepCards: null,
    whyCards: null
  };

  /**
   * Animate counter from 0 to target value
   * @param {HTMLElement} counter - Counter element
   * @param {number} target - Target value
   */
  function animateCounter(counter, target) {
    const duration = CONFIG.counterDuration;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toLocaleString('he-IL');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString('he-IL');
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Initialize counter animations
   */
  function initCounters() {
    if (!elements.counters || !elements.counters.length) return;

    elements.counters.forEach(counter => {
      const target = Number.parseInt(counter.getAttribute('data-target'), 10);
      if (!isNaN(target) && target > 0) {
        animateCounter(counter, target);
      }
    });
  }

  /**
   * Initialize scroll animations for cards
   */
  function initScrollAnimations() {
    if (!CONFIG.supportsIntersectionObserver) {
      // Fallback: show all cards immediately
      if (elements.stepCards) {
        elements.stepCards.forEach(card => card.classList.add('visible'));
      }
      if (elements.whyCards) {
        elements.whyCards.forEach(card => card.classList.add('visible'));
      }
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: CONFIG.animationThreshold,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is visible
    });

    // Observe step cards
    if (elements.stepCards) {
      elements.stepCards.forEach(card => observer.observe(card));
    }

    // Observe why cards
    if (elements.whyCards) {
      elements.whyCards.forEach(card => observer.observe(card));
    }
  }

  /**
   * Initialize counter observer
   */
  function initCounterObserver() {
    if (!elements.metricsSection) {
      initCounters();
      return;
    }

    if (!CONFIG.supportsIntersectionObserver) {
      initCounters();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initCounters();
          observer.disconnect();
        }
      });
    }, { threshold: CONFIG.counterThreshold });

    observer.observe(elements.metricsSection);
  }

  /**
   * Initialize all functionality
   */
  function init() {
    // Cache DOM elements
    elements.counters = document.querySelectorAll('.counter');
    elements.metricsSection = document.querySelector('.section-metrics');
    elements.stepCards = document.querySelectorAll('.step-card');
    elements.whyCards = document.querySelectorAll('.why-card');

    // Initialize features
    initCounterObserver();
    initScrollAnimations();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }
})();
