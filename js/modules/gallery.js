class Gallery {
    constructor(container, data) {
        this.container = container;
        this.data = data;
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
        console.log('Initializing gallery with data:', this.data);
        this.render();
        this.setupModalEvents();
    }
 
    setupModalEvents() {
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.modal.classList.remove('active');
            });
        }
    }
 
    render() {
        this.data.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
            
            const img = new Image();
            img.src = item.src;
            img.alt = item.title;
            img.loading = 'lazy';
 
            // 添加错误处理
            img.onerror = () => {
                console.error(`Failed to load image: ${item.src}`);
                loadingOverlay.innerHTML = '<p>Failed to load image</p>';
            };
            
            galleryItem.innerHTML = `
                <div class="item-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            galleryItem.prepend(img);
            galleryItem.appendChild(loadingOverlay);
            this.container.appendChild(galleryItem);
            
            img.addEventListener('load', () => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => loadingOverlay.remove(), 300);
            });
            
            galleryItem.addEventListener('click', () => this.showModal(item));
        });
    }
 
    showModal(item) {
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <img src="${item.src}" alt="${item.title}" class="modal-image">
            <div class="modal-info">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                ${item.author ? `<p class="modal-author">Created by: ${item.author}</p>` : ''}
            </div>
        `;
        this.modal.classList.add('active');
 
        const modalImage = modalBody.querySelector('.modal-image');
        modalImage.addEventListener('error', () => {
            modalImage.src = './assets/images/error-placeholder.jpg';
            console.error('Failed to load modal image:', item.src);
        });
    }
 
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
 }
 
 window.Gallery = Gallery;