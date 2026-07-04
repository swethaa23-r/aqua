document.addEventListener('DOMContentLoaded', () => {

  // --- Sidebar Toggle ---
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      // Resize charts after transition
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    });
  }

  // --- SPA Routing ---
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const spaSections = document.querySelectorAll('.spa-section');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-section');
      if (!targetId) return; // Allow normal link navigation (like logout) if no data-section exists

      e.preventDefault();

      // Update active state on links
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update breadcrumb
      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = link.querySelector('span').textContent;
      }

      // Hide all sections
      spaSections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.opacity = '0';
        sec.style.display = 'none';
      });

      // Show target section with GSAP
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(targetSection, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'});
        } else {
          targetSection.style.opacity = '1';
        }
      }
    });
  });

  // Ensure initial active section is visible on load
  const initialSection = document.querySelector('.spa-section.active');
  if (initialSection) {
    initialSection.style.opacity = '1';
    initialSection.style.display = 'block';
  }

  // --- Chart.js Initialization ---
  // Theme configuration for charts
  const getChartColors = () => {
    const isDark = document.body.classList.contains('light-mode') === false; // Default is dark
    return {
      text: isDark ? '#cbd5e1' : '#475569',
      grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };
  };

  let charts = [];

  const initCharts = () => {
    const colors = getChartColors();
    Chart.defaults.color = colors.text;
    Chart.defaults.scale.grid.color = colors.grid;
    
    // 1. Production Overview (Line Chart)
    const prodCtx = document.getElementById('productionChart');
    if (prodCtx) {
      charts.push(new Chart(prodCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Salmon Yield (Tons)',
            data: [120, 150, 180, 220, 260, 310],
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Shrimp Yield (Tons)',
            data: [80, 95, 110, 140, 160, 190],
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.2)',
            tension: 0.4,
            fill: true
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    // 2. Water Quality Radar
    const wqCtx = document.getElementById('wqChart');
    if (wqCtx) {
      charts.push(new Chart(wqCtx, {
        type: 'radar',
        data: {
          labels: ['pH', 'Dissolved O2', 'Temperature', 'Ammonia', 'Nitrate', 'Salinity'],
          datasets: [{
            label: 'Current Metrics',
            data: [90, 85, 95, 80, 75, 88],
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.4)',
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    // 3. Revenue Bar Chart
    const revCtx = document.getElementById('revenueChart');
    if (revCtx) {
      charts.push(new Chart(revCtx, {
        type: 'bar',
        data: {
          labels: ['Farm A', 'Farm B', 'Farm C', 'Farm D'],
          datasets: [{
            label: 'Revenue ($K)',
            data: [450, 320, 580, 290],
            backgroundColor: ['#7C3AED', '#34D399', '#f59e0b', '#8b5cf6'],
            borderRadius: 6
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }
    // 4. Inventory Doughnut Chart
    const invCtx = document.getElementById('inventoryChart');
    if (invCtx) {
      charts.push(new Chart(invCtx, {
        type: 'doughnut',
        data: {
          labels: ['Atlantic Salmon', 'Pacific White Shrimp', 'Tilapia', 'Barramundi'],
          datasets: [{ data: [850, 2400, 410, 128], backgroundColor: ['#14B8A6', '#f59e0b', '#8b5cf6', '#10b981'], borderWidth: 0, hoverOffset: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      }));
    }

    // 5. Feed Consumption Line Chart
    const feedCtx = document.getElementById('feedChart');
    if (feedCtx) {
      charts.push(new Chart(feedCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ label: 'Feed (Tons)', data: [38, 41, 39, 45, 42, 36, 43], borderColor: '#14B8A6', backgroundColor: 'rgba(20,184,166,0.15)', tension: 0.4, fill: true, pointBackgroundColor: '#14B8A6' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    // 6. Analytics 12-Month Revenue Chart
    const analyticsCtx = document.getElementById('analyticsChart');
    if (analyticsCtx) {
      charts.push(new Chart(analyticsCtx, {
        type: 'bar',
        data: {
          labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Revenue ($K)', data: [680, 720, 810, 890, 950, 1020, 780, 820, 970, 1100, 1150, 1200], backgroundColor: 'rgba(20,184,166,0.7)', borderRadius: 6 },
            { label: 'Production (T)', data: [580, 620, 710, 760, 800, 850, 680, 710, 820, 930, 980, 1010], backgroundColor: 'rgba(10,66,117,0.5)', borderRadius: 6 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    // 7. Sustainability Carbon Footprint Chart
    const sustainCtx = document.getElementById('sustainChart');
    if (sustainCtx) {
      charts.push(new Chart(sustainCtx, {
        type: 'line',
        data: {
          labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
          datasets: [{ label: 'CO₂ Emissions (Tons)', data: [2800, 2500, 2100, 1700, 1400, 1200, 1050], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)', tension: 0.4, fill: true, pointBackgroundColor: '#10b981' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }
  };

  // Only init if Chart.js is loaded
  if (typeof Chart !== 'undefined') {
    initCharts();
  }

  // Handle Theme Toggle for Charts
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTimeout(() => {
        if (typeof Chart !== 'undefined') {
          const colors = getChartColors();
          Chart.defaults.color = colors.text;
          Chart.defaults.scale.grid.color = colors.grid;
          charts.forEach(c => c.update());
        }
      }, 50); // slight delay to allow body class to update
    });
  }

});


  // --- SortableJS Integration ---
  if (typeof Sortable !== 'undefined') {
    const grid = document.querySelector('.widget-grid');
    if (grid) {
      new Sortable(grid, {
        animation: 300,
        ghostClass: 'sortable-ghost',
        easing: "cubic-bezier(1, 0, 0, 1)"
      });
    }
  }

  // --- Advanced SPA Routing with Skeleton & GSAP ---
  // Overriding previous SPA logic
  sidebarLinks.forEach(link => {
    // Clone and replace to strip old event listener
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    
    newLink.addEventListener('click', (e) => {
      const targetId = newLink.getAttribute('data-section');
      if (!targetId) return;

      e.preventDefault();

      // Update active states
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      newLink.classList.add('active');

      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = newLink.querySelector('span').textContent;
      }

      // Handle Section Switch
      spaSections.forEach(sec => {
        sec.classList.remove('active');
        sec.style.opacity = 0;
      });

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
        
        // Inject Skeleton
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader';
        skeleton.innerHTML = `
          <div class="skeleton-grid">
            <div class="skeleton-box"></div><div class="skeleton-box"></div>
            <div class="skeleton-box"></div><div class="skeleton-box"></div>
          </div>
          <div class="skeleton-box" style="height: 300px; margin-top:1.5rem;"></div>
        `;
        targetSection.style.position = 'relative';
        targetSection.appendChild(skeleton);

        // Simulate Network Fetch
        setTimeout(() => {
          skeleton.style.opacity = 0;
          setTimeout(() => skeleton.remove(), 400);
          
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(targetSection, {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'});
          } else {
            targetSection.style.opacity = 1;
          }
          
          // Animate Counters
          const counters = targetSection.querySelectorAll('.widget-value');
          counters.forEach(counter => {
            const text = counter.innerText;
            const num = parseInt(text.replace(/[^0-9]/g, ''));
            if (!isNaN(num) && num > 0) {
              const suffix = text.replace(/[0-9,]/g, '');
              let obj = { val: 0 };
              gsap.to(obj, {
                val: num,
                duration: 1.5,
                ease: 'expo.out',
                onUpdate: () => {
                  // Format with commas
                  counter.innerText = Math.floor(obj.val).toLocaleString() + suffix;
                }
              });
            }
          });
        }, 600); // 600ms fake load time
      }
    });
  });

  // --- Notification Dropdown Logic ---
  const notifBtn = document.getElementById('notif-btn');
  const notifContainer = document.getElementById('notif-container');
  if (notifBtn && notifContainer) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifContainer.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!notifContainer.contains(e.target)) {
        notifContainer.classList.remove('open');
      }
    });
  }

  // --- Dashboard Dark/Light Theme Toggle ---
  // Ensure the theme toggle only affects the dashboard HTML tag
  if (themeBtn) {
    // replace node to remove old listener
    const newThemeBtn = themeBtn.cloneNode(true);
    themeBtn.parentNode.replaceChild(newThemeBtn, themeBtn);
    
    newThemeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      newThemeBtn.innerHTML = isDark ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
      
      // Update Charts
      setTimeout(() => {
        if (typeof Chart !== 'undefined' && charts.length > 0) {
          const colors = {
            text: isDark ? '#E2E8F0' : '#475569',
            grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          };
          Chart.defaults.color = colors.text;
          Chart.defaults.scale.grid.color = colors.grid;
          charts.forEach(c => c.update());
        }
      }, 50);
    });
  }
