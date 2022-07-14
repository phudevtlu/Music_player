const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
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


const app = {
    currenIndex : 0, 
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs: [
        {
            name: 'Authentic',
            singer: 'Nam Milo',
            path: './assets/music/song1.mp3',
            Image: './assets/img/song1.jpg'
        },
        {
            name: 'Cố Nhân Tình',
            singer: 'Nam Milo',
            path: './assets/music/song2.mp3',
            Image: './assets/img/song2.jpg'
        },
        {
            name: 'Bring Of Soul Back',
            singer: 'Thái Hoàng',
            path: './assets/music/song3.mp3',
            Image: './assets/img/song3.jpg'
        },
        {
            name: 'Ni Nang Bu Nang',
            singer: 'T.Bynz',
            path: './assets/music/song4.mp3',
            Image: './assets/img/song4.jpg'
        },
        {
            name: 'Mày Đang Giấu Cái Gì Đó',
            singer: 'T.Bynz',
            path: './assets/music/song5.mp3',
            Image: './assets/img/song5.jpg'
        },
        {
            name: 'Lạc Chốn Hồng Trần',
            singer: 'Quyền Hải Phòng',
            path: './assets/music/song6.mp3',
            Image: './assets/img/song6.jpg'
        },
        {
            name: 'Fendi ',
            singer: 'T.Bynz ft Huu Dong',
            path: './assets/music/song7.mp3',
            Image: './assets/img/song7.jpg'
        },
        {
            name: 'Deep Sea Ver 2',
            singer: 'T.Bynz ft TanKun',
            path: './assets/music/song8.mp3',
            Image: './assets/img/song8.jpg'
        },
        {
            name: 'CLME',
            singer: 'Andree Right Hand x Hoang Ton x Long Con',
            path: './assets/music/song9.mp3',
            Image: './assets/img/song9.jpg'
        },
        {
            name: 'Bao Lâu Chưa Uống',
            singer: 'Long Con',
            path: './assets/music/song10.mp3',
            Image: './assets/img/song10.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song , index) => {
            return `
            <div class="song ${index === this.currenIndex   ? 'active' : ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.Image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
        </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currenSong', {
            get: function() {
                return this.song[this.currenIndex];
            }
        })
    },
    handleEvent: function () {
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], { 
            duration: 10000, // 10 second
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lí khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi bài hát play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi bài hát dừng
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        } 
        
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
            
        }

        // Xử lí khi tua bài hát
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Xử lý khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandom();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lý khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandom();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        // Xử lí random bật/ tắt random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom); 
        }
        // Xử lí bài hát khi kêt thúc
        audio.onended = function() {
            nextBtn.click();
        }
        // Xử lí lặp lại 1 bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat); 
        }

        // Xử lí next song khi repeat bài hát
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || (e.target.closest('.option')) ){
                // Xử lí khi click vào bài hát
                if(songNode){
                    _this.currenIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }
            }
        }

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 200);
    },
    loadCurrentSong: function () {
        heading.textContent = this.songs[this.currenIndex].name;
        cdThumb.style.backgroundImage = `url(${this.songs[this.currenIndex].Image})`;
        audio.src = this.songs[this.currenIndex].path;  
    },
    nextSong: function () {
        this.currenIndex++;
        if(this.currenIndex >= this.songs.length){
            this.currenIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currenIndex--;
        if(this.currenIndex < 0){
            this.currenIndex = this.songs.length - 1;
        }
        this.loadCurrentSong(); 
    },
    playRandom: function () {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);

        } while(newIndex === this.currenIndex);
        this.currenIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        // Lắng nghe / xử lí các sự kiện (DOM events)
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
}


app.start();

