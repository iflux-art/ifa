/**
 * Check if a value is a valid email address
 *
 * @param email - Email string to validate
 * @returns True if the email is valid
 *
 * @example
 * ```ts
 * isValidEmail('user@example.com') // Returns: true
 * isValidEmail('invalid-email') // Returns: false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if a value is a valid URL
 *
 * @param url - URL string to validate
 * @returns True if the URL is valid
 *
 * @example
 * ```ts
 * isValidUrl('https://example.com') // Returns: true
 * isValidUrl('not-a-url') // Returns: false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Check if a string is a valid UUID
 *
 * @param uuid - UUID string to validate
 * @returns True if the UUID is valid
 *
 * @example
 * ```ts
 * isValidUuid('123e4567-e89b-12d3-a456-426614174000') // Returns: true
 * isValidUuid('invalid-uuid') // Returns: false
 * ```
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Check if a string contains only alphanumeric characters
 *
 * @param str - String to validate
 * @returns True if the string is alphanumeric
 *
 * @example
 * ```ts
 * isAlphanumeric('abc123') // Returns: true
 * isAlphanumeric('abc-123') // Returns: false
 * ```
 */
export function isAlphanumeric(str: string): boolean {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/
  return alphanumericRegex.test(str)
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 *
 * @param value - Value to check
 * @returns True if the value is empty
 *
 * @example
 * ```ts
 * isEmpty('') // Returns: true
 * isEmpty([]) // Returns: true
 * isEmpty({}) // Returns: true
 * isEmpty(null) // Returns: true
 * isEmpty('hello') // Returns: false
 * ```
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Check if a value is a number (including string numbers)
 *
 * @param value - Value to check
 * @returns True if the value is a number
 *
 * @example
 * ```ts
 * isNumeric(123) // Returns: true
 * isNumeric('123') // Returns: true
 * isNumeric('abc') // Returns: false
 * ```
 */
export function isNumeric(value: unknown): boolean {
  if (typeof value === 'number') {
    return !Number.isNaN(value) && Number.isFinite(value)
  }
  if (typeof value === 'string') {
    const num = Number.parseFloat(value)
    return !Number.isNaN(num) && Number.isFinite(num)
  }
  return false
}

/**
 * Check if a string is a valid JSON
 *
 * @param str - String to validate
 * @returns True if the string is valid JSON
 *
 * @example
 * ```ts
 * isValidJson('{"name": "John"}') // Returns: true
 * isValidJson('invalid json') // Returns: false
 * ```
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Validate password strength
 *
 * @param password - Password to validate
 * @param options - Validation options
 * @returns Validation result with score and feedback
 *
 * @example
 * ```ts
 * validatePassword('password123')
 * // Returns: { isValid: false, score: 2, feedback: ['Add uppercase letters', 'Add special characters'] }
 * ```
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number
    requireUppercase?: boolean
    requireLowercase?: boolean
    requireNumbers?: boolean
    requireSpecialChars?: boolean
  } = {}
): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options

  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length < minLength) {
    feedback.push(`Password must be at least ${minLength} characters long`)
  } else {
    score += 1
  }

  // Uppercase check
  if (requireUppercase && !/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters')
  } else if (/[A-Z]/.test(password)) {
    score += 1
  }

  // Lowercase check
  if (requireLowercase && !/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters')
  } else if (/[a-z]/.test(password)) {
    score += 1
  }

  // Numbers check
  if (requireNumbers && !/\d/.test(password)) {
    feedback.push('Add numbers')
  } else if (/\d/.test(password)) {
    score += 1
  }

  // Special characters check
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Add special characters')
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  }

  return {
    isValid: feedback.length === 0,
    score,
    feedback,
  }
}