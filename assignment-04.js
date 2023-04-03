/**
 * Luis Daniel Santiago Gutierrez 
 * 22132503
 * 
 * Browsers Tested:
 *      Google Chrome Versión 110.0.5481.178
 *      FireFox Versión 110.0.1
 * 
 * Operating System: 
 *      Windows
 * 
 * 
 * CHECK CONSOLE FOR TEST SCRIPT OF BACK END
 * FUNCTION IS CALLED TESTSCRIPT IF YOU WANT TO LOOK
 * 
 */


let mysql = require('mysql');
var http = require('http');
var qs = require('querystring');


let con = mysql.createConnection({
    host: "webcourse.cs.nuim.ie",
    user: "u230865",
    password: "chai6TheephuQu5e",
    database: "cs230_u230865"
});

class user {
    constructor(Title, FirstN, SurN, Phone, Email, HomeAddressFK = null, ShippingAddressFK = null){
        this.Title = Title;
        this.FirstN = FirstN;
        this.SurN = SurN;
        this.Phone = Phone;
        this.Email = Email;
        this.HomeAddressFK = HomeAddressFK;
        this.ShippingAddressFK = ShippingAddressFK;
    }
};

class Address {
    constructor(Line1, Line2, Town, County, Eircode){
        this.Line1 = Line1;
        this.Line2 = Line2;
        this.Town = Town;
        this.County = County;
        this.Eircode = Eircode;
    }
}

con.connect(function(err) {
    if (err) throw err;
    
    console.log("Connected");
})

// Creates a USER
function CreateUser(newUser, callback) {

    
    let createSql = `INSERT INTO USERS(Title, FirstN, SurN, Phone, Email, HomeAddressFK, ShippingAddressFK) Values ('${newUser.Title}', '${newUser.FirstN}', '${newUser.SurN}', '${newUser.Phone}', '${newUser.Email}', '${newUser.HomeAddressFK}', '${newUser.ShippingAddressFK}')`;

    con.query(createSql, (err, result, fiedls) => {
        if (err) throw err;
            

        error = err;
        res = result;

        return callback(err, result);
    })


}


function CreateHomeAddress(newAddress, callback ) {



    let createSql = `INSERT INTO HomeAddress(Line1, Line2, Town, County, Eircode) Values ('${newAddress.Line1}', '${newAddress.Line2}', '${newAddress.Town}', '${newAddress.County}', '${newAddress.Eircode}')`;

    con.query(createSql, (err, result, fiedls) => {
        if (err) throw err;
            

        error = err;
        res = result;

        return callback(err, result);
    })

}

function CreateShippingAddress(newAddress, callback) {



    let createSql = `INSERT INTO ShippingAddress(Line1, Line2, Town, County, Eircode) Values ('${newAddress.Line1}', '${newAddress.Line2}', '${newAddress.Town}', '${newAddress.County}', '${newAddress.Eircode}')`;

    con.query(createSql, (err, result, fiedls) => {
        if (err) throw err;
    
    

        error = err;
        res = result;

        return callback(err, result);
    })

}


function CreateUserWithAddresses(user, homeAddress, shippingAddress, callback) {

    CreateHomeAddress(homeAddress, (err, res) => {
        if (err) return callback(err)

        user.HomeAddressFK = res.insertId;

        CreateShippingAddress(shippingAddress, (err, res) => {
            if (err) return callback(err)

            user.ShippingAddressFK = res.insertId;

            CreateUser(user, (err, res) => {
                if (err) return callback(err)

                return callback(err, res)
            })

        })

    })

}



function GetUserAndAdressesByID(id, callback) {
    let selectSQL = `SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK AND USERS.PK = ${id}`;
    let options = {sql: selectSQL, nestTables: true};

    con.query(options, (err, res) => {

        if(err) throw err;
        

        return callback(err, res)
    })
}

function GetAllUserAndAdresses(callback) {
    let selectSQL = `SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK`;
    let options = {sql: selectSQL, nestTables: true};

    con.query(options, (err, res) => {

        if(err) throw err;
        

        return callback(err, res)
    })
}


function GetUserAndAdressesByName(name, callback) {
    let selectSQL = `SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK AND USERS.FirstN = '${name.FirstN}' AND USERS.SurN = '${name.SurN}'`;
    let options = {sql: selectSQL, nestTables: true};

    con.query(options, (err, res) => {

        if(err) throw err;
        

        return callback(err, res)
    })
}


function UpdateUserByID(id, user, callback) {

    let sql = `UPDATE USERS
    SET Title = '${user.Title}', Phone = '${user.Phone}', Email = '${user.Email}'
    WHERE PK = ${id};`

    con.query(sql, (err, res) => {

        if(err) throw err;
        

        return callback(err, res)
    })
}

function UpdateHomeAddressByID(id, address, callback) {

    let sql = `UPDATE HomeAddress
    SET Line1 = '${address.Line1}', Line2 = '${newAddress.Line2}', Town = '${newAddress.Town}', County = '${newAddress.County}', Eircode = '${newAddress.Eircode}'
    WHERE PK = ${id};`

    con.query(sql, (err, res) => {

        if(err) throw err;
        

        return callback(err, res)
    })
}

function UpdateShippingAddressByID(id, address, callback) {

    let sql = `UPDATE ShippingAddress
    SET Line1 = '${address.Line1}', Line2 = '${address.Line2}', Town = '${address.Town}', County = '${address.County}', Eircode = '${address.Eircode}'
    WHERE PK = '${id}';`

    con.query(sql, (err, res) => {

        if(err) throw err;
        

        return callback(err, res)
    })
}



function DeleteUser(user, callback) {
    

    let sql = `DELETE FROM USERS WHERE PK = ${user.PK}`;

    con.query(sql, (err, res) => {

        if(err) throw err;
        

        sql = `DELETE FROM ShippingAddress WHERE PK = ${user.ShippingAddressFK}`;

        con.query(sql, (err, res) => {

            if(err) throw err;
                

            sql = `DELETE FROM HomeAddress WHERE PK = ${user.HomeAddressFK}`;
    
            con.query(sql, (err, res) => {

                if(err) throw err;
                        

                return callback(err, res)
            })
        })
    })
}




function DeleteUserByNameEmailPhone(user, callback) {

    let sql = `SELECT * FROM USERS WHERE FirstN = '${user.FirstN}' AND SurN = '${user.SurN}' AND Phone = '${user.Phone}' AND Email = '${user.Email}'`
    

    con.query(sql, (err, res) => {

        if(err) throw err;
        
        
        user.PK = res[0].PK;
        user.ShippingAddressFK = res[0].ShippingAddressFK;
        user.HomeAddressFK = res[0].HomeAddressFK;

        sql = `DELETE FROM USERS WHERE PK = ${user.PK}`;
    
        con.query(sql, (err, res) => {
    
            if(err) throw err;
                
    
            sql = `DELETE FROM ShippingAddress WHERE PK = ${user.ShippingAddressFK}`;
    
            con.query(sql, (err, res) => {
    
                if(err) throw err;
                        
    
                sql = `DELETE FROM HomeAddress WHERE PK = ${user.HomeAddressFK}`;
        
                con.query(sql, (err, res) => {
    
                    if(err) throw err;
                                
    
                    return callback(err, res)
                })
            })
        })
    })

}


function TrasformToDataBaseObj(postData) {

    let newUser = new user(postData.Title, postData.FirstN, postData.SurN, postData.Phone, postData.Email);    

    let newHome = new Address(postData.Line1, postData.Line2, postData.Town, postData.County, postData.EirCode);    

    let newShip = new Address(postData.SLine1, postData.SLine2, postData.STown, postData.SCounty, postData.SEirCode);    

    return {newUser, newHome, newShip};

}


function TestScript() {

    let newUser = new user();
    newUser.Title = "Mr"
    newUser.FirstN = "Tester";
    newUser.SurN = "Script",
    newUser.Phone = "1234567890",
    newUser.Email = "Test@gmail.com"

    newHomeAddress = new Address("123 Test Home", "", "Test Home", "Test Home County", "152AN");
    newShippingAddress = new Address("123 Test Ship", "", "Test Ship", "Test Ship County", "152AN");

    console.log("Creating Following user:");
    console.log("User:", newUser);
    console.log("Home Address:0", newHomeAddress);
    console.log("Shipping Address:", newShippingAddress);

    //CRUD TEST

    // CREATE
    CreateUserWithAddresses(newUser, newHomeAddress, newShippingAddress, (err, res) => {

        if (err) throw err;

        let testPK = res.insertId

        // RETRIEVE
        GetAllUserAndAdresses((err, res) => {
            if (err) throw err;

            console.log("ALL USERS, NEW USER IS LAST");
            console.log(res);

            let retrieveName = {
                FirstN: "Tester",
                SurN: "Script"
            }

            GetUserAndAdressesByName(retrieveName, (err, res) => {
                if (err) throw err;

                console.log("Person with Name: ", retrieveName.FirstN, "  ", retrieveName.SurN);
                console.log(res);

                newUser.Title = "Ms"
                newUser.FirstN = "Tester";
                newUser.SurN = "Script",
                newUser.Phone = "999999999",
                newUser.Email = "UpdatedTest@gmail.com"

                // UPDATE
                UpdateUserByID(testPK, newUser, (err, res) => {
                    if (err) throw err;

                    console.log("UPDATED USER Title, Phone, Email");

                    updateHomeAddress = new Address("123 UPDATE Home", "", "UPDATE Home", "UPDATE Home County", "152AN");

                    GetUserAndAdressesByID(testPK, (err, res) => {
                        if (err) throw err;

                        // console.log(res);

                        UpdateShippingAddressByID(res[0].PK, updateHomeAddress, (err, res) => {
                            if (err) throw err;

                            console.log("UPDATED HOME ADDRESS");

                            GetUserAndAdressesByID(testPK, (err, res) => {
                                if (err) throw err;
        
                                console.log(res);

                                // DELETE
                                DeleteUserByNameEmailPhone(newUser, (err, res) => {

                                    if (err) throw err;

                                    console.log("TEST USER HAS BEEN DELETED");

                                    GetAllUserAndAdresses((err, res) => {
                                        if (err) throw err;

                                        console.log(res);

                                    })

                                })

                            })

                        })

                    })
 

                })

            })

        });

    });

}

TestScript();



http.createServer(function (req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    res.write(req.url);
    

    if(req.method == "POST") {        

        var body = '';

        req.on('data', function (POSTdata) {
            body += POSTdata;
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);            

            let {newUser, newHome, newShip} = TrasformToDataBaseObj(post);

            CreateUserWithAddresses(newUser, newHome, newShip, ((err, DBres) => {
                if (err) throw err;
                

                res.end("DBres");
            }))


        });

    }
    else {  
        GetAllUserAndAdresses((err, data) => {
            if (err) throw err;
            let results; 
                    
    
            let html = "";
    
            data.forEach(row => {
                html += `
                <tr>
                <td>${row.USERS.Title}</td>
                <td>${row.USERS.FirstN}</td>
                <td>${row.USERS.SurN}</td>
                <td>${row.USERS.Phone}</td>
                <td>${row.USERS.Email}</td>

                <td>${row.HomeAddress.Line1}</td>
                <td>${row.HomeAddress.Line2}</td>
                <td>${row.HomeAddress.Town}</td>
                <td>${row.HomeAddress.County}</td>
                <td>${row.HomeAddress.Eircode}</td>

                <td>${row.ShippingAddress.Line1}</td>
                <td>${row.ShippingAddress.Line2}</td>
                <td>${row.ShippingAddress.Town}</td>
                <td>${row.ShippingAddress.County}</td>
                <td>${row.ShippingAddress.Eircode}</td>
                </tr>`
            });

        
    
    
            res.end(html);
        })
    }






  }).listen(3000);

