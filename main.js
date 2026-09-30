/* Afristar Consulting: accessible mobile navigation and static-site forms. */
(function () {
  document.body.classList.add('has-motion');

  // Reveal content as it enters view, with a small stagger for sibling cards.
  var revealItems = document.querySelectorAll('main section:not(.hero) .wrap > *');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(function (item, index) {
      item.classList.add('reveal');
      var siblingIndex = item.parentElement.children ? Array.prototype.indexOf.call(item.parentElement.children, item) : index;
      item.style.setProperty('--delay', Math.min(siblingIndex, 4) * 65 + 'ms');
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  // Thin reading-progress line at the top of each page.
  var progress = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--scroll', max > 0 ? String(window.scrollY / max) : '0');
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
        btn.focus();
      }
    });
  }

  document.querySelectorAll('form.js-form').forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (field) { return !field.value.trim(); });
      var email = form.querySelector('input[type="email"]');
      status.hidden = false;
      if (missing.length) {
        status.textContent = 'Please complete the required fields marked *.';
        missing[0].focus();
        return;
      }
      if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
        status.textContent = 'Please enter a valid email address.';
        email.focus();
        return;
      }
      var labels = {name:'Name',organisation:'Organisation',country:'Country',email:'Email',phone:'Phone / WhatsApp',start_date:'Needed by',type:'Request type',roles:'Roles needed',location:'Work locations',message:'Additional details',service:'Service'};
      var grouped = {};
      new FormData(form).forEach(function (value,key) { if (!grouped[key]) grouped[key]=[]; grouped[key].push(value); });
      var body = Object.keys(grouped).map(function (key) { return (labels[key] || key) + ': ' + grouped[key].join(', '); }).join('\n');
      var subject = form.closest('#request') ? 'Website recruitment request' : 'Website enquiry';
      var mailto = 'mailto:support@awtenterprize.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Your email app should open with this message. Review it and press Send to contact Afristar. If it does not open, email support@awtenterprize.com.';
      window.location.href = mailto;
    });
  });
  document.querySelectorAll('.yr').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
