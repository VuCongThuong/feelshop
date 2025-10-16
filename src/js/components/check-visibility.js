document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".animation");
    if(elements.length == 0) return;

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle("on", entry.isIntersecting);
            });
        }, { threshold: 0.2 });

        elements.forEach(el => observer.observe(el));
    } else {
        // Fallback nếu không hỗ trợ IntersectionObserver
        const checkVisibility = () => {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                el.classList.toggle("on", inView);
            });
        };

        window.addEventListener("scroll", checkVisibility);
        window.addEventListener("resize", checkVisibility);
        checkVisibility(); // Kiểm tra khi trang load
    }
});