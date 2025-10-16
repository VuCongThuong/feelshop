document.addEventListener('DOMContentLoaded', function () {
  const tabs = {
    init() {
      this.create();
    },
    create() {
      const tabElements = document.querySelectorAll('[data-tab-element]');
      

      if (tabElements.length === 0) return;

      tabElements.forEach(tabElement => {
        tabElement.addEventListener('click', function (event) {
          event.preventDefault();

          const name = tabElement.getAttribute('data-name');

          if (tabElement.hasAttribute('data-wrap')) {
            tabElement.classList.add('on');
            const siblings = tabElement.parentElement.parentElement.querySelectorAll('[data-tab-element]');
            siblings.forEach(sibling => {
              if (sibling !== tabElement) sibling.classList.remove('on');
            });
          } else {
            const siblings = tabElement.parentElement.querySelectorAll('[data-tab-element]');
            siblings.forEach(sibling => sibling.classList.remove('on'));
            tabElement.classList.add('on');
          }

          const tabContent = document.querySelector(`[data-tab-content][data-name="${name}"]`);
          let tabContents = null;

          if(tabContent) {
            tabContents = tabContent.parentNode.querySelectorAll(':scope > [data-tab-content]');

            tabContents.forEach(content => {
              if (content.getAttribute('data-name') === name) {
                content.classList.add('on');
                const slider = window.sliders[name];
                if (slider) {
                  setTimeout(function() {
                    slider.update();
                  }, 50);
                }
              } else {
                content.classList.remove('on');
              }
            });
          } 

          
        });
      });

      const tabSelects = document.querySelectorAll('[data-tab-select]');
      if (tabSelects.length > 0) {
        tabSelects.forEach(select => {
          select.addEventListener('change', function () {
            const selectedName = this.value; 

            const correspondingTab = document.querySelector(`[data-tab-element][data-name="${selectedName}"]`);
            
            if (correspondingTab) {
              correspondingTab.click();
            }
          });
        });
      }
    },
  };

  tabs.init();
});