const cube = document.querySelector('.cube');
let isDragging = false;
let startX, startY;
let rotationX = -20, rotationY = 0;
let idleRotation = true;

// Start rotation on mousedown
document.addEventListener('mousedown', (e) => {
    isDragging = true;
    idleRotation = false; // Stop idle rotation
    startX = e.clientX;
    startY = e.clientY;
});

// Update rotation based on mouse movement
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    rotationY += deltaX * 0.5;
    rotationX -= deltaY * 0.5;

    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    startX = e.clientX;
    startY = e.clientY;
});

// End rotation on mouseup
document.addEventListener('mouseup', () => {
    isDragging = false;
    idleRotation = true; // Resume idle rotation
});

// Idle rotation function
function animateIdleRotation() {
    if (idleRotation && !isDragging) {
        rotationY += 0.5; // Adjust speed of idle rotation
        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }
    requestAnimationFrame(animateIdleRotation);
}

// Start idle rotation
animateIdleRotation();