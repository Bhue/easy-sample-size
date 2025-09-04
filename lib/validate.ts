import { z } from 'zod'

export const alphaSchema = z.number().gt(0).lt(1)
export const powerSchema = z.number().gt(0).lt(1)
export const probSchema = z.number().gt(0).lt(1)
export const ratioSchema = z.number().gt(0)
export const positiveSchema = z.number().gt(0)

export const tailSchema = z.enum(['two-sided', 'one-sided'])

