<script>
	/**
	 * Componente para subir y previsualizar imágenes
	 */
	import { imageState, loadingState, processingParams } from '$lib/stores/appStore';
	import { apiService } from '$lib/services/apiService';
	
	let dragOver = false;
	let fileInput;
	
	async function handleFile(file) {
		if (!file || !file.type.startsWith('image/')) {
			alert('Por favor, selecciona una imagen válida');
			return;
		}
		
		// Crear preview
		const reader = new FileReader();
		reader.onload = (e) => {
			imageState.update(state => ({
				...state,
				file: file,
				preview: e.target.result
			}));
		};
		reader.readAsDataURL(file);
		
		// Procesar imagen
		loadingState.set({ isLoading: true, message: 'Procesando imagen...', progress: 33 });
		
		try {
			const params = $processingParams;
			const response = await apiService.processImage(file, {
				contrast: params.contrast,
				brightness: params.brightness,
				blur: params.blur,
				sharpen: params.sharpen
			});
			
			imageState.update(state => ({
				...state,
				imageId: response.image_id,
				width: response.width,
				height: response.height
			}));
			
			loadingState.set({ isLoading: false, message: '', progress: 0 });
		} catch (error) {
			console.error('Error procesando imagen:', error);
			alert('Error al procesar la imagen. Por favor, intenta de nuevo.');
			loadingState.set({ isLoading: false, message: '', progress: 0 });
		}
	}
	
	function handleDrop(e) {
		dragOver = false;
		const file = e.dataTransfer.files[0];
		handleFile(file);
	}
	
	function handleFileSelect(e) {
		const file = e.target.files[0];
		handleFile(file);
	}
	
	function handleClick() {
		fileInput.click();
	}
</script>

<div class="card">
	<h2 class="text-xl font-bold mb-4">1. Cargar Imagen</h2>
	
	<div
		class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
		class:border-primary-500={dragOver}
		class:bg-primary-50={dragOver}
		class:border-gray-300={!dragOver}
		role="button"
		tabindex="0"
		on:dragover|preventDefault={() => dragOver = true}
		on:dragleave={() => dragOver = false}
		on:drop|preventDefault={handleDrop}
		on:click={handleClick}
		on:keydown={(e) => e.key === 'Enter' && handleClick()}
	>
		{#if $imageState.preview}
			<div class="space-y-4">
				<img src={$imageState.preview} alt="Preview" class="max-w-full max-h-64 mx-auto rounded-lg shadow" />
				<p class="text-sm text-gray-600">
					Dimensiones: {$imageState.width} x {$imageState.height} px
				</p>
				<button class="btn btn-secondary" on:click|stopPropagation={() => imageState.set({ file: null, imageId: null, width: 0, height: 0, preview: null })}>
					Cambiar Imagen
				</button>
			</div>
		{:else}
			<div class="space-y-2">
				<svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
					<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<p class="text-gray-600">Arrastra una imagen aquí o haz clic para seleccionar</p>
				<p class="text-sm text-gray-500">PNG, JPG, GIF hasta 10MB</p>
			</div>
		{/if}
	</div>
	
	<input
		type="file"
		accept="image/*"
		class="hidden"
		bind:this={fileInput}
		on:change={handleFileSelect}
	/>
</div>

<style>
	/* Estilos adicionales si son necesarios */
</style>
