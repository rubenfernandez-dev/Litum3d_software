<script>
	/**
	 * Editor avanzado de imágenes con zoom, pan, rotación, brillo, contraste, etc.
	 * Previsualización en tiempo real con canvas.
	 * Incluye auto-enhance con IA ligera.
	 */
	import { onMount } from 'svelte';
	import { processingParams } from '$lib/stores/appStore';
	import { apiService } from '$lib/services/apiService';

	let canvas;
	let fileInput;
	let originalImage = null;
	let previewImage = null;
	let isProcessing = false;
	let showEditor = false;
	let isAutoEnhancing = false;
	let autoEnhanceMessage = '';
	let lastLoadedFile = null;

	// Estado del editor
	let editorState = {
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
	};

	let cropMode = 'free'; // free, aspect, area
	let isCropping = false;
	let cropStart = { x: 0, y: 0 };
	let cropCurrent = { x: 0, y: 0 };
	let isDraggingPan = false;
	let lastMousePos = { x: 0, y: 0 };

	const tabs = ['Ajustes', 'Recorte', 'Transformar'];
	let activeTab = 'Ajustes';

	onMount(() => {
		if (canvas) {
			canvas.addEventListener('mousedown', handleCanvasMouseDown);
			canvas.addEventListener('mousemove', handleCanvasMouseMove);
			canvas.addEventListener('mouseup', handleCanvasMouseUp);
			canvas.addEventListener('wheel', handleCanvasWheel);
		}

		return () => {
			if (canvas) {
				canvas.removeEventListener('mousedown', handleCanvasMouseDown);
				canvas.removeEventListener('mousemove', handleCanvasMouseMove);
				canvas.removeEventListener('mouseup', handleCanvasMouseUp);
				canvas.removeEventListener('wheel', handleCanvasWheel);
			}
		};
	});

	function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (!file) return;

		lastLoadedFile = file;
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				originalImage = img;
				showEditor = true;
				resetAdjustments();
				updatePreview();
				autoEnhanceMessage = '';
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);
	}

	function resetAdjustments() {
		editorState = {
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
		};
		updatePreview();
	}

	function updatePreview() {
		if (!originalImage || !canvas) return;

		isProcessing = true;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Crear canvas temporal para aplicar ajustes
		const tempCanvas = document.createElement('canvas');
		const tempCtx = tempCanvas.getContext('2d');
		if (!tempCtx) return;

		tempCanvas.width = originalImage.width;
		tempCanvas.height = originalImage.height;

		// Dibujar imagen original
		tempCtx.drawImage(originalImage, 0, 0);

		// Obtener datos de píxeles
		let imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
		let data = imageData.data;

		// Aplicar brillo
		if (editorState.brightness !== 0) {
			const factor = editorState.brightness;
			for (let i = 0; i < data.length; i += 4) {
				data[i] = Math.max(0, Math.min(255, data[i] + factor * 2.55));
				data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor * 2.55));
				data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor * 2.55));
			}
		}

		// Aplicar contraste
		if (editorState.contrast !== 0) {
			const factor = 1 + editorState.contrast / 100;
			const intercept = 128 * (1 - factor);
			for (let i = 0; i < data.length; i += 4) {
				data[i] = Math.max(0, Math.min(255, data[i] * factor + intercept));
				data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * factor + intercept));
				data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * factor + intercept));
			}
		}

		// Aplicar exposición
		if (editorState.exposure !== 0) {
			const factor = Math.pow(2, editorState.exposure);
			for (let i = 0; i < data.length; i += 4) {
				data[i] = Math.max(0, Math.min(255, data[i] * factor));
				data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * factor));
				data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * factor));
			}
		}

		// Aplicar gamma
		if (editorState.gamma !== 1.0) {
			const invGamma = 1 / editorState.gamma;
			for (let i = 0; i < data.length; i += 4) {
				data[i] = Math.max(0, Math.min(255, Math.pow(data[i] / 255, invGamma) * 255));
				data[i + 1] = Math.max(0, Math.min(255, Math.pow(data[i + 1] / 255, invGamma) * 255));
				data[i + 2] = Math.max(0, Math.min(255, Math.pow(data[i + 2] / 255, invGamma) * 255));
			}
		}

		// Aplicar invertir
		if (editorState.invert) {
			for (let i = 0; i < data.length; i += 4) {
				data[i] = 255 - data[i];
				data[i + 1] = 255 - data[i + 1];
				data[i + 2] = 255 - data[i + 2];
			}
		}

		tempCtx.putImageData(imageData, 0, 0);

		// Configurar canvas de display
		canvas.width = 600;
		canvas.height = 400;

		// Aplicar transformaciones geométricas
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);

		// Rotar
		if (editorState.rotation !== 0) {
			ctx.rotate((editorState.rotation * Math.PI) / 180);
		}

		// Escalar para zoom
		ctx.scale(editorState.zoom, editorState.zoom);

		// Aplicar pan
		ctx.translate(
			(editorState.pan_x * canvas.width) / (2 * editorState.zoom),
			(editorState.pan_y * canvas.height) / (2 * editorState.zoom)
		);

		// Dibujar imagen centrada
		ctx.drawImage(
			tempCanvas,
			-tempCanvas.width / 2,
			-tempCanvas.height / 2,
			tempCanvas.width,
			tempCanvas.height
		);

		// Dibujar área de recorte si está activa
		if (activeTab === 'Recorte' && editorState.crop_box) {
			const [left, top, right, bottom] = editorState.crop_box;
			ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
			ctx.lineWidth = 2;
			ctx.strokeRect(left - tempCanvas.width / 2, top - tempCanvas.height / 2, right - left, bottom - top);
		}

		ctx.restore();

		isProcessing = false;
	}

	function handleCanvasMouseDown(e) {
		if (activeTab === 'Recorte') {
			isCropping = true;
			const rect = canvas.getBoundingClientRect();
			cropStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		} else if (e.button === 2 || e.shiftKey) {
			// Click derecho o Shift+click para pan
			isDraggingPan = true;
			const rect = canvas.getBoundingClientRect();
			lastMousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		}
	}

	function handleCanvasMouseMove(e) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const currentPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

		if (isCropping && activeTab === 'Recorte') {
			cropCurrent = currentPos;
			updatePreview();
		} else if (isDraggingPan) {
			const deltaX = (currentPos.x - lastMousePos.x) / canvas.width;
			const deltaY = (currentPos.y - lastMousePos.height) / canvas.height;
			editorState.pan_x += deltaX;
			editorState.pan_y += deltaY;
			lastMousePos = currentPos;
			updatePreview();
		}
	}

	function handleCanvasMouseUp() {
		if (isCropping && activeTab === 'Recorte') {
			const left = Math.min(cropStart.x, cropCurrent.x);
			const top = Math.min(cropStart.y, cropCurrent.y);
			const right = Math.max(cropStart.x, cropCurrent.x);
			const bottom = Math.max(cropStart.y, cropCurrent.y);

			if (right - left > 10 && bottom - top > 10) {
				editorState.crop_box = [left, top, right, bottom];
			}
		}

		isCropping = false;
		isDraggingPan = false;
	}

	function handleCanvasWheel(e) {
		e.preventDefault();
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		editorState.zoom = Math.max(0.5, Math.min(4.0, editorState.zoom * delta));
		updatePreview();
	}

	function applyEdits() {
		if (!originalImage) return;

		// Guardar el estado del editor en el store (para usarlo en generación)
		processingParams.update((params) => ({
			...params,
			imageEdits: editorState,
			hasImageEdits: true
		}));

		showEditor = false;
	}

	function discardEdits() {
		showEditor = false;
		fileInput.value = '';
		autoEnhanceMessage = '';
	}

	async function handleAutoEnhance() {
		if (!lastLoadedFile || !originalImage) return;

		isAutoEnhancing = true;
		autoEnhanceMessage = '';

		try {
			const result = await apiService.autoEnhanceImage(lastLoadedFile);

			if (result.success && result.enhanced_image_base64) {
				// Cargar imagen mejorada
				const img = new Image();
				img.onload = () => {
					originalImage = img;
					resetAdjustments();
					updatePreview();
					autoEnhanceMessage = '✨ Foto mejorada automáticamente';

					// Guardar en store que se aplicó auto-enhance
					processingParams.update((params) => ({
						...params,
						autoEnhanceApplied: true,
						autoEnhanceData: {
							applied_adjustments: result.applied_adjustments,
							stats: result.stats
						}
					}));

					// Limpiar mensaje después de 3 segundos
					setTimeout(() => {
						autoEnhanceMessage = '';
					}, 3000);
				};
				img.onerror = () => {
					autoEnhanceMessage = '❌ Error al cargar imagen mejorada';
					isAutoEnhancing = false;
				};
				img.src = `data:image/png;base64,${result.enhanced_image_base64}`;
			} else {
				autoEnhanceMessage = '❌ Error en la mejora automática';
				isAutoEnhancing = false;
			}
		} catch (error) {
			console.error('Auto-enhance error:', error);
			autoEnhanceMessage = '❌ Error procesando imagen';
			isAutoEnhancing = false;
		}
	}

	function undoAutoEnhance() {
		processingParams.update((params) => ({
			...params,
			autoEnhanceApplied: false
		}));
		autoEnhanceMessage = '↩️ Mejora automática deshecha';
		setTimeout(() => {
			autoEnhanceMessage = '';
		}, 2000);
	}

</script>

<div class="card">
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-lg font-semibold">🖼️ Editor de Imagen (Opcional)</h2>
		{#if showEditor}
			<button
				type="button"
				on:click={discardEdits}
				class="text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
			>
				Cerrar
			</button>
		{/if}
	</div>

	{#if !showEditor}
		<div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer">
			<input
				type="file"
				bind:this={fileInput}
				accept="image/*"
				on:change={handleFileSelect}
				class="hidden"
			/>
			<button
				type="button"
				on:click={() => fileInput?.click()}
				class="w-full"
			>
				<p class="text-gray-700 font-medium">📷 Cargar imagen para editar</p>
				<p class="text-sm text-gray-500">Opcional: edita la imagen antes de generar litofanía</p>
			</button>
		</div>
	{:else if originalImage}
		<div class="space-y-4">
			<!-- Tabs -->
			<div class="flex border-b justify-between items-center">
				<div class="flex">
					{#each tabs as tab}
						<button
							type="button"
							on:click={() => {
								activeTab = tab;
							}}
							class={`px-4 py-2 text-sm font-medium ${
								activeTab === tab
									? 'border-b-2 border-primary-500 text-primary-600'
									: 'text-gray-600 hover:text-gray-900'
							}`}
						>
							{tab}
						</button>
					{/each}
				</div>
				
				<!-- Botón Auto-Enhance -->
				<button
					type="button"
					on:click={handleAutoEnhance}
					disabled={isAutoEnhancing}
					class={`px-4 py-2 text-sm font-medium rounded transition ${
						isAutoEnhancing
							? 'bg-gray-300 text-gray-600 cursor-not-allowed'
							: 'bg-amber-500 text-white hover:bg-amber-600'
					}`}
					title="Mejora automática de imagen usando IA ligera"
				>
					{#if isAutoEnhancing}
						⏳ Procesando...
					{:else}
						✨ Auto-Enhance
					{/if}
				</button>
			</div>

			<!-- Mensaje de Auto-Enhance -->
			{#if autoEnhanceMessage}
				<div class={`p-3 rounded text-sm font-medium text-center ${
					autoEnhanceMessage.startsWith('✨')
						? 'bg-green-100 text-green-800 border border-green-300'
						: 'bg-red-100 text-red-800 border border-red-300'
				}`}>
					{autoEnhanceMessage}
					{#if $processingParams.autoEnhanceApplied}
						<button
							type="button"
							on:click={undoAutoEnhance}
							class="ml-2 text-xs underline hover:no-underline"
						>
							(Deshacer)
						</button>
					{/if}
				</div>
			{/if}

			<!-- Canvas de previsualización -->
			<div class="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
				<canvas
					bind:this={canvas}
					width={600}
					height={400}
					class="w-full"
					style="max-height: 400px; cursor: {activeTab === 'Recorte' ? 'crosshair' : 'grab'}"
				></canvas>
			</div>

			<!-- Panel de controles según tab -->
			{#if activeTab === 'Ajustes'}
				<div class="space-y-4">
					<!-- Brillo -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Brillo: {editorState.brightness}
						</div>
						<input
							type="range"
							min="-100"
							max="100"
							bind:value={editorState.brightness}
							on:change={updatePreview}
							class="w-full"
						/>
					</div>

					<!-- Contraste -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Contraste: {editorState.contrast}
						</div>
						<input
							type="range"
							min="-100"
							max="100"
							bind:value={editorState.contrast}
							on:change={updatePreview}
							class="w-full"
						/>
					</div>

					<!-- Exposición -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Exposición: {editorState.exposure.toFixed(1)}
						</div>
						<input
							type="range"
							min="-2"
							max="2"
							step="0.1"
							bind:value={editorState.exposure}
							on:change={updatePreview}
							class="w-full"
						/>
					</div>

					<!-- Gamma -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Gamma: {editorState.gamma.toFixed(2)}
						</div>
						<input
							type="range"
							min="0.5"
							max="2.5"
							step="0.1"
							bind:value={editorState.gamma}
							on:change={updatePreview}
							class="w-full"
						/>
					</div>

					<!-- Nitidez -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Nitidez: {editorState.sharpen.toFixed(2)}
						</div>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							bind:value={editorState.sharpen}
							on:change={updatePreview}
							class="w-full"
						/>
					</div>

					<!-- Suavizado -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Suavizado (Blur): {editorState.blur.toFixed(2)}
						</div>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							bind:value={editorState.blur}
							on:change={updatePreview}
							class="w-full"
						/>
					</div>

					<!-- Invertir -->
					<div class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={editorState.invert}
							on:change={updatePreview}
							class="w-4 h-4"
						/>
						<span class="text-sm font-medium text-gray-700">Invertir colores (negativo)</span>
					</div>

					<!-- Reset -->
					<button
						type="button"
						on:click={resetAdjustments}
						class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
					>
						🔄 Restablecer ajustes
					</button>
				</div>
			{:else if activeTab === 'Recorte'}
				<div class="space-y-4">
					<p class="text-sm text-gray-600">Dibuja un rectángulo en la imagen para recortar.</p>

					<div class="space-y-2">
						<label class="flex items-center gap-2">
							<input
								type="radio"
								bind:group={cropMode}
								value="free"
								class="w-4 h-4"
							/>
							<span class="text-sm">Modo libre</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								type="radio"
								bind:group={cropMode}
								value="aspect"
								class="w-4 h-4"
							/>
							<span class="text-sm">Mantener proporción</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								type="radio"
								bind:group={cropMode}
								value="area"
								class="w-4 h-4"
							/>
							<span class="text-sm">Ajustar al área</span>
						</label>
					</div>

					<label class="flex items-center gap-2">
						<input
							type="checkbox"
							bind:checked={editorState.maintain_aspect}
							class="w-4 h-4"
						/>
						<span class="text-sm font-medium text-gray-700">Mantener aspecto</span>
					</label>

					{#if editorState.crop_box}
						<div class="text-sm text-gray-600">
							Recorte: {editorState.crop_box[0]}, {editorState.crop_box[1]}, {editorState.crop_box[2]},
							{editorState.crop_box[3]}
						</div>
						<button
							type="button"
							on:click={() => {
								editorState.crop_box = null;
								updatePreview();
							}}
							class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
						>
							Limpiar recorte
						</button>
					{/if}
				</div>
			{:else if activeTab === 'Transformar'}
				<div class="space-y-4">
					<!-- Rotación -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">Rotación</div>
						<div class="flex gap-2">
							{#each [0, 90, 180, 270] as angle}
								<button
									type="button"
									on:click={() => {
										editorState.rotation = angle;
										updatePreview();
									}}
									class={`px-3 py-1 rounded text-sm ${
										editorState.rotation === angle
											? 'bg-primary-500 text-white'
											: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
									}`}
								>
									{angle}°
								</button>
							{/each}
						</div>
					</div>

					<!-- Zoom -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Zoom: {editorState.zoom.toFixed(2)}x
						</div>
						<input
							type="range"
							min="0.5"
							max="4"
							step="0.1"
							bind:value={editorState.zoom}
							on:change={updatePreview}
							class="w-full"
						/>
						<p class="text-xs text-gray-500 mt-1">Rueda del mouse para zoom (en la vista previa)</p>
					</div>

					<!-- Pan -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Pan X: {editorState.pan_x.toFixed(2)}
						</div>
						<input
							type="range"
							min="-1"
							max="1"
							step="0.1"
							bind:value={editorState.pan_x}
							on:change={updatePreview}
							class="w-full"
						/>
					</div>

					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Pan Y: {editorState.pan_y.toFixed(2)}
						</div>
						<input
							type="range"
							min="-1"
							max="1"
							step="0.1"
							bind:value={editorState.pan_y}
							on:change={updatePreview}
							class="w-full"
						/>
						<p class="text-xs text-gray-500 mt-1">O arrastra con Shift+click en la vista previa</p>
					</div>
				</div>
			{/if}

			<!-- Botones de acción -->
			<div class="flex gap-2">
				<button
					type="button"
					on:click={applyEdits}
					class="flex-1 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
					disabled={isProcessing}
				>
					✓ Aplicar ediciones
				</button>
				<button
					type="button"
					on:click={discardEdits}
					class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
				>
					✕ Descartar
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	canvas {
		display: block;
	}
</style>
