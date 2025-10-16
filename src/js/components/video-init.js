$(function () {

    function calcVideoSize(el) {
        const aspectRatio = el.is('[data-aspect-ratio]') ? el.data('aspect-ratio') : 0.5625;
        const { width, height } = el.get(0).getBoundingClientRect();
        const newWidth = height * aspectRatio > width ? width : height * aspectRatio;
        const newHeight = newWidth / aspectRatio;
        return [newWidth, newHeight];
    }

    let _x = 0;

    export class Videos {
        constructor() {
            this.players = [];
            this.queue = [];
        }

        add($video) {
            if (!this.queue.includes($video)) {
                this.queue.push($video);
            }
        }

        loadApi() {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            var self = this;
            window.onYouTubeIframeAPIReady = () => {
                this.queue.forEach(el => self.createVideo(el));
            };
        }

        getAllPlayers() {
            return this.players;
        }

        createVideo($video) {
            var self = this;
            _x += 1;
            const _num = Date.now();
            const prefix = _x + '_' + _num;
            let ele, backgroundPlayer, size, videoEle;
            let videoID = $video.attr("data-id");

            $video.attr('data-prefix', prefix);

            if ($video.data("display-type") == "background") {
                size = calcVideoSize($video);
                $video.find('video').css({
                    width: size[0],
                    height: size[1]
                });

                window.addEventListener('resize', function(event) {
                    size = calcVideoSize($video);
                    $video.find('video').css({
                        width: size[0],
                        height: size[1]
                    });
                });

                if ($video.data("video-type") == "mp4") {
                    ele = $video;
                    videoEle = $video.find('video').get(0);

                    if ($video.is('[data-display-type="background"]')) {
                        if ($video.find('video:visible').is('[data-src]')) {
                            videoEle.src = $video.find('video:visible').data('src');
                            $video.find('video:visible').removeAttr('data-src');
                        } else {
                            window.addEventListener('resize', function(event) {
                                if ($video.find('video:visible').is('[data-src]')) {
                                    videoEle.src = $video.find('video:visible').data('src');
                                    $video.find('video:visible').removeAttr('data-src');
                                }
                            });
                        }
                    }

                    videoEle.addEventListener('loadeddata', function() {
                        ele.addClass('ready');
                        if (videoEle.readyState >= 2) {
                            if ($video.is('[data-autoplay]')) {
                                ele.addClass('playing');
                                videoEle.play().catch((error) => {
                                    fixMobileAutoplayLowerMode(videoEle);
                                });

                                setTimeout(function() {
                                    videoEle.play().catch((error) => {
                                        fixMobileAutoplayLowerMode(videoEle);
                                    });
                                }, 500);

                                $('body').on('click touchstart', function() {
                                    if (!$video.is('[data-trigger-play]')) {
                                        videoEle.play();
                                        $video.attr('data-trigger-play', 'true');
                                    }

                                });

                                videoEle.addEventListener('play', () => {
                                    $video.attr('data-trigger-play', 'true');
                                });
                            }
                        }
                    });

                    var _op = {
                        "key": prefix,
                        "value": videoEle,
                        "videoType": $video.attr("data-video-type")
                    }

                    self.players.push(_op);
                }

                if ($video.data("video-type") == "youtube") {
                    var mute = 0,
                        controls = 1;
                    if ($video.is('[data-autoplay]')) {
                        mute = 1;
                        controls = 0;
                    }

                    ele = $video;

                    var newBGId = videoID + prefix;
                    var videoEleBox = $('<div id="bg-' + newBGId + '"></div>');
                    $video.append(videoEleBox);

                    backgroundPlayer = new YT.Player('bg-' + newBGId, {
                        width: "100%",
                        height: "100%",
                        videoId: videoID,
                        playerVars: {
                            'loop': 1,
                            'autoplay': 0,
                            'controls': controls,
                            'enablejsapi': 1,
                            'playsinline': 1,
                            'rel': 0,
                            'showinfo': 0,
                            'mute': mute,
                            'modestbranding': 1,
                            'playlist': videoID
                        },
                        events: {
                            'onReady': onPlayerReady
                        }
                    });

                    function onPlayerReady(event) {
                        ele.addClass('ready');

                        if ($video.is('[data-autoplay]')) {
                            ele.addClass('playing');
                            backgroundPlayer.playVideo();

                            setTimeout(function() {
                                backgroundPlayer.playVideo();
                            }, 500);
                        }
                    }

                    size = calcVideoSize($video);
                    backgroundPlayer.setSize(size[0], size[1]);
                    window.addEventListener('resize', function(event) {
                        size = calcVideoSize($video);
                        backgroundPlayer.setSize(size[0], size[1]);
                    });

                    var _op = {
                        "key": prefix,
                        "value": backgroundPlayer,
                        "videoType": $video.attr("data-video-type")
                    }

                    self.players.push(_op);
                }

                $video.find('.btn.btn-play, [data-play]').on('click', function(event) {
                    event.preventDefault();
                    for (var i = 0; i < self.players.length; i++) {
                        if (self.players[i].key == $video.attr("data-prefix")) {
                            var videoEleTampBg = self.players[i].value;
                            if (self.players[i].videoType == 'mp4') {
                                videoEleTampBg.play();
                            } else if (self.players[i].videoType == 'youtube') {
                                videoEleTampBg.playVideo();
                            }
                            ele.addClass('playing').addClass('on');
                        }
                    }
                })
            }

            if ($video.data("display-type") === "popup") {
                $video.find('.btn.btn-play, [data-play]').on('click', event => {
                    event.preventDefault();

                    const newId = videoID + prefix;
                    if ($('#popup-' + newId).length === 0) {
                        const $popupVideo = document.createElement('div');
                        $popupVideo.setAttribute('id', `popup-${newId}`);

                        const $popupWrapper = document.createElement('section');
                        $popupWrapper.classList.add('w-video');
                        $popupWrapper.setAttribute('data-popup-video-id', newId);
                        $popupWrapper.setAttribute('data-popup-content', '');

                        const $overlay = document.createElement('span');
                        $overlay.classList.add('overlay');
                        $overlay.setAttribute('data-video-close', '');

                        const $wrap = document.createElement('div');
                        $wrap.classList.add('wrap');

                        const $content = document.createElement('div');
                        $content.setAttribute('data-video-content', '');

                        const $close = document.createElement('a');
                        $close.classList.add('close');
                        $close.setAttribute('href', '#');
                        $close.setAttribute('data-video-close', '');
                        $close.innerHTML = '<span class="icon-close text-blue-100"></span>';

                        $popupWrapper.appendChild($overlay);
                        $wrap.appendChild($content);
                        $wrap.appendChild($close);
                        $popupWrapper.appendChild($wrap);
                        $content.appendChild($popupVideo);
                        document.body.appendChild($popupWrapper);

                        // Create the YT player
                        const popupPlayer = new YT.Player(`popup-${newId}`, {
                            width: "100%",
                            height: "100%",
                            videoId: videoID,
                            playerVars: {
                                'loop': 1,
                                'controls': 1,
                                'enablejsapi': 1,
                                'playsinline': 1,
                                'rel': 0,
                                'showinfo': 0
                            },
                            events: {
                                'onReady': onPlayerReady
                            }
                        });

                        function onPlayerReady(event) {
                            event.target.playVideo();
                        }

                        const op = {
                            "key": prefix,
                            "value": popupPlayer,
                            "videoType": $video.attr("data-video-type")
                        }

                        self.players.push(op);
                    } else {
                        self.players.forEach(player => {
                            if (player.key === prefix) {
                                player.value.playVideo();
                            }
                        });
                    }

                    const $ele = ($video.data("display-type") === "popup") ? $(`[data-popup-video-id="${newId}"]`) : $video;
                    $ele.addClass('playing on');
                    self.closeVideo($ele, prefix);
                    document.body.classList.add('no-scroll');
                });
            }
        }

        closeVideo($ele, prefix) {
            var self = this;
            const $close = $ele.find('[data-video-close]');
            $close.on('click', event => {
                event.preventDefault();
                self.players.forEach(player => {
                    if (player.key === prefix) {
                        player.value.pauseVideo();
                    }
                });
                $ele.removeClass('on');
                document.body.classList.remove('no-scroll');
            });
        }
    }

    export const videos = new Videos();

});