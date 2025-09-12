# @repo/utils

Shared utility functions for the monorepo. A comprehensive collection of type-safe utility functions for common programming tasks.

## Installation

This package is part of the monorepo and should be installed via the workspace.

```bash
pnpm add @repo/utils
```

## Usage

```ts
import { cn, formatDate, debounce, unique } from '@repo/utils'

// Merge class names
const className = cn('px-4 py-2', 'bg-blue-500', { 'text-white': true })

// Format dates
const formatted = formatDate(new Date(), { includeTime: true })

// Debounce functions
const debouncedSearch = debounce((query: string) => {
  console.log('Searching:', query)
}, 300)

// Remove duplicates from arrays
const uniqueItems = unique([1, 2, 2, 3, 3, 4])
```

## API Reference

### Class Name Utilities

#### `cn(...inputs: ClassValue[]): string`
Utility function to merge class names with clsx. Combines multiple class values and removes duplicates.

```ts
cn('px-4 py-2', 'bg-blue-500', { 'text-white': true })
// Returns: 'px-4 py-2 bg-blue-500 text-white'
```

### Date Utilities

#### `formatDate(date: Date | string | number, options?: FormatDateOptions): string`
Format a date into a human-readable string with various options.

```ts
formatDate(new Date('2023-12-25'))
// Returns: 'Dec 25, 2023'

formatDate(new Date(), { includeTime: true, dateStyle: 'full' })
// Returns: 'Monday, December 25, 2023, 2:30 PM'
```

#### `formatRelativeTime(date: Date | string | number, locale?: string): string`
Format a date as a relative time string (e.g., "2 hours ago").

```ts
formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 2))
// Returns: '2 hours ago'
```

### Function Utilities

#### `debounce<T>(func: T, wait: number, options?: DebounceOptions): T`
Creates a debounced function that delays invoking func until after wait milliseconds have elapsed.

```ts
const debouncedSearch = debounce((query: string) => {
  console.log('Searching for:', query)
}, 300)

debouncedSearch('hello') // Will only execute after 300ms of no more calls
```

#### `throttle<T>(func: T, wait: number, options?: ThrottleOptions): T`
Creates a throttled function that only invokes func at most once per every wait milliseconds.

```ts
const throttledScroll = throttle(() => {
  console.log('Scroll event handled')
}, 100)
```

### String Utilities

#### Case Conversion
- `toKebabCase(str: string): string` - Convert to kebab-case
- `toCamelCase(str: string): string` - Convert to camelCase
- `toPascalCase(str: string): string` - Convert to PascalCase
- `toSnakeCase(str: string): string` - Convert to snake_case

```ts
toKebabCase('HelloWorld') // Returns: 'hello-world'
toCamelCase('hello-world') // Returns: 'helloWorld'
toPascalCase('hello-world') // Returns: 'HelloWorld'
toSnakeCase('HelloWorld') // Returns: 'hello_world'
```

#### Text Processing
- `capitalize(str: string): string` - Capitalize first letter
- `truncate(str: string, length: number, suffix?: string): string` - Truncate string
- `randomString(length: number, charset?: string): string` - Generate random string
- `stripHtml(str: string): string` - Remove HTML tags
- `escapeHtml(str: string): string` - Escape HTML special characters

### Array Utilities

#### `unique<T>(array: T[], keyFn?: (item: T) => any): T[]`
Remove duplicate items from an array.

```ts
unique([1, 2, 2, 3, 3, 4]) // Returns: [1, 2, 3, 4]
unique([{id: 1}, {id: 2}, {id: 1}], item => item.id) // Returns: [{id: 1}, {id: 2}]
```

#### `groupBy<T, K>(array: T[], keyFn: (item: T) => K): Record<K, T[]>`
Group array items by a key.

```ts
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
]
groupBy(users, user => user.role)
// Returns: { admin: [...], user: [...] }
```

#### Other Array Functions
- `chunk<T>(array: T[], size: number): T[][]` - Split array into chunks
- `shuffle<T>(array: T[]): T[]` - Shuffle array randomly
- `sample<T>(array: T[]): T | undefined` - Get random item
- `sampleSize<T>(array: T[], count: number): T[]` - Get multiple random items
- `intersection<T>(...arrays: T[][]): T[]` - Find common elements
- `difference<T>(array: T[], ...others: T[][]): T[]` - Find different elements

### Object Utilities

#### `deepClone<T>(obj: T): T`
Deep clone an object.

```ts
const original = { a: 1, b: { c: 2 } }
const cloned = deepClone(original)
```

#### `deepMerge<T>(target: T, ...sources: Partial<T>[]): T`
Deep merge multiple objects.

```ts
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = { b: { d: 3 }, e: 4 }
deepMerge(obj1, obj2) // Returns: { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

#### Property Manipulation
- `pick<T, K>(obj: T, keys: K[]): Pick<T, K>` - Pick specific properties
- `omit<T, K>(obj: T, keys: K[]): Omit<T, K>` - Omit specific properties
- `get<T>(obj: object, path: string, defaultValue?: T): T` - Get nested property
- `set<T>(obj: T, path: string, value: any): T` - Set nested property
- `has(obj: object, path: string): boolean` - Check if nested property exists

### Validation Utilities

#### `isValidEmail(email: string): boolean`
Check if a value is a valid email address.

#### `isValidUrl(url: string): boolean`
Check if a value is a valid URL.

#### `isValidUuid(uuid: string): boolean`
Check if a string is a valid UUID.

#### `validatePassword(password: string, options?: object): object`
Validate password strength with customizable requirements.

```ts
validatePassword('password123')
// Returns: { isValid: false, score: 2, feedback: ['Add uppercase letters', 'Add special characters'] }
```

#### Other Validation Functions
- `isAlphanumeric(str: string): boolean` - Check if alphanumeric
- `isEmpty(value: any): boolean` - Check if empty
- `isNumeric(value: any): boolean` - Check if numeric
- `isValidJson(str: string): boolean` - Check if valid JSON

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
pnpm test:watch
```

### Linting and Formatting

```bash
pnpm lint
pnpm format
pnpm check
```

## Features

- **Type Safe**: Full TypeScript support with proper type definitions
- **Tree Shakeable**: Import only what you need
- **Well Tested**: Comprehensive test coverage
- **Performance Optimized**: Efficient implementations
- **Zero Dependencies**: Minimal external dependencies (only clsx for class names)
- **Consistent API**: Predictable function signatures and behavior