import $ from 'jquery';
$(function() {
    var copyElements = document.querySelectorAll('[data-copy-element]');
    if (copyElements.length == 0) return;

    copyElements.forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault();

            var url = window.location.href;

            var tempInput = document.createElement('input');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            var copyContent = this.querySelector('[data-copy-content]');
            copyContent.classList.add('on');

            setTimeout(function() {
                copyContent.classList.remove('on');
            }, 1000);
        });
    });
});