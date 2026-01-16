<script>
	/**
	 * Controles para litofanías 360° envolventes.
	 */
	import { processingParams } from '$lib/stores/appStore';

	const wrapModes = [
		{ value: 'repeat', label: 'Repetir' },
		{ value: 'clamp', label: 'Estirar' },
		{ value: 'mirror', label: 'Espejo' }
	];
</script>

<div class="card">
	<h2 class="text-lg font-semibold mb-4">Proyección 360°</h2>

	<div class="space-y-4">
		<!-- Toggle Litofanía 360° -->
		<div class="flex items-center gap-2">
			<input
				type="checkbox"
				bind:checked={$processingParams.useLithophane360}
				class="w-4 h-4"
			/>
			<span class="text-sm text-gray-700">Activar litofanía 360° envolvente</span>
		</div>

		{#if $processingParams.useLithophane360}
			<!-- Modo de envoltura -->
			<div>
				<div class="block text-sm font-medium text-gray-700 mb-2">
					Ajuste de repetición
				</div>
				<select
					bind:value={$processingParams.wrapMode}
					class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				>
					{#each wrapModes as mode}
						<option value={mode.value}>{mode.label}</option>
					{/each}
				</select>
				<p class="text-xs text-gray-500 mt-1">
					Repetir = imagen cíclica | Estirar = clamped | Espejo = efecto de simetría
				</p>
			</div>

			<!-- Corrección de distorsión -->
			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={$processingParams.applyDistortionCorrection}
					class="w-4 h-4"
				/>
				<span class="text-sm text-gray-700">Corrección de distorsión en polígonos</span>
			</div>
			<p class="text-xs text-gray-500">
				Ajusta la proyección para evitar estiramiento excesivo en polígonos regulares.
			</p>
		{/if}
	</div>
</div>

<style>
	/* Los estilos se heredan del CSS global */
</style>
