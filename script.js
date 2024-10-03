// Переменные для хранения текстов на разных языках
const translations = {
    ru: {
        name: "Евгений Азарёнок",
        role: "Frontend / Backend Developer",
        email: "Почта",
        telegram: "Телеграм",
    },
    en: {
        name: "Yauheni Azaronak",
        role: "Frontend / Backend Developer",
        email: "Email",
        telegram: "Telegram",
    }
};

// Получаем элементы
const ruBtn = document.getElementById("ru-btn");
const enBtn = document.getElementById("en-btn");

const nameEl = document.getElementById("name");
const roleEl = document.getElementById("role");
const emailLabelEl = document.getElementById("email-label");
const telegramLabelEl = document.getElementById("telegram-label");

// Функция переключения языка
function switchLanguage(language) {
    const text = translations[language];
    nameEl.textContent = text.name;
    roleEl.textContent = text.role;
    emailLabelEl.innerHTML = `${text.email}: <a href="mailto:example@mail.com">example@mail.com</a>`;
    telegramLabelEl.innerHTML = `${text.telegram}: <a href="https://t.me/Azaratos" target="_blank">@Azaratos</a>`;

    // Установка активной кнопки
    if (language === "ru") {
        ruBtn.classList.add("active");
        enBtn.classList.remove("active");
    } else {
        enBtn.classList.add("active");
        ruBtn.classList.remove("active");
    }

    // Сохранение выбранного языка в localStorage
    localStorage.setItem("selectedLanguage", language);
}

// Проверка сохранённого языка при загрузке страницы
const savedLanguage = localStorage.getItem("selectedLanguage") || "ru";
switchLanguage(savedLanguage);

// Обработчики кликов по кнопкам переключения
ruBtn.addEventListener("click", function () {
    switchLanguage("ru");
});

enBtn.addEventListener("click", function () {
    switchLanguage("en");
});