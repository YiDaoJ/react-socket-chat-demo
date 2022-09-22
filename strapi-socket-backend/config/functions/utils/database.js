async function findUser(username, room) {
  try {
    const userExits = await strapi.services.users.find({username, room})
    return userExits
  } catch(err) {
    console.log("error while fetching: ", err)
  }
}

async function createUser({username, room, status, socketId}) {
  try {
    const user = await strapi.services.users.create({
      username,
      room,
      status,
      socketId
    })
    return user
  } catch (err) {
    console.log("User can not be created. Try again!")
  }
}

async function userExits(id) {
  try {
    const user = strapi.services.users.findOne({id})
    return user
  } catch (err) {
    console.log("Error occured when fetching user, ", err)
  }
}

async function getUsersInRoom(room) {
  try {
    const usersInRoom = await strapi.services.users.find({ room })
    return usersInRoom
  } catch (err) {
    console.log("Error occured: ", err)
  }
}

async function deleteUser(username) {
  try {
    const user = await strapi.services.users.delete({ username })
    return user
  } catch (err) {
    console.log('Error occured while deleting the User: ', err)
  }
}

module.exports = {
  findUser,
  createUser,
  userExits,
  getUsersInRoom,
  deleteUser
}
