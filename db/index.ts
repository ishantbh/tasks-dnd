import { drizzle } from 'drizzle-orm/postgres-js'

import * as schema from './schema'

declare global {
  var db: ReturnType<typeof drizzle> | undefined
}

export const db =
  globalThis.db ?? drizzle(process.env.DATABASE_URL!, { schema })

if (process.env.NODE_ENV !== 'production') {
  globalThis.db = db
}
