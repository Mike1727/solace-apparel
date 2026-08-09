const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('is-open');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    });
  });
}

let cartCount = 0;
const cartCountEl = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function addToCart(name, price) {
  cartCount += 1;
  if (cartCountEl) cartCountEl.textContent = String(cartCount);
  if (cartBtn) cartBtn.setAttribute('aria-label', `View cart, ${cartCount} items`);
  showToast(`Added "${name}" ($${Number(price).toFixed(2)}) to your cart.`);
}

document.querySelectorAll('.add-to-cart').forEach((btn) => {
  btn.addEventListener('click', () => {
    addToCart(btn.dataset.name, btn.dataset.price);
  });
});

document.querySelectorAll('.swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    const group = swatch.closest('.panel-swatches');
    if (group) group.querySelectorAll('.swatch').forEach((s) => s.classList.remove('is-active'));
    swatch.classList.add('is-active');
    const label = document.getElementById('panelColorLabel');
    if (label) label.textContent = swatch.dataset.color;
  });
});

const quickViewOverlay = document.getElementById('quickViewOverlay');
const quickViewClose = document.getElementById('quickViewClose');
const qvMedia = document.getElementById('qvMedia');
const qvSku = document.getElementById('qvSku');
const qvName = document.getElementById('qvName');
const qvPrice = document.getElementById('qvPrice');
const qvDesc = document.getElementById('qvDesc');
const qvAddToCart = document.getElementById('qvAddToCart');
let quickViewLastFocus = null;

function openQuickView(btn) {
  if (!quickViewOverlay) return;
  qvSku.textContent = `SKU ${btn.dataset.sku}`;
  qvName.textContent = btn.dataset.name;
  qvPrice.textContent = `$${Number(btn.dataset.price).toFixed(2)}`;
  qvDesc.textContent = btn.dataset.desc;
  qvMedia.style.background = getComputedStyle(btn.closest('.product-card, .product-panel')?.querySelector('.product-media, .hero-art') || btn).backgroundImage;
  qvAddToCart.dataset.name = btn.dataset.name;
  qvAddToCart.dataset.price = btn.dataset.price;
  quickViewLastFocus = document.activeElement;
  quickViewOverlay.classList.add('is-open');
  quickViewClose.focus();
}

function closeQuickView() {
  if (!quickViewOverlay) return;
  quickViewOverlay.classList.remove('is-open');
  if (quickViewLastFocus) quickViewLastFocus.focus();
}

document.querySelectorAll('.quick-view').forEach((btn) => {
  btn.addEventListener('click', () => openQuickView(btn));
});

if (quickViewClose) quickViewClose.addEventListener('click', closeQuickView);
if (quickViewOverlay) {
  quickViewOverlay.addEventListener('click', (e) => {
    if (e.target === quickViewOverlay) closeQuickView();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && quickViewOverlay?.classList.contains('is-open')) closeQuickView();
});
if (qvAddToCart) {
  qvAddToCart.addEventListener('click', () => {
    addToCart(qvAddToCart.dataset.name, qvAddToCart.dataset.price);
    closeQuickView();
  });
}

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletterEmail');
    const error = document.getElementById('newsletterError');
    const success = document.getElementById('newsletterSuccess');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    if (!valid) {
      error.textContent = 'Please enter a valid email address.';
      success.textContent = '';
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    success.textContent = "You're on the list — watch your inbox for early access.";
    newsletterForm.reset();
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const rules = {
    contactName: (v) => v.trim().length >= 2,
    contactEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    contactTopic: (v) => v.trim().length > 0,
    contactMessage: (v) => v.trim().length >= 10,
  };
  const messages = {
    contactName: 'Please enter your full name.',
    contactEmail: 'Please enter a valid email address.',
    contactTopic: 'Please select a topic.',
    contactMessage: 'Message should be at least 10 characters.',
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach((name) => {
      const field = contactForm.elements[name];
      const errorEl = contactForm.querySelector(`[data-error-for="${name}"]`);
      const ok = rules[name](field.value);
      if (!ok) {
        valid = false;
        if (errorEl) errorEl.textContent = messages[name];
        field.setAttribute('aria-invalid', 'true');
      } else {
        if (errorEl) errorEl.textContent = '';
        field.removeAttribute('aria-invalid');
      }
    });

    const success = document.getElementById('contactSuccess');
    if (!valid) {
      if (success) success.textContent = '';
      return;
    }
    if (success) success.textContent = "Message sent — we'll reply within one business day.";
    contactForm.reset();
  });
}
