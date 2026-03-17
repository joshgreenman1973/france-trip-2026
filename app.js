// === Service Worker Registration ===
if ('serviceWorker' in navigator) {
  const swPath = location.pathname.includes('france-trip-2026') ? '/france-trip-2026/sw.js' : '/sw.js';
  const scope = location.pathname.includes('france-trip-2026') ? '/france-trip-2026/' : '/';
  navigator.serviceWorker.register(swPath, { scope }).catch(() => {});
}

// === Tab Navigation ===
const tabs = document.querySelectorAll('#tabs button');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
});

// === Day Picker ===
const dayBtns = document.querySelectorAll('.day-btn');
const dayContents = document.querySelectorAll('.day-content');

dayBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const day = btn.dataset.day;
    dayBtns.forEach(b => b.classList.remove('active'));
    dayContents.forEach(d => d.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('day-' + day);
    if (target) target.classList.add('active');

    // Scroll the picker to keep the active button centered
    const picker = document.getElementById('day-picker');
    if (picker) {
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      const pickerWidth = picker.offsetWidth;
      const scrollTo = btnLeft - (pickerWidth / 2) + (btnWidth / 2);
      picker.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  });
});

// Auto-select today's day if we're on the trip
function autoSelectDay() {
  const now = new Date();
  const dayMap = {
    '2026-04-02': 'apr2', '2026-04-03': 'apr3', '2026-04-04': 'apr4',
    '2026-04-05': 'apr5', '2026-04-06': 'apr6', '2026-04-07': 'apr7',
    '2026-04-08': 'apr8', '2026-04-09': 'apr9', '2026-04-10': 'apr10'
  };
  const dateStr = now.toISOString().split('T')[0];
  if (dayMap[dateStr]) {
    const btn = document.querySelector(`.day-btn[data-day="${dayMap[dateStr]}"]`);
    if (btn) btn.click();
  }
}
autoSelectDay();

// === Countdown ===
function updateCountdown() {
  const departure = new Date('2026-04-01T23:00:00-04:00');
  const now = new Date();
  const diff = departure - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const el = document.getElementById('countdown');
  if (!el) return;

  if (days > 1) {
    el.textContent = days + ' days to go';
  } else if (days === 1) {
    el.textContent = 'Tomorrow!';
  } else if (days === 0) {
    el.textContent = 'Today!';
  } else {
    el.textContent = 'Bon voyage!';
  }
}
updateCountdown();

// === Collapsible Sections ===
window.toggleSection = function(btn) {
  btn.classList.toggle('open');
  const body = btn.nextElementSibling;
  if (body) body.classList.toggle('open');
};

// === Notes Persistence (localStorage) ===
const noteFields = document.querySelectorAll('.note-field');
noteFields.forEach(field => {
  const key = 'france-trip-note-' + field.id;
  field.value = localStorage.getItem(key) || '';
  field.addEventListener('input', () => {
    localStorage.setItem(key, field.value);
  });
});

// === Packing Checklist ===
const checklistItems = [
  'Passports (check expiry dates)',
  'Flight confirmation printed/saved offline',
  'Travel insurance documents',
  'Credit cards (notify bank of travel)',
  'Cash (some euros)',
  'Phone chargers + adapters (Type C/E plug for France)',
  'Portable battery pack',
  'Rain jackets (all 4)',
  'Comfortable walking shoes',
  'Layers: t-shirts, sweaters, light jacket',
  'Sunscreen + hats',
  'Medications / first aid basics',
  'Kids entertainment for flight (tablets, headphones, books)',
  'Snacks for travel days',
  'Reusable water bottles',
  'Small backpack / daypack',
  'Downloaded offline maps (Google Maps: Burgundy + Paris)',
  'Stroller or carrier for 5-year-old (long walking days)',
  'Ziplock bags (always useful with kids)',
  'Rental car confirmation',
  'Hotel/accommodation confirmations',
];

function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;
  const checked = JSON.parse(localStorage.getItem('france-trip-checklist') || '{}');
  container.innerHTML = checklistItems.map((item, i) => {
    const isChecked = checked[i] || false;
    return `<div class="checklist-item ${isChecked ? 'checked' : ''}">
      <input type="checkbox" id="check-${i}" ${isChecked ? 'checked' : ''} onchange="toggleCheck(${i})">
      <label for="check-${i}">${item}</label>
    </div>`;
  }).join('');
}

window.toggleCheck = function(i) {
  const checked = JSON.parse(localStorage.getItem('france-trip-checklist') || '{}');
  checked[i] = !checked[i];
  localStorage.setItem('france-trip-checklist', JSON.stringify(checked));
  renderChecklist();
};

renderChecklist();
