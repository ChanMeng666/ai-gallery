// document.addEventListener('DOMContentLoaded', () => {
//     // Initialize gallery
//     const galleryContainer = document.querySelector('.gallery-grid');
//     if (galleryContainer) {
//         new Gallery(galleryContainer, galleryData.images);
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    // Initialize gallery
    const galleryContainer = document.querySelector('.gallery-grid');
    if (galleryContainer) {
        new Gallery(galleryContainer, galleryData.images);
    }

    // Initialize animations
    new AnimationController();

    // Initialize smooth scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.2
                });
            }
        });
    });

    // Initialize image gallery
    const imageGallery = document.querySelector('#images .gallery-grid');
    if (imageGallery) {
        new Gallery(imageGallery, galleryData.images);
    }

    // Initialize audio gallery
    const audioGallery = document.querySelector('#music .gallery-grid');
    if (audioGallery) {
        new AudioPlayer(audioGallery, galleryData.music);
    }

    // Initialize video gallery
    const videoGallery = document.querySelector('#videos .gallery-grid');
    if (videoGallery) {
        new VideoPlayer(videoGallery, galleryData.videos);
    }
});