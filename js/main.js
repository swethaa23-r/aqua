document.addEventListener('DOMContentLoaded', () => {
  // Check local storage for theme safely
  var html = document.documentElement;
  var themeBtn = document.getElementById('theme-btn');
  var savedTheme = null;
  
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    console.warn("localStorage access denied, likely due to local file protocol.");
  }
  
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    if (themeBtn) themeBtn.innerHTML = '<i class="ph ph-sun"></i>';
  } else {
    if (themeBtn) themeBtn.innerHTML = '<i class="ph ph-moon"></i>';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      html.classList.toggle('dark');
      var isDark = html.classList.contains('dark');
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (e) {}
      themeBtn.innerHTML = isDark ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
    });
  }

  

  // Navbar Scroll Effect & Scroll Progress
  var navbar = document.querySelector('.navbar');
  var scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (navbar) { if (window.scrollY > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); } }

    // Scroll Progress bar
    var totalScroll = document.documentElement.scrollTop;
    var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scroll = `${totalScroll / windowHeight * 100}%`;
    if(scrollProgress) {
        scrollProgress.style.width = scroll;
    }
  });

  // Custom Cursor
  var cursor = document.getElementById('custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    var hoverElements = document.querySelectorAll('a, button, .interactive');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // GSAP Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Premium Hero GSAP Timeline
    var heroGsapItems = document.querySelectorAll('.gsap-hero-item');
    var heroGsapImage = document.querySelector('.gsap-hero-image');
    
    if (heroGsapItems.length > 0 || heroGsapImage) {
      var heroTl = gsap.timeline({ delay: 0.1 });
      
      if (heroGsapItems.length > 0) {
        heroTl.fromTo(heroGsapItems, 
          { y: 50, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
        );
      }
      
      if (heroGsapImage) {
        heroTl.fromTo(heroGsapImage,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out' },
          "-=0.8"
        );
      }
    }

    // Hero Background Parallax
    if (document.querySelector('.hero-slideshow')) {
      gsap.to('.hero-slideshow', {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        yPercent: 30,
        ease: 'none'
      });
    }

    // Advanced 3D Flip Card Transition
    var featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
      gsap.fromTo('.feature-card', 
        { y: 100, opacity: 0, rotationY: -30, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: featuresGrid,
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'expo.out'
        }
      );
    }

    // Dynamic Fade Up Elements
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.fromTo(el, 
        { y: 60, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );
    });

    // Premium Footer GSAP Animation Sequence
    var sfFooter = document.querySelector('.sf-footer');
    if (sfFooter) {
      var footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sfFooter,
          start: 'top 85%',
          once: true
        }
      });
      
      // Animate logo first
      footerTl.fromTo('.sf-logo', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      )
      // Description
      .fromTo('.sf-col.sf-brand .sf-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.4'
      )
      // Social icons one by one
      .fromTo('.sf-social-btn',
        { y: 20, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' },
        '-=0.2'
      )
      // Headings
      .fromTo('.sf-heading',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.2'
      )
      // Links sequentially
      .fromTo('.sf-links li, .sf-contact li',
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        '-=0.2'
      )
      // Newsletter last
      .fromTo('.sf-newsletter',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      );
    }

    // Newsletter Submission Handler
    var newsletterForm = document.querySelector('.sf-newsletter');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var emailInput = this.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          // Show success animation
          this.classList.add('success');
          // Reset after 3 seconds
          setTimeout(() => {
            this.classList.remove('success');
            emailInput.value = '';
          }, 3000);
        }
      });
    }

  }

  // Back to Top Button
  var backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
    // Stats Counter Animation (Native Intersection Observer)
    var statElements = document.querySelectorAll('.stat-number, .about-stat-number, .counter-number');
    if (statElements.length > 0) {
      const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        let start = null;

        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          el.innerHTML = Math.floor(easeProgress * target) + suffix;
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.innerHTML = target + suffix;
          }
        };
        window.requestAnimationFrame(step);
      };

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const parentCard = el.closest('.hero-stat-card, .stat-item, .about-stat-card, .counter-box');
            if (parentCard) {
              parentCard.style.opacity = '1';
              parentCard.style.transform = 'translateY(0) scale(1)';
            }
            animateCounter(el);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.1 });

      statElements.forEach(el => {
        el.innerHTML = '0' + (el.getAttribute('data-suffix') || '');
        const parentCard = el.closest('.hero-stat-card, .stat-item, .about-stat-card, .counter-box');
        if (parentCard) {
          parentCard.style.opacity = '0';
          parentCard.style.transform = 'translateY(30px) scale(0.95)';
          parentCard.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
        observer.observe(el);
      });
    }

    // Generate Bubbles & Particles (Enhanced)
    var heroBg = document.querySelector('.hero');
    if (heroBg) {
      for (let i = 0; i < 35; i++) {
        var bubble = document.createElement('div');
        bubble.classList.add('floating-bubble');
        var size = Math.random() * 30 + 5; // 5px to 35px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 15 + 10}s`; // 10s to 25s
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        
        // Add glowing aesthetic
        bubble.style.background = 'radial-gradient(circle, rgba(0,229,255,0.8) 0%, rgba(0,229,255,0) 70%)';
        bubble.style.border = 'none';
        
        heroBg.appendChild(bubble);
      }
    }

  // Back to Top Button Logic (deduplicated - handler already registered above)

  // Gallery Filtering
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        var filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
        
        // Refresh ScrollTrigger as heights change
        setTimeout(() => {
          if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 100);
      });
    });
  }

  // Lightbox Logic
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lbTitle = document.getElementById('lb-title');
  var lbDesc = document.getElementById('lb-desc');

  if (lightbox) {
    // We delegate the event since we might add items via infinite scroll
    var galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
      galleryGrid.addEventListener('click', (e) => {
        var item = e.target.closest('.gallery-item');
        if (item) {
          var imgSrc = item.querySelector('img').getAttribute('src');
          var title = item.querySelector('h3') ? item.querySelector('h3').innerText : 'Image';
          var desc = item.querySelector('p') ? item.querySelector('p').innerText : '';
          
          lightboxImg.setAttribute('src', imgSrc);
          if (lbTitle) lbTitle.innerText = title;
          if (lbDesc) lbDesc.innerText = desc;
          
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
      });
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('click', (e) => {
      // Close if clicking outside the content (on the backdrop itself or the lightbox container)
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // FAQ Accordion
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      
      if(question) {
        question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
      }
      
      question.addEventListener('click', () => {
        var isActive = item.classList.contains('active');
        
        // Close all others
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          if(otherItem.querySelector('.faq-answer')) {
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
          }
          if(otherItem.querySelector('.faq-question')) {
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        if (!isActive) {
          item.classList.add('active');
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + "px";
          }
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // FAQ Search Logic
    var searchInput = document.getElementById('faq-search-input');
    var noResults = document.getElementById('faq-no-results');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        var query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        faqItems.forEach(item => {
          var text = item.textContent.toLowerCase();
          if (text.includes(query)) {
            item.classList.remove('hide');
            visibleCount++;
          } else {
            item.classList.add('hide');
            // Close it if it was open
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = null;
          }
        });

        if (visibleCount === 0) {
          noResults.classList.remove('hide');
        } else {
          noResults.classList.add('hide');
        }
        
        setTimeout(() => {
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 100);
      });
    }
  }

});


  // 1. Hero Slideshow
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 6000);
  }

  // 2. Mouse Parallax on Hero Content
  var heroContent = document.querySelector('.hero-text-content');
  if (heroContent) {
    document.addEventListener('mousemove', (e) => {
      // Disable parallax on mobile screens to prevent layout bugs
      if (window.innerWidth <= 768) {
        heroContent.style.transform = 'none';
        return;
      }
      var x = (window.innerWidth / 2 - e.clientX) / 40;
      var y = (window.innerHeight / 2 - e.clientY) / 40;
      heroContent.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // 3. Fish Generator
  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    for(let i=0; i<5; i++) {
      var fish = document.createElement('div');
      fish.classList.add('swimming-fish');
      fish.innerHTML = '<i class="ph-fill ph-fish-simple"></i>';
      fish.style.top = `${Math.random() * 80 + 10}%`;
      fish.style.animationDuration = `${Math.random() * 15 + 15}s`;
      fish.style.animationDelay = `${Math.random() * 10}s`;
      fish.style.opacity = Math.random() * 0.5 + 0.3;
      heroSection.appendChild(fish);
    }
  }

  // Newsletter Success Animation
  var newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    // Remove inline onsubmit first
    form.removeAttribute('onsubmit');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('success-state');
      var input = form.querySelector('input');
      var originalPlace = input.placeholder;
      input.value = '';
      input.placeholder = 'Subscribed Successfully! 🎉';
      
      // Reset after 3 seconds
      setTimeout(() => {
        form.classList.remove('success-state');
        input.placeholder = originalPlace;
      }, 3000);
    });
  });

  // Scroll to Top Ripple Effect
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('mousedown', function(e) {
      var circle = document.createElement('span');
      var diameter = Math.max(this.clientWidth, this.clientHeight);
      var radius = diameter / 2;
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
      circle.classList.add('ripple');
      
      var ripple = this.querySelector('.ripple');
      if (ripple) {
        ripple.remove();
      }
      
      this.appendChild(circle);
    });
  }

  // =========================================================
  // Advanced Mobile Menu Toggle — Clean Implementation
  // =========================================================
  (function initMobileMenu() {
    var mobileBtn = document.getElementById('mobile-menu-btn');
    var navLinks  = document.getElementById('nav-links');
    if (!mobileBtn || !navLinks) return;

    // Create a full-screen overlay to catch outside-clicks and
    // visually dim the page behind the drawer.
    var menuOverlay = document.createElement('div');
    menuOverlay.id = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    /* ---- helpers ---- */
    function openMenu() {
      navLinks.classList.add('active');
      menuOverlay.classList.add('active');
      mobileBtn.classList.add('is-active');
      mobileBtn.setAttribute('aria-expanded', 'true');
      var navbar = document.querySelector('.navbar');
      if (navbar) navbar.classList.add('menu-active');
      // Lock background scroll robustly
      document.body.style.overflow = 'hidden';
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    }

    function closeMenu() {
      navLinks.classList.remove('active');
      menuOverlay.classList.remove('active');
      mobileBtn.classList.remove('is-active');
      mobileBtn.setAttribute('aria-expanded', 'false');
      var navbar = document.querySelector('.navbar');
      if (navbar) navbar.classList.remove('menu-active');
      // Restore background scroll
      document.body.style.overflow = '';
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }

    /* ---- events ---- */
    // Toggle on hamburger button click
    mobileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking the dark overlay
    menuOverlay.addEventListener('click', closeMenu);

    // Close when any nav link inside the drawer is clicked
    var drawerLinks = navLinks.querySelectorAll('a');
    drawerLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        // Small delay so the click registers as navigation first
        setTimeout(closeMenu, 80);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });

    // Cleanup state on resize back to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992) {
        closeMenu();
      }
    });
  })();

  // =========================================================
  // Active Page Highlighting
  // =========================================================
  (function initActivePage() {
    var navLinks = document.querySelectorAll('.nav-links a');
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  // --- Blog Page Specific Logic ---
  
  // 1. Featured Blog Slider
  var featuredSlider = document.getElementById('featured-slider');
  if (featuredSlider) {
    var slides = featuredSlider.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.slider-dots .dot');
    var prevBtn = document.querySelector('.prev-btn');
    var nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    var showSlide = (index) => {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    var nextSlide = () => showSlide(currentSlide + 1);
    var prevSlide = () => showSlide(currentSlide - 1);

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetInterval();
      });
    });

    var startInterval = () => {
      slideInterval = setInterval(nextSlide, 7000);
    };
    var resetInterval = () => {
      clearInterval(slideInterval);
      startInterval();
    };
    
    startInterval();
  }

  // 2. Blog Search Logic
  var blogSearch = document.getElementById('blog-search');
  if (blogSearch) {
    var blogCards = document.querySelectorAll('.blog-card');
    blogSearch.addEventListener('input', (e) => {
      var searchTerm = e.target.value.toLowerCase();
      
      blogCards.forEach(card => {
        var title = card.querySelector('.blog-title').innerText.toLowerCase();
        var desc = card.querySelector('.blog-desc').innerText.toLowerCase();
        var category = card.getAttribute('data-category').toLowerCase();
        
        if (title.includes(searchTerm) || desc.includes(searchTerm) || category.includes(searchTerm)) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
      
      // Refresh ScrollTrigger as heights might change
      setTimeout(() => {
        if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 350);
    });
  }

  // --- Contact Page Specific Logic ---

  // 1. Map Reveal Animation
  var mapWrapper = document.querySelector('.reveal-map-wrapper');
  if (mapWrapper && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: mapWrapper,
      start: 'top 80%',
      onEnter: () => mapWrapper.classList.add('revealed'),
      once: true
    });
  }

  // 2. Form Validation & Success Animation
  var contactForm = document.getElementById('contact-form-modern');
  var successOverlay = document.getElementById('form-success-overlay');
  var sendAnotherBtn = document.getElementById('send-another-btn');

  if (contactForm && successOverlay) {
    var inputs = contactForm.querySelectorAll('.floating-input');
    
    // Validate on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });
      input.addEventListener('input', () => {
        // Remove error state on typing
        input.parentElement.classList.remove('error');
      });
    });

    function validateInput(input) {
      var group = input.parentElement;
      if (input.value.trim() === '') {
        group.classList.remove('valid');
        group.classList.remove('error');
        return false;
      }

      if (input.type === 'email') {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(input.value)) {
          group.classList.add('valid');
          group.classList.remove('error');
          return true;
        } else {
          group.classList.add('error');
          group.classList.remove('valid');
          return false;
        }
      } else {
        group.classList.add('valid');
        group.classList.remove('error');
        return true;
      }
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
          input.parentElement.classList.add('error');
        }
      });

      if (isValid) {
        // Show success
        successOverlay.classList.remove('hide');
        contactForm.style.opacity = '0';
        contactForm.style.pointerEvents = 'none';
      }
    });

    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener('click', () => {
        successOverlay.classList.add('hide');
        contactForm.reset();
        inputs.forEach(input => {
          input.parentElement.classList.remove('valid');
          input.parentElement.classList.remove('error');
        });
        setTimeout(() => {
          contactForm.style.opacity = '1';
          contactForm.style.pointerEvents = 'auto';
        }, 300);
      });
    }
  }

  // 3. Live Chat Button
  var liveChatBtn = document.getElementById('live-chat-btn');
  if (liveChatBtn) {
    liveChatBtn.addEventListener('click', () => {
      alert("Live Chat initiated! (Connecting to agent...)");
    });
  }

  // 4. Gallery Infinite Scroll
  var scrollTrigger = document.getElementById('infinite-scroll-trigger');
  var skeletonLoader = document.querySelector('.skeleton-loader');
  var galleryGrid = document.getElementById('gallery-grid');
  
  if (scrollTrigger && galleryGrid) {
    var observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Show skeleton loader
        skeletonLoader.classList.remove('hide');
        
        // Simulate network request
        setTimeout(() => {
          skeletonLoader.classList.add('hide');
          
          // Generate new items
          var newItemsHTML = `
            <div class="gallery-item fade-up" data-category="farm">
              <img loading="lazy" src="assets/images/gal-farm1.png" alt="New Farm Expansion">
              <div class="gallery-overlay">
                <div class="gallery-caption">
                  <h3>New Farm Expansion</h3>
                  <p>Next-gen aquaculture</p>
                </div>
                <i class="ph ph-arrows-out zoom-icon"></i>
              </div>
            </div>
            <div class="gallery-item fade-up" data-category="tech">
              <img loading="lazy" src="assets/images/gal-tech2.webp" alt="Smart Sensor v2">
              <div class="gallery-overlay">
                <div class="gallery-caption">
                  <h3>Smart Sensor v2</h3>
                  <p>Enhanced accuracy</p>
                </div>
                <i class="ph ph-arrows-out zoom-icon"></i>
              </div>
            </div>
          `;
          
          galleryGrid.insertAdjacentHTML('beforeend', newItemsHTML);
          
          // Refresh scroll trigger after appending
          if(typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
          
          // Re-observe if we want infinite, but here we can just disconnect after a few loads.
          // For demo, we just disconnect after one load.
          observer.disconnect();
          
        }, 1500);
      }
    }, { threshold: 0.1 });
    
    observer.observe(scrollTrigger);
  }

  // --- Sustainability Page Specific Logic ---
  
  // 1. Impact Counters Animation (Handled globally by unified GSAP counter logic)

  // 2. Growing Trees GSAP Animation
  var growingTrees = document.querySelectorAll('.growing-trees .tree');
  if (growingTrees.length > 0 && typeof gsap !== 'undefined') {
    gsap.to(growingTrees, {
      scrollTrigger: {
        trigger: '.growing-trees',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      scale: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: 'elastic.out(1, 0.5)'
    });
  }

  // 3. Animated Download Button
  var downloadBtn = document.querySelector('.btn-animated-download');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (this.classList.contains('downloading') || this.classList.contains('success')) return;

      this.classList.add('downloading');
      var progress = this.querySelector('.download-progress');
      var text = this.querySelector('.btn-text');
      var icon = this.querySelector('.btn-icon');
      
      text.innerText = 'Downloading...';
      
      if (typeof gsap !== 'undefined' && progress) {
        gsap.to(progress, {
          width: '100%',
          duration: 2,
          ease: 'power2.inOut',
          onComplete: () => {
            this.classList.remove('downloading');
            this.classList.add('success');
            text.innerText = 'Downloaded! ✓';
            if (icon) icon.className = 'ph ph-check btn-icon';
            
            setTimeout(() => {
              this.classList.remove('success');
              progress.style.width = '0%';
              text.innerText = 'Download 2026 Report';
              if (icon) icon.className = 'ph ph-download-simple btn-icon';
            }, 3000);
          }
        });
      } else {
        // Fallback if GSAP is not available
        setTimeout(() => {
          this.classList.remove('downloading');
          text.innerText = 'Download Complete!';
          setTimeout(() => {
            text.innerText = 'Download 2026 Report';
          }, 3000);
        }, 2000);
      }
    });
  }

  // --- Technology Page Specific Logic ---
  
  // 1. tsParticles Configuration
  var tsParticlesContainer = document.getElementById('tsparticles');
  if (tsParticlesContainer && typeof tsParticles !== 'undefined') {
    tsParticles.load("tsparticles", {
      fpsLimit: 60,
      particles: {
        color: { value: "#2DD4BF" },
        links: {
          color: "#2DD4BF",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: false,
          straight: false,
          outModes: { default: "bounce" },
        },
        number: {
          density: { enable: true, area: 800 },
          value: 60,
        },
        opacity: {
          value: 0.3,
        },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, links: { opacity: 0.5 } }
        }
      },
      detectRetina: true,
    });
  }

  // 2. Timeline Slide-in Observer
  var timelineNodes = document.querySelectorAll('.timeline-node');
  if (timelineNodes.length > 0 && typeof gsap !== 'undefined') {
    timelineNodes.forEach((node, index) => {
      var direction = node.classList.contains('left') ? -50 : 50;
      gsap.fromTo(node, 
        { x: direction, opacity: 0 },
        {
          scrollTrigger: {
            trigger: node,
            start: 'top 85%'
          },
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          onComplete: () => node.classList.add('active')
        }
      );
    });

    // Animate the timeline SVG line
    var timelinePath = document.getElementById('timeline-path');
    if (timelinePath) {
      gsap.to(timelinePath, {
        scrollTrigger: {
          trigger: '.timeline-section',
          start: 'top 50%',
          end: 'bottom 80%',
          scrub: 1
        },
        strokeDashoffset: 0,
        ease: 'none'
      });
    }
  }

  // Story Reveal Animation
  gsap.utils.toArray('.gs-reveal').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // Story Image Reveal
  gsap.utils.toArray('.reveal-image').forEach((img) => {
    ScrollTrigger.create({
      trigger: img,
      start: 'top 85%',
      onEnter: () => img.classList.add('revealed')
    });
  });

  // --- Species Page Specific Logic ---
  
  // 1. Comparison Chart Animation
  var compRows = document.querySelectorAll('.comp-row');
  if (compRows.length > 0 && typeof IntersectionObserver !== 'undefined') {
    var compObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          var row = entry.target;
          var bar = row.querySelector('.comp-bar');
          if (bar) {
            var width = bar.getAttribute('data-width');
            // We set width via JS and add animate class to trigger CSS transition
            setTimeout(() => {
              bar.style.width = width;
              row.classList.add('animate');
            }, 200);
          }
          observer.unobserve(row);
        }
      });
    }, { threshold: 0.5 });
    
    compRows.forEach(row => compObserver.observe(row));
  }
  
  // --- Services Page Specific Logic ---
  
  // 1. 3D Tilt Card Effect
  var tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    var borderWrapper = card.querySelector('.animated-border');
    
    card.addEventListener('mousemove', (e) => {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      
      var rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
      var rotateY = ((x - centerX) / centerX) * 10;
      
      if (borderWrapper) {
        borderWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (borderWrapper) {
        borderWrapper.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      }
    });
  });

  // 2. Ripple Button Effect
  var rippleBtns = document.querySelectorAll('.ripple-btn, .btn, button');
  rippleBtns.forEach(btn => {
    btn.addEventListener('mousedown', function(e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      var circle = document.createElement('span');
      circle.classList.add('ripple-span');
      
      var diameter = Math.max(this.clientWidth, this.clientHeight);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${x - (diameter / 2)}px`;
      circle.style.top = `${y - (diameter / 2)}px`;
      
      this.appendChild(circle);
      
      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });

  // Magnetic Button Effect
  var magneticButtons = document.querySelectorAll('.magnetic-btn');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      var position = btn.getBoundingClientRect();
      var x = e.clientX - position.left - position.width / 2;
      var y = e.clientY - position.top - position.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });
    
    btn.addEventListener('mouseout', (e) => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  // Mouse Parallax for Hero Illustration
  var heroIllustration = document.querySelector('.hero-illustration');
  if (heroIllustration) {
    document.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) {
        heroIllustration.style.transform = 'none';
        return;
      }
      var x = (window.innerWidth / 2 - e.clientX) / 40;
      var y = (window.innerHeight / 2 - e.clientY) / 40;
      
      heroIllustration.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // End Mouse Parallax


    // Highlight Active Navbar Link
    var currentPath = window.location.pathname.split("/").pop() || "index.html";
    var navAnchors = document.querySelectorAll(".nav-links a");
    navAnchors.forEach(a => {
      var href = a.getAttribute("href");
      if (href === currentPath) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });

    // Global Form Handling
    var allForms = document.querySelectorAll("form");
    allForms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Simple validation check
        var inputs = form.querySelectorAll("input[required], textarea[required]");
        let isValid = true;
        inputs.forEach(input => {
          if (!input.value.trim()) isValid = false;
        });

        if (!isValid) return; // Let HTML5 validation handle UI

        // Button state
        var btn = form.querySelector("button[type='submit']");
        var originalText = btn ? btn.innerHTML : "";
        if (btn) btn.innerHTML = "<i class='ph ph-spinner ph-spin'></i> Processing...";

        setTimeout(() => {
          if (btn) btn.innerHTML = "<i class='ph ph-check'></i> Success!";
          
          // Specific Form Routing
          var isLogin = window.location.pathname.includes("login.html");
          var isSignup = window.location.pathname.includes("signup.html");
          
          if (isLogin || isSignup) {
            window.location.href = "dashboard-manager.html";
          } else {
            // Reset button and form after 3s for newsletter/contact
            setTimeout(() => {
              if (btn) btn.innerHTML = originalText;
              form.reset();
            }, 3000);
          }
        }, 1200);
      });
    });
