import $ from "jquery";

window.openPopup = function (name, options = {}) {
  const popupContent = $('[data-popup-content][data-name="' + name + '"]');
  const popupElement = $('[data-popup-element][data-name="' + name + '"]');

  if (popupContent.length > 0) {
    // Nếu đã mở rồi và không cho phép mở lại -> thoát
    if (popupContent.hasClass("on") && !options.force) {
      return;
    }

    // Đóng trước khi mở mới (nếu cần)
    // $("[data-popup-content].on, [data-popup-element].on").removeClass("on");
    $("html, body").removeClass("no-scroll");

    // Mở popup
    popupContent.addClass("on");
    popupElement.addClass("on");
    $("html, body").addClass("no-scroll");
  }
};

window.closePopup = function (name) {
  const popupContent = $('[data-popup-content][data-name="' + name + '"]');
  const popupElement = $('[data-popup-element][data-name="' + name + '"]');

  // Kiểm tra sự tồn tại của popup trước khi đóng
  if (popupContent.length > 0) {
    // Đóng popup theo thứ tự đúng
    popupContent.removeClass("on");
    popupElement.removeClass("on");
    $("html, body").removeClass("no-scroll");
  }
};

$(function () {
  const popup = {
    init() {
      popup.create();
    },
    create() {
      const popupContent = $("[data-popup-content]");

      if (popupContent.length == 0) return;

      popupContent.addClass("w-transition");

      // Trường hợp click
      $("body").on("click", "[data-popup-element]", function (event) {
        event.preventDefault();
        let name = $(this).data("name");
        // mở popup bằng trigger click
        openPopup(name, { force: true });
      });

      // Trường hợp close
      $("body").on("click", "[data-popup-close]", function (event) {
        event.preventDefault();
        event.stopPropagation(); // Ngăn event bubbling
        let name = $(this).data("name");

        // Kiểm tra name có tồn tại không
        if (name) {
          closePopup(name);
        }
      });

      // Đóng popup khi nhấn ESC
      $(document).on("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) {
          const openPopup = $("[data-popup-content].on");
          if (openPopup.length > 0) {
            const name = openPopup.data("name");
            if (name) {
              closePopup(name);
            }
          }
        }
      });
    },
  };

  popup.init();
});
