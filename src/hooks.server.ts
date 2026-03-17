import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log(
		`[hooks.server] ${event.request.method} ${event.url.pathname} → route.id: ${event.route.id}`
	);
	return resolve(event);
};
