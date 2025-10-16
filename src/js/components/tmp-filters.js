document.addEventListener("DOMContentLoaded", function() {
  const filterContainers = document.querySelectorAll("[data-filters]");
  if (!filterContainers) return;

  const filterPopupElement = document.querySelectorAll("[data-filter-popup-element]");
  filterPopupElement?.forEach((filter) => {
    filter.addEventListener('click', () => {
      filter.classList.toggle('on');
      const name = filter.getAttribute('data-name');

      const content = document.querySelector(`[data-filter-popup-content][data-name="${name}"]`);

      if (content) {
        content.classList.toggle('on');
      }
    });
  });

  const filterPopupClose = document.querySelectorAll("[data-filter-popup-close]");
  filterPopupClose?.forEach((filterClose) => {
    filterClose.addEventListener('click', () => {

      const name = filterClose.getAttribute('data-name');

      const content = document.querySelector(`[data-filter-popup-content][data-name="${name}"]`);
      const element = document.querySelector(`[data-filter-popup-element][data-name="${name}"]`);

      if (content) {
        content.classList.remove('on');
      }

      if (element) {
        element.classList.remove('on');
      }
    });
  });

  const blogTypeButtons = document.querySelectorAll("[data-blog-type]");
  blogTypeButtons?.forEach(button => {
    button.addEventListener("click", () => {
      blogTypeButtons.forEach(btn => btn.classList.remove("on"));
      button.classList.add("on");
      // filterItemsList();
    });
  });
});