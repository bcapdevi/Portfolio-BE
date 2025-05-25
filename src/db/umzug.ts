import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import sequelize from '../config/database'

export const umzug = new Umzug({
  migrations: {
    glob: 'src/db/migrations/*.ts',
    resolve: ({ name, path, context }) => {
      const migration = require(path!)
      return {
        name,
        up: async () => migration.up(context),
        down: async () => migration.down(context)
      }
    }
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console
})

// Export types
export type Migration = typeof umzug._types.migration