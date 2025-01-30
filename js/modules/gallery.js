class Gallery {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.modal = document.querySelector('.modal');
        this.init();
    }

    init() {
        this.render();
        this.setupModal();
    }

    render() {
        this.data.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
            
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <div class="item-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            
            galleryItem.appendChild(loadingOverlay);
            this.container.appendChild(galleryItem);
            
            // Handle image load
            const img = galleryItem.querySelector('img');
            img.addEventListener('load', () => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => loadingOverlay.remove(), 300);
            });
            
            // Add click handler
            galleryItem.addEventListener('click', () => this.showModal(item));
        });
    }

    setupModal() {
        if (!this.modal) {
            this.modal = document.createElement('div');
            this.modal.className = 'modal';
            this.modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <div class="modal-body"></div>
                </div>
            `;
            document.body.appendChild(this.modal);
            
            this.modal.querySelector('.modal-close').addEventListener('click', () => {
                this.modal.classList.remove('active');
            });
        }
    }

    showModal(item) {
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <img src="${item.src}" alt="${item.title}" class="modal-image">
            <div class="modal-info">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <p class="modal-author">Created by: ${item.author}</p>
            </div>
        `;
        this.modal.classList.add('active');
    }
}