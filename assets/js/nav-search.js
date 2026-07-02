import * as params from '@params';

(function () {
  var toggle = document.getElementById('nav-search-toggle');
  var wrap = document.getElementById('nav-search');
  var input = document.getElementById('searchInput');
  var resultsList = document.getElementById('searchResults');
  if (!toggle || !wrap || !input || !resultsList) return;

  var fuseOpts = params.fuseOpts || {};
  var fuse;

  function loadIndex() {
    if (fuse) return;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        fuse = new Fuse(data, {
          isCaseSensitive: fuseOpts.iscasesensitive ?? false,
          shouldSort: fuseOpts.shouldsort ?? true,
          location: fuseOpts.location ?? 0,
          distance: fuseOpts.distance ?? 100,
          threshold: fuseOpts.threshold ?? 0.4,
          minMatchCharLength: fuseOpts.minmatchcharlength ?? 1,
          keys: fuseOpts.keys ?? ['title', 'permalink', 'summary', 'content'],
        });
      }
    };
    xhr.open('GET', '/index.json');
    xhr.send();
  }

  function open() {
    wrap.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    loadIndex();
    setTimeout(function () { input.focus(); }, 0);
  }

  function close() {
    wrap.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    input.value = '';
    resultsList.innerHTML = '';
  }

  toggle.addEventListener('click', function () {
    if (wrap.classList.contains('is-open')) close(); else open();
  });

  document.addEventListener('click', function (e) {
    if (wrap.classList.contains('is-open') && !wrap.contains(e.target)) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && wrap.classList.contains('is-open')) close();
  });

  input.addEventListener('input', function () {
    if (!fuse) return;
    var term = input.value.trim();
    if (!term) {
      resultsList.innerHTML = '';
      return;
    }
    var results = fuse.search(term, { limit: fuseOpts.limit ?? 8 });
    if (!results.length) {
      resultsList.innerHTML = '<li class="search-empty">No results</li>';
      return;
    }
    resultsList.innerHTML = results.map(function (r) {
      return '<li><a href="' + r.item.permalink + '">' + r.item.title + '</a></li>';
    }).join('');
  });
})();
