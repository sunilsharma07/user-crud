var debug = require('debug')('x-code:v1:controllers:user'),
    moment = require('moment'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    path = require('path'),
    shortid = require('shortid'),
    _ = require('underscore'),

    UserSchema = require('../models/User'),
    MemberSchema = require('../models/Member'),
    TaskSchema = require('../models/Task'),


    config = rootRequire('config/global'),
    ED = rootRequire('services/encry_decry'),
    Uploader = rootRequire('support/uploader'),
    Mailer = rootRequire('support/mailer'),
    DS = rootRequire('services/date'),
    multer = require('multer');
    
    var multiparty = require("multiparty");
    var fileExtension = require('file-extension');
    var crypto = require('crypto');
    var fs = require('fs');
    var mongoose = require('mongoose');

    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, 'uploads/pgn/')
        },
        filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
        }
    });
    var upload = multer({storage: storage});


/** Sync */
function randomString(length, chars) {
    if (!chars) {
      throw new Error('Argument \'chars\' is undefined');
    }
  
    var charsLength = chars.length;
    if (charsLength > 256) {
      throw new Error('Argument \'chars\' should not have more than 256 characters'
        + ', otherwise unpredictability will be broken');
    }
  
    var randomBytes = crypto.randomBytes(length);
    var result = new Array(length);
  
    var cursor = 0;
    for (var i = 0; i < length; i++) {
      cursor += randomBytes[i];
      result[i] = chars[cursor % charsLength];
    }
  
    return result.join('');
  }
  
  /** Sync */
  function randomAsciiString(length) {
    return randomString(length,
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  }

  function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0) return false;
    if (obj.length === 0) return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

module.exports = {

    login: function(req, res) {

              
        async.waterfall([
            function(nextCall) { // check required parameters

                req.checkBody('email', 'Email is required').notEmpty(); // Name is required
                req.checkBody('email', 'Email is not a valid').isEmail();
                req.checkBody('password', 'Password is required').notEmpty(); // password is required

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },
            function (body, nextCall) {
                password = ED.encrypt(body.password);
                console.log('password',password);
                UserSchema.find({ 'email': new RegExp(body.email, 'i'), 'password': password }, function (err, user) {
                    // console.log('user', user.length);
                    if (err) {
                        return nextCall({ "message": err });
                    }
                    if (user.length > 0) {
                        nextCall(null, user[0]);
                        // res.status(200).send({"status":0,"message":"Email already exist!"});
                    } else {
                        return nextCall({ "status": 200, "message": "This email and password doesn't match." });
                    }

                });
            },
            function(user, nextCall) {

                var jwtData = {
                    _id: user._id,
                    email: user.email,
                    timestamp:DS.now()
                };

                // create a token
                access_token = jwt.sign(jwtData, config.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                UserSchema.findOneAndUpdate({ "_id": user._id }, { $set: { "access_token": access_token } }, function (error, results) {
                        if (error) {
                            console.log('LOGIN DEVICE TOKEN UPDATE ERROR:', error);
                        }

                        var data = {
                            '_id': results._id,
                            'firstname': results.firstname,
                            'lastname': results.lastname,
                            'phone': results.phone,
                            'email': results.email,
                            'created_at': results.created_at,
                            'updated_at': results.updated_at,
                            'access_token': access_token,
                            'user_type':results.user_type
                        }
                        nextCall(null, data);
                    });

                // nextCall(null, body);
            },
            function(body, nextCall) {

                // return the information including token as JSON
                nextCall(null, {
                    status: 1,
                    message: 'Login successfully',
                    data: body
                });
            }
        ], function(err, response) {
            if (err) {
                debug('Login Error', err);
                return res.sendToEncode({ status: 0, message: (err && err.message) || "Oops! You could not be logged in." });
            }

            res.sendToEncode(response);
        });
    },

    register_new_user : function(req,res)
    {
        async.waterfall([
            function (nextCall) 
            {
                req.checkBody('email', 'Email is required').notEmpty(); // Name is required
                req.checkBody('email', 'Email is not a valid').isEmail();
                req.checkBody('password', 'Password is required').notEmpty(); // password is required
                req.checkBody('first_name', 'First name is required').notEmpty(); 
                req.checkBody('last_name', 'Last name is required').notEmpty(); 
                req.checkBody('phone', 'Phone is required').notEmpty();

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },           
            function(new_array,nextCall)
            {    
                var postData = {
                            'email':new_array.email,
                            'first_name': new_array.first_name,
                            'last_name': new_array.last_name,
                            'password':new_array.password,
                            'phone': new_array.phone,
                            'status':new_array.status
                    }
    
                  var user = new UserSchema(postData);
    
                  user.save(function (error, res) {
    
                            if (error) throw error;
    
                            nextCall(null, {
                                    status: 1,
                                    message: 'User added successfully.',
                                    data: res
                            });
                     });
                
            }      
        ],
            function (err, response) {
                if (err) {
                    debug('Logout Error', err);
                    return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be Insert." });
                }
                
                res.sendToEncode(response);    
            })

    },
  

    admin_dashboard: function (req, res) {
        async.waterfall([
            function (nextCall) {
                // UserSchema.find({'user_type':'coach'}.populate('tbl_student'), function (err, results) {

                   UserSchema.find({'user_type':'coach'}, function (error, coach) {
                    if (error) {
                            console.log('LOGIN DEVICE TOKEN UPDATE ERROR:', error);
                    }
                        nextCall(null, coach.length)
                });
            },
             function (coach, nextCall) {
                StudentSchema.find({}, function (error, student) {
                    if (error) {
                            console.log('LOGIN DEVICE TOKEN UPDATE ERROR:', error);
                    }

                    dataValue = {
                        'totalCoach':coach,
                        'totalStudent':student.length,
                    }

                    nextCall(null, {
                        status: 1,
                        message: 'Dashboard result.',
                        data: dataValue
                    })
                });
            }

        ],function (err, response) {
                if (err) {
                    debug('coach List Error', err);
                    return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be Insert." });
                }

                res.sendToEncode(response);
            });
    }, 


add_member : function(req, res)
{
    async.waterfall([
           function(nextCall) { // check required parameters
                req.checkBody('name', 'Name is required').notEmpty(); // Name is required

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },
            function (body, nextCall) {
                var member = new MemberSchema(body);
                 member.save(function (error, result) {
                    // console.log('user', user.length);
                    if (error) {
                        return nextCall({ "message": error });
                    }
                    nextCall(null, {
                        status: 200,
                        message: 'Member add succesfully.',
                        data: result
                    });

                });
            }
        ], function(err, response) {
            if (err) {
                debug('Category Error', err);
                return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be logged in." });
            }

            res.sendToEncode(response);
        });


},

getmemberlist : function(req,res)
{
   var counts = 0;
    async.waterfall([
        function (nextCall) {
            var query1 = {};
            if (req.body.type !== 'all') 
            {
                var query = {
                    order: [],
                    offset: req.body.offset ? req.body.offset : 0,
                    limit: req.body.limit ? req.body.limit : config.LimitPerPage
                };
            } else {
                var query = {
                    order: []
                };
            }

            /*check for sorting data */
            if (req.body.sort && _.keys(req.body.sort).length > 0) 
            {

                var sortValues = _.values(req.body.sort);
                var sortField = _.values(req.body.sort)[0].split('.');
                if (sortField.length > 1) {
                } else {
                    query.order.push([sortValues[0], sortValues[1]])
                }

            } else {
                query.order.push(['_id', 'DESC'])
            }

            /* Check for filter data */
            query1["status"] = { $in: [0,1] };
            if (req.body.filter && _.keys(req.body.filter).length > 0) 
            {
                _.map(req.body.filter, function (val, key) 
                {
                    if (key === 'name') 
                    {
                        query1["name"] = { $regex: val, $options: 'i' }
                    } 
                });
            }

            query1["added_by"] = req.body.added_by;
            
            MemberSchema.find(query1, {created_at: 1, name: 1, status: 1 }).sort(query.order).skip(Number(query.offset)).limit(Number(query.limit)).exec(function (err, categoriesList) {
                if (err) {
                    //nextCall('SWW-400', null);
                    nextCall({ "message": err });
                }
                var body = {};
                
                body.rows = categoriesList;
                nextCall(null, body, query1);
            });
        },
        function (body, query1, nextCall) {
            // console.log(query1,body)
            MemberSchema.count(query1, function (err, counts) {
                if (err) {
                    //nextCall('SWW-400', null);
                     nextCall({ "message": err });
                }

                var returnData = {
                    count: counts,
                    rows: body.rows
                }
                nextCall(null, returnData);
            });
        }
    ],
        function (err, response) {
            if (err) 
            {
                 return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! Something went wrong." });
            }

            return res.sendToEncode({
                status: 200,
                message: 'listing',
                data: response
            })
        }
    );



},

edit_member: function(req,res){
        async.waterfall([
            function (nextCall) { // check required parameters

                req.checkBody('member_id', 'Member id is required.').notEmpty();

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }

                nextCall(null, req.body);
            },
            function (body, nextCall) {

                var member_id = body.member_id;
                MemberSchema.find({ '_id': member_id }, function (err, results) {
                    // console.log(results);
                    // return false;

                    if (err) {
                        nextCall({ message: 'Something went wrong.' });
                    }
                    // console.log('results',results)
                    if (results.length > 0) {
                        //   console.log(results.length);
                        //  return error !== results[0].email;
                        return nextCall(null, results[0], body);
                    } else {
                        return nextCall({ message: 'Member id is wrong.' });
                    }
                });
            },
            function (result, body, nextCall) {

                var postdata = {
                    'name': body.name || result.name,
                    'status':body.status
                }

                MemberSchema.findOneAndUpdate({ "_id": result._id }, { $set: postdata }, function (error, results) {
                    if (error) {
                        nextCall({ message: 'Something went wrong.' });
                    } else {
                        nextCall(null, {
                            status: 200,
                            message: 'Member update successfully.',
                            // data: results
                        });
                    }
                });
            }
        ], function (err, response) {
            if (err) {
                return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be update." });
            }

            res.sendToEncode(response);
        });
    },

update_status_member : function(req,res)
{
    async.waterfall([
        function (nextCall) { // check required parameters

            req.checkBody('member_id', 'Member id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }

            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.status
            }
              var _id = body.member_id;

            MemberSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Member status update successfully.',
                        // data: results
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) {
            return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be update." });
        }

        res.sendToEncode(response);
    });

},    


list_member_dropdown: function(req, res) {
    async.waterfall([
        function (nextCall) {
             
               var check_option = req.body.option;

               if(check_option==0)
                {
                    var qq = {'status':'0','added_by':req.body.added_by};
                }
                else if(check_option==1)
                {
                    var qq = {'status':'1','added_by':req.body.added_by};
                }
                else
                {
                    var qq = {'added_by':req.body.added_by};
                }

            MemberSchema.find(qq, function (err, cat) {
                // console.log('user', user.length);
                if (err) {
                    return nextCall({ "message": err });
                }
                nextCall(null, {
                    status: 200,
                    message: 'Member list.',
                    data: cat
                });
            });
        }
    ], function(err, response) {
        if (err) {
            debug('Category Error', err);
            return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be logged in." });
        }
        res.sendToEncode(response);
    });
},


add_task : function(req,res){

    async.waterfall([
           function(nextCall) { // check required parameters
                req.checkBody('name', 'Name is required').notEmpty(); // Name is required
                req.checkBody('member_id', 'Member is required').notEmpty(); // Name is required

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },
            function (body, nextCall) {
                var task = new TaskSchema(body);
                 task.save(function (error, result) {
                    // console.log('user', user.length);
                    if (error) {
                        return nextCall({ "message": error });
                    }
                    nextCall(null, {
                        status: 200,
                        message: 'Task add succesfully.',
                        data: result
                    });

                });
            }
        ], function(err, response) {
            if (err) {
                debug('Category Error', err);
                return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be logged in." });
            }

            res.sendToEncode(response);
        });
  

},

gettasklist : function(req,res){

    async.waterfall([
        function (nextCall) 
        {
            
                var query1 = {};
                var query = {};                
                if (req.body.type !== 'all') 
                {
                    var query = {
                        order: [],
                        offset: req.body.offset ? req.body.offset : 0,
                        limit: req.body.limit ? req.body.limit : config.LimitPerPage
                    };
                } else {
                    var query = {
                        order: []
                    };
                }

                /*check for sorting data */
                if (req.body.sort && _.keys(req.body.sort).length > 0) 
                {
                    var sortValues = _.values(req.body.sort);
                    var sortField = _.values(req.body.sort)[0].split('.');
                    if (sortField.length > 1) {
                    } else {
                        query.order.push([sortValues[0], sortValues[1]])
                    }
                } else {
                    query.order.push(['_id', 'DESC'])
                }


                var aggregateQuery = [];

                if (req.body.filter && _.keys(req.body.filter).length > 0) {
                    _.map(req.body.filter, function (val, key) {
                        if (key === 'name') 
                        {
                            query1["name"] = { $regex: val, $options: 'i' }

                            aggregateQuery.push({
                                $match: {
                                    "name": { $regex: val, $options: 'i' }//req.body.filter['name'],
                                }
                            });

                        }
                       
                    });
                }

                 // Stage 1 
                aggregateQuery.push({
                    $match: {
                        "added_by": mongoose.Types.ObjectId(req.body.added_by),
                    }
                });

                /*aggregateQuery.push({
                    $match: {
                        "added_by":{$in:[mongoose.Types.ObjectId(req.body.added_by)]} 
                        
                    }
                });*/

              
                // Stage 2
                aggregateQuery.push({
                    $lookup: {
                        from: 'tbl_member',
                        localField: 'member_id',
                        foreignField: '_id',
                        as: 'members'
                    }
                });


                // Stage 3
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "name":1,
                        "member_id":1,    
                        "member_name":"$members.name",
                        "updated_at":1,
                        "created_at":1,                        
                        "status":1,
                        "task_status":1,

                    }
                });

                
                 // Stage 4
                aggregateQuery.push({
                     $sort: {
                        updated_at: -1, 
                        }
                });

                //Stage 5
                aggregateQuery.push({
                    $skip: Number(query.offset)
                });
               
                 // Stage 6
                 aggregateQuery.push({
                    $limit: Number(query.limit)
                });
                

                //query2["added_by"] = mongoose.Types.ObjectId(req.body.added_by);

                TaskSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{
                             var body = {};
                             body.rows = result;
                             nextCall(null, body,aggregateQuery)
                        }                            
                    });

                   

        },
        function (body, query3, nextCall) {
            TaskSchema.count(query3, function (err, counts) {
                var returnData = {
                    count: counts,
                    rows: body.rows
                }
                nextCall(null, returnData);
            });
        }
    ],
        function (err, response) {
            if (err) {
                return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! Something went wrong." });
            }
            return res.sendToEncode({
                status: 200,
                message: '',
                data: response
            })
        })  



},

update_status_task : function(req,res)
{
    async.waterfall([
        function (nextCall) { // check required parameters

            req.checkBody('member_id', 'Member id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }

            nextCall(null, req.body);
        },
        function (body, nextCall) {
           
                
            if(body.check_status=='status')
            {
                var postdata = {
                    'status': body.status
                }

            }
            else{
                var postdata = {
                    'task_status': body.status
                }
            }

              var _id = body.member_id;

              TaskSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Task status update successfully.',
                        // data: results
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) {
            return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be update." });
        }

        res.sendToEncode(response);
    });

}, 

edit_task : function(req,res)
{
    async.waterfall([
        function (nextCall) { // check required parameters

            req.checkBody('task_id', 'Task id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }

            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var task_id = body.task_id;
            TaskSchema.find({ '_id': task_id }, function (err, results) {
                // console.log(results);
                // return false;

                if (err) {
                    nextCall({ message: 'Something went wrong.' });
                }
               
                if (results.length > 0) {                
                    return nextCall(null, results[0], body);
                } else {
                    return nextCall({ message: 'Task id is wrong.' });
                }
            });
        },
        function (result, body, nextCall) {

            var postdata = {
                'name': body.name || result.name,
                'status':body.status
            }

            TaskSchema.findOneAndUpdate({ "_id": result._id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Task update successfully.',                        
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) {
            return res.sendToEncode({ status: 400, message: (err && err.message) || "Oops! You could not be update." });
        }

        res.sendToEncode(response);
    });



},

    
test: function (req, res) {
        res.sendToEncode({ status: 1, message: "TEST MESSAGE", data: { message: 'test' } });
    }

};



