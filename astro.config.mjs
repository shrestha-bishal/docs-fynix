// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Fynix PHP v3',
			description: 'Fynix PHP v3 is a framework-agnostic validation engine with fluent rules, structured errors, DTO validation, and nested object support.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/shrestha-bishal/fynix' },
				{ icon: 'seti:php', label: 'Packagist', href: 'https://packagist.org/packages/bishalshrestha/fynix' },
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Introduction', slug: 'introduction' },
					],
				},
				{
					label: 'Public API',
					items: [
						{ label: 'Reference overview', slug: 'reference/overview' },
						{ label: 'Rule, RuleSet, and registry', slug: 'reference/rules-and-registry' },
						{ label: 'Validation handler and errors', slug: 'reference/validation-handler' },
						{ label: 'Composable rules', slug: 'reference/composable-rules' },
						{
							label: 'Fluent API',
							items: [
								{ label: 'Overview', slug: 'reference/methods/overview' },
								{ label: 'label()', slug: 'reference/methods/label' },
								{ label: 'min()', slug: 'reference/methods/min' },
								{ label: 'max()', slug: 'reference/methods/max' },
								{ label: 'length()', slug: 'reference/methods/length' },
								{ label: 'required() and optional()', slug: 'reference/methods/required' },
								{ label: 'in()', slug: 'reference/methods/in' },
								{ label: 'notIn()', slug: 'reference/methods/not-in' },
								{ label: 'sameAs()', slug: 'reference/methods/same-as' },
								{ label: 'differentFrom()', slug: 'reference/methods/different-from' },
								{ label: 'requiredIf()', slug: 'reference/methods/required-if' },
								{ label: 'requiredUnless()', slug: 'reference/methods/required-unless' },
								{ label: 'prohibitedIf()', slug: 'reference/methods/prohibited-if' },
								{ label: 'prohibitedUnless()', slug: 'reference/methods/prohibited-unless' },
								{ label: 'genericValidation()', slug: 'reference/methods/generic-validation' },
								{ label: 'withoutGenericValidation()', slug: 'reference/methods/without-generic-validation' },
								{ label: 'validate()', slug: 'reference/methods/validate' },
								{ label: 'validateAll()', slug: 'reference/methods/validate-all' },
							],
						},
					],
				},
				{
					label: 'Validation capabilities',
					items: [
						{ label: 'Capability overview', slug: 'reference/validators' },
						{ label: 'Text validation', slug: 'reference/validators/string' },
						{ label: 'Boolean validation', slug: 'reference/validators/boolean' },
						{ label: 'Number validation', slug: 'reference/validators/number' },
						{ label: 'Integer validation', slug: 'reference/validators/integer' },
						{ label: 'Decimal validation', slug: 'reference/validators/decimal' },
						{ label: 'Email validation', slug: 'reference/validators/email' },
						{ label: 'Username validation', slug: 'reference/validators/username' },
						{ label: 'Phone validation', slug: 'reference/validators/phone-number' },
						{ label: 'Password validation', slug: 'reference/validators/password' },
						{ label: 'Date and time validation', slug: 'reference/validators/date-time' },
						{ label: 'URL validation', slug: 'reference/validators/url' },
						{ label: 'UUID validation', slug: 'reference/validators/uuid' },
						{ label: 'IP address validation', slug: 'reference/validators/ip-address' },
						{ label: 'Pattern validation', slug: 'reference/validators/regex' },
						{ label: 'Array validation', slug: 'reference/validators/array' },
						{ label: 'Enum validation', slug: 'reference/validators/enum' },
						{ label: 'File validation', slug: 'reference/validators/file' },
						{ label: 'Image validation', slug: 'reference/validators/image' },
						{ label: 'Multiple-image validation', slug: 'reference/validators/images' },
						{ label: 'Nested object validation', slug: 'reference/validators/object' },
						{ label: 'Object array validation', slug: 'reference/validators/object-array' },
					],
				},
				{
					label: 'Advanced reference',
					items: [
						{ label: 'Advanced patterns', slug: 'reference/advanced-patterns' },
					],
				},
				{
					label: 'Examples',
					items: [
						{ label: 'Examples overview', slug: 'examples' },
						{ label: 'Standalone values', slug: 'examples/standalone' },
						{ label: 'Array and collection validation', slug: 'examples/arrays' },
						{ label: 'Object and DTO validation', slug: 'examples/objects' },
						{ label: 'File and image validation', slug: 'examples/uploads' },
						{ label: 'Registration workflow', slug: 'examples/registration' },
						{ label: 'Nested order validation', slug: 'examples/nested-order' },
						{ label: 'Field and API errors', slug: 'examples/field-errors' },
						{ label: 'Validation recipes', slug: 'examples/recipes' },
						{ label: 'Validator examples', slug: 'examples/validators' },
					],
				},
				{
					label: 'Playground',
					items: [
						{ label: 'Interactive playground', slug: 'playground' },
					],
				},
			],
		}),
	],
});
