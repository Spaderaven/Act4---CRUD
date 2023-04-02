let mysql = require('mysql');
var http = require('http');
const { log } = require('console');
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


function RunQuery(sql, callback) {
    console.log(sql);
    
    let error, res;

    con.query(sql, function(err, result, fiedls) {
        if (err) throw err;
    
        // console.log("THE RESUTL Q", result);

        error = err;
        res = result;

        return callback(err, result);
    })

}

// CreateUser();

let newUser = new user();
newUser.Title = "Mr"
newUser.FirstN = "NEWERMiguel";
newUser.SurN = "asdasd",
newUser.Phone = "3213150",
newUser.Email = "asdasasd.com"

let homeAddress = new Address("123 Fake Street", null, "My Town", "My County", "152AN");
let shippingAddress = new Address("321 Fake Street", null, "My Town", "My County", "152AN");

// CreateUserWithAddresses(newUser, homeAddress, shippingAddress, ()=>{});

function CreateUser(newUser, callback) {

    
    let createSql = `INSERT INTO USERS(Title, FirstN, SurN, Phone, Email, HomeAddressFK, ShippingAddressFK) Values ('${newUser.Title}', '${newUser.FirstN}', '${newUser.SurN}', '${newUser.Phone}', '${newUser.Email}', '${newUser.HomeAddressFK}', '${newUser.ShippingAddressFK}')`;

    // let { err, res } = RunQuery(createSql);

    let selectSQL = 'Select * From USERS'

    con.query(createSql, (err, result, fiedls) => {
        if (err) throw err;
    
        console.log("THE RESUTL Q", result);

        error = err;
        res = result;

        return callback(err, result);
    })


}


function CreateHomeAddress(newAddress, callback ) {

    // newAddress = new Address("123 Fake Street", null, "My Town", "My County", "152AN");

    let createSql = `INSERT INTO HomeAddress(Line1, Line2, Town, County, Eircode) Values ('${newAddress.Line1}', '${newAddress.Line2}', '${newAddress.Town}', '${newAddress.County}', '${newAddress.Eircode}')`;

    con.query(createSql, (err, result, fiedls) => {
        if (err) throw err;
    
        console.log("THE RESUTL Q", result);

        error = err;
        res = result;

        return callback(err, result);
    })

}

function CreateShippingAddress(newAddress, callback) {

    // newAddress = new Address("123 Fake Street", null, "My Town", "My County", "152AN");

    let createSql = `INSERT INTO ShippingAddress(Line1, Line2, Town, County, Eircode) Values ('${newAddress.Line1}', '${newAddress.Line2}', '${newAddress.Town}', '${newAddress.County}', '${newAddress.Eircode}')`;

    con.query(createSql, (err, result, fiedls) => {
        if (err) throw err;
    
        // console.log("THE RESUTL Q", result);

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


// GetUserAndAdressesByID(3, () => {});

function GetUserAndAdressesByID(id, callback) {
    let selectSQL = `SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK AND USERS.PK = ${id}`;
    let options = {sql: selectSQL, nestTables: true};

    con.query(options, (err, res) => {

        if(err) throw err;

        console.log("NEW WAYYY", res[0]);

        return callback(err, res)
    })
}

function GetAllUserAndAdresses(callback) {
    let selectSQL = `SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK`;
    let options = {sql: selectSQL, nestTables: true};

    con.query(options, (err, res) => {

        if(err) throw err;

        console.log("NEW WAYYY", res);

        return callback(err, res)
    })
}

// GetUserAndAdressesByName("Miguel", () => {})

function GetUserAndAdressesByName(name, callback) {
    let selectSQL = `SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK AND USERS.FirstN = '${name}'`;
    let options = {sql: selectSQL, nestTables: true};

    con.query(options, (err, res) => {

        if(err) throw err;

        console.log("NEW WAYYY", res[0]);

        return callback(err, res)
    })
}

newUser.Title = "Mr"
newUser.FirstN = "Miguel";
newUser.SurN = "Lustro",
newUser.Phone = "123123",
newUser.Email = "test@gmail.com"
newUser.PK = 44;
newUser.HomeAddressFK = 6;
newUser.ShippingAddressFK = 6;

// UpdateUserByID(43, newUser, () => {} )

function UpdateUserByID(id, user, callback) {

    let sql = `UPDATE USERS
    SET Title = '${user.Title}', Phone = '${user.Phone}', Email = '${user.Email}'
    WHERE PK = ${id};`

    con.query(sql, (err, res) => {

        if(err) throw err;

        console.log("UPDATE", res);

        return callback(err, res)
    })
}

function UpdateHomeAddressByID(id, address, callback) {

    let sql = `UPDATE HomeAddress
    SET Line1 = '${address.Line1}', Line2 = '${newAddress.Line2}', Town = '${newAddress.Town}', County = '${newAddress.County}', Eircode = '${newAddress.Eircode}'
    WHERE PK = ${id};`

    con.query(sql, (err, res) => {

        if(err) throw err;

        console.log("UPDATE", res);

        return callback(err, res)
    })
}

function UpdateShippingAddressByID(id, address, callback) {

    let sql = `UPDATE ShippingAddress
    SET Line1 = '${address.Line1}', Line2 = '${newAddress.Line2}', Town = '${newAddress.Town}', County = '${newAddress.County}', Eircode = '${newAddress.Eircode}'
    WHERE PK = ${id};`

    con.query(sql, (err, res) => {

        if(err) throw err;

        console.log("UPDATE", res);

        return callback(err, res)
    })
}


// DeleteUser(newUser, () => {});

function DeleteUser(user, callback) {

    console.log("USER", user);

    let sql = `DELETE FROM USERS WHERE PK = ${user.PK}`;

    con.query(sql, (err, res) => {

        if(err) throw err;

        console.log("DELTE1", res);

        sql = `DELETE FROM ShippingAddress WHERE PK = ${user.ShippingAddressFK}`;

        con.query(sql, (err, res) => {

            if(err) throw err;
    
            console.log("DELTE2", res);

            sql = `DELETE FROM HomeAddress WHERE PK = ${user.HomeAddressFK}`;
    
            con.query(sql, (err, res) => {

                if(err) throw err;
        
                console.log("DELTE3", res);      

                return callback(err, res)
            })
        })
    })
}



// DeleteUserByNameEmailPhone(newUser, () => {});

function DeleteUserByNameEmailPhone(user, callback) {

    let sql = `SELECT * FROM USERS WHERE FirstN = '${user.FirstN}' AND SurN = '${user.SurN}' AND Phone = '${user.Phone}' AND Email = '${user.Email}'`

    console.log("USER", user);

    con.query(sql, (err, res) => {

        if(err) throw err;

        console.log("GET", res);
        
        user.PK = res[0].PK;
        user.ShippingAddressFK = res[0].ShippingAddressFK;
        user.HomeAddressFK = res[0].HomeAddressFK;

        sql = `DELETE FROM USERS WHERE PK = ${user.PK}`;
    
        con.query(sql, (err, res) => {
    
            if(err) throw err;
    
            console.log("DELTE1", res);
    
            sql = `DELETE FROM ShippingAddress WHERE PK = ${user.ShippingAddressFK}`;
    
            con.query(sql, (err, res) => {
    
                if(err) throw err;
        
                console.log("DELTE2", res);
    
                sql = `DELETE FROM HomeAddress WHERE PK = ${user.HomeAddressFK}`;
        
                con.query(sql, (err, res) => {
    
                    if(err) throw err;
            
                    console.log("DELTE3", res);      
    
                    return callback(err, res)
                })
            })
        })
    })

}


function TrasformToDataBaseObj(postData) {

    let newUser = new user(postData.Title, postData.FirstN, postData.SurN, postData.Phone, postData.Email);
    console.log(newUser);

    let newHome = new Address(postData.Line1, postData.Line2, postData.Town, postData.County, postData.EirCode);
    console.log(newHome);

    let newShip = new Address(postData.SLine1, postData.SLine2, postData.STown, postData.SCounty, postData.SEirCode);
    console.log(newShip);

    return {newUser, newHome, newShip};

}




// GetUserAndAdressesByID(3, () => {});

/* function GetUserAndAdressesByID(id, callback) {

    let selectSQL = 'Select * From USERS, HomeAddress, ShippingAddress WHERE USERS.PK = 2 AND USERS.HomeAddressFK = HomeAddress.PK AND USERS.ShippingAddressFK = ShippingAddress.PK';
    selectSQL = 'SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK AND USERS.PK = 3;';
    selectSQL = 'SELECT * FROM USERS, HomeAddress, ShippingAddress WHERE USERS.HomeAddressFK = HomeAddress.PK AND ShippingAddress.PK = USERS.ShippingAddressFK AND USERS.PK = 3;';

    let select = `SELECT * FROM USERS WHERE PK = ${id}`;

    let data = {};

    con.query(select, function(err, result, fiedls) {
        if (err) throw err;

        data.user = result[0];

        select = `SELECT * FROM HomeAddress WHERE PK = ${data.user.HomeAddressFK}`;

        con.query(select, function(err, result, fiedls) {
            if (err) throw err;
        
            data.homeAddress = result[0];

            select = `SELECT * FROM ShippingAddress WHERE PK = ${data.user.ShippingAddressFK}`;

            con.query(select, function(err, result, fiedls) {
                if (err) throw err;
            
                data.shippingAddress = result[0];

                console.log("DATA; ", data);
        
                return callback(err, data);
            })

        })

    })
    
} */


http.createServer(function (req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    log(req.url);
    // res.writeHead(200, {'Content-Type': 'text/html'});
    
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    res.write(req.url);

    console.log(req.method);

    if(req.method == "POST") {
        console.log("POST DATA", res);

        var body = '';

        req.on('data', function (POSTdata) {
            body += POSTdata;

            // Too much POST POSTdata, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
            console.log("POST DA,", post.FirstN);

            let {newUser, newHome, newShip} = TrasformToDataBaseObj(post);

            CreateUserWithAddresses(newUser, newHome, newShip, ((err, DBres) => {
                if (err) throw err;

                console.log("RESS", DBres);

                res.end("DBres");
            }))


        });

    }
    else {  
        GetAllUserAndAdresses((err, data) => {
            if (err) throw err;
            let results; 
            // data.map(v => Object.assign({}, v));
            console.log(data);
    
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

            console.log(html);
    
    
            res.end(html);
        })
    }






  }).listen(3000);

// con.end();
