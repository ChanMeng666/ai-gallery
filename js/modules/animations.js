class AnimationController {
    constructor() {
        this.initScrollAnimation();
        this.initMouseTrail();
        this.initScrollProgress();
        this.initLoadingScreen();
    }

    initScrollAnimation() {
        const elements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(element => observer.observe(element));
    }

    initMouseTrail() {
        const trails = [];
        const trailCount = 5;

        // Create trail elements
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'mouse-trail';
            document.body.appendChild(trail);
            trails.push({
                element: trail,
                x: 0,
                y: 0,
                alpha: 1 - (i / trailCount)
            });
        }

        // Update trail positions
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateTrails() {
            trails.forEach((trail, index) => {
                const delay = index * 2;
                trail.element.style.left = `${mouseX}px`;
                trail.element.style.top = `${mouseY}px`;
                trail.element.style.opacity = trail.alpha;
            });
            requestAnimationFrame(updateTrails);
        }
        updateTrails();
    }

    initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrolled = window.scrollY;
            
            const progress = scrolled / (documentHeight - windowHeight);
            progressBar.style.transform = `scaleX(${progress})`;
        });
    }

    initLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = '<div class="loading-icon"></div>';
        document.body.appendChild(loadingScreen);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 1000);
                this.animatePageElements();
            }, 500);
        });
    }

    animatePageElements() {
        // Add fade-in class to elements
        const elements = [
            ...document.querySelectorAll('h1, h2, .gallery-item')
        ];

        elements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.animationDelay = `${index * 0.1}s`;
        });
    }
}