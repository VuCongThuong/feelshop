// FAQ Accordion functionality
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll("[data-faq-toggle]");

  // Initialize expanded item content height
  const expandedItem = document.querySelector(
    "[data-faq-expanded] [data-faq-content]"
  );
  if (expandedItem) {
    expandedItem.style.maxHeight = expandedItem.scrollHeight + "px";
  }

  faqItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const faqItem = this.closest(".faq-item");
      if (!faqItem) return;

      const faqContainer = faqItem.querySelector(
        "[data-faq-expanded], [data-faq-collapsed]"
      );
      const faqContent = faqItem.querySelector("[data-faq-content]");

      if (!faqContainer || !faqContent) return;

      const isExpanded = faqContainer.hasAttribute("data-faq-expanded");

      // Close all other FAQ items
      document.querySelectorAll(".faq-item").forEach(function (otherItem) {
        if (otherItem !== faqItem) {
          const otherContainer = otherItem.querySelector(
            "[data-faq-expanded], [data-faq-collapsed]"
          );
          const otherContent = otherItem.querySelector("[data-faq-content]");
          const otherIcon = otherItem.querySelector("svg path");

          if (otherContainer && otherContent) {
            otherContainer.removeAttribute("data-faq-expanded");
            otherContainer.setAttribute("data-faq-collapsed", "");
            otherContainer.classList.remove("bg-[#BFFB4F]");
            otherContainer.classList.add("bg-[#F5F5F5]");
            otherContent.style.maxHeight = "0px";

            // Change icon to plus
            if (otherIcon) {
              otherIcon.setAttribute("d", "M12 6v6m0 0v6m0-6h6m-6 0H6");
            }
          }
        }
      });

      const currentIcon = faqItem.querySelector("svg path");

      // Toggle current item
      if (isExpanded) {
        // Collapse
        faqContainer.removeAttribute("data-faq-expanded");
        faqContainer.setAttribute("data-faq-collapsed", "");
        faqContainer.classList.remove("bg-[#BFFB4F]");
        faqContainer.classList.add("bg-[#F5F5F5]");
        faqContent.style.maxHeight = "0px";

        // Change icon to plus
        if (currentIcon) {
          currentIcon.setAttribute("d", "M12 6v6m0 0v6m0-6h6m-6 0H6");
        }
      } else {
        // Expand
        faqContainer.removeAttribute("data-faq-collapsed");
        faqContainer.setAttribute("data-faq-expanded", "");
        faqContainer.classList.remove("bg-[#F5F5F5]");
        faqContainer.classList.add("bg-[#BFFB4F]");

        // Set height to auto temporarily to calculate scroll height
        faqContent.style.maxHeight = "none";
        const height = faqContent.scrollHeight;
        faqContent.style.maxHeight = "0px";

        // Force reflow then set the height
        setTimeout(function () {
          faqContent.style.maxHeight = height + "px";
        }, 10);

        // Change icon to X
        if (currentIcon) {
          currentIcon.setAttribute("d", "M6 18L18 6M6 6l12 12");
        }
      }
    });
  });
});
