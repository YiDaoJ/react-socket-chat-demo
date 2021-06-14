'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

const { findUser, createUser, userExits } = require('./utils/database')

module.exports = () => {
  const io = require('socket.io')(strapi.server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', function(socket) {
    socket.on('join', async ({ username, room }, callback) => {
      try {
        const userExits = await findUser(username, room)

        if (userExits.length > 0) {
          callback(`User ${username} already exists in room no${room}. Please select a different name or room.`)
        } else {
          const user = await createUser({username,room, status: 'ONLINE', socketId: socket.id})

          if(user) {
            socket.join(user.room)
            socket.emit('welcome', {
              user: 'bot',
              text: `${user.username}, Welcome to room ${user.room}.`,
              userData: user
            })
            socket.broadcast.to(user.room).emit('message', {
              user: 'bot',
              text: `${user.username} has joined.`
            })
          } else {
            callback('user can not be created. Try again.')
          }

        }

        callback()

      } catch (err) {
        console.log('Error occured, try again!', error)
      }
    })

    socket.on('sendMessage', async(data, callback) => {
      try {
        const user = await userExits(data.userId)

        if(user) {
          io.to(user.room).emit('message', {
            user: user.username,
            text: data.message
          })
        } else {
          callback("User doesn't exist in the database. Rejoin the chat.")
        }

        callback()

      } catch(err) {
        console.log('Catched error: ', err)
      }
    })

  });
};
