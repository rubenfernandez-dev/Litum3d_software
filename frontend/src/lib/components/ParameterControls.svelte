<script>
	/**
	 * Componente de controles para ajustar parámetros
	 */
	import { processingParams } from '$lib/stores/appStore';
	
	const shapes = [
		{ value: 'plane_rect', label: 'Plano Rectangular' },
		{ value: 'plane_circle', label: 'Plano Circular' },
		{ value: 'arc', label: 'Arco' },
		{ value: 'cylinder', label: 'Cilindro' },
		{ value: 'sphere_partial', label: 'Esfera Parcial' },
		{ value: 'heart', label: 'Corazón' },
		{ value: 'polygon_profile', label: 'Perfil Poligonal' },
		{ value: 'tower_triangle', label: 'Torre Triangular' },
		{ value: 'tower_square', label: 'Torre Cuadrada' },
		{ value: 'tower_pentagon', label: 'Torre Pentagonal' },
		{ value: 'tower_hexagon', label: 'Torre Hexagonal' },
		{ value: 'tower_octagon', label: 'Torre Octagonal' }
	];
	
	let showAdvanced = false;
</script>

<div class="card">
	<h2 class="text-xl font-bold mb-4">2. Configurar Parámetros</h2>
	
	<div class="space-y-6">
		<!-- Forma -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Forma
			</div>
			<select 
				bind:value={$processingParams.shapeType}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
			>
				{#each shapes as shape}
					<option value={shape.value}>{shape.label}</option>
				{/each}
			</select>
		</div>

		<!-- Número de caras (0=círculo) -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Número de caras: {$processingParams.numFaces}
			</div>
			<input 
				type="range" 
				min="0" 
				max="12" 
				step="1"
				bind:value={$processingParams.numFaces}
			/>
			<p class="text-xs text-gray-500 mt-1">0 = círculo (alta resolución), 3-12 = polígono regular.</p>
		</div>
		
		<!-- Altura Mínima -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Altura Mínima: {$processingParams.minHeight} mm
			</div>
			<input 
				type="range" 
				min="0.1" 
				max="5" 
				step="0.1"
				bind:value={$processingParams.minHeight}
			/>
		</div>
		
		<!-- Altura Máxima -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Altura Máxima: {$processingParams.maxHeight} mm
			</div>
			<input 
				type="range" 
				min="1" 
				max="10" 
				step="0.1"
				bind:value={$processingParams.maxHeight}
			/>
		</div>
		
		<!-- Grosor -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Grosor: {$processingParams.thickness} mm
			</div>
			<input 
				type="range" 
				min="0.5" 
				max="10" 
				step="0.1"
				bind:value={$processingParams.thickness}
			/>
		</div>
		
		<!-- Suavizado -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Suavizado: {$processingParams.smoothing}
			</div>
			<input 
				type="range" 
				min="0" 
				max="5" 
				step="1"
				bind:value={$processingParams.smoothing}
			/>
		</div>
		
		<!-- Resolución -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Resolución: {$processingParams.resolution}
			</div>
			<input 
				type="range" 
				min="50" 
				max="500" 
				step="10"
				bind:value={$processingParams.resolution}
			/>
			<p class="text-xs text-gray-500 mt-1">Mayor resolución = más detalle (más tiempo de proceso)</p>
		</div>
		
		<!-- Curvatura (para formas curvas) -->
		{#if ['arc', 'sphere_partial'].includes($processingParams.shapeType)}
			<div>
				<div class="block text-sm font-medium text-gray-700 mb-2">
					Curvatura: {$processingParams.curvature}°
				</div>
				<input 
					type="range" 
					min="0" 
					max="180" 
					step="5"
					bind:value={$processingParams.curvature}
				/>
			</div>
		{/if}
		
		<!-- Parámetros de torre -->
		{#if $processingParams.shapeType.startsWith('tower_')}
			<div>
				<div class="block text-sm font-medium text-gray-700 mb-2">
					Altura de Torre: {$processingParams.towerHeight} mm
				</div>
				<input 
					type="range" 
					min="10" 
					max="200" 
					step="5"
					bind:value={$processingParams.towerHeight}
				/>
			</div>
		{/if}
		
		<!-- Controles avanzados -->
		<div>
			<button 
				class="text-primary-600 text-sm font-medium hover:text-primary-700"
				on:click={() => showAdvanced = !showAdvanced}
			>
				{showAdvanced ? '▼' : '▶'} Configuración Avanzada
			</button>
			
			{#if showAdvanced}
				<div class="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
					<!-- Contraste -->
					<div>
					<div class="block text-sm font-medium text-gray-700 mb-2">
						Contraste: {$processingParams.contrast.toFixed(1)}
					</div>
						<input 
							type="range" 
							min="0.1" 
							max="3" 
							step="0.1"
							bind:value={$processingParams.contrast}
						/>
					</div>
					
					<!-- Brillo -->
					<div>
					<div class="block text-sm font-medium text-gray-700 mb-2">
						Brillo: {$processingParams.brightness.toFixed(1)}
					</div>
						<input 
							type="range" 
							min="0.1" 
							max="3" 
							step="0.1"
							bind:value={$processingParams.brightness}
						/>
					</div>
					
					<!-- Desenfoque -->
					<div>
					<div class="block text-sm font-medium text-gray-700 mb-2">
						Desenfoque: {$processingParams.blur}
					</div>
						<input 
							type="range" 
							min="0" 
							max="20" 
							step="1"
							bind:value={$processingParams.blur}
						/>
					</div>
					
					<!-- Nitidez -->
					<div>
					<div class="block text-sm font-medium text-gray-700 mb-2">
						Nitidez: {$processingParams.sharpen.toFixed(1)}
					</div>
						<input 
							type="range" 
							min="0" 
							max="2" 
							step="0.1"
							bind:value={$processingParams.sharpen}
						/>
					</div>
					
					<!-- Invertir -->
					<div class="flex items-center">
						<input 
							type="checkbox" 
							id="invert"
							bind:checked={$processingParams.invert}
							class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<label for="invert" class="ml-2 text-sm text-gray-700">
							Invertir mapa de alturas
						</label>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
