$(function() {

    const selectDropdown = {
        init() {
            selectDropdown.create();
        },
        create() {
            const $selectEle = $('[data-select-element]');
            const $selectContent = $('[data-select-content]');
            if ($selectEle.length === 0) return;

            $selectContent.addClass('w-transition');

            $selectEle.on('click', function(event) {
                event.preventDefault();
                const $parent = $(this).parent();
                $parent.toggleClass('on');
            });

            $selectContent.find('[data-value]').on('click', function(event) {
                event.preventDefault();
                const $this = $(this);
                const value = $this.data('value');
                const text = $this.text();
                $this.addClass('on').siblings().removeClass('on');
                const $selectDropdown = $this.parents('[data-select-dropdown]');
                $selectDropdown.removeClass('on');

                if (value != '') {
                    $(this).parents('[data-select-dropdown]').addClass('w-filled')
                } else {
                    $(this).removeClass('w-filled')
                }

                $selectDropdown.find('[data-select-element] [data-value]').val(value);

                if($this.attr('href')) {
                    window.location.href = $this.attr('href');
                }
            });

            function checkPostion() {
                $('[data-select-dropdown]').each(function(index, el) {
                    const $selectContent = $(el).find('[data-select-content]');
                    const selectContentHeight = $selectContent.outerHeight(true);
                    const $selectElement = $(el).find('[data-select-element]');
                    const offsetTop = $selectElement.offset().top + $selectElement.outerHeight(true);
                    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    const windowHeight = $(window).height();

                    if ((selectContentHeight + offsetTop) > (scrollTop + windowHeight)) {
                        $selectContent.addClass('w-top').removeClass('w-bottom');
                    } else {
                        $selectContent.addClass('w-bottom').removeClass('w-top');
                    }
                });
            }

            checkPostion();

            $(window).on('resize scroll', function(event) {
                checkPostion();
            });
        }
    }

    selectDropdown.init();

});