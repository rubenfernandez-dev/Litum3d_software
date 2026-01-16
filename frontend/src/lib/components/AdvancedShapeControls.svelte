<script>
	/**
	 * Controles avanzados para torsión, escala progresiva e interpolación del perfil.
	 */
	import { processingParams, multiImageState } from '$lib/stores/appStore';
	import ScaleCurveEditor from '$lib/components/ScaleCurveEditor.svelte';

	const interpolationOptions = [
		{ value: 'lineal', label: 'Lineal' },
		{ value: 'curva', label: 'Curva (suave)' }
	];
</script>

<div class="card">
	<h2 class="text-xl font-bold mb-4">2.1 Controles Avanzados</h2>

	<div class="space-y-5">
		<!-- Toggle Multi-Imagen -->
		<div class="flex items-center gap-2">
			<input
				type="checkbox"
				id="multiImageMode"
				bind:checked={$multiImageState.useMultiImageMode}
			/>
			<label for="multiImageMode" class="text-sm font-medium text-gray-700">
				🎨 Modo múltiples imágenes (collage 360°)
			</label>
		</div>
		{#if $multiImageState.useMultiImageMode}
			<p class="text-xs text-blue-600 bg-blue-50 p-2 rounded">
				Sube varias imágenes que se distribuirán automáticamente alrededor del cilindro 360°.
			</p>
		{/if}
		
		<!-- Torsión total -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Torsión total: {$processingParams.torsionTotal}°
			</div>
			<input
				type="range"
				min="0"
				max="180"
				step="5"
				bind:value={$processingParams.torsionTotal}
			/>
			<p class="text-xs text-gray-500 mt-1">Se aplica de forma progresiva desde la base hasta la parte superior.</p>
		</div>

		<!-- Escala progresiva simple -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Escalado progresivo: {$processingParams.progressiveScale.toFixed(2)}x (base → tope)
			</div>
			<input
				type="range"
				min="0.5"
				max="2.0"
				step="0.05"
				bind:value={$processingParams.progressiveScale}
				disabled={$processingParams.useScaleCurve}
			/>
			<p class="text-xs text-gray-500 mt-1">1.0 = sin cambio. Usa valores &lt;1 para estrechar o &gt;1 para ensanchar.</p>
		</div>

		<!-- Toggle curva avanzada -->
		<div class="flex items-center gap-2">
			<input
				type="checkbox"
				bind:checked={$processingParams.useScaleCurve}
				class="w-4 h-4"
			/>
			<span class="text-sm text-gray-700">Usar curva de escala avanzada</span>
		</div>

		{#if $processingParams.useScaleCurve}
			<ScaleCurveEditor />
		{/if}

		<!-- Interpolación -->
		<div>
			<div class="block text-sm font-medium text-gray-700 mb-2">
				Tipo de interpolación del perfil
			</div>
			<select
				bind:value={$processingParams.interpolationType}
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
			>
				{#each interpolationOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
			<p class="text-xs text-gray-500 mt-1">Lineal = aristas definidas. Curva = transición suave tipo jarrón.</p>
		</div>
	</div>
</div>
