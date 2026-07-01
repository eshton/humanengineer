---
title: "Photography"
date: 2026-07-01
draft: false
ShowToc: false
ShowBreadCrumbs: false
ShowReadingTime: false
ShowWordCount: false
---

A few photos from travels over the years, alongside the engineering.
All shot on trips around Europe and Asia; a wider set is up on
[Pexels](https://www.pexels.com/hu-hu/@agoston-fung-1165130/). Click a
photo to view it full screen.

<div class="photo-grid">

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-seven-sisters">
  <figure>
    <img src="seven-sisters-england.jpg" alt="Chalk cliffs of the Seven Sisters, Seaford, England">
    <figcaption>Seven Sisters, Seaford, England</figcaption>
  </figure>
</div>

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-winter-lake">
  <figure>
    <img src="winter-lake-hungary.jpg" alt="Frozen lake in winter, Hungary">
    <figcaption>Winter lake, Hungary</figcaption>
  </figure>
</div>

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-krk-beach">
  <figure>
    <img src="krk-beach-croatia.jpg" alt="Beach at Vrbnik, Krk, Croatia">
    <figcaption>Krk, Croatia</figcaption>
  </figure>
</div>

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-balaton">
  <figure>
    <img src="balaton-hungary.jpg" alt="Lake Balaton, Hungary">
    <figcaption>Lake Balaton, Hungary</figcaption>
  </figure>
</div>

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-mountains">
  <figure>
    <img src="mountains-china.jpg" alt="Green terraced mountains, China">
    <figcaption>Terraced mountains, China</figcaption>
  </figure>
</div>

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-koh-samui">
  <figure>
    <img src="koh-samui-thailand.jpg" alt="Beach at Koh Samui, Thailand">
    <figcaption>Koh Samui, Thailand</figcaption>
  </figure>
</div>

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-angkor-wat">
  <figure>
    <img src="angkor-wat-cambodia.jpg" alt="Angkor Wat temple, Siem Reap, Cambodia">
    <figcaption>Angkor Wat, Cambodia</figcaption>
  </figure>
</div>

<div class="photo-grid-item" role="button" tabindex="0" data-lightbox-open="lb-barcelona">
  <figure>
    <img src="barcelona-spain.jpg" alt="Seagull over the beach in Barcelona, Spain">
    <figcaption>Barcelona, Spain</figcaption>
  </figure>
</div>

</div>

<div id="lb-seven-sisters" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="seven-sisters-england.jpg" alt="Chalk cliffs of the Seven Sisters, Seaford, England">
</div>

<div id="lb-winter-lake" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="winter-lake-hungary.jpg" alt="Frozen lake in winter, Hungary">
</div>

<div id="lb-krk-beach" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="krk-beach-croatia.jpg" alt="Beach at Vrbnik, Krk, Croatia">
</div>

<div id="lb-balaton" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="balaton-hungary.jpg" alt="Lake Balaton, Hungary">
</div>

<div id="lb-mountains" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="mountains-china.jpg" alt="Green terraced mountains, China">
</div>

<div id="lb-koh-samui" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="koh-samui-thailand.jpg" alt="Beach at Koh Samui, Thailand">
</div>

<div id="lb-angkor-wat" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="angkor-wat-cambodia.jpg" alt="Angkor Wat temple, Siem Reap, Cambodia">
</div>

<div id="lb-barcelona" class="lightbox" data-lightbox>
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close"></button>
  <img src="barcelona-spain.jpg" alt="Seagull over the beach in Barcelona, Spain">
</div>

<script>
(function () {
  function close(box) {
    box.classList.remove('is-open');
  }
  document.querySelectorAll('[data-lightbox-open]').forEach(function (item) {
    function open() {
      var box = document.getElementById(item.getAttribute('data-lightbox-open'));
      if (box) box.classList.add('is-open');
    }
    item.addEventListener('click', open);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
  document.querySelectorAll('[data-lightbox]').forEach(function (box) {
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.hasAttribute('data-lightbox-close')) {
        close(box);
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lightbox.is-open').forEach(close);
    }
  });
})();
</script>
