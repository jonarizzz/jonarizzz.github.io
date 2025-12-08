(function () {

    let scrollTimeout = null;

    // Updates the description card below
    function updateDescCard(text) {
        const card = document.getElementById("cover-desc-card");
        card.textContent = text || "No description available.";
    }

    window.onload = function () {

        var browserPrefix = "";
        if (navigator.userAgent.indexOf('Firefox') != -1) {
            browserPrefix = "-moz-";
        } else if (navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Safari') != -1) {
            browserPrefix = "-webkit-";
        }

        var setTransform3D = function (el, degree, perspective, z, scale = 1) {
            degree = Math.max(Math.min(degree, 90), -90);
            z -= 5;
            el.style["-webkit-perspective"] = el.style["perspective"] = el.style["-moz-perspective"] = perspective + "px";
            el.style["-webkit-transform"] = el.style["transform"] =
                "rotateY(" + degree + "deg) translateZ(" + z + "px) scale(" + scale + ")";
        };

        var displayIndex = function (imgSize, spacing, left, imgs, index, flat, width, labelBox) {

            var mLeft = (width - imgSize) * 0.5 - spacing * (index + 1) - imgSize * 0.5;

            for (var i = 0; i <= index; ++i) {
                imgs[i].style.left = (left + i * spacing + spacing) + "px";
                imgs[i].style.marginLeft = mLeft + "px";
                imgs[i].style["-webkit-filter"] = "brightness(0.65)";
                imgs[i].style.zIndex = i + 1;
                setTransform3D(
                    imgs[i],
                    flat ? 0 : ((index - i) * 10 + 45),
                    300,
                    flat ? -(index - i) * 10 : (-(index - i) * 30 - 20),
                    0.8
                );
            }

            imgs[index].style["-webkit-filter"] = "none";
            imgs[index].style.marginLeft = (mLeft + imgSize * 0.5) + "px";
            imgs[index].style.zIndex = imgs.length;

            if (labelBox) {
                labelBox.style.visibility = "visible";
                labelBox.innerHTML = (imgs[index].dataset.artist || "") + "<br>" + (imgs[index].dataset.info || "");
            }

            updateDescCard(imgs[index].dataset.desc);

            setTransform3D(imgs[index], 0, 0, 5);

            for (var i = index + 1; i < imgs.length; ++i) {
                imgs[i].style.left = (left + i * spacing + spacing) + "px";
                imgs[i].style.marginLeft = (mLeft + imgSize) + "px";
                imgs[i].style["-webkit-filter"] = "brightness(0.7)";
                imgs[i].style.zIndex = imgs.length - i;
                setTransform3D(
                    imgs[i],
                    flat ? 0 : ((index - i) * 10 - 45),
                    300,
                    flat ? (index - i) * 10 : ((index - i) * 30 - 20),
                    0.8
                );
            }
        };

        var coverflowScroll = function (imgSize, spacing, c, imgs, flat, labelBox) {
            var width = parseInt(c.style.width);
            var p = c.scrollLeft / width;
            var index = Math.min(Math.round(p * imgs.length), imgs.length - 1);
            var left = c.scrollLeft;
            c.dataset.index = index;
            displayIndex(imgSize, spacing, left, imgs, index, flat, width, labelBox);
        };

        var initCoverFlow = function (c) {

            var imgSize = parseInt(c.dataset.size) || 64,
                spacing = parseInt(c.dataset.spacing) || 10,
                imgShadow = !((c.dataset.imgshadow == "false") || false),
                bgColor = c.dataset.bgcolor || "transparent",
                flat = (c.dataset.flat == "true") || false,
                width = c.dataset.width,
                index = c.dataset.index,
                imgHeight = 0,
                imgs = [];

            for (var i = 0; i < c.childNodes.length; ++i)
                if (c.childNodes[i].tagName)
                    imgs.push(c.childNodes[i]);

            for (var i = 0; i < imgs.length; ++i) {
                imgs[i].style.position = "absolute";
                imgs[i].style.width = imgSize + "px";
                imgs[i].style.height = "auto";
                imgs[i].style.bottom = "60px";
                if (imgShadow)
                    imgs[i].style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
                imgs[i].style["transition"] = browserPrefix + "transform .4s ease, margin-left .4s ease, -webkit-filter .4s ease";
                imgHeight = Math.max(imgHeight, imgs[i].getBoundingClientRect().height);
            }

            c.style.overflowX = "scroll";
            c.style.backgroundColor = bgColor;

            var labelBox = document.getElementsByClassName("coverflow-label-box")[0];

            setTransform3D(c, 0, 600, 0);

            var placeholding = document.createElement("DIV");
            placeholding.style.width = (width ? width * 2 : (imgSize + (imgs.length + 1) * spacing) * 2) + "px";
            placeholding.style.height = "1px";
            c.appendChild(placeholding);

            if (width)
                c.style.width = width + "px";
            else
                c.style.width = (imgSize + (imgs.length + 1) * spacing) + "px";

            c.style.height = (imgHeight + 80) + "px";
            c.style.position = "relative";
            c.dataset.index = index ? parseInt(index) : 0;

            // --- DRAG & TOUCH TO SCROLL ---
            let isDragging = false;
            let startX, scrollStart;

            const startDrag = (x) => {
                isDragging = true;
                startX = x;
                scrollStart = c.scrollLeft;
            };

            const moveDrag = (x) => {
                if (!isDragging) return;
                const walk = startX - x;
                c.scrollLeft = scrollStart + walk;
                coverflowScroll(imgSize, spacing, c, imgs, flat, labelBox);
            };

            const endDrag = () => {
                isDragging = false;
            };

            // Mouse
            c.addEventListener("mousedown", (e) => {
                startDrag(e.pageX - c.offsetLeft);
                c.style.cursor = 'grabbing';
            });
            c.addEventListener("mousemove", (e) => moveDrag(e.pageX - c.offsetLeft));
            c.addEventListener("mouseup", () => { endDrag(); c.style.cursor = 'grab'; });
            c.addEventListener("mouseleave", () => { endDrag(); c.style.cursor = 'grab'; });

            // Touch
            c.addEventListener("touchstart", (e) => startDrag(e.touches[0].pageX - c.offsetLeft));
            c.addEventListener("touchmove", (e) => { moveDrag(e.touches[0].pageX - c.offsetLeft); e.preventDefault(); });
            c.addEventListener("touchend", endDrag);

            // --- MOUSE WHEEL HORIZONTAL SCROLL ---
            c.addEventListener("wheel", (e) => {
                e.preventDefault();
                c.scrollLeft += e.deltaY * 1.5;
                coverflowScroll(imgSize, spacing, c, imgs, flat, labelBox);
            });

            // --- scroll event ---
            c.addEventListener("scroll", () => {
                if (scrollTimeout) return;
                scrollTimeout = requestAnimationFrame(() => {
                    var delta = Math.abs(c.scrollLeft - (c.dataset.lastScroll || 0));
                    if (delta > 1) {
                        coverflowScroll(imgSize, spacing, c, imgs, flat, labelBox);
                        c.dataset.lastScroll = c.scrollLeft;
                    }
                    scrollTimeout = null;
                });
            });

            // click to select
            imgs.forEach(img => {
                img.addEventListener("click", function () {
                    displayIndex(imgSize, spacing, c.scrollLeft, imgs, imgs.indexOf(this), flat, parseInt(c.style.width), labelBox);
                });
            });

            // Initial description and label
            displayIndex(imgSize, spacing, c.scrollLeft, imgs, +c.dataset.index, flat, parseInt(c.style.width), labelBox);
        };

        var coverflows = document.getElementsByClassName("coverflow");
        for (var i = 0; i < coverflows.length; ++i)
            initCoverFlow(coverflows[i]);
    }

})();