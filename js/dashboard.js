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
        sec.style.opacity = 0;
      });

      // Show target section with GSAP
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(targetSection, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'});
        } else {
          targetSection.style.opacity = 1;
        }
      }
    });
  });

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
