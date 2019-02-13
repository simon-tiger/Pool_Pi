const {QuickServer} = require("translucid");

const {trans} = QuickServer(8000 || process.env.PORT);
trans.public("pool_pi3");
trans.bind("/","pool_pi3/index.html",["*"]);