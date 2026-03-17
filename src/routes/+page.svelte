<h1>Reroute + command() Bug Reproduction</h1>

<p>Navigate to one of these paths:</p>

<ul>
	<li><a href="/actual"><code>/actual</code></a> — direct route (no reroute)</li>
	<li><a href="/original"><code>/original</code></a> — rerouted to <code>/actual</code> via reroute hook</li>
</ul>

<p>
	Then click the "Call command()" button and observe the route info returned by the server.
</p>
