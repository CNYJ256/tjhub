import { z } from 'zod'

export const sourceKindSchema = z.enum(['official', 'student', 'third_party', 'internal'])
export const entryStatusSchema = z.enum(['active', 'stale', 'unavailable', 'archived'])
export const visibilitySchema = z.enum(['public', 'hidden', 'draft'])
export const reviewStatusSchema = z.enum(['draft', 'pending', 'approved', 'rejected'])

const pageBlockSchema = z.object({
  type: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  source: z.string().optional(),
  collection: z.enum(['links', 'projects']).optional(),
  placement: z.string().optional(),
  limit: z.number().int().positive().optional()
})

export const pageSchema = z.object({
  type: z.enum(['page', 'guide']),
  title: z.string().min(1),
  slug: z.string().min(1),
  visibility: visibilitySchema.default('public'),
  reviewStatus: reviewStatusSchema.default('approved'),
  blocks: z.array(pageBlockSchema).default([])
})

export const linkSchema = z.object({
  type: z.literal('link'),
  title: z.string().min(1),
  slug: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  sourceKind: sourceKindSchema,
  official: z.boolean().default(false),
  featured: z.boolean().default(false),
  placements: z.array(z.string()).default([]),
  audience: z.array(z.string()).default(['all']),
  priority: z.number().int().default(0),
  status: entryStatusSchema.default('active'),
  visibility: visibilitySchema.default('public'),
  reviewStatus: reviewStatusSchema.default('approved'),
  contributors: z.array(z.string()).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastCheckedAt: z.string().optional(),
  guideSlug: z.string().optional()
})

export const projectSchema = z.object({
  type: z.literal('project'),
  title: z.string().min(1),
  slug: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  sourceKind: sourceKindSchema.default('student'),
  featured: z.boolean().default(false),
  placements: z.array(z.string()).default([]),
  audience: z.array(z.string()).default(['all']),
  priority: z.number().int().default(0),
  status: entryStatusSchema.default('active'),
  visibility: visibilitySchema.default('public'),
  reviewStatus: reviewStatusSchema.default('approved'),
  maintainers: z.array(z.string()).default([]),
  contributors: z.array(z.string()).default([]),
  lastCheckedAt: z.string().optional()
})
