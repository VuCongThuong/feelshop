class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.init();
  }

  init() {
    this.createContainer();
    this.bindEvents();
  }

  createContainer() {
    // Tạo container cho toast nếu chưa có
    this.container = document.querySelector(".toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  show(options = {}) {
    const {
      type = "success",
      title = "Thông báo",
      message = "",
      duration = 4000,
      closable = true,
    } = options;

    const toast = this.createToast(type, title, message, closable, duration);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("toast-show");
    });

    // Start countdown animation if duration > 0
    if (duration > 0) {
      this.startCountdown(toast, duration);

      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }

    return toast;
  }

  createToast(type, title, message, closable, duration) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = this.getIcon(type);

    toast.innerHTML = `
            <div class="toast-wrapper">
                <div class="toast-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="toast-content">
                    <h4 class="toast-title">${title}</h4>
                    ${message ? `<p class="toast-message">${message}</p>` : ""}
                </div>
                ${
                  closable
                    ? '<button class="toast-close" type="button">&times;</button>'
                    : ""
                }
            </div>
            ${
              duration > 0
                ? '<div class="toast-progress"><div class="toast-progress-bar"></div></div>'
                : ""
            }
        `;

    if (closable) {
      const closeBtn = toast.querySelector(".toast-close");
      closeBtn.addEventListener("click", () => {
        this.remove(toast);
      });
    }

    return toast;
  }

  getIcon(type) {
    const icons = {
      success: "fa-regular fa-circle-check text-[#00C033] text-[32px]",
      error: "fa-regular fa-circle-check text-[#DC3545] text-[32px]",
      warning: "fa-regular fa-circle-check",
      info: "fa-fa-regular fa-circle-check",
    };
    return icons[type] || icons.info;
  }

  startCountdown(toast, duration) {
    const progressBar = toast.querySelector(".toast-progress-bar");
    if (!progressBar) return;

    // Reset progress bar
    progressBar.style.width = "100%";
    progressBar.style.transition = "none";

    // Start countdown animation
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${duration}ms linear`;
      progressBar.style.width = "0%";
    });
  }

  remove(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove("toast-show");
    toast.classList.add("toast-hide");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }

  removeAll() {
    this.toasts.forEach((toast) => {
      this.remove(toast);
    });
  }

  bindEvents() {
    // Các sự kiện khác có thể được thêm vào đây nếu cần
  }

  // Phương thức tiện ích để hiển thị các loại toast khác nhau
  success(title, message, duration = 4000) {
    return this.show({ type: "success", title, message, duration });
  }

  error(title, message, duration = 4000) {
    return this.show({ type: "error", title, message, duration });
  }

  warning(title, message, duration = 4000) {
    return this.show({ type: "warning", title, message, duration });
  }

  info(title, message, duration = 4000) {
    return this.show({ type: "info", title, message, duration });
  }
}

// Khởi tạo ToastManager khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  window.toastManager = new ToastManager();
});

export default ToastManager;
