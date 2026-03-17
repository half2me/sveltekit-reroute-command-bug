<script lang="ts">
	import { getRouteInfo } from '$lib/get-route-info.remote';

	let result: { routeId: string | null; pathname: string } | null = $state(null);
	let loading = $state(false);

	async function handleClick() {
		loading = true;
		result = await getRouteInfo();
		loading = false;
	}
</script>

<h1>Reroute + command() Bug Reproduction</h1>

<p>
	This page is served at <code>/actual</code>, but you may have navigated to <code>/original</code>
	(which reroutes to <code>/actual</code> via the <code>reroute</code> hook).
</p>

<button onclick={handleClick} disabled={loading}>
	{loading ? 'Loading...' : 'Call command()'}
</button>

{#if result}
	<h2>Server-side result from command():</h2>
	<dl>
		<dt><code>event.route.id</code></dt>
		<dd><code>{result.routeId ?? 'null'}</code></dd>
		<dt><code>event.url.pathname</code></dt>
		<dd><code>{result.pathname}</code></dd>
	</dl>

	<h2>Expected vs Actual</h2>
	<table>
		<thead>
			<tr>
				<th></th>
				<th>Expected</th>
				<th>Actual</th>
				<th>OK?</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>route.id</code></td>
				<td><code>/actual</code></td>
				<td><code>{result.routeId ?? 'null'}</code></td>
				<td>{result.routeId === '/actual' ? 'PASS' : 'BUG'}</td>
			</tr>
			<tr>
				<td><code>url.pathname</code></td>
				<td><code>/actual</code></td>
				<td><code>{result.pathname}</code></td>
				<td>{result.pathname === '/actual' ? 'PASS' : 'BUG'}</td>
			</tr>
		</tbody>
	</table>
{/if}
