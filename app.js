const {QuickServer} = require("translucid");

const {translucid} = QuickServer(process.env.PORT || 8000);
translucid.public("pool_pi3");
translucid.bind("/","pool_pi3/index.html",["*"]);