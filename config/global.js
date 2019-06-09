module.exports = {

    'PORT': 3000,

    'appHost': 'http://localhost:3000',
    'apiHost': 'http://localhost:3000/v1',



    'database': {         
         'mongoURL': 'mongodb://localhost:27017/user_crud',         
         'mySQLConfig': {
            'connectionLimit': 10, // Max. connection limit
            'host': 'localhost', // DB Hostname
            'user': 'root', // DB username
            'password': '', // DB Password
            'database': '' // DB name
        },
        'use': 'mongodb' // specify db =>  mongodb , mysql
    },

    'jwtTokenVerificationEnable' : true, // true/false

    'secret': '#chess*', // jwt secret key

    'cryptoEnable': false,   // To enable this method
    'cryptoKey': 'xCode2019@!secureAcc$ess',   // Secret encryption key
    'cryptoIV': 'a2xhcgAAAAAAAAAA',        // Secret encryption IV

    'socket': {
        'enable' : true
    },

    'mailOptions': {
        'host': 'smtp.1and1.com', //HOST name
        'secureConnection': false, // use SSL
        'port': 587, // port for secure SMTP
        'auth': {
            'user': '',
            'pass': ''
        }
    },

    'notification': { // Push Notificatoin
        'enable': true, // enable/disable notification
        'androidApiKey': '' // android api key
    }

};
