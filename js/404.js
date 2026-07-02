document.addEventListener('DOMContentLoaded', () => {
  // Wait a tiny bit for GSAP to be available
  setTimeout(() => {
    // GSAP Fade In
    if (typeof gsap !== 'undefined') {
      gsap.to('.error-card', { opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.error-code', { opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.7)', delay: 0.4 });
      gsap.from('.error-title', { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
      gsap.from('.error-desc', { opacity: 0, y: 20, duration: 0.8, delay: 0.7 });
      gsap.from('.btn-group', { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });
    } else {
      document.querySelector('.error-card').style.opacity = '1';
    }
  }, 100);

  // Bubble Particles
  const body = document.querySelector('body');
  for (let i = 0; i < 20; i++) {
    createBubble();
  }

  function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Randomize bubble properties
    const size = Math.random() * 30 + 10; // 10px to 40px
    const left = Math.random() * 100; // 0% to 100%
    const duration = Math.random() * 15 + 10; // 10s to 25s
    const delay = Math.random() * 10;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    
    body.appendChild(bubble);
  }

  // Countdown Redirect
  let count = 10;
  const countdownSpan = document.getElementById('countdown-timer');
  if (countdownSpan) {
    const timer = setInterval(() => {
      count--;
      countdownSpan.textContent = count;
      if (count <= 0) {
        clearInterval(timer);
        window.location.href = 'index.html';
      }
    }, 1000);
  }
});
