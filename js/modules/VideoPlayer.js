class VideoPlayer {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.modal = document.querySelector('.modal') || this.createModal();
        this.currentVideo = null;
        
        this.init();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    init() {
        this.render();
        this.setupModalEvents();
    }

    setupModalEvents() {
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.modal.classList.remove('active');
                if (this.currentVideo) {
                    this.currentVideo.pause();
                }
            });
        }
    }

    render() {
        this.data.forEach(item => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item fade-in';
            
            videoItem.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}" class="video-thumbnail">
                <div class="video-duration">${item.duration}</div>
                <div class="video-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            videoItem.addEventListener('click', () => this.showPlayer(item));
            this.container.appendChild(videoItem);
        });
    }

    showPlayer(item) {
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="video-player">
                <video src="${item.src}"></video>
                <div class="video-controls">
                    <button class="video-play-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                    <div class="video-progress">
                        <div class="video-progress-bar"></div>
                    </div>
                    <div class="video-time">0:00 / ${item.duration}</div>
                    <div class="video-volume">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        <div class="volume-slider">
                            <div class="volume-level"></div>
                        </div>
                    </div>
                    <div class="video-fullscreen">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="modal-info">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                ${item.author ? `<p class="modal-author">Created by: ${item.author}</p>` : ''}
            </div>
        `;

        const video = modalBody.querySelector('video');
        this.currentVideo = video;
        this.setupVideoControls(modalBody, video);
        this.modal.classList.add('active');
    }

    setupVideoControls(container, video) {
        const playBtn = container.querySelector('.video-play-btn');
        const progressBar = container.querySelector('.video-progress-bar');
        const progress = container.querySelector('.video-progress');
        const timeDisplay = container.querySelector('.video-time');
        const volumeSlider = container.querySelector('.volume-slider');
        const volumeLevel = container.querySelector('.volume-level');
        const fullscreenBtn = container.querySelector('.video-fullscreen');

        playBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                `;
            } else {
                video.pause();
                playBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                `;
            }
        });

        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
            timeDisplay.textContent = `${this.formatTime(video.currentTime)} / ${this.formatTime(video.duration)}`;
        });

        progress.addEventListener('click', (e) => {
            const rect = progress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        });

        volumeSlider.addEventListener('click', (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            video.volume = volume;
            volumeLevel.style.width = `${volume * 100}%`;
        });

        fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                const videoPlayer = container.querySelector('.video-player');
                videoPlayer.requestFullscreen();
            }
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

window.VideoPlayer = VideoPlayer;