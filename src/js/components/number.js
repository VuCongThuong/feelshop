import $ from 'jquery';

$(function() {

    const number = {
        init: function() {
            var num = $("[data-num]");
            var symbol = num.data("symbol");
            if (num.length == 0) return;
            
            check();
            $(window).scroll(function(event) {
                check();
            });

            function check() {
                num.each(function(index, el) {
                    if (
                        $(window).scrollTop() + $(window).outerHeight(true) >=
                        $(this).offset().top
                    ) {
                        counter(
                            $(this),
                            parseInt($(this).data("start")),
                            parseInt($(this).data("end")),
                            parseInt($(this).data("step"))
                        );
                    }
                });
            }

            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }

            function counter(num, start, end, step) {
                if (!num.hasClass("off")) {
                    num.addClass("off");
                    let current = start,
                        range = end - start,
                        increment = end > start ? 1 : -1,
                        step = Math.abs(Math.floor(2000 / range)),
                        timer = setInterval(() => {
                            current += increment;
                            if (symbol) {
                                num.text(numberWithCommas(current));
                            } else {
                                num.text(new Intl.NumberFormat().format(current));
                            }
                            if (current >= end) {
                                if (symbol) {
                                    num.text(numberWithCommas(end));
                                } else {
                                    num.text(new Intl.NumberFormat().format(end));
                                }
                                clearInterval(timer);
                            }
                        }, step);
                }
            }
        }
    };

    number.init();

});