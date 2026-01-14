document.querySelectorAll('.card').forEach(card => {
    const header = card.querySelector('.card-header');
    const parts = Array.from(card.querySelectorAll('.unfold'));

    function updateHeights() {
        const h = header.offsetHeight;
        parts.forEach(el => el.style.setProperty('--open-height', h + 'px'));
    }

    updateHeights();
    window.addEventListener('resize', updateHeights);

    header.onclick = () => {
        const opening = !parts[0].classList.contains('active');
        const start = opening ? 0 : parts.length - 1;
        const step = opening ? 1 : -1;

        function toggleNext(i) {
            if (i < 0 || i >= parts.length) return;

            parts[i].classList.toggle('active');

            parts[i].addEventListener('transitionend', () => {
                toggleNext(i + step);
            }, { once: true });
        }

        toggleNext(start);
    };
});