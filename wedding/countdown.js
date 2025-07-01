const countdownElement = document.getElementById("countdown");
const targetDate = new Date("2025-08-13T16:00:00+03:00"); // 13 августа 2025, 16:00 Минск

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownElement.textContent = "Свадьба уже началась!";
    clearInterval(intervalId);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownElement.textContent =
    `${days} Д : ${hours} Ч : ${minutes} М : ${seconds} С`;
}

updateCountdown(); // первый вызов сразу
const intervalId = setInterval(updateCountdown, 1000);
