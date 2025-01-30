class AudioVisualizer {
    constructor(canvas, audio) {
        this.canvas = canvas;
        this.audio = audio;
        this.ctx = canvas.getContext('2d');
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(audio);
        
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        this.canvas.width = canvas.offsetWidth;
        this.canvas.height = canvas.offsetHeight;
        
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(23, 23, 23, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for(let i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i] / 2;
            
            const gradient = this.ctx.createLinearGradient(0, 0, 0, barHeight);
            gradient.addColorStop(0, `hsl(${barHeight + 100}, 100%, 50%)`);
            gradient.addColorStop(1, `hsl(${barHeight + 100}, 100%, 20%)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
        
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
}