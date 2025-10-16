import $ from 'jquery';

$(function() {
    const hover = {
        init() {
            hover.create();
        },
        create() {
            const eleHoverGroup = $('[data-ele-hover-group]');
            if(eleHoverGroup.length == 0) return;

            eleHoverGroup.each(function(index, el) {
                const self = $(this);
                self.find('[data-ele-hover]').on('mouseenter', function(event) {
                    self.addClass('on-focus');
                    $(this).addClass('hover').siblings().removeClass('hover');
                });

                self.find('[data-ele-hover]').on('mouseleave', function(event) {
                    $(this).removeClass('hover');
                });

                self.on('mouseleave', function(event) {
                    self.removeClass('on-focus');
                    self.find('[data-ele-hover]').removeClass('hover');
                });
            });
        }
    };

    hover.init();
});