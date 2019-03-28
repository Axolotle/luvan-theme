// ╭───────────────────────────────────────────────────╮
// │     ╷╭─╴   ╭─┐╷ ╷┌─╮╶┬╴╭─╮   ┌─╮╷  ╭─┐╷ ╷┌─╴┌─╮   │
// │     │╰─╮   ├─┤│ ││ │ │ │ │   ├─╯│  ├─┤╰─┤├─╴├┬╯   │
// │   ╰─╯╶─╯   ╵ ╵╰─╯└─╯╶┴╴╰─╯   ╵  ╰─╴╵ ╵╶─╯╰─╴╵ ╰   │
// ╰───────────────────────────────────────────────────╯

function Player(domNode) {

    this.audio = domNode;
    console.log(this.audio.dataset);

    let container = this.audio.parentNode.parentNode;
    container.classList.add('js');

    let fragment = document.createElement('div');
    fragment.classList.add('player', 'js');

    let left = document.createElement('div');
    this.playBtn = document.createElement('button');
    this.playBtn.setAttribute('tabindex', -1);
    left.appendChild(this.playBtn);
    left.appendChild(container.firstElementChild.firstElementChild);

    let right = document.createElement('div');
    right.classList.add('player-infos');
    let title = document.createElement('p');
    title.innerHTML = '<em>' + container.dataset.title + '</em>';
    let author = document.createElement('p');
    author.innerHTML = 'par <strong>' + container.dataset.author + '</strong>'
    let timer = document.createElement('p');
    this.currentTime = document.createElement('span');
    this.currentTime.textContent = '00:00';
    timer.appendChild(this.currentTime);

    this.trackBar = document.createElement('div');
    this.trackBar.classList.add('track');

    this.trackLoading = document.createElement('div');
    this.trackLoading.classList.add('track-loading');

    this.trackSlider = document.createElement('div');
    this.trackSlider.classList.add('track-progress');

    let trackPlus = document.createElement('div');
    trackPlus.classList.add('line');

    this.trackBar.appendChild(this.trackLoading);
    this.trackBar.appendChild(this.trackSlider);
    this.trackBar.appendChild(trackPlus);


    right.appendChild(title);
    right.appendChild(author);
    right.appendChild(this.trackBar);
    right.appendChild(timer);


    fragment.appendChild(left);
    fragment.appendChild(right);
    fragment.appendChild(this.audio);
    container.parentNode.replaceChild(fragment, container);

    this.buffered = 0;
    this.mouseMove = false;

    this.initListeners();
}
Player.prototype.initListeners = function() {
    var _this = this;

    // init play button listener
    function togglePlayPause() {
        if (_this.audio.paused)
            _this.audio.play();
        else
            _this.audio.pause();
        _this.playBtn.classList.toggle('playing');
    }

    this.playBtn.onclick = togglePlayPause;

    // generic sliders mouse event listener
    function sliderListerner(e, action, graphicUpdate) {
        function removeListeners(e) {
            action(e, true);
            window.removeEventListener("mousemove", action);
            window.removeEventListener("mouseup", removeListeners);
        }
        e.preventDefault();
        action(e);

        window.addEventListener("mousemove", action);
        window.addEventListener("mouseup", removeListeners);
    }

    function getTrackValue(e, update) {
        var trackWidth = this.trackBar.getBoundingClientRect().width;
        var x = Math.round(e.pageX - this.trackBar.getBoundingClientRect().left) - 3;

        var currentTime;
        if (x >= trackWidth) currentTime = this.audio.duration;
        else if (x <= 0) currentTime = 0;
        else currentTime = (x / trackWidth) * this.audio.duration;

        if (update === true) {
            this.mouseMove = false;
            this.audio.currentTime = currentTime;
            this.updateLoading();
        }
        this.updateTrackGraphic(currentTime);
    }

    // init track slider listener
    this.trackBar.onmousedown = function(e) {
        _this.mouseMove = true;
        sliderListerner(e, getTrackValue.bind(_this));
    }

    this.audio.addEventListener('progress', _this.updateLoading.bind(_this));
    this.audio.addEventListener('timeupdate', function() {
        if (!_this.mouseMove) {
            _this.updateTrackGraphic(_this.audio.currentTime);
            _this.updateLoading();
        }
    });
    this.audio.addEventListener('ended', function () {
        this.pause();
    });

};
Player.prototype.updateLoading = function() {

    var length = this.audio.buffered.length;

    if (length > 0) {
        var buffered = this.audio.buffered.end(length-1);
        if (buffered > this.buffered) {
            this.buffered = buffered;
            var percent = (buffered / this.audio.duration) * 100;
            this.trackLoading.style.width = percent + '%';
        }
    }
};
Player.prototype.updateTrackGraphic = function(value) {
    var percent = (value / this.audio.duration) * 100;
    this.trackSlider.style.width = percent + '%';
    this.currentTime.textContent = this.formatTime(value);
};
Player.prototype.formatTime = function(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);

    return min + ':' + ((sec<10) ? ('0' + sec) : sec);
};
