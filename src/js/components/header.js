document.addEventListener("DOMContentLoaded", () => {
  const headerElement = document.querySelector('header');

  if (!headerElement) return;

  let flagSubNav = false,
    flagNav = false;

  const html = document.documentElement;
  const nav = headerElement.querySelector("[data-nav]");
  const hamburger = headerElement.querySelector('[data-hamburger-element]');
  const expandContents = headerElement.querySelector('[data-expand-content]');

  if (!nav || !hamburger) return;

  const header = {
    init() {
      this.controlNav();
      this.stickyNav();
      this.search();
    },
    openNav() {
      html.classList.add('on-nav');
      nav.classList.add('on');
      hamburger.classList.add('on');

      setTimeout(() => {
        hamburger.setAttribute('aria-expanded', 'true');
      }, 300);
    },
    closeNav() {
      let timeout = 0;
      if (html.classList.contains('on-sub-nav')) {
        html.classList.remove('on-sub-nav');
        const expandElements = document.querySelectorAll(`[data-expand-element]`);
        if (expandElements) {
          expandElements.forEach((expandElement) => {
            expandElement.setAttribute('aria-expanded', 'false');
          });
        }

        timeout = 300;
      }

      setTimeout(() => {
        hamburger.classList.remove('on');
        nav.classList.remove('on');

        setTimeout(() => {
          html.classList.remove('on-nav');
          hamburger.setAttribute('aria-expanded', 'false');
        }, 300);
      }, timeout);
    },
    openSubNav(name) {
      const openSubNavs = document.querySelectorAll('[data-expand-element][aria-expanded="true"]');
      openSubNavs.forEach((element) => {
        const openName = element.getAttribute('data-name');
        if (openName !== name) {
          this.closeSubNav(openName);
        }
      });

      const expandElement = document.querySelector(`[data-expand-element][data-name="${name}"]`);
      const expandContent = document.querySelector(`[data-expand-content][data-name="${name}"]`);

      if (!expandElement || !expandContent) return;

      html.classList.add('on-sub-nav');
      expandElement.setAttribute('aria-expanded', 'true');
      expandElement.parentNode?.classList.add('on');
      expandContent.classList.add('on');
      window.Animation.slideDown(expandContent);
    },

    closeSubNav(name) {
      const expandElement = document.querySelector(`[data-expand-element][data-name="${name}"]`);
      const expandContent = document.querySelector(`[data-expand-content][data-name="${name}"]`);

      if (!expandElement || !expandContent) return;

      html.classList.remove('on-sub-nav');
      expandElement.setAttribute('aria-expanded', 'false');
      expandElement.parentNode?.classList.remove('on');
      expandContent.classList.remove('on');
      window.Animation.slideUp(expandContent);
    },
    controlNav() {
      const expandElements = nav.querySelectorAll('[data-expand-element]');
      if (expandElements.length > 0) {
        expandElements.forEach((expandElement) => {
          const name = expandElement.getAttribute('data-name');
          if (!name) return;

          if (window.innerWidth > 1024) {
            let hoverTimeout, removeTimeout;

            const li = expandElement.closest("li");
            if (!li) return;

            const content = li.querySelector("[data-expand-content]");
            if (!content) return;

            expandElement.addEventListener("mouseenter", () => {
              clearTimeout(removeTimeout);
              hoverTimeout = setTimeout(() => {
                li.classList.add("on");
              }, 100);
            });

            expandElement.addEventListener("mouseleave", () => {
              clearTimeout(hoverTimeout);
              removeTimeout = setTimeout(() => {
                if (!content.matches(":hover")) {
                  li.classList.remove("on");
                }
              }, 100);
            });

            content.addEventListener("mouseenter", () => {
              clearTimeout(removeTimeout);
            });

            content.addEventListener("mouseleave", () => {
              removeTimeout = setTimeout(() => {
                if (!expandElement.matches(":hover")) {
                  li.classList.remove("on");
                }
              }, 100);
            });
          } else {
            expandElement.addEventListener('click', (event) => {
              event.preventDefault();
              if (expandElement.getAttribute('aria-expanded') === 'true') {
                this.closeSubNav(name);
              } else {
                this.openSubNav(name);
              }
            });
          }
        });
      }

      const expandContentBacks = headerElement.querySelectorAll('[data-expand-content-back]');
      if (expandContentBacks.length > 0) {
        expandContentBacks.forEach((expandContentBack) => {
          expandContentBack.addEventListener('click', (event) => {
            event.preventDefault();
            const name = expandContentBack.getAttribute('data-name');
            if (!name) return;
            this.closeSubNav(name);
          });
        });
      }

      hamburger.addEventListener('click', () => {
        if (hamburger.getAttribute('aria-expanded') === 'true') {
          this.closeNav();
        } else {
          this.openNav();
        }
      });
    },
    stickyNav() {
      if (!headerElement) return;

      let lastScrollTop = 0;
      let st = 0;
      let triggerStart = 0;
      let rafId = null;

      const sticky = () => {
        st = window.scrollY;
        triggerStart = headerElement.offsetHeight + 400;

        if (st > headerElement.offsetHeight) {
          headerElement.classList.add('trigger-sticky');
        } else {
          headerElement.classList.remove('trigger-sticky');
        }

        if (st > triggerStart) {
          if (st > lastScrollTop) {
            document.body?.classList.remove('scroll-up');
            document.body?.classList.add('scroll-down');
          } else {
            document.body?.classList.add('scroll-up');
            document.body?.classList.remove('scroll-down');
          }

          headerElement.classList.add('trigger-transition');
        } else {
          document.body?.classList.remove('scroll-up', 'scroll-down');
          headerElement.classList.remove('trigger-transition');
        }

        lastScrollTop = st;
        rafId = null;
      };

      const handleScroll = () => {
        if (!rafId) {
          rafId = requestAnimationFrame(sticky);
        }
      };

      sticky();
      window.addEventListener('scroll', handleScroll);
    },
    search() {
      const searchEle = document.querySelector('[data-search-element]');
      if (!searchEle) return;

      searchEle.addEventListener('click', (event) => {
        event.preventDefault();
        document.documentElement.style.setProperty('--header-height', `${headerElement.offsetHeight}px`);
        document.documentElement.style.setProperty('--header-top-height', `${headerElement.querySelector('.header--top').offsetHeight}px`);

        const searchContent = document.querySelector('[data-search-content]');
        if (!searchContent) return;

        if (searchEle.classList.contains('on')) {
          searchEle.classList.remove('on');
          searchContent.classList.remove('on');
        } else {
          searchEle.classList.add('on');
          searchContent.classList.add('on');
          setTimeout(() => {
            const formControl = searchContent.querySelector('.c-form-control');
            formControl?.focus();
          }, 300);
        }
      });

      const searchClose = document.querySelector('[data-search-close]');
      if (searchClose) {
        searchClose.addEventListener('click', (event) => {
          event.preventDefault();
          const searchContent = document.querySelector('[data-search-content]');
          if (!searchContent) return;

          searchEle.classList.remove('on');
          searchContent.classList.remove('on');
        });
      }
    }
  };

  header.init();
});