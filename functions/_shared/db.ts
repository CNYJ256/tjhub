export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`
}

export async function getOne<T>(statement: D1PreparedStatement): Promise<T | null> {
  const result = await statement.first<T>()
  return result || null
}

export async function requireOne<T>(statement: D1PreparedStatement, message = '记录不存在。'): Promise<T> {
  const row = await getOne<T>(statement)
  if (!row) {
    throw new Error(message)
  }
  return row
}
