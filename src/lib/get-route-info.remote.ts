import { command, getRequestEvent } from '$app/server';

export const getRouteInfo = command(async () => {
	const event = getRequestEvent();
	return {
		route: event.route,
		pathname: event.url.pathname,
		href: event.url.href
	};
});
