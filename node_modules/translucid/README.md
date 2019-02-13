# Translucid
A simple node.js library to bind files to requests

# Get started:

First you need to install the package:
```
npm install translucid --save
```

Then, you need to include it in your project:
```
const trans = require("translucid");
```

To create your first server, call ".QuickServer(port)":
```
trans.QuickServer(8000);
```

The ".QuickServer" method return many useful objects:
```
const {app,server,connect,translucid} = trans.QuickServer(8000);
```
The translucid object can be used to make file bindings:
```
translucid.bind("/","client/index.html",["myId"]);
```
Then you can add middleware like this:
```
translucid.use({
    name:"my middleware",
    keys:["myid"],
    run:(prev,req,res,next) => {
        next(`${prev} <br/> string added by a middleware`);//passing the argument is optional
    }
});
```


You can make a folder public like this:
```
translucid.public(`client`);
```

You can read bindings from a file:
```
translucid.bindJSON(`data/files.json`);
```
And in files.json:
```
{
    "/articles":{
        "file":"client/articles.html",
        "classes":["*"]
    },
    "/":{
        "file":"client/start.html",
        "classes":["*"]
    },
    "/start":{
        "file":"client/start.html",
        "classes":["*"]
    }
}
```

The QuickServer returns:    
* translucid => the basic translucid object
* express => the express module
* http => the http module
* server => instance of http.Server()
* connect => a promise that resolves when the server is listening to the specified port

Other utilities in translucid:  
* read => read a file
