import { umzug } from './umzug'
import { createLogger } from '../utils/logger'

const logger = createLogger('migrations')

async function main() {
  const command = process.argv[2]

  try {
    switch (command) {
      case 'up':
        logger.info('Running migrations up')
        await umzug.up()
        break
      case 'down':
        logger.info('Running migrations down')
        await umzug.down()
        break
      case 'status':
        const pending = await umzug.pending()
        const executed = await umzug.executed()
        logger.info('Migration status:', {
          pending: pending.map(m => m.name),
          executed: executed.map(m => m.name)
        })
        break
      default:
        logger.error('Invalid command. Use: up, down, or status')
        process.exit(1)
    }
  } catch (error) {
    logger.error('Migration failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}