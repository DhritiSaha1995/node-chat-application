const users = []

const addUser = ({id, username, room})=>{

    // cleanup data

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data

    if(!username || !room){
        return {
            error : 'Username and room are required.'
        }
    }
    
    // check for existingUsers

    const existingUser = users.find((user)=>{
         
        return user.username === username && user.room === room

    })
    

    // validate username
    if(existingUser){
        return {
            error: 'Username already in use!'
        }
    }

    //Storing user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>    user.id === id )
    if (index !== -1)

    {    
        // console.log(users.splice(index,2))
        return users.splice(index, 1)[0]
    }
         
}

const getUser = (id)=>{
  return users.find((user)=>  user.id === id )
}

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}

// const getUsersInRoom = (room)=>{
//     room = room.trim().toLowerCase()
//     const allUsers = users.filter((user)=>{
//         if(user.room === room){
//             return true
//         }
//     })
//     return allUsers
// }

// addUser({
//     id: 25,
//     username: 'Dhriti',
//     room: "City Center"
// })
//  addUser({
//      id: 42, 
//      username: "Mike",
//      room: "City Center"
//  })
//  addUser({
//     id: 32,
//     username: 'Dhriti',
//     room: "South Philly"
//  })

// const user = getUsersInRoom('city center')
// console.log(user)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}