/* Qoollege v2 — script (isolated; does not share state with v1) */

/* ===== Image strip snap carousel with infinite loop (v1-style) ===== */
(function () {
  var strip = document.getElementById('carouselStrip');
  if (!strip) return;

  var allSlides = strip.querySelectorAll('.strip-image');
  var realSlides = strip.querySelectorAll('.strip-image[data-idx]');
  if (!realSlides.length) return;

  var total = realSlides.length; // 4
  var clonesBefore = 2;
  var current = 0; // index into real slides (0-3)
  var timer = null;
  var isTransitioning = false;
  var activeWidth = 480;
  var inactiveWidth = 280;
  var gap = 16;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getWidths() {
    if (isMobile()) return { active: 280, inactive: 180 };
    return { active: activeWidth, inactive: inactiveWidth };
  }

  function getOffset(slideIndex) {
    var wrapperWidth = strip.parentElement.offsetWidth;
    var w = getWidths();
    var offset = 0;
    for (var i = 0; i < slideIndex; i++) {
      offset += w.inactive + gap;
    }
    // Center the active slide
    offset = offset - (wrapperWidth / 2) + (w.active / 2);
    return -offset;
  }

  function applyPositions(centerSlideIdx) {
    allSlides.forEach(function (s, i) {
      s.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
      var delta = i - centerSlideIdx;
      if (delta === 0) s.classList.add('active');
      else if (delta === -1) s.classList.add('prev');
      else if (delta === 1) s.classList.add('next');
      else if (delta === -2) s.classList.add('far-prev');
      else if (delta === 2) s.classList.add('far-next');
    });
  }

  function activate(realIdx, animate) {
    var slideIdx = realIdx + clonesBefore;
    current = realIdx;

    applyPositions(slideIdx);

    if (animate === false) {
      strip.style.transition = 'none';
    } else {
      strip.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    strip.style.transform = 'translateX(' + getOffset(slideIdx) + 'px)';

    if (animate === false) {
      strip.offsetHeight; // force reflow
      strip.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  }

  function next() {
    if (isTransitioning) return;
    var nextReal = current + 1;

    if (nextReal >= total) {
      isTransitioning = true;
      var cloneIdx = clonesBefore + total;
      applyPositions(cloneIdx);
      strip.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      strip.style.transform = 'translateX(' + getOffset(cloneIdx) + 'px)';

      setTimeout(function () {
        isTransitioning = false;
        activate(0, false);
      }, 620);
    } else {
      activate(nextReal, true);
    }
  }

  function startLoop() {
    timer = setInterval(next, 3000);
  }

  // Click to select
  realSlides.forEach(function (slide, i) {
    slide.addEventListener('click', function () {
      clearInterval(timer);
      activate(i, true);
      startLoop();
    });
  });

  // Suppress all slide transitions on initial load, then enable
  allSlides.forEach(function (s) { s.style.transition = 'none'; });
  activate(0, false);
  // Force reflow, then restore slide transitions
  strip.offsetHeight;
  requestAnimationFrame(function () {
    allSlides.forEach(function (s) { s.style.transition = ''; });
    startLoop();
  });

  window.addEventListener('resize', function () {
    activate(current, false);
  });
})();

/* ===== Testimonials carousel ===== */
(function () {
  var stage = document.getElementById('testimonialStage');
  var dotsWrap = document.getElementById('testimonialDots');
  if (!stage || !dotsWrap) return;

  var testimonials = [
    {
      quote: "I was SO lost before Qoollege. Ollie helped me realize I didn't have to pick between engineering and art — there were programs for both.",
      name: 'Maya R.',
      detail: 'Accepted to Georgia Tech',
      year: "Class of '26"
    },
    {
      quote: "The athlete recruiting tools are unreal. My coach visibility went from zero to getting actual responses from college coaches.",
      name: 'Jordan T.',
      detail: 'D1 Soccer Recruit',
      year: "Class of '26"
    },
    {
      quote: "My parents couldn't help with applications because they didn't go through this system. Qoollege was the guide I needed.",
      name: 'Priya K.',
      detail: 'First-gen, accepted to 7 schools',
      year: "Class of '26"
    },
    {
      quote: "The scholarship matcher found me $12K I never would have applied for. Literally paid for itself 100x over.",
      name: 'Carlos M.',
      detail: 'Full ride to UT Austin',
      year: "Class of '25"
    },
    {
      quote: "I was terrified my community college credits would disappear. The Transfer Navigator showed me exactly which credits UNC would accept before I even applied.",
      name: 'Aisha L.',
      detail: 'CC → UNC Chapel Hill',
      year: "Transfer '26"
    },
    {
      quote: "I picked the wrong school freshman year. Qoollege helped me find where I actually belonged and made the transfer process way less scary.",
      name: 'Derek W.',
      detail: 'Transferred to UC Davis',
      year: "Transfer '25"
    }
  ];

  var slides = testimonials.map(function (t, i) {
    var el = document.createElement('article');
    el.className = 'testimonial' + (i === 0 ? ' active' : '');
    el.innerHTML =
      '<p class="testimonial-quote">“' + t.quote + '”</p>' +
      '<div class="testimonial-foot">' +
        '<div>' +
          '<div class="testimonial-name">' + t.name + '</div>' +
          '<div class="testimonial-detail">' + t.detail + '</div>' +
        '</div>' +
        '<span class="testimonial-year">' + t.year + '</span>' +
      '</div>';
    return el;
  });

  stage.innerHTML = '';
  slides.forEach(function (s) { stage.appendChild(s); });

  var dots = dotsWrap.querySelectorAll('.dot');
  var current = 0;
  var timer = null;
  var INTERVAL = 5000;

  function go(idx) {
    if (idx === current) return;
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      clearInterval(timer);
      go(parseInt(d.dataset.idx, 10));
      start();
    });
  });

  function start() {
    timer = setInterval(function () { go(current + 1); }, INTERVAL);
  }
  start();
})();

/* ===== Stats counter on scroll ===== */
(function () {
  var nums = document.querySelectorAll('.stat-num');
  if (!nums.length || !('IntersectionObserver' in window)) return;

  var done = new WeakSet();
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || done.has(e.target)) return;
      done.add(e.target);
      var el = e.target;
      var final = el.textContent;
      // Extract numeric portion to animate; keep non-numeric (+, /, $, M, etc.) as suffix/prefix
      var m = final.match(/^([^\d]*)([\d,]+)(.*)$/);
      if (!m) return;
      var prefix = m[1];
      var target = parseInt(m[2].replace(/,/g, ''), 10);
      var suffix = m[3];
      if (!target || target < 10) return; // skip "24/7"
      var start = 0;
      var dur = 1200;
      var t0 = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var v = Math.floor(start + (target - start) * eased);
        el.textContent = prefix + v.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  nums.forEach(function (n) { obs.observe(n); });
})();

/* ===== "Where are you at right now?" — single-select + green response card ===== */
(function () {
  var opts = document.querySelectorAll('.where-option');
  if (!opts.length) return;

  var responses = [
    { text: "You're not alone — most students feel that way. Ollie can walk you through the entire process step by step, from building your college list to submitting your apps.", cta: "Get Started – It's Free →" },
    { text: "Nice — you're in the thick of it. Our Essay Genie helps you write standout essays in your voice, and the Task Board keeps every deadline on track.", cta: "Try Essay Genie →" },
    { text: "We've got recruiting coaches, highlight reel editing, coach contact tracking, AND academic counseling — all in one platform. Others charge $13K+ for this.", cta: "Book Free Consultation →" },
    { text: "Our Scholarship Finder matches you to thousands of financial aid opportunities based on your background, identity, and goals. Stack them to cover your full tuition.", cta: "Find Scholarships →" },
    { text: "Whether you're at a school that isn't the right fit or mapping credits from community college — we handle transfer-friendly matching, credit estimates, and counseling.", cta: "Explore Transfer Options →" },
    { text: "That's totally okay. Our Discovery tools help you explore majors, career paths, and programs until something clicks. No pressure, just possibilities.", cta: "Start Exploring →" },
    { text: "Let's make it happen. We'll help you build the strongest application possible — from essay strategy to interview prep to financial aid optimization.", cta: "Build Your Strategy →" },
    { text: "Smart move. We'll map your credits, find transfer-friendly schools that match your goals, and make sure nothing gets lost in the process.", cta: "Map Your Credits →" }
  ];

  var responseBox = document.getElementById('whereResponse');
  var responseText = document.getElementById('whereResponseText');
  var responseCta = document.getElementById('whereCta');

  opts.forEach(function (b) {
    b.addEventListener('click', function () {
      opts.forEach(function (o) { o.classList.remove('active'); });
      b.classList.add('active');

      var idx = parseInt(b.dataset.idx, 10);
      var data = responses[idx] || responses[0];

      if (responseBox) {
        responseBox.classList.add('switching');
        setTimeout(function () {
          responseText.textContent = data.text;
          if (responseCta) responseCta.textContent = data.cta;
          responseBox.style.display = 'flex';
          responseBox.classList.remove('switching');
        }, 220);
      }
    });
  });
})();

/* ===== Pricing card mouse-follow glow (from v1) ===== */
(function () {
  document.querySelectorAll('.pricing-card').forEach(function (card) {
    var glow = card.querySelector('.card-glow');
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      if (glow) {
        glow.style.setProperty('--mouse-x', x + 'px');
        glow.style.setProperty('--mouse-y', y + 'px');
      }
    });
  });
})();

/* ===== Smooth anchor offset for sticky nav ===== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length <= 1) return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
