import { google } from 'googleapis'
import { createLogger } from '../utils/logger'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'

// Load environment variables
dotenv.config()

const logger = createLogger('oauth2')
const TOKENS_PATH = path.join(__dirname, '../../.oauth2-tokens.json')

// Verify environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  logger.error('Missing required environment variables')
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
)

// Handle token updates
oauth2Client.on('tokens', async (tokens) => {
  if (tokens.refresh_token) {
    logger.info('New refresh token received')
    try {
      await fs.writeFile(TOKENS_PATH, JSON.stringify(tokens, null, 2))
      logger.info('Tokens saved successfully')
    } catch (error) {
      logger.error('Failed to save tokens:', error)
    }
  }
})

// Generate an authentication URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose'
  ],
  prompt: 'consent',
  include_granted_scopes: true
})

console.log('\nAuthorization URL:', authUrl, '\n')

// Handle authorization code
async function handleAuthCode(code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    console.log('\nTokens received successfully!')
    
    if (tokens.refresh_token) {
      console.log('\nRefresh Token:', tokens.refresh_token)
      console.log('\nAdd this to your .env file as GOOGLE_REFRESH_TOKEN\n')
    } else {
      console.log('\nNo refresh token received. Try revoking access and running again.\n')
    }
  } catch (error) {
    logger.error('Error getting tokens:', error)
    process.exit(1)
  }
}

// Process command line arguments
if (process.argv[2]) {
  handleAuthCode(process.argv[2])
} else {
  console.log('To get your refresh token:')
  console.log('1. Copy the URL above and open it in your browser')
  console.log('2. Complete the authorization flow')
  console.log('3. Copy the code from the redirect URL')
  console.log('4. Run: npx ts-node src/scripts/get-refresh-token.ts <code>\n')
}