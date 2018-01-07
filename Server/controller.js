var models = require('db.js');
var path = require('path');
var bodyParser = require('body-parser');



module.exports = function (app,io){
    app.use( bodyParser.json() );
    app.use(bodyParser.urlencoded({     
        extended: true
    }));
    
    app.get('/',function(req,res){
        //code here
    });
    
    app.post('/register',function(req,res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        var user={
            /*
				code here
            */
        };
        console.log(user);
        
        models.user.findOne({"handle":req.body.handle},function(err,doc){
            if(err){
                res.json(err); 
            }
            if(doc == null){
                models.user.create(user,function(err,doc){
                    if(err) res.json(err);
                    else{
                        // code here
                    }
                });
            }else{
                // code here
            }
        })
        
    });
    
    
    var handle=null;
    var private=null;
    var users={};
    var keys={};
    
    app.post('/login',function(req,res){
        console.log(req.body.handle);
        /*
			code here
        */
        handle = req.body.handle;
        models.user.findOne({"handle":req.body.handle, "password":req.body.password},function(err,doc){
            if(err){
                res.send(err); 
            }
            if(doc==null){
                res.send("User has not registered");
            }
            else{
                console.log("Asas"+__dirname);
                // code here
            }
            
    });
    });
    
    io.on('connection',function(socket){
        console.log("Connection :User is connected  "+handle);
        console.log("Connection : " +socket.id);
        io.to(socket.id).emit('handle', handle);
        users[handle]=socket.id;
        keys[socket.id]=handle;
        console.log("Users list : "+users);
        console.log("keys list : "+keys);
        models.user.find({"handle" : handle},{friends:1,_id:0},function(err,doc){
            if(err){res.json(err);}
            else{
                friends=[];
                pending=[];
                all_friends=[];
                console.log("friends list: "+doc);
                list=doc[0].friends.slice();
                console.log(list);
                
                /*
					code here
                */
                console.log("pending list: "+pending);
                console.log("friends list: "+friends);
                /*
					code here
                */
            }
        });
        
        
        socket.on('group message',function(msg){
            console.log(msg);
            // code here
        });
        
        socket.on('private message',function(msg){
            console.log('message  :'+msg.split("#*@")[0]);
            models.messages.create({
                "message":msg.split("#*@")[1],
                "sender" :msg.split("#*@")[2],
                "reciever":msg.split("#*@")[0],
                "date" : new Date()});
            io.to(users[msg.split("#*@")[0]]).emit('private message', msg);
        });
        
        socket.on('disconnect', function(){
            /*
				code here
            */
            console.log(users);
        });
    });
    
    app.post('/friend_request',function(req,res){
        /*
			code here
        */
        friend=true;
        models.user.find({"handle" : req.body.my_handle,"friends.name":req.body.friend_handle},function(err,doc){
            if(err){res.json(err);}
            else if(doc.length!=0){
                console.log("Friend request : "+doc.length);
                console.log("Friend request : friend request already sent "+doc);
                // code here
            }
            else{
                console.log("Friend request : "+doc.length);
                models.user.update({
                    // code here
                },{
                    $push:{
                        friends:{
                            name: req.body.friend_handle,
                            status: // fill here
                        }
                    }
                },{
                    upsert:true
                },function(err,doc){
                    if(err){res.json(err);}
                });
                io.to(users[req.body.friend_handle]).emit('message', req.body);
            }
        });
    });
    
    app.post('/friend_request/confirmed',function(req,res){
        console.log("friend request confirmed : "+req.body);
        if(req.body.confirm=="Yes"){
            models.user.find({
                /*
								code here
                */
            },function(err,doc){
                if(err){
                    // code here
                }
                else if(doc.length!=0){
                    console.log("Friend request confirmed : "+doc.length);
                    console.log("Friend request confirmed : friend request already sent "+doc);
                    // code here
                }
                else{
                    models.user.update({
                        	/*
								code here
                            */
                    },{
                        '$set':{
                            "friends.$.status":"Friend"
                        }
                    },function(err,doc){
                        if(err){res.json(err);}
                        else{

                            console.log("friend request confirmed : Inside yes confirmed");
                            /*
								code here
                            */
                        }
                    });
                    models.user.update({
                        handle:req.body.friend_handle
                    },{
                        $push:{
                            friends:{
                                /*
									code here
                                */
                            }
                        }
                    },{upsert:true},function(err,doc){
                        if(err){res.json(err);}
                    });
                }
            });
        }
        else{
            
            console.log("friend request confirmed : Inside No confirmed");
            models.user.update({
                // code here
            },{
                '$pull':{
                    'friends':{
                        // code here
                    }
                }
            },function(err,doc){
            if(err){/* code here */}
            else{
                console.log("No");
            }
        });
        }
    });
    
}