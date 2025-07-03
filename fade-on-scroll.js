document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.paper-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.25 // регулируй по желанию
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});