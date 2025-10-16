import { videos } from "../components/video-init";

$(function () {

    var video = {
        init: function() {
            video.create();
        },
        create: function() {
            const videoEls = document.querySelectorAll('[data-video-element]');
            if (!videoEls.length) return;
            const $videoEls = Array.from(videoEls).map(el => $(el));
            $videoEls.forEach($video => {
                videos.add($video);
            });
            videos.loadApi();
        }
    }

    video.init();

})