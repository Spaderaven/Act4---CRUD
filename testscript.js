import * as server from './server'


server.GetUserAndAdressesByID(3, (err, res) => {

    if(err) throw err;

    console.log("ANSDER", re);

})