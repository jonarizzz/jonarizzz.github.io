document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const drawings = document.querySelectorAll(".drawing");

    // OPEN
    drawings.forEach(img => {
        img.addEventListener("click", () => {

            // Set image source first
            lightboxImg.src = img.src;

            // Reset closing state
            lightbox.classList.remove("closing");

            // Ensure it's visible BEFORE animation
            lightbox.style.display = "flex";

            // Next frame: fade in
            requestAnimationFrame(() => {
                lightbox.classList.add("active");
            });

            document.body.classList.add("lb-open");
        });
    });

    // CLOSE HANDLERS
    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeLightbox();
    });

    function closeLightbox() {
        // Start fade-out
        lightbox.classList.remove("active");
        lightbox.classList.add("closing");
        document.body.classList.remove("lb-open");

        // After animation ends (250ms), hide completely
        setTimeout(() => {
            lightbox.style.display = "none";
            lightbox.classList.remove("closing");
            lightboxImg.src = "";
        }, 250);
    }

});