'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const { parseCommand } = require('./command.js');
const fetch = require('node-fetch');

// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
async function handleEvent(event) {
  if (event.type === 'join') {
    const groupId = event.source.groupId;
    const groupSummary = await client.getGroupSummary(groupId);


    return client.pushMessage({
      to: "C1119bc1221f84a5e9c6fad69b44c7d5b",
      messages: [{
        type: 'text',
        text: `Bot invited to\nGroup Name: ${groupSummary.groupName}\nGroup ID: ${groupSummary.groupId}`,
      }]
    });
  };

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // if (event.message.text == '/getuserid') {
  //   return client.replyMessage({
  //     replyToken: event.replyToken,
  //     messages: [{
  //       type: 'text',
  //       text: `Your user id is ${event.source.userId}`
  //     }]
  //   });
  // }
  
  const { api, ...data } = await parseCommand(event.message.text);

  if (!api) {
    return Promise.resolve(null);
  }

  if (api === 'reply') {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [data],
    });
  }

  if (api === 'push') {
    return client.pushMessage({
      to: event.source.userId,
      messages: [data],
    });
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});