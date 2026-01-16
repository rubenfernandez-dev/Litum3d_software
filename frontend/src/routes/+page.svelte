<script>
	/**
	 * Página principal de la aplicación
	 */
	import '../app.css';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import MultiImageUploader from '$lib/components/MultiImageUploader.svelte';
	import ImageEditor from '$lib/components/ImageEditor.svelte';
	import ParameterControls from '$lib/components/ParameterControls.svelte';
	import AdvancedShapeControls from '$lib/components/AdvancedShapeControls.svelte';
	import Lithophane360Controls from '$lib/components/Lithophane360Controls.svelte';
	import PreviewEnhancements from '$lib/components/PreviewEnhancements.svelte';
	import ThreeViewer from '$lib/components/ThreeViewer.svelte';
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import { multiImageState } from '$lib/stores/appStore';
</script>

<svelte:head>
	<title>Litum3D - Generador de Litofanías 3D</title>
	<meta name="description" content="Crea litofanías 3D personalizadas a partir de tus imágenes" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">
						🌟 Litum3D
					</h1>
					<p class="text-sm text-gray-600 mt-1">
						Generador de Litofanías 3D
					</p>
				</div>
				<div class="text-right">
					<p class="text-xs text-gray-500">v1.0.0</p>
					<a 
						href="https://github.com" 
						target="_blank"
						class="text-xs text-primary-600 hover:text-primary-700"
					>
						GitHub
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
		<!-- Descripción -->
		<div class="mb-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-primary-500">
			<h2 class="text-lg font-semibold text-gray-900 mb-2">
				¿Qué es una litofanía?
			</h2>
			<p class="text-gray-600">
				Una litofanía es una impresión 3D que crea una imagen cuando se ilumina desde atrás. 
				Las zonas más finas permiten pasar más luz, mientras que las más gruesas bloquean la luz, 
				creando gradientes y detalles asombrosos.
			</p>
		</div>

		<!-- Grid Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Columna Izquierda -->
			<div class="space-y-6">
				{#if $multiImageState.useMultiImageMode}
					<MultiImageUploader />
				{:else}
					<ImageUploader />
				{/if}
				<ImageEditor />
				<ParameterControls />
				<AdvancedShapeControls />
				<Lithophane360Controls />
				<PreviewEnhancements />
				<ActionButtons />
			</div>

			<!-- Columna Derecha -->
			<div class="space-y-6">
				<ThreeViewer />
				
				<!-- Tips -->
				<div class="card bg-blue-50 border border-blue-200">
					<h3 class="font-semibold text-blue-900 mb-2">💡 Consejos</h3>
					<ul class="text-sm text-blue-800 space-y-1 list-disc list-inside">
						<li>Usa imágenes con buen contraste para mejores resultados</li>
						<li>Retratos y paisajes funcionan mejor que patrones complejos</li>
						<li>Una altura entre 0.8mm y 3.2mm es ideal para la mayoría de impresoras</li>
						<li>Mayor resolución = más detalle pero archivos más grandes</li>
						<li>Imprime con material blanco o translúcido (PLA blanco recomendado)</li>
					</ul>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-12 bg-white border-t border-gray-200">
		<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
			<div class="text-center text-sm text-gray-600">
				<p>
					Hecho con ❤️ usando SvelteKit, Three.js, FastAPI y Python
				</p>
				<p class="mt-2">
					© 2026 Litum3D - Código abierto bajo licencia MIT
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
