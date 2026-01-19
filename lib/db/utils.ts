/**
 * Server Actions utility helpers
 * Provides type-safe wrappers and consistent error handling for all Server Actions
 */

import { ZodType } from 'zod'

export type ActionResponse<T = void> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

/**
 * Wraps a server action with error handling and type safety
 * @param schema - Zod schema for input validation
 * @param action - The server action function to execute
 * @returns A wrapped function that handles errors consistently
 */
export function createServerAction<TInput, TOutput>(
  schema: ZodType<TInput>,
  action: (validatedInput: TInput) => Promise<TOutput>
) {
  return async (input: unknown): Promise<ActionResponse<TOutput>> => {
    try {
      // Validate input
      const validatedInput = schema.parse(input)

      // Execute action
      const result = await action(validatedInput)

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        }
      }

      // Handle unknown errors
      return {
        success: false,
        error: 'An unexpected error occurred',
      }
    }
  }
}

/**
 * Type guard to check if a response is successful
 */
export function isSuccess<T>(
  response: ActionResponse<T>
): response is { success: true; data: T } {
  return response.success
}

/**
 * Type guard to check if a response is an error
 */
export function isError<T>(
  response: ActionResponse<T>
): response is { success: false; error: string } {
  return !response.success
}
