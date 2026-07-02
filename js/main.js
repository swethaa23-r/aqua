document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check local storage for theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    themeBtn.innerHTML = '<i class="ph ph-sun"></i>';
  } else {
    themeBtn.innerHTML = '<i class="ph ph-moon"></i>';
  }

  themeBtn.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtn.innerHTML = isDark ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
  });

  // Mobile Menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Navbar Scroll Effect & Scroll Progress
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Progress bar
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${totalScroll / windowHeight * 100}%`;
    if(scrollProgress) {
        scrollProgress.style.width = scroll;
    }
  });

  // Custom Cursor
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, .interactive');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // GSAP Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    gsap.from('.hero-content h1', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    });
    
    gsap.from('.hero-content p', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: 'power3.out'
    });

    gsap.from('.hero-buttons', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: 'power3.out'
    });

    // Features Stagger
    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
      gsap.fromTo('.feature-card', 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: featuresGrid,
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        }
      );
    }

    // Fade Up Elements
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.fromTo(el, 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
    });

    // Stats Counter Animation
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(el, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power1.inOut',
            onUpdate: function() {
              el.innerHTML = Math.round(this.targets()[0].innerHTML) + (el.getAttribute('data-suffix') || '');
            }
          });
        },
        once: true
      });
    });

    // Generate Bubbles
    const heroBg = document.querySelector('.hero');
    if (heroBg) {
      for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('floating-bubble');
        const size = Math.random() * 40 + 10; // 10px to 50px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 10 + 10}s`; // 10s to 20s
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        heroBg.appendChild(bubble);
      }
    }
  }

  // Gallery Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
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
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all others
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });

    // FAQ Search Logic
    const searchInput = document.getElementById('faq-search-input');
    const noResults = document.getElementById('faq-no-results');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        faqItems.forEach(item => {
          const text = item.textContent.toLowerCase();
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
