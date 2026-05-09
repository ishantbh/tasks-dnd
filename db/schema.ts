import { relations } from 'drizzle-orm'
import {
  doublePrecision,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

/* TABLES */
export const columnTable = pgTable(
  'columns',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    position: doublePrecision('position').notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      precision: 3,
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      precision: 3,
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (tbl) => [index('column_position_idx').on(tbl.position)],
)

export const taskTable = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    columnId: uuid('column_id')
      .notNull()
      .references(() => columnTable.id, { onDelete: 'cascade' }),
    content: varchar('content', { length: 255 }).notNull(),
    position: doublePrecision('position').notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      precision: 3,
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      precision: 3,
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (tbl) => [
    index('task_column_idx').on(tbl.columnId),

    index('task_column_position_idx').on(tbl.columnId, tbl.position),
  ],
)

/* RELATIONS */
export const columnRelations = relations(columnTable, ({ many }) => ({
  tasks: many(taskTable),
}))

export const taskRelations = relations(taskTable, ({ one }) => ({
  column: one(columnTable, {
    fields: [taskTable.columnId],
    references: [columnTable.id],
  }),
}))

/* TYPES */
export type Task = typeof taskTable.$inferSelect
export type NewTask = typeof taskTable.$inferInsert

export type Column = typeof columnTable.$inferSelect
export type NewColumn = typeof columnTable.$inferInsert
