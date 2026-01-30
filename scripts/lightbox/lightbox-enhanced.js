document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const galleryImages = document.querySelectorAll(".gallery-image");

    // Lazy loading for gallery images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add("loading");
                    img.onload = () => {
                        img.classList.remove("loading");
                        img.classList.add("loaded");
                    };
                    img.removeAttribute("data-src");
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: "50px"
    });

    // Observe all gallery images
    galleryImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // OPEN LIGHTBOX
    galleryImages.forEach(img => {
        img.addEventListener("click", () => {
            // Get full-size image path (replace _thumb with _full)
            let fullSizeSrc = img.dataset.full || img.src;
            if (fullSizeSrc.includes("_thumb")) {
                fullSizeSrc = fullSizeSrc.replace("_thumb", "_full");
            }

            // Set full-size image source
            lightboxImg.src = fullSizeSrc;
            lightboxImg.alt = img.alt || "";

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
