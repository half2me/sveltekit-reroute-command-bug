import { command, getRequestEvent } from '$app/server';

export const getRouteInfo = command(async () => {
	const event = getRequestEvent();
	return {
		routeId: event.route.id,
		pathname: event.url.pathname
	};
});
