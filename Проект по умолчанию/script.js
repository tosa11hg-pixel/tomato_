(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  /* Мобильное меню */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Появление блоков при прокрутке */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Кнопка «Наверх» */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var updateToTop = function () {
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', updateToTop, { passive: true });
    updateToTop();
  }

  /* Чек-лист с сохранением прогресса */
  var STORAGE_KEY = 'tomato-checklist-v1';
  var boxes = Array.prototype.slice.call(document.querySelectorAll('#checkItems input[type="checkbox"]'));
  var bar = document.getElementById('progressBar');
  var counter = document.getElementById('progressText');
  var done = document.getElementById('doneMessage');
  var reset = document.getElementById('resetChecklist');

  function readSaved() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* приватный режим — просто не сохраняем */
    }
  }

  function refresh() {
    var checked = boxes.filter(function (box) { return box.checked; });
    var total = boxes.length;
    var percent = total ? Math.round(checked.length / total * 100) : 0;
    if (bar) bar.style.width = percent + '%';
    if (counter) counter.textContent = checked.length + ' из ' + total;
    if (done) done.hidden = checked.length !== total;

    var state = {};
    boxes.forEach(function (box) { state[box.dataset.key] = box.checked; });
    save(state);
  }

  if (boxes.length) {
    var saved = readSaved();
    boxes.forEach(function (box) {
      box.checked = Boolean(saved[box.dataset.key]);
      box.addEventListener('change', refresh);
    });
    refresh();
    if (reset) {
      reset.addEventListener('click', function () {
        boxes.forEach(function (box) { box.checked = false; });
        refresh();
      });
    }
  }
})();
