class PopupManager {
 constructor(options = {}) {
   this.options = {
     groupSelector: '[data-toggle-popup-group]',
     triggerSelector: '[data-toggle-popup-element]', 
     contentSelector: '[data-toggle-popup-content]',
     activeClass: 'on',
     closeOthers: true,
     scrollDebounce: 150,
     ...options
   };

   this.popups = document.querySelectorAll(this.options.groupSelector);
   if (!this.popups.length) return;
   
   this.init();
 }

 init() {
   this.popups.forEach(popup => {
     const triggerElement = popup.querySelector(this.options.triggerSelector);
     const contentElement = popup.querySelector(this.options.contentSelector);
     
     // Toggle popup khi click trigger
     triggerElement?.addEventListener('click', (event) => {
       event.stopPropagation();
       this.togglePopup(popup);
     });

     // Ngăn bubble event từ content
     contentElement?.addEventListener('click', (event) => {
       event.stopPropagation();
     });
   });

   // Global events
   this.setupGlobalEvents();
 }

 togglePopup(popup) {
   // Đóng các popup khác nếu closeOthers = true
   if (this.options.closeOthers) {
     this.popups.forEach(p => {
       if (p !== popup && p.classList.contains(this.options.activeClass)) {
         p.classList.remove(this.options.activeClass);
       }
     });
   }
   popup.classList.toggle(this.options.activeClass);
 }

 closePopup(popup) {
   popup.classList.remove(this.options.activeClass);
 }

 closeAllPopups() {
   this.popups.forEach(popup => this.closePopup(popup));
 }

 setupGlobalEvents() {
   // Click outside
   document.addEventListener('click', (event) => {
     this.popups.forEach(popup => {
       if (!popup.contains(event.target)) {
         this.closePopup(popup);
       }
     });
   });

   // ESC key
   document.addEventListener('keydown', (event) => {
     if (event.key === 'Escape') {
       this.closeAllPopups();
     }
   });

   // Scroll
   let scrollTimer;
   window.addEventListener('scroll', () => {
     clearTimeout(scrollTimer);
     scrollTimer = setTimeout(() => {
       this.popups.forEach(popup => {
         if (popup.classList.contains(this.options.activeClass)) {
           this.closePopup(popup);
         }
       });
     }, this.options.scrollDebounce);
   });
 }
}

window.popupManager = new PopupManager();