export function createDefaultPayload(type: string, title: string): Record<string, unknown> {
  const safeTitle = title.trim() || '未命名内容'

  if (type === 'page' || type === 'guide') {
    return { title: safeTitle, body: '', blocks: [] }
  }

  if (type === 'category') {
    return { label: safeTitle, description: '' }
  }

  if (type === 'banner') {
    return { title: safeTitle, description: '', priority: 0 }
  }

  if (type === 'project') {
    return {
      title: safeTitle,
      url: 'https://tjhub.cc',
      description: '待补充',
      category: 'student-project',
      tags: [],
      aliases: [],
      sourceKind: 'student',
      featured: false,
      placements: [],
      audience: ['all'],
      priority: 0,
      status: 'active',
      maintainers: []
    }
  }

  return {
    title: safeTitle,
    url: 'https://tjhub.cc',
    description: '待补充',
    category: 'tools',
    tags: [],
    aliases: [],
    sourceKind: 'official',
    official: false,
    featured: false,
    placements: [],
    audience: ['all'],
    priority: 0,
    status: 'active'
  }
}
