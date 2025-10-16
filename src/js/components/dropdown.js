import $ from 'jquery';

$(function () {
    const dropdown = {
        init() {
            dropdown.create();
            dropdown.hoverElement();
        },
        create() {
            const dropdownEle = $("[data-dropdown-element]");
            const dropdownGroup = $("[data-dropdown]");
            if (!dropdownEle.length) return;

            dropdownGroup.each(function(index, el) {
                if($(this).hasClass('on')) {
                    $(this).find('[data-dropdown-content]').stop().slideDown(350);
                }            
            });

            dropdownEle.on('click', function(event) {
                
                var _time = 0;
                var _this = $(this);
                var dropdownContent = _this.parents('[data-dropdown]').find('[data-dropdown-content]');

                if(_this.parent().hasClass('on')) {
                    event.preventDefault();
                    _this.parent().removeClass('on');
                    dropdownContent.stop().slideUp(350);
                } else {
                    event.preventDefault();
                    var dropdownCurrent = _this.parents('[data-dropdown-group]').find('[data-dropdown].on');

                    if(dropdownCurrent.length > 0) {
                        _time = 350;
                        dropdownCurrent.removeClass('on');
                        dropdownCurrent.find('[data-dropdown-content]').stop().slideUp(350);
                    }

                    setTimeout(function() {
                        _this.parent().toggleClass('on');
                        dropdownContent.stop().slideToggle(350);
                    }, _time)
                }
                
            });
        },
        hoverElement() {
            const dropdownHover = $('[data-dropdown-hover]');
            if(dropdownHover.length == 0) return;

            dropdownHover.each(function(index, el) {
                const $this = $(this);
                $this.on('mouseenter', function(event) {
                    if($(window).width() > 1024) {
                        $this.find('[data-dropdown-element]').trigger('click');
                    }
                });

                $this.on('mouseleave', function(event) {
                    if($(window).width() > 1024) {
                        if($this.find('[data-dropdown]').hasClass('on')) {
                            $this.find('[data-dropdown-element]').trigger('click');
                        }
                    }
                });            
            });
        }
    };

    dropdown.init();
});