/**
 * Servicio para comunicación con la API backend
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const apiService = {
	/**
	 * Procesa una imagen y la convierte a escala de grises
	 */
	async processImage(file, params = {}) {
		const formData = new FormData();
		formData.append('file', file);
		
		const queryParams = new URLSearchParams({
			contrast: params.contrast || 1.0,
			brightness: params.brightness || 1.0,
			blur: params.blur || 0,
			sharpen: params.sharpen || 0.0
		});
		
		const response = await axios.post(
			`${API_BASE_URL}/process-image?${queryParams}`,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		);
		
		return response.data;
	},
	
	/**
	 * Aplica filtros avanzados a una imagen y devuelve base64
	 */
	async applyImageFilters(file, adjustments = {}) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('adjustments', JSON.stringify(adjustments));
		
		const response = await axios.post(
			`${API_BASE_URL}/apply-image-filters`,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		);
		
		return response.data;
	},
	
	/**
	 * Mejora automática de imagen usando IA ligera
	 */
	async autoEnhanceImage(file) {
		const formData = new FormData();
		formData.append('file', file);
		
		const response = await axios.post(
			`${API_BASE_URL}/auto-enhance`,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		);
		
		return response.data;
	},
	
	/**
	 * Genera un mapa de alturas desde una imagen procesada
	 */
	async generateHeightmap(imageId, params = {}) {
		const response = await axios.post(
			`${API_BASE_URL}/generate-heightmap`,
			{
				image_id: imageId,
				min_height: params.minHeight || 0.8,
				max_height: params.maxHeight || 3.2,
				invert: params.invert || false
			}
		);
		
		return response.data;
	},
	
	/**
	 * Genera una malla 3D desde un heightmap
	 */
	async generateMesh(heightmapId, params = {}) {
		const mapProfilePoints = (points) => {
			if (!Array.isArray(points)) return null;
			return points.map((p) => ({
				height_percent: p.height_percent ?? p.heightPercent ?? 0,
				diameter: p.diameter ?? 0
			}));
		};

		const mapProgressiveScale = (scale) => {
			if (scale === undefined || scale === null) return 1.0;
			if (typeof scale === 'number') return scale;
			if (!Array.isArray(scale)) return 1.0;
			return scale.map((p) => ({
				height_percent: p.height_percent ?? p.heightPercent ?? 0,
				scale: p.scale ?? p.value ?? 1.0
			}));
		};

		const mapScaleCurve = (points) => {
			if (!Array.isArray(points)) return null;
			return points.map((p) => ({
				height: p.height ?? p.height_norm ?? 0,
				scale: p.scale ?? 1.0
			}));
		};

		const response = await axios.post(
			`${API_BASE_URL}/generate-mesh`,
			{
				heightmap_id: heightmapId,
				shape_type: params.shapeType || 'plane_rect',
				thickness: params.thickness || 2.0,
				smoothing: params.smoothing || 0,
				resolution: params.resolution || 200,
				curvature: params.curvature || 0.0,
				tower_height: params.towerHeight || 50.0,
				tower_sides: params.towerSides || 4,
				num_faces: params.numFaces ?? 0,
				profile_points: mapProfilePoints(params.profilePoints),
				torsion_total: params.torsionTotal ?? 0,
				progressive_scale: mapProgressiveScale(params.progressiveScale),
				interpolation_type: params.interpolationType || 'lineal',
					scale_curve_points: params.useScaleCurve ? mapScaleCurve(params.scaleCurvePoints) : null,
					projection_mode: params.projectionMode || 'frontal',
					wrap_mode: params.wrapMode || 'repeat',
					apply_distortion_correction: params.applyDistortionCorrection ?? true
			}
		);
		
		return response.data;
	},
	
	/**
	 * Obtiene la URL completa para descargar un archivo
	 */
	getDownloadUrl(downloadPath) {
		return `http://localhost:8000${downloadPath}`;
	},
	
	/**
	 * Exporta una malla a formato STL o 3MF
	 */
	async exportMesh(meshId, format = 'stl') {
		const response = await axios.post(
			`${API_BASE_URL}/export`,
			{
				mesh_id: meshId,
				format: format
			}
		);
		return response.data;
	},

	/**
	 * Procesa múltiples imágenes para litofanía 360° collage
	 */
	async processMultiImages(files, params = {}) {
		const formData = new FormData();
		files.forEach((file, index) => {
			formData.append(`images`, file);
		});
		formData.append('params', JSON.stringify(params));

		const response = await axios.post(
			`${API_BASE_URL}/multi-image-projection`,
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		);

		return response.data;
	},

	/**
	 * Verifica el estado del servidor
	 */
	async healthCheck() {
		const response = await axios.get(`${API_BASE_URL}/health`);
		return response.data;
	}
};
