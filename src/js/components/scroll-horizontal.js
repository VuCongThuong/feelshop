import $ from "jquery";

$(function () {
    const scrollHorizontal = {
        init() {
            this.create();
        },
        create() {
            const scrollWrap = $("[data-scroll-horizontal]");

            if (scrollWrap.length === 0) return;

            $(window).on("resize", function (event) {
                contentScrollHorizontal();
                setTimeout(contentScrollHorizontal);
            });

            function contentScrollHorizontal() {
                scrollWrap.each(function (index, el) {
                    const $this = $(this);
                    let width = 0;

                    const contentWrapWidth = $this.find('[data-content]').parent().width();

                    $this.find("[data-item]").each(function (index, el) {
                        width += $(this).outerWidth(true);
                    });

                    if (width <= contentWrapWidth) {
                        $this.removeClass("is-scroll").find("[data-content]").width("auto");
                    } else {
                        $this.addClass("is-scroll").find("[data-content]").width(width + $this.find("[data-item]").length);
                    }
                });
            }

            contentScrollHorizontal();
        },
    };

    const drapHorizontal = {
        init() {
            this.create();
        },
        create() {
            const slider = $("[data-scroll-horizontal] [data-content]");

            slider.each(function () {
                const self = this;
                let isDown = false;
                let startX;
                let scrollLeft;

                self.addEventListener('mousedown', (e) => {
                    isDown = true;
                    self.classList.add('active');
                    startX = e.pageX - self.offsetLeft;
                    scrollLeft = self.scrollLeft;
                });
                self.addEventListener('mouseleave', () => {
                    isDown = false;
                    self.classList.remove('active');
                });
                self.addEventListener('mouseup', () => {
                    isDown = false;
                    self.classList.remove('active');
                    self.classList.remove('mousemove');
                });
                self.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    self.classList.add('mousemove');
                    const x = e.pageX - self.offsetLeft;
                    const walk = (x - startX) * 3;
                    self.scrollLeft = scrollLeft - walk;
                });
            });

            $('[data-horizontal-next]').on('click', function (event) {
                event.preventDefault();
                const name = $(this).data('name');
                const left = $('[data-content][data-name="' + name + '"]').scrollLeft() + 100;
                $('[data-content][data-name="' + name + '"]').scrollLeft(left);
            });

            $('[data-horizontal-prev]').on('click', function (event) {
                event.preventDefault();
                const name = $(this).data('name');
                const left = $('[data-content][data-name="' + name + '"]').scrollLeft() - 100;
                $('[data-content][data-name="' + name + '"]').scrollLeft(left);
            });
        }
    }

    scrollHorizontal.init();
    drapHorizontal.init();
});