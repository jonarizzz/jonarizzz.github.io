window.addEventListener("scroll", function() {
    const sidePanel = document.querySelector(".side-panel");
    const scrollThreshold = 100; // Adjust this value as needed
    const minWidthForScrollEffect = 768; // Minimum width for effect to apply

    if (window.innerWidth >= minWidthForScrollEffect) {
        if (window.scrollY > scrollThreshold) {
            sidePanel.style.display = "none";
        } else {
            sidePanel.style.display = "block";
        }
    } else {
        // Reset side panel display in case user resizes from large to small screen
        sidePanel.style.display = "block";
    }
});