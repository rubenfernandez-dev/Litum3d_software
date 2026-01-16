<script>
	/**
	 * Botones de acción para generar y exportar
	 */
	import { imageState, heightmapState, meshState, processingParams, loadingState, exportState } from '$lib/stores/appStore';
	import { apiService } from '$lib/services/apiService';
	
	async function generateLithophane() {
		if (!$imageState.imageId) {
			alert('Por favor, carga una imagen primero');
			return;
		}
		
		try {
			// Paso 1: Generar heightmap
			loadingState.set({ isLoading: true, message: 'Generando mapa de alturas...', progress: 33 });
			
			const heightmapResponse = await apiService.generateHeightmap($imageState.imageId, {
				minHeight: $processingParams.minHeight,
				maxHeight: $processingParams.maxHeight,
				invert: $processingParams.invert
			});
			
			heightmapState.set({
				heightmapId: heightmapResponse.heightmap_id,
				minValue: heightmapResponse.min_value,
				maxValue: heightmapResponse.max_value
			});
			
			// Paso 2: Generar malla
			loadingState.set({ isLoading: true, message: 'Generando malla 3D...', progress: 66 });
			
			const meshResponse = await apiService.generateMesh($heightmapState.heightmapId, {
				shapeType: $processingParams.shapeType,
				thickness: $processingParams.thickness,
				smoothing: $processingParams.smoothing,
				resolution: $processingParams.resolution,
				curvature: $processingParams.curvature,
				towerHeight: $processingParams.towerHeight,
				towerSides: $processingParams.towerSides,
				numFaces: $processingParams.numFaces,
				profilePoints: $processingParams.profilePoints,
				torsionTotal: $processingParams.torsionTotal,
				progressiveScale: $processingParams.progressiveScale,
				interpolationType: $processingParams.interpolationType,
				useScaleCurve: $processingParams.useScaleCurve,
				scaleCurvePoints: $processingParams.scaleCurvePoints,
				projectionMode: $processingParams.useLithophane360 ? '360' : 'frontal',
				wrapMode: $processingParams.wrapMode,
				applyDistortionCorrection: $processingParams.applyDistortionCorrection
			});
			
			meshState.set({
				meshId: meshResponse.mesh_id,
				vertexCount: meshResponse.vertex_count,
				faceCount: meshResponse.face_count,
				volume: meshResponse.volume
			});
			
			loadingState.set({ isLoading: false, message: '¡Litofanía generada!', progress: 100 });
			
			setTimeout(() => {
				loadingState.set({ isLoading: false, message: '', progress: 0 });
			}, 2000);
			
		} catch (error) {
			console.error('Error generando litofanía:', error);
			alert('Error al generar la litofanía. Por favor, intenta de nuevo.');
			loadingState.set({ isLoading: false, message: '', progress: 0 });
		}
	}
	
	async function exportSTL() {
		if (!$meshState.meshId) {
			alert('Primero genera la litofanía');
			return;
		}
		
		try {
			loadingState.set({ isLoading: true, message: 'Exportando STL...', progress: 50 });
			
			const response = await apiService.exportMesh($meshState.meshId, 'stl');
			const downloadUrl = apiService.getDownloadUrl(response.download_url);
			
			exportState.set({
				downloadUrl: downloadUrl,
				fileSize: response.file_size
			});
			
			// Descargar archivo
			window.open(downloadUrl, '_blank');
			
			loadingState.set({ isLoading: false, message: '', progress: 0 });
			
		} catch (error) {
			console.error('Error exportando STL:', error);
			alert('Error al exportar. Por favor, intenta de nuevo.');
			loadingState.set({ isLoading: false, message: '', progress: 0 });
		}
	}
	
	async function export3MF() {
		if (!$meshState.meshId) {
			alert('Primero genera la litofanía');
			return;
		}
		
		try {
			loadingState.set({ isLoading: true, message: 'Exportando 3MF...', progress: 50 });
			
			const response = await apiService.exportMesh($meshState.meshId, '3mf');
			const downloadUrl = apiService.getDownloadUrl(response.download_url);
			
			exportState.set({
				downloadUrl: downloadUrl,
				fileSize: response.file_size
			});
			
			// Descargar archivo
			window.open(downloadUrl, '_blank');
			
			loadingState.set({ isLoading: false, message: '', progress: 0 });
			
		} catch (error) {
			console.error('Error exportando 3MF:', error);
			alert('Error al exportar. Por favor, intenta de nuevo.');
			loadingState.set({ isLoading: false, message: '', progress: 0 });
		}
	}
</script>

<div class="card">
	<h2 class="text-xl font-bold mb-4">4. Generar y Exportar</h2>
	
	<div class="space-y-4">
		<!-- Botón Generar -->
		<button 
			class="btn btn-primary w-full text-lg py-3"
			on:click={generateLithophane}
			disabled={!$imageState.imageId || $loadingState.isLoading}
		>
			{#if $loadingState.isLoading}
				<span class="spinner mr-2"></span>
				{$loadingState.message}
			{:else}
				🚀 Generar Litofanía
			{/if}
		</button>
		
		<!-- Barra de progreso -->
		{#if $loadingState.isLoading}
			<div class="w-full bg-gray-200 rounded-full h-2">
				<div 
					class="bg-primary-600 h-2 rounded-full transition-all duration-300"
					style="width: {$loadingState.progress}%"
				></div>
			</div>
		{/if}
		
		<!-- Botones de exportación -->
		{#if $meshState.meshId}
			<div class="pt-4 border-t border-gray-200">
				<p class="text-sm font-medium text-gray-700 mb-3">Exportar como:</p>
				<div class="grid grid-cols-2 gap-3">
					<button 
						class="btn btn-success"
						on:click={exportSTL}
						disabled={$loadingState.isLoading}
					>
						📥 Exportar STL
					</button>
					<button 
						class="btn btn-success"
						on:click={export3MF}
						disabled={$loadingState.isLoading}
					>
						📥 Exportar 3MF
					</button>
				</div>
			</div>
		{/if}
		
		<!-- Información de exportación -->
		{#if $exportState.downloadUrl}
			<div class="mt-4 p-4 bg-green-50 rounded-lg">
				<p class="text-sm text-green-800">
					✅ Archivo exportado correctamente ({($exportState.fileSize / 1024).toFixed(2)} KB)
				</p>
			</div>
		{/if}
	</div>
</div>
