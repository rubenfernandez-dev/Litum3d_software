<script>
	import { processingParams } from '$lib/stores/appStore';
	import { onMount } from 'svelte';

	const width = 320;
	const height = 200;
	const padding = 30;
	const minScale = 0.5;
	const maxScale = 2.0;

	let points = [];

	const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

	const toSvg = (h, s) => {
		const x = padding + h * (width - padding * 2);
		const y = padding + (1 - (s - minScale) / (maxScale - minScale)) * (height - padding * 2);
		return { x, y };
	};

	const toValues = (x, y) => {
		const h = clamp((x - padding) / (width - padding * 2), 0, 1);
		const s = clamp(
			minScale + (1 - (y - padding) / (height - padding * 2)) * (maxScale - minScale),
			minScale,
			maxScale
		);
		return { h, s };
	};

	function syncFromStore(val) {
		points = (val.scaleCurvePoints || []).map((p) => ({ h: p.height ?? p.height_norm ?? 0, s: p.scale ?? 1.0 }));
		if (!points.length) {
			points = [
				{ h: 0, s: 1.0 },
				{ h: 1, s: 1.0 }
			];
		}
		points = points.map((p) => ({ h: clamp(p.h, 0, 1), s: clamp(p.s, minScale, maxScale) }));
	}

	function persist() {
		processingParams.update((prev) => ({
			...prev,
			scaleCurvePoints: points.map((p) => ({ height: p.h, scale: p.s }))
		}));
	}

	function addPoint() {
		points = [...points, { h: 0.5, s: 1.0 }].sort((a, b) => a.h - b.h);
		persist();
	}

	function removeLast() {
		if (points.length <= 2) return;
		points = points.slice(0, -1);
		persist();
	}

	let draggingIndex = -1;

	function onMouseDown(event, idx) {
		draggingIndex = idx;
	}

	function onMouseMove(event) {
		if (draggingIndex === -1) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const { h, s } = toValues(x, y);
		points[draggingIndex] = { h, s };
		points = [...points].sort((a, b) => a.h - b.h);
		persist();
	}

	function onMouseUp() {
		draggingIndex = -1;
	}

	onMount(() => {
		const unsubscribe = processingParams.subscribe((val) => syncFromStore(val));
		syncFromStore($processingParams || {});
		return unsubscribe;
	});
</script>

<div class="card mt-4">
	<h3 class="text-lg font-semibold mb-3">Curva de escala avanzada</h3>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="border rounded-md bg-white"
		style={`width:${width}px;height:${height}px;`}
		role="button"
		aria-label="Editor de curva de escala"
		tabindex="0"
		on:mousemove={onMouseMove}
		on:mouseup={onMouseUp}
		on:mouseleave={onMouseUp}
	>
		<svg width={width} height={height}>
			<rect x="0" y="0" width={width} height={height} fill="#f9fafb" stroke="#e5e7eb" />
			<line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#d1d5db" />
			<line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#d1d5db" />

			{#if points.length > 1}
				<polyline
					fill="none"
					stroke="#3b82f6"
					stroke-width="2"
					points={points
						.map((p) => {
							const { x, y } = toSvg(p.h, p.s);
							return `${x},${y}`;
						})
						.join(' ')}
				/>
			{/if}

			{#each points as p, idx}
				{@const pos = toSvg(p.h, p.s)}
				<circle
					cx={pos.x}
					cy={pos.y}
					r="6"
					fill="#2563eb"
					role="button"
					aria-label="Punto de control {idx + 1}"
					tabindex="0"
					on:mousedown={(e) => onMouseDown(e, idx)}
				>
					{#if points.length > 2}
						<title>Arrastra para editar</title>
					{/if}
				</circle>
			{/each}
		</svg>
	</div>

	<div class="flex gap-2 mt-3">
		<button class="btn btn-secondary" on:click={addPoint}>Añadir punto</button>
		<button class="btn btn-secondary" on:click={removeLast} disabled={points.length <= 2}>Eliminar punto</button>
	</div>

	<p class="text-xs text-gray-500 mt-2">X: altura 0-100%. Y: escala 0.5-2.0. Arrastra los nodos para dar forma a la curva.</p>
</div>
