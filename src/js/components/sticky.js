document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    let st = 0;
    let triggerStart = 0;
    let rafId = null;

    function sticky() {
        st = window.scrollY;
        triggerStart = document.querySelectorAll('[data-trigger-sticky-start]');

        triggerStart.forEach(function(el) {
            const name = el.getAttribute('data-name');
            const rect = el.getBoundingClientRect();
            const offsetTop = rect.top + st;

            if (st >= offsetTop) {
                const stickyElement = document.querySelector('[data-sticky-element][data-name="' + name + '"]');
                stickyElement.classList.add('on');
            } else {
                const stickyElement = document.querySelector('[data-sticky-element][data-name="' + name + '"]');
                stickyElement.classList.remove('on');
            }
        });

        lastScrollTop = st;
        rafId = null;
    }

    function handleScroll() {
        if (!rafId) {
            rafId = requestAnimationFrame(sticky);
        }
    }

    sticky();
    window.addEventListener('scroll', handleScroll);
});