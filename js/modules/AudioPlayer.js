// class AudioPlayer {
//     constructor(container, data) {
//         this.container = container;
//         this.data = data;
//         this.currentAudio = null;
//         this.visualizer = null;
        
//         this.init();
//     }

//     init() {
//         this.render();
//         this.setupModal();
//     }

//     render() {
//         this.data.forEach(item => {
//             const audioItem = document.createElement('div');
//             audioItem.className = 'audio-item fade-in';
            
//             audioItem.innerHTML = `
//                 <img src="${item.thumbnail}" alt="${item.title}" class="audio-thumbnail">
//                 <div class="audio-duration">${item.duration}</div>
//                 <div class="audio-info">
//                     <h3>${item.title}</h3>
//                     <p>${item.description}</p>
//                 </div>
//             `;
            
//             audioItem.addEventListener('click', () => this.showPlayer(item));
//             this.container.appendChild(audioItem);
//         });
//     }

//     setupModal() {
//         const modal = document.querySelector('.modal');
//         if (!modal) {
//             this.modal = document.createElement('div');
//             this.modal.className = 'modal';
//             this.modal.innerHTML = `
//                 <div class="modal-content">
//                     <span class="modal-close">&times;</span>
//                     <div class="modal-body"></div>
//                 </div>
//             `;
//             document.body.appendChild(this.modal);
//         } else {
//             this.modal = modal;
//         }
//     }

//     showPlayer(item) {

//         console.log('Loading audio:', item.src); // 添加调试日志

//         const audio = new Audio(item.src);
//         audio.onerror = (e) => {
//             console.error(`Failed to load audio: ${item.src}`, e);
//             alert('Failed to load audio file');
//         };


//         if (this.currentAudio) {
//             this.currentAudio.pause();
//         }

//         const modalBody = this.modal.querySelector('.modal-body');
//         modalBody.innerHTML = `
//             <h2>${item.title}</h2>
//             <p>${item.description}</p>
//             <div class="audio-player">
//                 <div class="audio-visualization">
//                     <canvas class="visualization-canvas"></canvas>
//                 </div>
//                 <div class="audio-controls">
//                     <button class="audio-play-btn">
//                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                             <polygon points="5 3 19 12 5 21 5 3"></polygon>
//                         </svg>
//                     </button>
//                     <div class="audio-progress">
//                         <div class="audio-progress-bar"></div>
//                     </div>
//                     <div class="audio-time">0:00</div>
//                     <div class="audio-volume">
//                         <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
//                             <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
//                             <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
//                         </svg>
//                         <div class="volume-slider">
//                             <div class="volume-level"></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;

//         const audio = new Audio(item.src);
//         this.currentAudio = audio;

//         const canvas = modalBody.querySelector('.visualization-canvas');
//         this.visualizer = new AudioVisualizer(canvas, audio);

//         this.setupAudioControls(modalBody, audio);
//         this.modal.classList.add('active');
//     }

//     setupAudioControls(container, audio) {
//         const playBtn = container.querySelector('.audio-play-btn');
//         const progressBar = container.querySelector('.audio-progress-bar');
//         const progress = container.querySelector('.audio-progress');
//         const timeDisplay = container.querySelector('.audio-time');
//         const volumeSlider = container.querySelector('.volume-slider');
//         const volumeLevel = container.querySelector('.volume-level');

//         playBtn.addEventListener('click', () => {
//             if (audio.paused) {
//                 audio.play();
//                 playBtn.innerHTML = `
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                         <rect x="6" y="4" width="4" height="16"></rect>
//                         <rect x="14" y="4" width="4" height="16"></rect>
//                     </svg>
//                 `;
//             } else {
//                 audio.pause();
//                 playBtn.innerHTML = `
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                         <polygon points="5 3 19 12 5 21 5 3"></polygon>
//                     </svg>
//                 `;
//             }
//         });

//         audio.addEventListener('timeupdate', () => {
//             const progress = (audio.currentTime / audio.duration) * 100;
//             progressBar.style.width = `${progress}%`;
//             timeDisplay.textContent = this.formatTime(audio.currentTime);
//         });

//         progress.addEventListener('click', (e) => {
//             const rect = progress.getBoundingClientRect();
//             const pos = (e.clientX - rect.left) / rect.width;
//             audio.currentTime = pos * audio.duration;
//         });

//         volumeSlider.addEventListener('click', (e) => {
//             const rect = volumeSlider.getBoundingClientRect();
//             const volume = (e.clientX - rect.left) / rect.width;
//             audio.volume = Math.max(0, Math.min(1, volume));
//             volumeLevel.style.width = `${volume * 100}%`;
//         });
//     }

//     formatTime(seconds) {
//         const minutes = Math.floor(seconds / 60);
//         seconds = Math.floor(seconds % 60);
//         return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     }
// }

// // 确保类被导出
// window.AudioPlayer = AudioPlayer;



class AudioPlayer {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.currentAudio = null;
        this.visualizer = null;
        this.modal = document.querySelector('.modal') || this.createModal();
        
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
                if (this.currentAudio) {
                    this.currentAudio.pause();
                }
            });
        }
    }

    render() {
        this.data.forEach(item => {
            const audioItem = document.createElement('div');
            audioItem.className = 'audio-item fade-in';
            
            audioItem.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}" class="audio-thumbnail">
                <div class="audio-duration">${item.duration}</div>
                <div class="audio-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            audioItem.addEventListener('click', () => this.showPlayer(item));
            this.container.appendChild(audioItem);
        });
    }

    showPlayer(item) {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <div class="audio-player">
                <div class="audio-visualization">
                    <canvas class="visualization-canvas"></canvas>
                </div>
                <div class="audio-controls">
                    <button class="audio-play-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                    <div class="audio-progress">
                        <div class="audio-progress-bar"></div>
                    </div>
                    <div class="audio-time">0:00</div>
                    <div class="audio-volume">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        <div class="volume-slider">
                            <div class="volume-level"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.currentAudio = new Audio(item.src);
        const canvas = modalBody.querySelector('.visualization-canvas');
        this.visualizer = new AudioVisualizer(canvas, this.currentAudio);

        this.setupAudioControls(modalBody);
        this.modal.classList.add('active');
    }

    setupAudioControls(container) {
        const playBtn = container.querySelector('.audio-play-btn');
        const progressBar = container.querySelector('.audio-progress-bar');
        const progress = container.querySelector('.audio-progress');
        const timeDisplay = container.querySelector('.audio-time');
        const volumeSlider = container.querySelector('.volume-slider');
        const volumeLevel = container.querySelector('.volume-level');

        playBtn.addEventListener('click', () => {
            if (this.currentAudio.paused) {
                this.currentAudio.play();
                playBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                `;
            } else {
                this.currentAudio.pause();
                playBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                `;
            }
        });

        this.currentAudio.addEventListener('timeupdate', () => {
            const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            timeDisplay.textContent = this.formatTime(this.currentAudio.currentTime);
        });

        progress.addEventListener('click', (e) => {
            const rect = progress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.currentAudio.currentTime = pos * this.currentAudio.duration;
        });

        volumeSlider.addEventListener('click', (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            this.currentAudio.volume = volume;
            volumeLevel.style.width = `${volume * 100}%`;
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

window.AudioPlayer = AudioPlayer;