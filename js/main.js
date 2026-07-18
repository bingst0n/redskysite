// Red Sky Sports Academy — shared scripts

// Shared page chrome — header nav, subpage carousel band, CTA band + footer.
// Each lives here ONCE: edit PAGES (or the markup below) and every page updates.
// Must run before the behavior IIFEs below so their querySelectors find the markup.
(function () {
  var PAGES = [
    ['/', 'Home'],
    ['/about/', 'About'],
    ['/staff/', 'Staff'],
    ['/lessons/', 'Lessons'],
    ['/registration/', 'Registration'],
    ['/schedule/', 'Schedule/Rates'],
    ['/donate/', 'Donate'],
    ['/contact-us/', 'Contact Us']
  ];
  var REGISTER = '<a class="btn" href="https://campscui.active.com/orgs/RedSkySportsAcademy?orglink=camps-registration">Register</a>';
  var page = location.pathname.replace(/index\.html$/, '');
  if (page.charAt(page.length - 1) !== '/') page += '/';

  function navLinks() {
    return PAGES.map(function (p) {
      return '<a href="' + p[0] + '"' + (p[0] === page ? ' aria-current="page"' : '') + '>' + p[1] + '</a>';
    }).join('');
  }

  document.body.insertAdjacentHTML('afterbegin',
    '<header class="nav" id="nav">' +
      '<div class="nav-inner">' +
        '<a class="brand" href="/" aria-label="Red Sky Sports Academy — Home">' +
          '<span class="brand-flag" aria-hidden="true">' +
            '<span class="bf-name">Red Sky</span>' +
            '<span class="bf-tag">Sports Academy</span>' +
          '</span>' +
        '</a>' +
        '<nav class="nav-links" aria-label="Main">' + navLinks() + REGISTER + '</nav>' +
        '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>' +
      '<div class="nav-mobile">' + navLinks() + REGISTER + '</div>' +
    '</header>');

  // Subpage banner carousel — pages opt in with <div data-carousel-band></div>
  // (the home page has its own hero carousel inline instead)
  var band = document.querySelector('[data-carousel-band]');
  if (band) {
    band.outerHTML =
      '<div class="carousel-band">' +
        '<img class="band-photo" src="/images/slides/' + band.getAttribute('data-carousel-band') + '.jpg" alt="">' +
      '</div>';
  }

  function footLinks() {
    return PAGES.map(function (p) { return '<a href="' + p[0] + '">' + p[1] + '</a>'; }).join('');
  }

  document.body.insertAdjacentHTML('beforeend',
    '<div class="cta-band">' +
      '<span class="band-label">Summer 2026</span>' + REGISTER +
      '<div class="call"><a href="tel:5082211217">(508) 221-1217</a></div>' +
    '</div>' +
    '<footer class="footer">' +
      '<div class="footer-inner">' +
        '<div class="fbrand">Red Sky Sports Academy<span>The Cape Cod Academy<br>50 Osterville-West Barnstable Rd.<br>Osterville, MA 02655<br>(508) 221-1217</span></div>' +
        '<div class="cols">' +
          '<nav aria-label="Footer"><span class="fhead">Menu</span>' + footLinks() + '</nav>' +
          '<nav aria-label="Social"><span class="fhead">Follow</span>' +
            '<a href="https://www.instagram.com/redskysportsacademy/">Instagram</a>' +
            '<a href="https://www.facebook.com/redskyinfo/">Facebook</a>' +
          '</nav>' +
          '<nav aria-label="Forms"><span class="fhead">Forms</span>' +
            '<a href="/pdfs/Red_Sky_Registration.pdf">Mail-In Registration</a>' +
            '<a href="/pdfs/RedSkyHealthForm.pdf">Health Form</a>' +
            '<a href="/pdfs/Required%20Equipment%20by%20Sport.pdf">Equipment by Sport</a>' +
          '</nav>' +
        '</div>' +
      '</div>' +
      '<div class="fbottom">Red Sky Sports Academy LLC &middot; <a href="tel:5082211217">(508) 221-1217</a> &middot; <a href="mailto:info@redskysportsacademy.com">info@redskysportsacademy.com</a></div>' +
    '</footer>');
})();

// Mobile nav toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    var nav = document.getElementById('nav');
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
})();

// Countdown pill (home hero) — three states for Summer 2026:
// before Opening Day (June 29) show days remaining; in season (through Aug 7)
// show "in session"; after the season hide the pill entirely.
(function () {
  var countEl = document.getElementById('count-days');
  if (!countEl) return;
  var pill = countEl.parentNode;
  var label = countEl.nextElementSibling;
  var now = new Date();
  var days = Math.ceil((new Date(2026, 5, 29) - now) / 86400000);
  if (days > 0) {
    countEl.textContent = String(days).padStart(3, '0');
  } else if (now < new Date(2026, 7, 8)) {
    pill.removeChild(countEl);
    pill.classList.add('nonum');
    label.textContent = 'Summer 2026 is in session!';
  } else {
    pill.style.display = 'none';
  }
})();

// Photo carousels (auto-advance, pause on hover/focus, arrows, counter) —
// the home hero has two: the mobile slideshow and the desktop collage band
(function () {
  var carousels = document.querySelectorAll('.carousel');
  for (var c = 0; c < carousels.length; c++) setup(carousels[c]);

  function setup(carousel) {
  var slides = carousel.querySelectorAll('.carousel-track > *');
  var posEl = carousel.querySelector('.car-pos');
  var n = slides.length;
  if (n === 0) return;

  var i = 0;
  var timer = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(k) {
    slides[i].classList.remove('active');
    i = ((k % n) + n) % n;
    slides[i].classList.add('active');
    if (posEl) posEl.textContent = i + 1;
    // Eagerly decode the next slide so fades never flash empty
    var next = slides[(i + 1) % n];
    var imgs = next.tagName === 'IMG' ? [next] : next.querySelectorAll('img');
    for (var m = 0; m < imgs.length; m++) if (imgs[m].loading === 'lazy') imgs[m].loading = 'eager';
  }

  function start() {
    if (reduced || timer) return;
    timer = setInterval(function () { show(i + 1); }, 4500);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  var prev = carousel.querySelector('.car-btn.prev');
  var next = carousel.querySelector('.car-btn.next');
  if (prev) prev.addEventListener('click', function () { show(i - 1); });
  if (next) next.addEventListener('click', function () { show(i + 1); });

  // Pause/play control (WCAG 2.2.2) — a user pause wins over hover resume
  var userPaused = false;
  var pauseBtn = carousel.querySelector('.car-btn.pause');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', userPaused);
      pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
      pauseBtn.querySelector('.ic-pause').style.display = userPaused ? 'none' : 'block';
      pauseBtn.querySelector('.ic-play').style.display = userPaused ? 'block' : 'none';
      if (userPaused) stop(); else start();
    });
  }

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', function () { if (!userPaused) start(); });
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', function () { if (!userPaused) start(); });
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });

  start();
  }
})();
