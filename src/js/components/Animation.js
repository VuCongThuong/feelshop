
window.Animation = {
  slideUp(element, callback) {
    element.style.height = element.scrollHeight + "px";
    element.offsetHeight;
    element.style.height = 0;

    const transitionEnded = (event) => {
      if (event.target === element && event.propertyName === "height") {
        element.removeEventListener("transitionend", transitionEnded);
        if (callback) callback();
      }
    };
    element.addEventListener("transitionend", transitionEnded);
  },

  slideDown(element, callback) {
    const height = element.scrollHeight;
    element.style.height = height + "px";

    const transitionEnded = function (event) {
      if (event.target === element && event.propertyName === "height") {
        element.style.height = "auto";
        element.removeEventListener("transitionend", transitionEnded);
        if (callback) callback();
      }
    };
    element.addEventListener("transitionend", transitionEnded);
  },

  resetStyle(element) {
    element.style.height = '';
  }
};