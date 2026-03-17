<script lang="ts">
	import { getRouteInfo } from '$lib/get-route-info.remote';

	let result: { route: { id: string | null }; pathname: string; href: string } | null =
		$state(null);
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
	<table>
		<thead>
			<tr>
				<th>Property</th>
				<th>Expected</th>
				<th>Actual</th>
				<th>OK?</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>event.route.id</code></td>
				<td><code>/actual</code></td>
				<td><code>{result.route.id ?? 'null'}</code></td>
				<td>{result.route.id === '/actual' ? 'PASS' : 'BUG'}</td>
			</tr>
		</tbody>
	</table>

	<h3>Other properties (informational):</h3>
	<dl>
		<dt><code>event.route</code></dt>
		<dd><pre>{JSON.stringify(result.route, null, 2)}</pre></dd>
		<dt><code>event.url.pathname</code></dt>
		<dd><code>{result.pathname}</code></dd>
		<dt><code>event.url.href</code></dt>
		<dd><code>{result.href}</code></dd>
	</dl>
{/if}
