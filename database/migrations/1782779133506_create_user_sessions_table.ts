import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_sessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('external_user_id').notNullable()
      table.string('token', 500).notNullable().unique()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('expires_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}