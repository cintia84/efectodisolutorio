document.addEventListener('DOMContentLoaded', () => {
    const interactiveGroup = document.querySelector('.interactive-group');
    const displacementMap = document.querySelector('#dissolve-filter feDisplacementMap');
    const bigNoise = document.querySelector('#dissolve-filter feTurbulence[result="bigNoise"]');

    let isAnimating = false;

    function setRandomSeed() {
        const randomSeed = Math.floor(Math.random() * 1000);
        bigNoise.setAttribute('seed', randomSeed);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    const maxDisplacementScale = 300;
    
    interactiveGroup.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        setRandomSeed();
        const duration = 2500;
        const opacityStart = 0.5;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);

            const displacementScale = easedProgress * maxDisplacementScale;
            displacementMap.setAttribute('scale', displacementScale);

            const scaleFactor = 1 + (0.2 * easedProgress);
            interactiveGroup.style.transform = `scale(${scaleFactor})`;
            
            let opacity = 1;
            if (easedProgress > opacityStart) {
                opacity = 1 - (easedProgress - opacityStart) / (1 - opacityStart);
            }
            interactiveGroup.style.opacity = opacity;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    interactiveGroup.style.opacity = 1;
                    interactiveGroup.style.transform = 'scale(1)';
                    displacementMap.setAttribute('scale', 0);
                    isAnimating = false;
                }, 500);
            }
        }
        requestAnimationFrame(animate);
    });
});