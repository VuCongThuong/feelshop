document.addEventListener('DOMContentLoaded', function() {
  function createRipple(event) {

    const btn = event.target.closest('[data-btn-effect]');

    if (!btn) {
      return;
    }

    const oldRipple = btn.querySelector(".ripple");
    if (oldRipple) {
      oldRipple.remove();
    }

    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;

    if (event.type === 'pointerdown') {
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
  	} else {
      circle.style.left = `${btn.clientWidth / 2 - radius}px`;
      circle.style.top = `${btn.clientHeight / 2 - radius}px`;
    }

    circle.classList.add("ripple");
    btn.appendChild(circle);
  }

  document.addEventListener('pointerdown', createRipple);
});