// document.addEventListener('DOMContentLoaded', () => {

//     console.log('DOM Content Loaded');

//     // Initialize gallery
//     const galleryContainer = document.querySelector('.gallery-grid');
//     if (galleryContainer) {
//         new Gallery(galleryContainer, galleryData.images);
//     }

//     // Initialize animations
//     new AnimationController();

//     // Initialize smooth scroll
//     const lenis = new Lenis({
//         duration: 1.2,
//         easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
//     });

//     function raf(time) {
//         lenis.raf(time);
//         requestAnimationFrame(raf);
//     }

//     requestAnimationFrame(raf);

//     // Smooth scroll for navigation links
//     document.querySelectorAll('nav a').forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             const target = document.querySelector(link.getAttribute('href'));
//             if (target) {
//                 lenis.scrollTo(target, {
//                     offset: -100,
//                     duration: 1.2
//                 });
//             }
//         });
//     });

//     // Initialize image gallery
//     const imageGallery = document.querySelector('#images .gallery-grid');
//     if (imageGallery) {
//         new Gallery(imageGallery, galleryData.images);
//     }

//     // Initialize audio gallery
//     const audioGallery = document.querySelector('#music .gallery-grid');
//     if (audioGallery) {
//         new AudioPlayer(audioGallery, galleryData.music);
//     }

//     // Initialize video gallery
//     const videoGallery = document.querySelector('#videos .gallery-grid');
//     if (videoGallery) {
//         new VideoPlayer(videoGallery, galleryData.videos);
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    // 初始化画廊功能
    function initializeGalleries() {
        // 图片画廊初始化
        const imageGallery = document.querySelector('[data-type="images"]');
        if (imageGallery) {
            console.log('Initializing image gallery');
            new Gallery(imageGallery, galleryData.images);
        } else {
            console.warn('Image gallery container not found');
        }

        // 音频画廊初始化
        const audioGallery = document.querySelector('[data-type="music"]');
        if (audioGallery && typeof AudioPlayer !== 'undefined') {
            console.log('Initializing audio gallery');
            new AudioPlayer(audioGallery, galleryData.music);
        } else {
            console.warn('Audio gallery container not found or AudioPlayer not defined');
        }

        // 视频画廊初始化
        const videoGallery = document.querySelector('[data-type="videos"]');
        if (videoGallery && typeof VideoPlayer !== 'undefined') {
            console.log('Initializing video gallery');
            new VideoPlayer(videoGallery, galleryData.videos);
        } else {
            console.warn('Video gallery container not found or VideoPlayer not defined');
        }
    }

    // 初始化动画效果
    function initializeAnimations() {
        // 添加页面滚动动画
        const animatedElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => observer.observe(element));

        // 添加滚动进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrolled = window.scrollY;
            
            const progress = Math.min(scrolled / (documentHeight - windowHeight), 1);
            progressBar.style.transform = `scaleX(${progress})`;
        });
    }

    // 初始化加载屏幕
    // function initializeLoadingScreen() {
    //     const loadingScreen = document.createElement('div');
    //     loadingScreen.className = 'loading-screen';
    //     loadingScreen.innerHTML = '<div class="loading-icon"></div>';
    //     document.body.appendChild(loadingScreen);

    //     window.addEventListener('load', () => {
    //         setTimeout(() => {
    //             loadingScreen.classList.add('hidden');
    //             setTimeout(() => loadingScreen.remove(), 1000);
    //         }, 500);
    //     });
    // }


    // 修改后的加载屏幕初始化
    function createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = '<div class="loading-icon"></div>';
        document.body.appendChild(loadingScreen);
        return loadingScreen;
    }

    function removeLoadingScreen(loadingScreen) {
        if (!loadingScreen) return;
        
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 1000);
    }





    // 初始化导航功能
    function initializeNavigation() {
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 错误处理
    function handleErrors() {
        window.addEventListener('error', (e) => {
            console.error('Resource loading error:', e.target);
            if (e.target.tagName === 'IMG') {
                e.target.src = './assets/images/error-placeholder.jpg';
            }
        }, true);
    }

    // // 初始化所有功能
    // function initializeAll() {
    //     try {
    //         console.log('Initializing application...');
    //         initializeLoadingScreen();
    //         initializeGalleries();
    //         initializeAnimations();
    //         initializeNavigation();
    //         handleErrors();
    //         console.log('Application initialized successfully');
    //     } catch (error) {
    //         console.error('Error during initialization:', error);
    //     }
    // }

    // // 启动应用
    // if (document.readyState === 'complete') {
    //     initializeAll();
    // } else {
    //     window.addEventListener('load', initializeAll);
    // }



    // 修改后的主初始化函数
    async function initializeAll() {
        try {
            console.log('Initializing application...');
            
            // 创建加载屏幕
            const loadingScreen = createLoadingScreen();
            
            // 初始化其他功能
            initializeGalleries();
            initializeAnimations();
            initializeNavigation();
            handleErrors();
            
            console.log('Application initialized successfully');

            // 确保所有资源加载完成
            window.addEventListener('load', () => {
                setTimeout(() => {
                    removeLoadingScreen(loadingScreen);
                }, 500);
            });
            
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // 修改启动逻辑
    initializeAll();



});