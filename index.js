const http = require('http')
require('dotenv').config()

// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api')
const slackEvents = createEventAdapter(process.env.SLACK_APP_SIGNING_SECRET)

// Express Server
const port = process.env.PORT || 3000
const express = require('express')
const app = express()

// Mount Event handler on a route
app.use('/receive', slackEvents.expressMiddleware())

// Slack Event Listners
slackEvents.on('app_mention', (event) => {
  if (event.text.includes('new channel')) {
    console.log('Time to make a new channel then!')
    console.log(event)

    let { user, channel } = event
  }
})

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error)

// Express Routes
app.get('/', (req, res) => res.send('Nothing here'))

// Run Server
http
  .createServer(app)
  .listen(port, () => console.log(`Freddo app listening on port ${port}!`))
