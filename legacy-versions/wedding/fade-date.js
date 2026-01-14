// fade-date.js

window.addEventListener('scroll', () => {
  const dateElem = document.querySelector('.hero .date');
  if (!dateElem) return;

  const scrollTop = window.scrollY || window.pageYOffset;
  const fadeStart = 0;
  const fadeEnd = 200;

  let opacity = 1;

  if (scrollTop <= fadeStart) {
    opacity = 1;
  } else if (scrollTop >= fadeEnd) {
    opacity = 0;
  } else {
    opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
  }

  dateElem.style.opacity = opacity;
});
