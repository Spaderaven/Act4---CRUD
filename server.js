let mysql = require('mysql');

let con = mysql.createConnection({
    host: "webcourse.cs.nuim.ie",
    user: "u230865",
    password: "chai6TheephuQu5e",
    database: "cs230_u230865"
});

class user {
    constructor(FirstN, SurN, Phone, Email, HomeAddressFK = null, ShippingAddressFK = null){
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
newUser.FirstN = "NEWERMiguel";
newUser.SurN = "asdasd",
newUser.Phone = "3213150",
newUser.Email = "asdasasd.com"

let homeAddress = new Address("123 Fake Street", null, "My Town", "My County", "152AN");
let shippingAddress = new Address("321 Fake Street", null, "My Town", "My County", "152AN");

// CreateUserWithAddresses(newUser, homeAddress, shippingAddress, ()=>{});

function CreateUser(newUser, callback) {

    
    let createSql = `INSERT INTO USERS(FirstN, SurN, Phone, Email, HomeAddressFK, ShippingAddressFK) Values ('${newUser.FirstN}', '${newUser.SurN}', '${newUser.Phone}', '${newUser.Email}', '${newUser.HomeAddressFK}', '${newUser.ShippingAddressFK}')`;

    // let { err, res } = RunQuery(createSql);

    let selectSQL = 'Select * From USERS'

    con.query(createSql, function(err, result, fiedls) {
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

    con.query(createSql, function(err, result, fiedls) {
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

    con.query(createSql, function(err, result, fiedls) {
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
newUser.PK = 45;
newUser.HomeAddressFK = 7;
newUser.ShippingAddressFK = 7;

// UpdateUserByID(43, newUser, () => {} )

function UpdateUserByID(id, user, callback) {

    let sql = `UPDATE USERS
    SET FirstN = '${user.FirstN}', SurN = '${user.SurN}', Phone = '${user.Phone}', Email = '${user.Email}'
    WHERE PK = ${id};`

    con.query(sql, (err, res) => {

        if(err) throw err;

        console.log("UPDATE", res);

        return callback(err, res)
    })
}

DeleteUser(newUser, () => {});

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



DeleteUserByEmailPhoneName(newUser, () => {});

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



// con.end();
