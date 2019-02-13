const {QuickServer} = require("translucid");

const {translucid} = QuickServer(8000 || process.env.PORT);
translucid.public("pool_pi3");
translucid.bind("/","pool_pi3/index.html",["*"]);