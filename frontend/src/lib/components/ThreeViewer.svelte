<script>
	/**
	 * Visor 3D con Three.js - Animaciones y iluminación realista
	 */
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { meshState, processingParams } from '$lib/stores/appStore';
	
	let container;
	let scene, camera, renderer, mesh, shadowPlane;
	let animationId;
	let basePositions;
	const previewHeight = 4;
	const baseRadius = 1.5;
	let unsubscribeProcessing;
	
	// Iluminación
	let pointLight, ambientLight, shadowLight;
	
	// Animación
	let rotationAngle = 0;
	let transitionStartTime = null;
	let transitionDuration = 300; // ms
	let previousTransitionParams = null;
	
	// Colores de luz
	const lightColorTemp = {
		calida: { color: 0xffc87c, intensity: 1.0 },
		neutra: { color: 0xffffff, intensity: 1.0 },
		fria: { color: 0xb4d7ff, intensity: 1.0 }
	};
	
	onMount(() => {
		initThree();
		animate();
		unsubscribeProcessing = processingParams.subscribe((params) => {
			transitionStartTime = Date.now();
			previousTransitionParams = params;
			refreshPreview(params);
		});
	});
	
	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (renderer) {
			renderer.dispose();
		}
		if (unsubscribeProcessing) {
			unsubscribeProcessing();
		}
	});
	
	function initThree() {
		// Crear escena
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf3f4f6);
		
		// Crear cámara
		camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.set(0, 5, 10);
		camera.lookAt(0, 0, 0);
		
		// Crear renderer con shadows
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowShadow;
		container.appendChild(renderer.domElement);
		
		// Agregar luces realistas
		// Luz ambiente suave
		ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);
		
		// Luz direccional para sombras
		shadowLight = new THREE.DirectionalLight(0xffffff, 0.5);
		shadowLight.position.set(10, 10, 10);
		shadowLight.castShadow = true;
		shadowLight.shadow.mapSize.width = 2048;
		shadowLight.shadow.mapSize.height = 2048;
		shadowLight.shadow.camera.far = 50;
		scene.add(shadowLight);
		
		// Luz puntual interior (lámpara) - inicialmente desactivada
		pointLight = new THREE.PointLight(0xffc87c, 0, 30);
		pointLight.position.set(0, previewHeight / 2, 0);
		pointLight.castShadow = true;
		scene.add(pointLight);
		
		// Crear plano de sombra suave
		createShadowPlane();
		
		// Agregar grilla
		const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
		gridHelper.position.y = -previewHeight / 2 - 0.5;
		scene.add(gridHelper);
		
		// Agregar ejes
		const axesHelper = new THREE.AxesHelper(5);
		scene.add(axesHelper);
		
		// Crear geometría de ejemplo
		createExampleMesh();
		
		// Manejar resize
		window.addEventListener('resize', handleResize);
		
		// Agregar controles de mouse
		container.addEventListener('mousedown', onMouseDown);
		container.addEventListener('wheel', onWheel);
	}
	
	function createShadowPlane() {
		const planeGeom = new THREE.PlaneGeometry(10, 10);
		const planeMat = new THREE.ShadowMaterial({ opacity: 0.3 });
		shadowPlane = new THREE.Mesh(planeGeom, planeMat);
		shadowPlane.rotation.x = -Math.PI / 2;
		shadowPlane.position.y = -previewHeight / 2 - 0.5;
		shadowPlane.receiveShadow = true;
		scene.add(shadowPlane);
	}
	
	function calculateRadialSegments(numFaces) {
		if (!numFaces || numFaces < 3) return 64;
		return Math.max(12, numFaces * 4);
	}

	function createExampleMesh(params = {}) {
		const radialSegments = calculateRadialSegments(params.numFaces);
		const geometry = new THREE.CylinderGeometry(
			baseRadius,
			baseRadius,
			previewHeight,
			radialSegments,
			64,
			false
		);
		basePositions = geometry.attributes.position.array.slice();
		
		// Material translúcido realista para litofanía
		const material = new THREE.MeshStandardMaterial({
			color: 0xf0e6d2, // Color blanco cálido
			emissive: 0x1a1a1a,
			metalness: 0,
			roughness: 0.7,
			side: THREE.FrontSide,
			transparent: true,
			opacity: 0.95,
			flatShading: false
		});

		mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);
	}

	function refreshPreview(params) {
		if (!scene) return;
		if (!mesh) {
			createExampleMesh(params);
		}

		const radialSegments = calculateRadialSegments(params?.numFaces);
		const currentSegments = mesh.geometry.parameters?.radialSegments;
		if (currentSegments !== radialSegments) {
			scene.remove(mesh);
			mesh.geometry.dispose();
			mesh.material.dispose();
			mesh = undefined;
			createExampleMesh(params);
		}

		applyTransforms(params);
	}

	function applyTransforms(params) {
		if (!mesh || !mesh.geometry) return;
		const positions = mesh.geometry.attributes.position;
		if (!basePositions || basePositions.length !== positions.array.length) {
			basePositions = positions.array.slice();
		}

		const torsion = params?.torsionTotal ?? 0;
		const scaleEnd = params?.progressiveScale ?? 1.0;
		const useAdvancedCurve = params?.useScaleCurve ?? false;
		const scaleCurve = useAdvancedCurve ? (params?.scaleCurvePoints || []) : [];

		const degToRad = Math.PI / 180;
		const halfHeight = previewHeight / 2;

		// Función helper para evaluar escala desde la curva
		const evaluateCurve = (t) => {
			if (!scaleCurve.length) return 1.0;
			let prev = scaleCurve[0];
			for (let i = 1; i < scaleCurve.length; i++) {
				const curr = scaleCurve[i];
				if (prev.height <= t && t <= curr.height) {
					if (curr.height === prev.height) return prev.scale;
					const s = (t - prev.height) / (curr.height - prev.height);
					return prev.scale + s * (curr.scale - prev.scale);
				}
				prev = curr;
			}
			return scaleCurve[scaleCurve.length - 1].scale;
		};

		for (let i = 0; i < positions.count; i++) {
			const bx = basePositions[i * 3];
			const by = basePositions[i * 3 + 1];
			const bz = basePositions[i * 3 + 2];

			const t = (by + halfHeight) / previewHeight;
			let scale = 1 + (scaleEnd - 1) * t;
			if (useAdvancedCurve) {
				scale *= evaluateCurve(t);
			}

			const twistAngle = (torsion * degToRad) * t;
			const cosA = Math.cos(twistAngle);
			const sinA = Math.sin(twistAngle);
			const xr = bx * cosA - bz * sinA;
			const zr = bx * sinA + bz * cosA;

			positions.setXYZ(i, xr * scale, by, zr * scale);
		}

		positions.needsUpdate = true;
		mesh.geometry.computeVertexNormals();
	}
	
	function animate() {
		animationId = requestAnimationFrame(animate);
		
		// Obtener parámetros actuales para rotación y luz
		processingParams.subscribe((params) => {
			if (params.autoRotate && mesh) {
				rotationAngle += (params.rotationSpeed || 1.0) * 0.005;
				mesh.rotation.y = rotationAngle;
			}
			
			// Actualizar iluminación según modo lámpara
			if (params.lampMode) {
				const lightConfig = lightColorTemp[params.lightColor || 'neutra'];
				pointLight.color.setHex(lightConfig.color);
				pointLight.intensity = (params.lightIntensity || 1.0) * 1.5;
			} else {
				pointLight.intensity = 0;
			}
			
			// Transición suave de color ambiental si lampMode está activo
			if (params.lampMode) {
				const factor = (params.lightIntensity || 1.0) * 0.3;
				const lightConfig = lightColorTemp[params.lightColor || 'neutra'];
				const tempColor = new THREE.Color(lightConfig.color);
				ambientLight.color.lerp(tempColor, factor * 0.2);
				ambientLight.intensity = Math.max(0.2, 0.4 - factor * 0.1);
			} else {
				ambientLight.color.setHex(0xffffff);
				ambientLight.intensity = 0.4;
			}
		})();
		
		renderer.render(scene, camera);
	}
	
	function handleResize() {
		if (!container || !camera || !renderer) return;
		
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	}
	
	let isDragging = false;
	let previousMousePosition = { x: 0, y: 0 };
	
	function onMouseDown(e) {
		isDragging = true;
		previousMousePosition = { x: e.clientX, y: e.clientY };
		
		const onMouseMove = (e) => {
			if (!isDragging) return;
			
			const deltaX = e.clientX - previousMousePosition.x;
			const deltaY = e.clientY - previousMousePosition.y;
			
			// Rotar cámara alrededor del origen
			const speed = 0.005;
			camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * speed);
			camera.position.applyAxisAngle(
				new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion),
				deltaY * speed
			);
			camera.lookAt(0, 0, 0);
			
			previousMousePosition = { x: e.clientX, y: e.clientY };
		};
		
		const onMouseUp = () => {
			isDragging = false;
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};
		
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}
	
	function onWheel(e) {
		e.preventDefault();
		const delta = e.deltaY * 0.01;
		const direction = new THREE.Vector3();
		camera.getWorldDirection(direction);
		camera.position.add(direction.multiplyScalar(-delta));
	}
</script>

<div class="card">
	<h2 class="text-xl font-bold mb-4">3. Vista Previa 3D</h2>
	
	<div 
		bind:this={container}
		class="w-full h-96 rounded-lg overflow-hidden bg-gray-100"
	></div>
	
	{#if $meshState.meshId}
		<div class="mt-4 grid grid-cols-3 gap-4 text-sm">
			<div class="text-center">
				<p class="text-gray-600">Vértices</p>
				<p class="font-bold text-lg">{$meshState.vertexCount.toLocaleString()}</p>
			</div>
			<div class="text-center">
				<p class="text-gray-600">Caras</p>
				<p class="font-bold text-lg">{$meshState.faceCount.toLocaleString()}</p>
			</div>
			<div class="text-center">
				<p class="text-gray-600">Volumen</p>
				<p class="font-bold text-lg">{$meshState.volume.toFixed(2)} mm³</p>
			</div>
		</div>
	{/if}
	
	<div class="mt-4 text-sm text-gray-600">
		<p>💡 Controles:</p>
		<ul class="list-disc list-inside ml-2">
			<li>Arrastrar: Rotar vista</li>
			<li>Rueda del mouse: Zoom</li>
		</ul>
	</div>
</div>

<style>
	:global(canvas) {
		display: block;
	}
</style>
