import { createServer } from './server'
import sequelize from './config/database'
import { createLogger } from './utils/logger'

const logger = createLogger('server')

const start = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    logger.info('Database connection established')

    const server = await createServer()
    const port = Number(process.env.PORT) || 8080
    const host = '0.0.0.0'

    await server.listen({ port, host })
  } catch (err) {
    logger.error('Error starting server:', err)
    process.exit(1)
  }
}

start()