const eventDate = new Date('2025-08-13T16:00:00Z');

function updateCountdown() {
  const now = new Date();
  const diff = eventDate - now;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  document.getElementById('countdown').innerHTML = `
    ${d} д : ${h} ч : ${m} м : ${s} с
  `;
}

setInterval(updateCountdown, 1000);
updateCountdown();