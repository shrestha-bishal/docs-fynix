// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Fynix PHP',
			description: 'A modern, framework-agnostic PHP validation engine for DTOs, files, and nested object graphs.',
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
					label: 'Core concepts',
					items: [
						{ label: 'Reference overview', slug: 'reference/overview' },
						{ label: 'Rule, RuleSet, and registry', slug: 'reference/rules-and-registry' },
						{ label: 'Validation handler and errors', slug: 'reference/validation-handler' },
						{ label: 'Composable rules', slug: 'reference/composable-rules' },
						{ label: 'Advanced patterns', slug: 'reference/advanced-patterns' },
					],
				},
				{
					label: 'Validators',
					items: [
						{ label: 'Validator overview', slug: 'reference/validators' },
						{ label: 'StringValidator', slug: 'reference/validators/string' },
						{ label: 'BooleanValidator', slug: 'reference/validators/boolean' },
						{ label: 'NumberValidator', slug: 'reference/validators/number' },
						{ label: 'IntegerValidator', slug: 'reference/validators/integer' },
						{ label: 'DecimalValidator', slug: 'reference/validators/decimal' },
						{ label: 'EmailValidator', slug: 'reference/validators/email' },
						{ label: 'UsernameValidator', slug: 'reference/validators/username' },
						{ label: 'PhoneNumberValidator', slug: 'reference/validators/phone-number' },
						{ label: 'PasswordValidator', slug: 'reference/validators/password' },
						{ label: 'DateTimeValidator', slug: 'reference/validators/date-time' },
						{ label: 'UrlValidator', slug: 'reference/validators/url' },
						{ label: 'UuidValidator', slug: 'reference/validators/uuid' },
						{ label: 'IpAddressValidator', slug: 'reference/validators/ip-address' },
						{ label: 'RegexValidator', slug: 'reference/validators/regex' },
						{ label: 'ArrayValidator', slug: 'reference/validators/array' },
						{ label: 'EnumValidator', slug: 'reference/validators/enum' },
						{ label: 'FileValidator', slug: 'reference/validators/file' },
						{ label: 'ImageValidator', slug: 'reference/validators/image' },
						{ label: 'ImagesValidator', slug: 'reference/validators/images' },
						{ label: 'ObjectValidator', slug: 'reference/validators/object' },
						{ label: 'ObjectArrayValidator', slug: 'reference/validators/object-array' },
					],
				},
				{
					label: 'Rule facade',
					items: [
						{ label: 'Rule::string()', slug: 'reference/validators/string' },
						{ label: 'Rule::boolean()', slug: 'reference/validators/boolean' },
						{ label: 'Rule::number()', slug: 'reference/validators/number' },
						{ label: 'Rule::integer()', slug: 'reference/validators/integer' },
						{ label: 'Rule::decimal()', slug: 'reference/validators/decimal' },
						{ label: 'Rule::email()', slug: 'reference/validators/email' },
						{ label: 'Rule::phoneNumber()', slug: 'reference/validators/phone-number' },
						{ label: 'Rule::password()', slug: 'reference/validators/password' },
						{ label: 'Rule::dateTime()', slug: 'reference/validators/date-time' },
						{ label: 'Rule::url()', slug: 'reference/validators/url' },
						{ label: 'Rule::uuid()', slug: 'reference/validators/uuid' },
						{ label: 'Rule::ipAddress()', slug: 'reference/validators/ip-address' },
						{ label: 'Rule::regex()', slug: 'reference/validators/regex' },
						{ label: 'Rule::array()', slug: 'reference/validators/array' },
						{ label: 'Rule::enum()', slug: 'reference/validators/enum' },
						{ label: 'Rule::file()', slug: 'reference/validators/file' },
						{ label: 'Rule::image()', slug: 'reference/validators/image' },
						{ label: 'Rule::images()', slug: 'reference/validators/images' },
						{ label: 'Rule::object()', slug: 'reference/validators/object' },
						{ label: 'Rule::objectArray()', slug: 'reference/validators/object-array' },
						{ label: 'Rule::username()', slug: 'reference/validators/username' },
					],
				},
				{
					label: 'Rule methods',
					items: [
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
						{ label: 'validateField()', slug: 'reference/methods/validate-field' },
						{ label: 'validateFieldAll()', slug: 'reference/methods/validate-field-all' },
					],
				},
			],
		}),
	],
});
