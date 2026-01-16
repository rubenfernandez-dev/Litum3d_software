<script>
	/**
	 * Controles para animación y previsualización realista.
	 * No modifica componentes existentes.
	 */
	import { processingParams } from '$lib/stores/appStore';

	const lightColors = [
		{ value: 'calida', label: '☀️ Cálida' },
		{ value: 'neutra', label: '⚪ Neutra' },
		{ value: 'fria', label: '❄️ Fría' }
	];
</script>

<div class="card">
	<h2 class="text-lg font-semibold mb-4">⚡ Previsualización Realista</h2>

	<div class="space-y-4">
		<!-- Sección de rotación automática -->
		<div class="border-b pb-4">
			<div class="flex items-center gap-2 mb-3">
				<input
					type="checkbox"
					bind:checked={$processingParams.autoRotate}
					class="w-4 h-4"
				/>
				<span class="text-sm font-medium text-gray-700">Rotación automática</span>
			</div>

			{#if $processingParams.autoRotate}
				<div>
					<div class="block text-sm font-medium text-gray-700 mb-2">
						Velocidad: {$processingParams.rotationSpeed.toFixed(1)}x
					</div>
					<input
						type="range"
						min="0.1"
						max="2.0"
						step="0.1"
						bind:value={$processingParams.rotationSpeed}
						class="w-full"
					/>
					<p class="text-xs text-gray-500 mt-1">Lento (0.1) → Rápido (2.0)</p>
				</div>
			{/if}
		</div>

		<!-- Sección de iluminación -->
		<div class="border-b pb-4">
			<div class="flex items-center gap-2 mb-3">
				<input
					type="checkbox"
					bind:checked={$processingParams.lampMode}
					class="w-4 h-4"
				/>
				<span class="text-sm font-medium text-gray-700">Modo lámpara encendida</span>
			</div>

			{#if $processingParams.lampMode}
				<div class="space-y-3">
					<!-- Intensidad de luz -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Intensidad: {$processingParams.lightIntensity.toFixed(2)}
						</div>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							bind:value={$processingParams.lightIntensity}
							class="w-full"
						/>
						<p class="text-xs text-gray-500 mt-1">Oscuro (0) → Brillante (2)</p>
					</div>

					<!-- Temperatura de luz -->
					<div>
						<div class="block text-sm font-medium text-gray-700 mb-2">
							Temperatura de luz
						</div>
						<select
							bind:value={$processingParams.lightColor}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						>
							{#each lightColors as color}
								<option value={color.value}>{color.label}</option>
							{/each}
						</select>
						<p class="text-xs text-gray-500 mt-1">Simula diferentes temperaturas de color.</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Info -->
		<p class="text-xs text-gray-500">
			💡 La rotación automática y el modo lámpara se actualizan en tiempo real en la vista previa 3D.
		</p>
	</div>
</div>
