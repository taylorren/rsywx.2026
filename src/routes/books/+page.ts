import { redirect } from '@sveltejs/kit';

// /books → the catalogue.
export const load = () => {
	throw redirect(307, '/books/list');
};
