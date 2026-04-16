// main.js - WebVerse 3D Experience

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    initThreeJS();
    initGSAPAnimations();
});

function initThreeJS() {
    const container = document.getElementById('webgl-container');

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 2;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ==========================================
    // Particles System (The Neural Network)
    // ==========================================
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles over a large volume
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Custom shader material for glowing nodes
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x53ddfc,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    // ==========================================
    // Central Artifact (Obsidian Core)
    // ==========================================
    // Complex geometry (Icosahedron + Wireframe)
    const coreGeometry = new THREE.IcosahedronGeometry(3, 1);

    // Dark, glossy obsidian material
    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);

    // Wireframe glow over the core
    const wireframeGeometry = new THREE.WireframeGeometry(coreGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0xa3a6ff,
        transparent: true,
        opacity: 0.3
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    const coreGroup = new THREE.Group();
    coreGroup.add(coreMesh);
    coreGroup.add(wireframe);

    // Position core behind the main content area (shifted right)
    coreGroup.position.set(5, 0, -5);
    scene.add(coreGroup);

    // ==========================================
    // Lighting
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x131313);
    scene.add(ambientLight);

    // Primary Neon Purple
    const pointLight1 = new THREE.PointLight(0xa3a6ff, 5, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    // Secondary Cyan
    const pointLight2 = new THREE.PointLight(0x53ddfc, 4, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Tertiary Violet
    const pointLight3 = new THREE.PointLight(0xc180ff, 3, 50);
    pointLight3.position.set(-8, 5, 2);
    scene.add(pointLight3);

    // ==========================================
    // Interaction & Animation
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Rotate particles slowly
        particleMesh.rotation.y += 0.001;
        particleMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

        // Rotate and animate Core Artifact
        coreGroup.rotation.y += 0.003;
        coreGroup.rotation.z += 0.002;
        coreGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.5; // Hover effect

        // Pulse lighting
        pointLight1.intensity = 3 + Math.sin(elapsedTime * 2) * 2;

        // Mouse interaction (Parallax)
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 - camera.position.y + 2) * 0.05; // Offset Y to stay above
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // ==========================================
    // Resize Handler
    // ==========================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initGSAPAnimations() {
    // Initial timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Stagger in the HUD elements
    tl.from("nav", {
        y: -50,
        opacity: 0,
        duration: 1.2,
        delay: 0.2
    })
        .from("#hero-section", {
            y: 30,
            opacity: 0,
            duration: 1
        }, "-=0.8")
        .from("#bento-grid > div", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.6");
}