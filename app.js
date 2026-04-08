/* ===========================
   SpicePot Analytics – JS
   IBM Cognos Case Study 13
=========================== */

// ---- KPI DATA BY FILTER ----
const kpiData = {
  all: {
    revenue: '₹48,72,500',
    rating: '4.2',
    cancel: '8.6%',
    delivery: '42 mins',
  },
  Chennai: {
    revenue: '₹14,21,000',
    rating: '4.4',
    cancel: '7.2%',
    delivery: '38 mins',
  },
  Bangalore: {
    revenue: '₹13,58,500',
    rating: '4.3',
    cancel: '9.1%',
    delivery: '45 mins',
  },
  Hyderabad: {
    revenue: '₹11,90,000',
    rating: '4.0',
    cancel: '10.3%',
    delivery: '48 mins',
  },
  Coimbatore: {
    revenue: '₹9,03,000',
    rating: '4.5',
    cancel: '6.4%',
    delivery: '36 mins',
  },
};

const barData = {
  all: [
    { label: 'Mains', pct: 82, val: '₹21.3L' },
    { label: 'Starters', pct: 54, val: '₹14.0L' },
    { label: 'Beverages', pct: 38, val: '₹9.8L' },
    { label: 'Desserts', pct: 14, val: '₹3.6L' },
  ],
  dine: [
    { label: 'Mains', pct: 74, val: '₹9.2L' },
    { label: 'Starters', pct: 62, val: '₹7.7L' },
    { label: 'Beverages', pct: 44, val: '₹5.5L' },
    { label: 'Desserts', pct: 20, val: '₹2.5L' },
  ],
  takeaway: [
    { label: 'Mains', pct: 88, val: '₹6.8L' },
    { label: 'Starters', pct: 41, val: '₹3.2L' },
    { label: 'Beverages', pct: 28, val: '₹2.2L' },
    { label: 'Desserts', pct: 8, val: '₹0.6L' },
  ],
  delivery: [
    { label: 'Mains', pct: 92, val: '₹5.3L' },
    { label: 'Starters', pct: 51, val: '₹3.1L' },
    { label: 'Beverages', pct: 19, val: '₹1.1L' },
    { label: 'Desserts', pct: 6, val: '₹0.4L' },
  ],
};

// ---- UTILITY ----
function animateValue(el, from, to, duration) {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ---- APPLY FILTERS ----
function applyFilters() {
  const outlet = document.getElementById('outletFilter').value;
  const orderType = document.getElementById('orderTypeFilter').value;

  // Update KPI cards
  const data = kpiData[outlet] || kpiData['all'];
  updateKPI('kpiRevenue', data.revenue);
  updateKPI('kpiRating', data.rating);
  updateKPI('kpiCancel', data.cancel);
  updateKPI('kpiDelivery', data.delivery);

  // Update delivery KPI trend color
  const deliveryMins = parseInt(data.delivery);
  const deliveryTrend = document.querySelector('.kpi-card:nth-child(4) .kpi-trend');
  if (deliveryTrend) {
    if (deliveryMins > 50) {
      deliveryTrend.className = 'kpi-trend up';
      deliveryTrend.textContent = '↑ Above target';
    } else if (deliveryMins > 42) {
      deliveryTrend.className = 'kpi-trend up';
      deliveryTrend.textContent = '→ Near target';
    } else {
      deliveryTrend.className = 'kpi-trend down';
      deliveryTrend.textContent = '↓ On time';
    }
  }

  // Update bar chart
  const bars = document.querySelectorAll('.bar-item');
  const bData = barData[orderType] || barData['all'];
  bars.forEach((item, i) => {
    if (bData[i]) {
      const bar = item.querySelector('.bar');
      const val = item.querySelector('.bar-val');
      bar.style.width = bData[i].pct + '%';
      val.textContent = bData[i].val;
    }
  });

  // Flash the KPI cards
  document.querySelectorAll('.kpi-card').forEach((card, i) => {
    card.style.animation = 'none';
    setTimeout(() => {
      card.style.animation = '';
      card.style.opacity = '0.4';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transition = 'opacity 0.4s';
      }, 50);
    }, i * 80);
  });
}

function updateKPI(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transform = 'scale(0.92)';
  el.style.opacity = '0.3';
  el.style.transition = 'all 0.25s';
  setTimeout(() => {
    el.textContent = value;
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
  }, 200);
}

// ---- INTERSECTION OBSERVER: animate bars on enter ----
function initBarAnimations() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    bar.setAttribute('data-target', target);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar');
        bars.forEach((bar, i) => {
          const target = bar.getAttribute('data-target');
          setTimeout(() => {
            bar.style.transition = 'width 0.9s ease';
            bar.style.width = target;
          }, i * 120);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const chartBox = document.getElementById('categoryChart');
  if (chartBox) observer.observe(chartBox.closest('.chart-box'));
}

// ---- SMOOTH SECTION REVEAL ----
function initSectionReveal() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(24px)';
    section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(section);
  });
}

// ---- QUESTION CARD EXPAND ----
function initQuestionCards() {
  const cards = document.querySelectorAll('.question-card');
  cards.forEach(card => {
    const details = card.querySelector('.q-details');
    if (!details) return;
    details.style.maxHeight = '0';
    details.style.overflow = 'hidden';
    details.style.transition = 'max-height 0.4s ease';

    // Show on page load after a short delay
    setTimeout(() => {
      details.style.maxHeight = details.scrollHeight + 'px';
    }, 300);
  });
}

// ---- ACTIVE NAV HIGHLIGHT ----
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--spice-gold)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
}

// ---- WAITER TABLE SORT ----
function initTableSort() {
  const headers = document.querySelectorAll('.perf-table th');
  headers.forEach((th, colIndex) => {
    th.style.cursor = 'pointer';
    th.title = 'Click to sort';
    th.addEventListener('click', () => {
      sortTable(colIndex);
    });
  });
}

function sortTable(colIndex) {
  const tbody = document.getElementById('waiterTable');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const asc = tbody.getAttribute('data-sort-asc') === String(colIndex);
  tbody.setAttribute('data-sort-asc', asc ? '' : String(colIndex));

  rows.sort((a, b) => {
    const aVal = a.cells[colIndex]?.textContent.trim() || '';
    const bVal = b.cells[colIndex]?.textContent.trim() || '';
    const numA = parseFloat(aVal.replace(/[^0-9.]/g, ''));
    const numB = parseFloat(bVal.replace(/[^0-9.]/g, ''));
    if (!isNaN(numA) && !isNaN(numB)) {
      return asc ? numB - numA : numA - numB;
    }
    return asc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
  });

  rows.forEach(row => tbody.appendChild(row));

  // Re-number rank column
  rows.forEach((row, i) => {
    if (row.cells[0]) row.cells[0].textContent = i + 1;
  });
}

// ---- HERO PARALLAX ----
function initParallax() {
  const heroBg = document.querySelector('.hero-bg-pattern');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}

// ---- DELIVERY STATUS INDICATOR ----
function checkDeliveryStatus() {
  const deliveryEl = document.getElementById('kpiDelivery');
  if (!deliveryEl) return;

  const observer = new MutationObserver(() => {
    const mins = parseInt(deliveryEl.textContent);
    const card = deliveryEl.closest('.kpi-card');
    if (!card) return;
    card.style.borderColor =
      mins > 60 ? 'rgba(200,75,49,0.5)' :
      mins > 45 ? 'rgba(212,131,10,0.5)' :
      'rgba(46,139,87,0.5)';
  });

  observer.observe(deliveryEl, { childList: true, subtree: true, characterData: true });
}

// ---- TOOLTIP ON DONUT ----
function initDonutTooltip() {
  const segs = document.querySelectorAll('.donut-seg');
  const labels = {
    'seg-dine': 'Dine-In: 42% of orders',
    'seg-take': 'Takeaway: 28% of orders',
    'seg-del': 'Delivery: 30% of orders',
  };
  segs.forEach(seg => {
    const cls = [...seg.classList].find(c => c.startsWith('seg-'));
    if (!cls) return;
    seg.style.cursor = 'pointer';
    seg.addEventListener('mouseenter', () => {
      // temporarily highlight
      seg.style.filter = 'brightness(1.3)';
    });
    seg.addEventListener('mouseleave', () => {
      seg.style.filter = '';
    });
  });
}

// ---- MODULE CARD COUNTER ANIMATION ----
function initModuleNumbers() {
  const nums = document.querySelectorAll('.module-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.color = 'rgba(232, 168, 32, 0.35)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => observer.observe(n));
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Filter button
  const applyBtn = document.getElementById('applyFilter');
  if (applyBtn) applyBtn.addEventListener('click', applyFilters);

  // Also apply when dropdowns change
  const selects = document.querySelectorAll('.filter-group select');
  selects.forEach(sel => sel.addEventListener('change', () => {
    // slight debounce
    clearTimeout(sel._t);
    sel._t = setTimeout(applyFilters, 300);
  }));

  initBarAnimations();
  initSectionReveal();
  initQuestionCards();
  initActiveNav();
  initTableSort();
  initParallax();
  checkDeliveryStatus();
  initDonutTooltip();
  initModuleNumbers();

  console.log('%cSpicePot Analytics — IBM Cognos Case Study 13', 'color:#e8a820;font-size:14px;font-weight:bold;');
  console.log('%cAdroIT Technologies · Reporting | Exploration | Dashboard | Story Making', 'color:#888;font-size:11px;');
});
