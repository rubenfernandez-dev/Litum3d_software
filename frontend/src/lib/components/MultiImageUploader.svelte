<script>
	/**
	 * Componente para subir múltiples imágenes (modo collage 360°)
	 */
	import { multiImageState } from '$lib/stores/appStore';
	
	let files = [];
	let dragOver = false;
	let fileInput;
	
	function handleFileSelect(event) {
		const selectedFiles = Array.from(event.target.files);
		addFiles(selectedFiles);
	}
	
	function handleDrop(event) {
		dragOver = false;
		const droppedFiles = Array.from(event.dataTransfer.files);
		addFiles(droppedFiles.filter(f => f.type.startsWith('image/')));
	}
	
	function addFiles(newFiles) {
		const validFiles = newFiles.filter(f => f.type.startsWith('image/'));
		
		// Crear previews
		validFiles.forEach(file => {
			const reader = new FileReader();
			reader.onload = (e) => {
				files = [...files, {
					file: file,
					preview: e.target.result,
					name: file.name
				}];
				updateStore();
			};
			reader.readAsDataURL(file);
		});
	}
	
	function removeFile(index) {
		files = files.filter((_, i) => i !== index);
		updateStore();
	}
	
	function moveUp(index) {
		if (index === 0) return;
		const newFiles = [...files];
		[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
		files = newFiles;
		updateStore();
	}
	
	function moveDown(index) {
		if (index === files.length - 1) return;
		const newFiles = [...files];
		[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
		files = newFiles;
		updateStore();
	}
	
	function updateStore() {
		multiImageState.set({
			files: files.map(f => f.file),
			count: files.length,
			previews: files.map(f => f.preview)
		});
	}
	
	function handleClick() {
		fileInput.click();
	}
</script>

<div class="card">
	<h2 class="text-xl font-bold mb-4">🖼️ Cargar Múltiples Imágenes (Collage 360°)</h2>
	
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
		<input
			bind:this={fileInput}
			type="file"
			multiple
			accept="image/*"
			on:change={handleFileSelect}
			class="hidden"
		/>
		
		<div class="space-y-2">
			<div class="text-4xl">📸</div>
			<p class="text-gray-700 font-medium">
				Arrastra varias imágenes aquí o haz clic para seleccionar
			</p>
			<p class="text-sm text-gray-500">
				Las imágenes se distribuirán automáticamente alrededor de la litofanía 360°
			</p>
			<p class="text-xs text-gray-400 mt-2">
				{files.length} imagen{files.length !== 1 ? 'es' : ''} cargada{files.length !== 1 ? 's' : ''}
			</p>
		</div>
	</div>
	
	<!-- Grid de miniaturas -->
	{#if files.length > 0}
		<div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
			{#each files as fileData, index}
				<div class="relative group border border-gray-200 rounded-lg overflow-hidden">
					<img 
						src={fileData.preview} 
						alt={fileData.name}
						class="w-full h-32 object-cover"
					/>
					
					<!-- Overlay con controles -->
					<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
						<button
							on:click|stopPropagation={() => moveUp(index)}
							disabled={index === 0}
							class="opacity-0 group-hover:opacity-100 bg-white rounded p-1 text-xs disabled:opacity-30"
							title="Mover arriba"
						>
							⬆️
						</button>
						<button
							on:click|stopPropagation={() => moveDown(index)}
							disabled={index === files.length - 1}
							class="opacity-0 group-hover:opacity-100 bg-white rounded p-1 text-xs disabled:opacity-30"
							title="Mover abajo"
						>
							⬇️
						</button>
						<button
							on:click|stopPropagation={() => removeFile(index)}
							class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded p-1 text-xs"
							title="Eliminar"
						>
							🗑️
						</button>
					</div>
					
					<!-- Número de orden -->
					<div class="absolute top-1 left-1 bg-primary-600 text-white text-xs px-2 py-1 rounded">
						#{index + 1}
					</div>
					
					<!-- Nombre del archivo -->
					<div class="p-2 bg-white">
						<p class="text-xs text-gray-600 truncate" title={fileData.name}>
							{fileData.name}
						</p>
					</div>
				</div>
			{/each}
		</div>
		
		<div class="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
			💡 <strong>Tip:</strong> Las imágenes se mapearán en orden secuencial alrededor del cilindro 360°. 
			Usa las flechas para reordenarlas.
		</div>
	{/if}
</div>
