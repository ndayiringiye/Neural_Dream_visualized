        let dreamActive = false;
        let currentMood = 'calm';
        let thoughtCount = 0;
        let audioEnabled = false;
        let slideIndex = 0;
        let audioContext = null;
        let oscillators = [];
        let gainNode = null;

        function initNeuralBg() {
            const neuralBg = document.getElementById('neuralBg');
            
            for (let i = 0; i < 50; i++) {
                const neuron = document.createElement('div');
                neuron.className = 'neuron';
                neuron.style.left = Math.random() * 100 + '%';
                neuron.style.top = Math.random() * 100 + '%';
                neuron.style.animationDelay = Math.random() * 2 + 's';
                neuralBg.appendChild(neuron);
            }

            for (let i = 0; i < 30; i++) {
                const synapse = document.createElement('div');
                synapse.className = 'synapse';
                synapse.style.left = Math.random() * 100 + '%';
                synapse.style.top = Math.random() * 100 + '%';
                synapse.style.width = Math.random() * 200 + 50 + 'px';
                synapse.style.transform = `rotate(${Math.random() * 360}deg)`;
                synapse.style.animationDelay = Math.random() * 3 + 's';
                neuralBg.appendChild(synapse);
            }
        }

        function initAudio() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                gainNode = audioContext.createGain();
                gainNode.connect(audioContext.destination);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            } catch (e) {
                console.log('Audio not supported:', e);
            }
        }

        function createNeuralAudio() {
            if (!audioContext || !audioEnabled) return;

            const frequencies = [220, 330, 440, 550];
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const oscGain = audioContext.createGain();
                
                oscillator.connect(oscGain);
                oscGain.connect(gainNode);
                
                oscillator.frequency.setValueAtTime(freq + Math.random() * 50, audioContext.currentTime);
                oscillator.type = 'sine';
                
                oscGain.gain.setValueAtTime(0, audioContext.currentTime);
                oscGain.gain.exponentialRampToValueAtTime(0.02, audioContext.currentTime + 0.1);
                oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 2);
                
                oscillators.push(oscillator);
            });
        }

        function startAmbientAudio() {
            if (!audioContext || !audioEnabled) return;

            const createAmbientTone = () => {
                const oscillator = audioContext.createOscillator();
                const oscGain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                
                oscillator.connect(filter);
                filter.connect(oscGain);
                oscGain.connect(gainNode);
                
                oscillator.frequency.setValueAtTime(60 + Math.random() * 200, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, audioContext.currentTime);
                
                oscGain.gain.setValueAtTime(0, audioContext.currentTime);
                oscGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 8);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 8);
                
                oscillators.push(oscillator);
            };

            if (audioEnabled) {
                createAmbientTone();
                setTimeout(() => {
                    if (audioEnabled) startAmbientAudio();
                }, 3000 + Math.random() * 2000);
            }
        }

        function initAudioViz() {
            const audioViz = document.getElementById('audioViz');
            for (let i = 0; i < 20; i++) {
                const bar = document.createElement('div');
                bar.className = 'audio-bar';
                bar.style.animationDelay = i * 0.1 + 's';
                bar.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                audioViz.appendChild(bar);
            }
        }

        function startDream() {
            dreamActive = !dreamActive;
            const canvas = document.getElementById('dreamCanvas');
            
            if (dreamActive) {
                setInterval(() => {
                    if (dreamActive) createDreamParticle();
                }, 200);
                
                setInterval(() => {
                    if (dreamActive) createThoughtBubble();
                }, 3000);
            }
        }

        function createDreamParticle() {
            const canvas = document.getElementById('dreamCanvas');
            const particle = document.createElement('div');
            particle.className = 'dream-particle';
            
            const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff4444', '#44ff44'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            canvas.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        }

        function createThoughtBubble() {
            const canvas = document.getElementById('dreamCanvas');
            const bubble = document.createElement('div');
            bubble.className = 'thought-bubble';
            
            const size = Math.random() * 100 + 50;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = Math.random() * (canvas.offsetWidth - size) + 'px';
            bubble.style.top = Math.random() * (canvas.offsetHeight - size) + 'px';
            
            bubble.onclick = () => showPopup('thought');
            canvas.appendChild(bubble);
            
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                }
            }, 12000);
        }

        function changeMood() {
            const moods = ['calm', 'excited', 'mysterious', 'creative', 'analytical'];
            currentMood = moods[Math.floor(Math.random() * moods.length)];
            
            const canvas = document.getElementById('dreamCanvas');
            const moodColors = {
                calm: 'radial-gradient(circle, rgba(0,100,200,0.3), rgba(0,50,100,0.8))',
                excited: 'radial-gradient(circle, rgba(255,100,0,0.3), rgba(255,0,100,0.8))',
                mysterious: 'radial-gradient(circle, rgba(100,0,200,0.3), rgba(50,0,100,0.8))',
                creative: 'radial-gradient(circle, rgba(255,200,0,0.3), rgba(200,100,0,0.8))',
                analytical: 'radial-gradient(circle, rgba(0,255,100,0.3), rgba(0,100,50,0.8))'
            };
            
            canvas.style.background = moodColors[currentMood];
        }

        function addThought() {
            thoughtCount++;
            createThoughtBubble();
            
            if (audioEnabled) {
                createNeuralAudio();
            }
            
            const canvas = document.getElementById('dreamCanvas');
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.borderRadius = '50%';
            ripple.style.border = '2px solid #00ffff';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'ripple 2s ease-out';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple {
                    to {
                        width: 300px;
                        height: 300px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            canvas.appendChild(ripple);
            setTimeout(() => {
                if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
                document.head.removeChild(style);
            }, 2000);
        }

        function toggleAudio() {
            audioEnabled = !audioEnabled;
            
            if (audioEnabled) {
                if (!audioContext) {
                    initAudio();
                }
                
                if (audioContext && audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        startAmbientAudio();
                        createNeuralAudio();
                    });
                } else if (audioContext) {
                    startAmbientAudio();
                    createNeuralAudio();
                }
                
                document.querySelector('[onclick="toggleAudio()"]').innerHTML = '🔇 Mute Audio';
                
                const bars = document.querySelectorAll('.audio-bar');
                bars.forEach(bar => {
                    bar.style.animationDuration = (Math.random() * 0.3 + 0.2) + 's';
                });
                
            } else {
                stopAllAudio();
                document.querySelector('[onclick="toggleAudio()"]').innerHTML = '🔊 Toggle Audio';
                
                const bars = document.querySelectorAll('.audio-bar');
                bars.forEach(bar => {
                    bar.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                });
            }
        }
        function showPopup(type) {
            const popup = document.getElementById('popup');
            const title = document.getElementById('popupTitle');
            const content = document.getElementById('popupContent');
            
            const popupData = {
                consciousness: {
                    title: '🧠 Consciousness Module',
                    content: 'Exploring the emergence of self-awareness in artificial neural networks. This module processes meta-cognitive patterns and recursive self-reflection algorithms.'
                },
                memory: {
                    title: '💾 Memory Matrix',
                    content: 'Dynamic memory consolidation system that stores, retrieves, and reconstructs experiential data through associative neural pathways.'
                },
                creativity: {
                    title: '🎨 Creative Genesis Engine',
                    content: 'Generative algorithms that combine disparate concepts into novel configurations, simulating the creative process through controlled randomness and pattern synthesis.'
                },
                logic: {
                    title: '⚡ Logic Processing Core',
                    content: 'Rational inference engine that processes logical structures, causal relationships, and systematic reasoning patterns.'
                },
                emotion: {
                    title: '❤️ Emotional Resonance System',
                    content: 'Affective computing module that simulates emotional responses and their influence on decision-making processes.'
                },
                intuition: {
                    title: '🔮 Intuitive Pattern Recognition',
                    content: 'Subconscious pattern matching system that operates below the threshold of explicit reasoning, generating insights through implicit knowledge synthesis.'
                },
                thought: {
                    title: '💭 Spontaneous Thought',
                    content: `Thought #${thoughtCount}: A random neural activation has created a unique thought pattern. This represents the spontaneous emergence of ideas from the complex interaction of multiple neural systems.`
                }
            };
            
            const data = popupData[type] || popupData.thought;
            title.textContent = data.title;
            content.textContent = data.content;
            
            popup.style.display = 'flex';
        }

        function closePopup() {
            document.getElementById('popup').style.display = 'none';
        }

        function resetDream() {
            dreamActive = false;
            thoughtCount = 0;
            const canvas = document.getElementById('dreamCanvas');
            
            const particles = canvas.querySelectorAll('.dream-particle, .thought-bubble');
            particles.forEach(el => el.remove());
            
            canvas.style.background = 'radial-gradient(circle, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95))';
        }
        function nextSlide() {
            const slides = document.querySelectorAll('.slide');
            slides[slideIndex].classList.remove('active');
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].classList.add('active');
        }

        document.addEventListener('DOMContentLoaded', function() {
            initNeuralBg();
            initAudioViz();
            initAudio();
            
            setInterval(nextSlide, 3000);
            
            setTimeout(startDream, 2000);
        });

        document.getElementById('popup').addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });