import { QueryInterface } from 'sequelize'

export async function up(queryInterface: QueryInterface) {
  await queryInterface.bulkInsert('messages', [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message',
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('messages', {})
}