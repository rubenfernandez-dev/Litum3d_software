/**
 * Store global para el estado de la aplicación
 */
import { writable } from 'svelte/store';

// Estado de la imagen
export const imageState = writable({
	file: null,
	imageId: null,
	width: 0,
	height: 0,
	preview: null
});

// Estado de múltiples imágenes (modo collage 360°)
export const multiImageState = writable({
	files: [],
	count: 0,
	previews: [],
	useMultiImageMode: false
});

// Estado del heightmap
export const heightmapState = writable({
	heightmapId: null,
	minValue: 0,
	maxValue: 0
});

// Estado de la malla
export const meshState = writable({
	meshId: null,
	vertexCount: 0,
	faceCount: 0,
	volume: 0
});

// Parámetros de procesamiento
export const processingParams = writable({
	// Parámetros de imagen
	contrast: 1.0,
	brightness: 1.0,
	blur: 0,
	sharpen: 0.0,
	
	// Parámetros de edición de imagen (ImageEditor)
	hasImageEdits: false,
	imageEdits: {
		brightness: 0,
		contrast: 0,
		exposure: 0,
		gamma: 1.0,
		sharpen: 0,
		blur: 0,
		invert: false,
		rotation: 0,
		zoom: 1.0,
		pan_x: 0,
		pan_y: 0,
		crop_box: null,
		maintain_aspect: false
	},
	
	// Parámetros de auto-enhance (IA)
	autoEnhanceApplied: false,
	autoEnhanceData: {
		applied_adjustments: {},
		stats: {}
	},
	
	// Parámetros de heightmap
	minHeight: 0.8,
	maxHeight: 3.2,
	invert: false,
	
	// Parámetros de malla
	shapeType: 'plane_rect',
	thickness: 2.0,
	smoothing: 0,
	resolution: 200,
	curvature: 0.0,
	towerHeight: 50.0,
	towerSides: 4,
	numFaces: 0,
	profilePoints: [
		{ heightPercent: 0, diameter: 60 },
		{ heightPercent: 100, diameter: 60 }
	],
	// Parámetros avanzados
	torsionTotal: 0,
	progressiveScale: 1.0,
	interpolationType: 'lineal',
	useScaleCurve: false,
	scaleCurvePoints: [
		{ height: 0, scale: 1.0 },
		{ height: 1, scale: 1.0 }
	],
	// Parámetros de proyección 360°
	projectionMode: 'frontal',
	useLithophane360: false,
	wrapMode: 'repeat',
	applyDistortionCorrection: true,
	// Parámetros de animación y previsualización
	autoRotate: true,
	rotationSpeed: 0.5,
	lampMode: false,
	lightIntensity: 1.0,
	lightColor: 'neutra'
});

// Estado de carga
export const loadingState = writable({
	isLoading: false,
	message: '',
	progress: 0
});

// Estado de exportación
export const exportState = writable({
	downloadUrl: null,
	fileSize: 0
});

// Estado de animación
export const animationState = writable({
	isTransitioning: false,
	transitionProgress: 0
});
