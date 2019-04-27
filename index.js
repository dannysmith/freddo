const http = require('http')
require('dotenv').config()

// -------------
// SLACK CLIENTS
// -------------

// Event Client
const events = require('@slack/events-api').createEventAdapter(
  process.env.SLACK_APP_SIGNING_SECRET
)

// Web Client
const { WebClient } = require('@slack/web-api')

const web = new WebClient(process.env.SLACK_APP_BOT_OAUTH_TOKEN)

// -------------
// EXPRESS APP
// -------------

const port = process.env.PORT || 3000
const express = require('express')
const app = express()

// -------------
// HANDLERS
// -------------

app.use('/receive', events.expressMiddleware())

// Slack Event Listners
events.on('app_mention', (event) => {
  if (event.text.includes('new channel')) {
    ;(async () => {
      const { user, channel } = event

      // Message User
      console.log(`Request to make new channel from ${user} in ${channel}`)
      let res = await web.chat.postEphemeral({
        channel,
        user,
        text: `So you wanna make a new channel then?`,
      })
      console.log('Ephemeral Message sent: ', res)

      // Create Channel - SHIT THIS DOESN'T WORK
      res = await web.groups.create({
        name: 'temp-foobar',
      })
      console.log('Channel created: ', res)

      // Invite original user to channel
      res = await web.groups.invite({
        channel: res.group.id,
        user,
      })
      console.log('User Invited: ', res)
    })()
  }
})

// Handle errors (see `errorCodes` export)
events.on('error', console.error)

// -------------
// RUN SERVER
// -------------
http
  .createServer(app)
  .listen(port, () => console.log(`Freddo app listening on port ${port}!`))
