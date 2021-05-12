const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'CYRUS_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const volume = $('.volume');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    setupVolume: 100,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    listRandomSongs: [],
    songs: [],

    getApiListSongs: async function () {
        const response = await fetch('http://localhost:3030/api-songs');
        const myJson = await response.json();
        myJson.forEach((value, index) => {
            this.songs.push(value)
        })
    },

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${
                index === this.currentIndex ? 'active' : ''
            }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        let checkOnMouseAndTouch = true;

        // Rotate CD
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: 'rotate(360deg)' }],
            {
                duration: 10000, // 10 seconds
                iterations: Infinity,
            },
        );

        cdThumbAnimate.pause();

        // Config scroll bar
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // When song is playing
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };

        // When song is not playing
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        // Set progress bar
        audio.ontimeupdate = function () {
            if (this.duration && checkOnMouseAndTouch) {
                const progressPercent = Math.floor(
                    (this.currentTime / this.duration) * 100,
                );
                progress.value = progressPercent;
            }
        };

        // Event mouse on browser
        progress.onmousedown = function () {
            checkOnMouseAndTouch = false;
        };

        // Event mouse on mobile
        progress.ontouchstart = function () {
            checkOnMouseAndTouch = false;
        };

        // Skip time of song
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
            checkOnMouseAndTouch = true;
        };

        // When click next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // When click prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Toggle option random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            this.classList.toggle('active', _this.isRandom);
        };

        // Toggle option repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            this.classList.toggle('active', _this.isRepeat);
        };

        // Song when ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Listen event click on playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');

            if (songNode || e.target.closest('.option')) {
                // When choose song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        };

        // Volume on mobile
        volume.ontouchmove = function (e) {
            _this.setupVolume = e.target.value / 100;
            audio.volume = _this.setupVolume;

            _this.setConfig('volume', _this.setupVolume);
        };

        // Volume on browser
        volume.onmousemove = function (e) {
            _this.setupVolume = e.target.value / 100;
            audio.volume = _this.setupVolume;

            _this.setConfig('volume', _this.setupVolume);
        };
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            });
        }, 300);
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        this.setConfig('songIsPlaying', this.currentIndex);
    },

    loadConfig: function () {
        if (Object.keys(this.config).length !== 0) {
            if (this.config.hasOwnProperty('songIsPlaying'))
                this.currentIndex = this.config.songIsPlaying;

            if (this.config.hasOwnProperty('isRepeat'))
                this.isRepeat = this.config.isRepeat;

            if (this.config.hasOwnProperty('isRandom'))
                this.isRandom = this.config.isRandom;

            if (this.config.hasOwnProperty('volume')) {
                this.setupVolume = this.config.volume;
                audio.volume = this.config.volume;
            }
        }
    },

    nextSong: function () {
        this.currentIndex++;

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let songsIndex = [];

        if (this.listRandomSongs.length === 0) {
            for (let i = 0; i < this.songs.length; i++) {
                songsIndex.push(i);
            }

            this.listRandomSongs = songsIndex.sort(() => {
                return 0.5 - Math.random();
            });
        }

        if (this.listRandomSongs.length > 0) {
            this.currentIndex = this.listRandomSongs.pop();
        }

        this.loadCurrentSong();
    },

    start: async function () {
        await this.getApiListSongs();
        this.loadConfig();
        this.defineProperties(); // Define Props
        this.handleEvents(); // Listen events
        this.loadCurrentSong(); // Load first song when start app
        this.render(); // Render playlist

        volume.value = this.setupVolume * 100;
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
};

app.start();
