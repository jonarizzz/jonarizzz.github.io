let all_books = [];

document.addEventListener("DOMContentLoaded", function () {
    if (Array.isArray(window.BOOKS_DATA)) {
        all_books = window.BOOKS_DATA;
        render();
        return;
    }

    console.error("Books load error: window.BOOKS_DATA is missing");
    show_error();

    const filter = document.getElementById("filter-status");
    if (filter) {
        filter.addEventListener("change", render);
    }
});

function show_error() {
    const root = document.getElementById("books-root");
    if (!root) return;
    root.innerHTML =
        "<div class='text-color-4'>Не удалось загрузить список книг.</div>";
}

function render() {
    const root = document.getElementById("books-root");
    root.innerHTML = "";

    const filter = document.getElementById("filter-status");
    const status_filter = filter ? filter.value : "all";

    const filtered = all_books.filter(function (book) {
        return (
            status_filter === "all" ||
            book.status === status_filter
        );
    });

    const by_year = {};
    const year_order = [];

    filtered.forEach(function (book) {
        if (!by_year[book.year]) {
            by_year[book.year] = [];
            year_order.push(book.year);
        }
        by_year[book.year].push(book);
    });

    year_order.forEach(function (year) {
        root.appendChild(
            render_year_section(year, by_year[year])
        );
    });
}

function render_year_section(year, books) {
    const section = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = year;
    title.className = "font-size-3 text-color-1";
    section.appendChild(title);

    books.forEach(function (book) {
        section.appendChild(render_book(book));
    });

    return section;
}

function render_book(book) {
    const item = document.createElement("div");

    const row = document.createElement("div");
    row.className = "personal-info-item";

    const line = document.createElement("div");
    line.className = "personal-info-item-line";

    const title = document.createElement("div");
    title.className = "book-title";
    title.innerHTML =
        book.title +
        "<br/><div class='text-color-4'>" +
        book.author +
        "</div>" +
        "";

    const meta = document.createElement("div");
    const status = document.createElement("div");
    status.className = "book-meta status-" + book.status;
    status.textContent = status_label(book.status);

    const rating = document.createElement("div");
    rating.className = "book-meta";
    rating.textContent = stars(book.rating);

    meta.appendChild(status);
    meta.appendChild(rating);

    const details = document.createElement("div");
    details.className = "book-details";

    if (book.text) {
        const p = document.createElement("p");
        p.textContent = book.text;
        details.appendChild(p);
    }

    title.addEventListener("click", function () {
        details.classList.toggle("open");
    });

    row.appendChild(line);
    row.appendChild(title);
    row.appendChild(meta);
    item.appendChild(row);
    item.appendChild(details);

    return item;
}

function stars(count) {
    const total = 5;
    const safe = Number.isFinite(count) ? count : 0;
    const filled = Math.max(0, Math.min(total, safe));
    return "★".repeat(filled) + "☆".repeat(total - filled);
}

function status_label(status) {
    if (status === "reading") return "читаю";
    if (status === "finished") return "прочитано";
    if (status === "dropped") return "брошено";
    return "";
}
