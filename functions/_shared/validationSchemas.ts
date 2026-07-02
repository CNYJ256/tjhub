import { z } from 'zod'

export const linkPayloadSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().or(z.string().min(1)),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  sourceKind: z.enum(['official', 'student', 'third_party', 'internal']),
  official: z.boolean().default(false),
  featured: z.boolean().default(false),
  placements: z.array(z.string()).default([]),
  audience: z.array(z.string()).default(['all']),
  priority: z.number().int().default(0),
  status: z.enum(['active', 'stale', 'unavailable', 'archived']).default('active'),
  guideSlug: z.string().optional()
})

export const projectPayloadSchema = linkPayloadSchema.extend({
  maintainers: z.array(z.string()).default([])
}).omit({ official: true })

export const pagePayloadSchema = z.object({
  title: z.string().min(1),
  body: z.string().default(''),
  blocks: z.array(z.object({
    type: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    body: z.string().optional(),
    collection: z.enum(['links', 'projects', 'guides']).optional(),
    placement: z.string().optional(),
    limit: z.number().int().positive().optional()
  })).default([])
})

const schemaByType: Record<string, z.ZodTypeAny> = {
  link: linkPayloadSchema,
  project: projectPayloadSchema,
  page: pagePayloadSchema,
  guide: pagePayloadSchema,
  category: z.object({ label: z.string().min(1), description: z.string().default('') }),
  banner: z.object({ title: z.string().min(1), description: z.string().default(''), imageUrl: z.string().optional(), primaryLink: z.string().optional(), secondaryLink: z.string().optional(), priority: z.number().int().default(0) })
}

export function validatePayload(type: string, payload: unknown): { ok: false; message: string } | { ok: true } {
  const schema = schemaByType[type]
  if (!schema) return { ok: false, message: `不支持的内容类型：${type}` }
  const result = schema.safeParse(payload)
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('；')
    return { ok: false, message: `内容校验失败：${issues}` }
  }
  return { ok: true }
}
