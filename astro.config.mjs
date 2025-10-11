// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Fynix PHP',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/shrestha-bishal/fynix' },
				{ icon: 'seti:php', label: 'Packagist', href: 'https://packagist.org/packages/bishalshrestha/fynix' },
			],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
