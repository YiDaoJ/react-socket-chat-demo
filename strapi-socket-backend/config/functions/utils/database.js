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

module.exports = {
  findUser,
  createUser,
  userExits
}
