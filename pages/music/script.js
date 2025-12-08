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
        } else if (navigator.userAgent.indexOf('Chrome') != -1) {
            browserPrefix = "-webkit-";
        } else if (navigator.userAgent.indexOf('Safari') != -1) {
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

            var mLeft = (width - imgSize) * .5 - spacing * (index + 1) - imgSize * .5;

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
                    0.8 // <--- scale down
                );            
            }

            imgs[index].style["-webkit-filter"] = "none";
            imgs[index].style.marginLeft = (mLeft + imgSize * .5) + "px";
            imgs[index].style.zIndex = imgs.length;

            // Show label under the selected album
            if (labelBox) {
                labelBox.style.visibility = "visible";
                labelBox.innerHTML = (imgs[index].dataset.artist || "") + "<br>" + (imgs[index].dataset.info || "");
            }

            // Update description card
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
                    0.8 // <--- side scaling
                );
            }
        };

        var coverflowScroll = function (imgSize, spacing, c, imgs, flat, labelBox) {
            var width = parseInt(c.style.width);
            var p = 1. * c.scrollLeft / width;
            var index = Math.min(Math.floor(p * imgs.length), imgs.length - 1);
            var left = c.scrollLeft;
            c.dataset.index = index;
            displayIndex(imgSize, spacing, left, imgs, index, flat, width, labelBox);
        };

        var initCoverFlow = function (c) {

            var imgSize = parseInt(c.dataset.size) || 64,
                spacing = parseInt(c.dataset.spacing) || 10,
                // shadow = (c.dataset.shadow == "true") || false,
                imgShadow = !((c.dataset.imgshadow == "false") || false),
                bgColor = c.dataset.bgcolor || "transparent",
                flat = (c.dataset.flat == "true") || false,
                width = c.dataset.width,
                index = c.dataset.index,
                imgHeight = 0,
                imgs = [],
                placeholding;

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
            placeholding = document.createElement("DIV");
            placeholding.style.width = (width ? width * 2 : (imgSize + (imgs.length + 1) * spacing) * 2) + "px";
            placeholding.style.height = "1px";
            c.appendChild(placeholding);

            if (width)
                c.style.width = width + "px";
            else
                c.style.width = (width ? width : (imgSize + (imgs.length + 1) * spacing)) + "px";


            c.style.height = (imgHeight + 80) + "px";
            c.style.position = "relative";
            c.dataset.index = index ? parseInt(index) : 0;

            c.onscroll = function () {
                if (scrollTimeout) return;
                scrollTimeout = requestAnimationFrame(() => {
                    coverflowScroll(imgSize, spacing, c, imgs, flat, labelBox);
                    scrollTimeout = null;
                });
            };

            for (var i = 0; i < imgs.length; ++i)
                imgs[i].onclick = function () {
                    displayIndex(imgSize, spacing, c.scrollLeft, imgs, imgs.indexOf(this), flat, parseInt(c.style.width), labelBox);
                }

            // Initial description and label
            displayIndex(imgSize, spacing, c.scrollLeft, imgs, +c.dataset.index, flat, parseInt(c.style.width), labelBox);
        };

        var coverflows = document.getElementsByClassName("coverflow");

        for (var i = 0; i < coverflows.length; ++i)
            initCoverFlow(coverflows[i]);
    }
    
})();