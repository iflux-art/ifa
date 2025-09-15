/**
 * Remove duplicate items from an array
 *
 * @param array - Array to deduplicate
 * @param keyFn - Optional function to extract comparison key
 * @returns Array with duplicates removed
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 4]) // Returns: [1, 2, 3, 4]
 * unique([{id: 1}, {id: 2}, {id: 1}], item => item.id) // Returns: [{id: 1}, {id: 2}]
 * ```
 */
export function unique<T, K>(array: T[], keyFn?: (item: T) => K): T[] {
  if (!keyFn) {
    return [...new Set(array)]
  }

  const seen = new Set<K>()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Group array items by a key
 *
 * @param array - Array to group
 * @param keyFn - Function to extract grouping key
 * @returns Object with grouped items
 *
 * @example
 * ```ts
 * const users = [
 *   { name: 'John', role: 'admin' },
 *   { name: 'Jane', role: 'user' },
 *   { name: 'Bob', role: 'admin' }
 * ]
 * groupBy(users, user => user.role)
 * // Returns: { admin: [{ name: 'John', role: 'admin' }, { name: 'Bob', role: 'admin' }], user: [{ name: 'Jane', role: 'user' }] }
 * ```
 */
export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    },
    {} as Record<K, T[]>
  )
}

/**
 * Chunk an array into smaller arrays of specified size
 *
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5, 6], 2) // Returns: [[1, 2], [3, 4], [5, 6]]
 * chunk([1, 2, 3, 4, 5], 3) // Returns: [[1, 2, 3], [4, 5]]
 * ```
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) throw new Error('Chunk size must be greater than 0')

  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 *
 * @param array - Array to shuffle
 * @returns New shuffled array
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]) // Returns: [3, 1, 5, 2, 4] (random order)
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get a random item from an array
 *
 * @param array - Array to pick from
 * @returns Random item from the array
 *
 * @example
 * ```ts
 * sample([1, 2, 3, 4, 5]) // Returns: 3 (random)
 * sample(['apple', 'banana', 'cherry']) // Returns: 'banana' (random)
 * ```
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Get multiple random items from an array
 *
 * @param array - Array to pick from
 * @param count - Number of items to pick
 * @returns Array of random items
 *
 * @example
 * ```ts
 * sampleSize([1, 2, 3, 4, 5], 3) // Returns: [2, 4, 1] (random)
 * ```
 */
export function sampleSize<T>(array: T[], count: number): T[] {
  if (count >= array.length) return shuffle(array)
  if (count <= 0) return []

  const shuffled = shuffle(array)
  return shuffled.slice(0, count)
}

/**
 * Find the intersection of multiple arrays
 *
 * @param arrays - Arrays to intersect
 * @returns Array containing common elements
 *
 * @example
 * ```ts
 * intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]) // Returns: [3]
 * ```
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return [...arrays[0]]

  return arrays[0].filter(item =>
    arrays.slice(1).every(array => array.includes(item))
  )
}

/**
 * Find the difference between arrays
 *
 * @param array - Base array
 * @param others - Arrays to subtract
 * @returns Array with items not in other arrays
 *
 * @example
 * ```ts
 * difference([1, 2, 3, 4], [2, 4], [3]) // Returns: [1]
 * ```
 */
export function difference<T>(array: T[], ...others: T[][]): T[] {
  const otherItems = new Set(others.flat())
  return array.filter(item => !otherItems.has(item))
}
