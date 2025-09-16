/**
 * Convert a string to kebab-case
 *
 * @param str - String to convert
 * @returns Kebab-cased string
 *
 * @example
 * ```ts
 * toKebabCase('HelloWorld') // Returns: 'hello-world'
 * toKebabCase('hello_world') // Returns: 'hello-world'
 * toKebabCase('Hello World') // Returns: 'hello-world'
 * ```
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Convert a string to camelCase
 *
 * @param str - String to convert
 * @returns CamelCased string
 *
 * @example
 * ```ts
 * toCamelCase('hello-world') // Returns: 'helloWorld'
 * toCamelCase('hello_world') // Returns: 'helloWorld'
 * toCamelCase('Hello World') // Returns: 'helloWorld'
 * ```
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert a string to PascalCase
 *
 * @param str - String to convert
 * @returns PascalCased string
 *
 * @example
 * ```ts
 * toPascalCase('hello-world') // Returns: 'HelloWorld'
 * toPascalCase('hello_world') // Returns: 'HelloWorld'
 * toPascalCase('hello world') // Returns: 'HelloWorld'
 * ```
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * Convert a string to snake_case
 *
 * @param str - String to convert
 * @returns Snake_cased string
 *
 * @example
 * ```ts
 * toSnakeCase('HelloWorld') // Returns: 'hello_world'
 * toSnakeCase('hello-world') // Returns: 'hello_world'
 * toSnakeCase('Hello World') // Returns: 'hello_world'
 * ```
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

/**
 * Capitalize the first letter of a string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * ```ts
 * capitalize('hello world') // Returns: 'Hello world'
 * capitalize('HELLO WORLD') // Returns: 'Hello world'
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate a string to a specified length
 *
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add when truncated (defaults to '...')
 * @returns Truncated string
 *
 * @example
 * ```ts
 * truncate('Hello world', 5) // Returns: 'Hello...'
 * truncate('Hello world', 5, '…') // Returns: 'Hello…'
 * truncate('Hi', 5) // Returns: 'Hi'
 * ```
 */
export function truncate(str: string, length: number, suffix = "..."): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Generate a random string of specified length
 *
 * @param length - Length of the string to generate
 * @param charset - Character set to use (defaults to alphanumeric)
 * @returns Random string
 *
 * @example
 * ```ts
 * randomString(8) // Returns: 'aB3xY9mN'
 * randomString(4, 'ABCDEF') // Returns: 'ACEF'
 * ```
 */
export function randomString(
  length: number,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Remove HTML tags from a string
 *
 * @param str - String containing HTML
 * @returns String with HTML tags removed
 *
 * @example
 * ```ts
 * stripHtml('<p>Hello <strong>world</strong></p>') // Returns: 'Hello world'
 * ```
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML special characters
 *
 * @param str - String to escape
 * @returns Escaped string
 *
 * @example
 * ```ts
 * escapeHtml('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
