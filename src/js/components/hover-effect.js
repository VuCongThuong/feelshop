
document.addEventListener('DOMContentLoaded', function () {
  const hoverContainers = document.querySelectorAll('[data-tmp-hover]');

  const desktopBreakpoint = 1025;

  if (hoverContainers.length === 0) {
    return;
  }

  hoverContainers.forEach(container => {
    const contentElement = container.querySelector('[data-tmp-hover-content]');
    if (!contentElement) {
      return;
    }

    let leaveTimer;
    container.isAnimating = false;

    container.addEventListener('mouseenter', function () {
      if (window.innerWidth < desktopBreakpoint) return;

      clearTimeout(leaveTimer);
      if (container.isAnimating || contentElement.clientHeight > 0) {
        return;
      }
      container.isAnimating = true;
      window.Animation.slideDown(contentElement, () => {
        container.isAnimating = false;
      });
    });

    container.addEventListener('mouseleave', function () {
      if (window.innerWidth < desktopBreakpoint) return;

      leaveTimer = setTimeout(() => {
        if (container.isAnimating || contentElement.clientHeight === 0) {
          return;
        }
        container.isAnimating = true;
        window.Animation.slideUp(contentElement, () => {
          container.isAnimating = false;
        });
      }, 100);
    });
  });

  function handleResize() {
    if (window.innerWidth < desktopBreakpoint) {
      hoverContainers.forEach(container => {
        const contentElement = container.querySelector('[data-tmp-hover-content]');
        if (contentElement) {
          window.Animation.resetStyle(contentElement);
          container.isAnimating = false;
        }
      });
    }
  }

  window.addEventListener('resize', handleResize);

  handleResize();
});