/* Qoollege v2 — script (isolated; does not share state with v1) */

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

/* ===== "Where are you at right now?" — single-select highlight ===== */
(function () {
  var opts = document.querySelectorAll('.where-option');
  if (!opts.length) return;
  opts.forEach(function (b) {
    b.addEventListener('click', function () {
      opts.forEach(function (o) { o.classList.remove('active'); });
      b.classList.add('active');
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
