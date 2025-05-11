// Configuration Three.js pour le fond de galaxie
let scene, camera, renderer, stars = [], meteors = [];

function initGalaxy() {
    // Création de la scène
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('galaxy-background').appendChild(renderer.domElement);

    // Position de la caméra
    camera.position.z = 5;

    // Création des étoiles
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Création des météores
    createMeteor();
}

function createMeteor() {
    const meteorGeometry = new THREE.BufferGeometry();
    const meteorMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
    });

    const meteorVertices = [];
    const length = 2;
    const angle = Math.PI / 4;
    
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * window.innerWidth;
        const y = (Math.random() - 0.5) * window.innerHeight;
        meteorVertices.push(x, y, 0);
        meteorVertices.push(x - length * Math.cos(angle), y - length * Math.sin(angle), 0);
    }

    meteorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(meteorVertices, 3));
    const meteor = new THREE.LineSegments(meteorGeometry, meteorMaterial);
    scene.add(meteor);
    meteors.push(meteor);

    // Supprimer le météore après l'animation
    setTimeout(() => {
        scene.remove(meteor);
        meteors = meteors.filter(m => m !== meteor);
    }, 2000);

    // Créer un nouveau météore après un délai aléatoire
    setTimeout(createMeteor, Math.random() * 3000 + 1000);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotation des étoiles
    scene.rotation.y += 0.0001;
    scene.rotation.x += 0.0001;

    // Animation des météores
    meteors.forEach(meteor => {
        meteor.position.x -= 2;
        meteor.position.y -= 2;
        meteor.material.opacity -= 0.01;
    });

    renderer.render(scene, camera);
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation du texte 3D
function animateText() {
    const text = document.querySelector('.animated-text');
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 50;
        mouseY = (e.clientY - window.innerHeight / 2) / 50;
        
        gsap.to(text, {
            duration: 0.5,
            rotationY: mouseX,
            rotationX: -mouseY,
            ease: "power2.out"
        });
    });
}

// Animation au défilement
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.5s ease-out';
        observer.observe(section);
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initGalaxy();
    animate();
    animateText();
    initScrollAnimations();
}); 