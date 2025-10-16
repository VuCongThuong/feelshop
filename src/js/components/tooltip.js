import "../../scss/snippets/tooltip.scss";

$(function () {
    
    const tooltip = {
        create() {
            const elements = document.querySelectorAll('[data-tooltip-element]');
            if (elements.length === 0) return;

            elements.forEach((element, index) => {
                element.setAttribute('data-tooltip-name', index);
                const tooltipContentWrap = document.createElement('div');
                tooltipContentWrap.classList.add('tooltip-content-wrap');
                tooltipContentWrap.setAttribute('data-tooltip-name', index);

                const tooltipContent = document.createElement('div');
                tooltipContent.classList.add('tooltip-content');
                tooltipContent.innerHTML = element.getAttribute('data-tooltip-title') + element.getAttribute('data-tooltip-copy');

                const tooltipRectangle = document.createElement('span');
                tooltipRectangle.setAttribute('data-rec', '');
                tooltipRectangle.classList.add('tooltip-rec');

                tooltipContentWrap.appendChild(tooltipContent);
                tooltipContentWrap.appendChild(tooltipRectangle);
                document.body.appendChild(tooltipContentWrap);

                tooltipContentWrap.addEventListener('mouseenter', () => {
                    const _tooltip = document.querySelector(`.tooltip[data-tooltip-name="${index}"]`);
                    _tooltip.setAttribute('data-trigger', 'on');
                });

                tooltipContentWrap.addEventListener('mouseleave', () => {
                    if (window.innerWidth > 1024) {
                        const _tooltip = document.querySelector(`.tooltip[data-tooltip-name="${index}"]`);
                        _tooltip.setAttribute('data-trigger', 'off');
                    }
                });

                this.setPosition(element);
                this.addClickTooltip(element);
                this.addHoverTooltip(element);
            });

            document.addEventListener('click', (event) => {
                const tooltipContentWrap = event.target.closest('.tooltip-content-wrap');
                const tooltipElement = event.target.closest('[data-tooltip-element]');
                if (!tooltipContentWrap && !tooltipElement) {
                    const activeTooltip = document.querySelector('.tooltip-content-wrap.on');
                    if (activeTooltip) {
                        activeTooltip.classList.remove('on');
                    }
                }
            });

            window.addEventListener('resize', () => {
                elements.forEach((element, index) => {
                    this.setPosition(element);
                    this.addClickTooltip(element);
                    this.addHoverTooltip(element);
                });
            });
        },

        setPosition(element) {
            const currentWidth = 277;
            const innerWidth = window.innerWidth;
            const name = element.getAttribute('data-tooltip-name');

            let offsetTop = element.getBoundingClientRect().top + window.scrollY - document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).offsetHeight - 16;
            let offsetLeft = element.getBoundingClientRect().left - document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).offsetWidth + element.offsetWidth + 30;
            let offsetRight = innerWidth - (offsetLeft + element.offsetWidth);

            if (offsetLeft + currentWidth > innerWidth) {
                if (offsetRight + currentWidth > innerWidth) {
                    if (offsetLeft >= offsetRight) {
                        document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.top = `${offsetTop}px`;
                        document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.right = '30px';
                        document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.left = 'auto';
                    } else {
                        document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.top = `${offsetTop}px`;
                        document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.left = `${offsetLeft}px`;
                        document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.right = 'auto';

                    }
                } else {
                    document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.top = `${offsetTop}px`;
                    document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.right = `${offsetRight}px`;
                    document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.left = 'auto';
                }
            } else {
                document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.top = `${offsetTop}px`;
                document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.left = `${offsetLeft}px`;
                document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${name}"]`).style.right = 'auto';
            }
        },

        addClickTooltip(element) {
            const tooltipContentWrap = document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${element.getAttribute('data-tooltip-name')}"]`);
            element.addEventListener('click', (event) => {
                event.preventDefault();
                const activeTooltip = $('.tooltip-content-wrap.on');
                if (activeTooltip) {
                    activeTooltip.removeClass('on');
                }
                tooltipContentWrap.classList.add('on');
            });
        },

        addHoverTooltip(element) {
            const tooltipContentWrap = document.querySelector(`.tooltip-content-wrap[data-tooltip-name="${element.getAttribute('data-tooltip-name')}"]`);
            let timeoutId;
            let tooltipVisible = false;

            element.addEventListener('mouseenter', () => {
                const activeTooltip = $('.tooltip-content-wrap.on');
                if (activeTooltip) {
                    activeTooltip.removeClass('on');
                }
                tooltipContentWrap.classList.add('on');
                tooltipVisible = true;

                this.setPosition(element);
            });

            element.addEventListener('mouseleave', () => {
                tooltipVisible = false;
                timeoutId = setTimeout(() => {
                    if (!tooltipVisible) {
                        tooltipContentWrap.classList.remove('on');
                    }
                }, 3000);
            });

            tooltipContentWrap.addEventListener('mouseenter', () => {
                clearTimeout(timeoutId);
            });

            tooltipContentWrap.addEventListener('mouseleave', () => {
                tooltipVisible = false;
                tooltipContentWrap.classList.remove('on');
            });

            
        },
    };

    tooltip.create();

});