/**
 * BitForge — Three.js 3D Cyber Vault & Dynamic Node Core
 * Interactive 3D wireframe vault + connected blockchain nodes
 */

(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 75;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  // 1. Central 3D BitForge Vault Wireframe (Icosahedron)
  const vaultGeo = new THREE.IcosahedronGeometry(18, 1);
  const vaultMat = new THREE.MeshBasicMaterial({
    color: 0x00e676,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const vaultMesh = new THREE.Mesh(vaultGeo, vaultMat);
  vaultMesh.position.set(24, 0, -10); // positioned subtly behind hero cards
  scene.add(vaultMesh);

  // Inner Core Sphere
  const coreGeo = new THREE.OctahedronGeometry(9, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  vaultMesh.add(coreMesh);

  // 2. Floating Blockchain Nodes
  const NODE_COUNT = 45;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.45, 8, 8);
  const greenPalette = [0x00e676, 0x10b981, 0x00e5ff, 0x34d399];

  for (let i = 0; i < NODE_COUNT; i++) {
    const col = greenPalette[Math.floor(Math.random() * greenPalette.length)];
    const mat = new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: Math.random() * 0.6 + 0.3
    });
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 140,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 60
    );

    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.04,
      (Math.random() - 0.5) * 0.04,
      (Math.random() - 0.5) * 0.02
    );

    nodes.push({ mesh, vel });
    scene.add(mesh);
  }

  // 3. Dynamic Connecting Lines
  const maxLines = 75;
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00e676,
    transparent: true,
    opacity: 0.15
  });
  const lineGeo = new THREE.BufferGeometry();
  const linePos = new Float32Array(maxLines * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSegments);

  // Resize handler
  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth camera mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    camera.position.x = targetX * 0.15;
    camera.position.y = -targetY * 0.15;
    camera.lookAt(scene.position);

    // Vault rotations
    vaultMesh.rotation.x += 0.003;
    vaultMesh.rotation.y += 0.005;
    coreMesh.rotation.x -= 0.006;
    coreMesh.rotation.y -= 0.004;

    // Update nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.mesh.position.add(n.vel);

      if (Math.abs(n.mesh.position.x) > 70) n.vel.x *= -1;
      if (Math.abs(n.mesh.position.y) > 50) n.vel.y *= -1;
      if (Math.abs(n.mesh.position.z) > 30) n.vel.z *= -1;
    }

    // Connect close nodes
    let lineIdx = 0;
    const posAttr = lineGeo.attributes.position;
    for (let i = 0; i < nodes.length && lineIdx < maxLines; i++) {
      for (let j = i + 1; j < nodes.length && lineIdx < maxLines; j++) {
        const d = nodes[i].mesh.position.distanceTo(nodes[j].mesh.position);
        if (d < 22) {
          const idx = lineIdx * 6;
          linePos[idx] = nodes[i].mesh.position.x;
          linePos[idx + 1] = nodes[i].mesh.position.y;
          linePos[idx + 2] = nodes[i].mesh.position.z;
          linePos[idx + 3] = nodes[j].mesh.position.x;
          linePos[idx + 4] = nodes[j].mesh.position.y;
          linePos[idx + 5] = nodes[j].mesh.position.z;
          lineIdx++;
        }
      }
    }

    // Reset remaining unused lines
    for (let i = lineIdx * 6; i < maxLines * 6; i++) {
      linePos[i] = 0;
    }
    posAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
})();
