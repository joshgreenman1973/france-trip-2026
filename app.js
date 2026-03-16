// === Service Worker Registration ===
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
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
    window.scrollTo(0, 0);
  });
});

// === Countdown ===
function updateCountdown() {
  const departure = new Date('2026-04-01T23:00:00-04:00');
  const now = new Date();
  const diff = departure - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const el = document.getElementById('countdown-days');
  if (el) {
    if (days > 0) {
      el.textContent = days;
    } else if (days === 0) {
      el.textContent = 'Today!';
    } else {
      el.textContent = 'Bon voyage!';
      el.style.fontSize = '32px';
    }
  }
}
updateCountdown();

// === Collapsible Sections ===
window.toggleCollapsible = function(header) {
  header.classList.toggle('open');
  const body = header.nextElementSibling;
  body.classList.toggle('open');
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
