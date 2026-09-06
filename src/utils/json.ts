/**
 * Safely stringifies a JSON object for inclusion in an HTML context (like `<script>` tags).
 * Escapes characters that could be used to break out of the script tag or execute XSS.
 */
export function safeJsonStringify(obj: any): string {
	return JSON.stringify(obj)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}
