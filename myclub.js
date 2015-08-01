var myclub_url = 'http://203.74.127.188:5566/userlogin.aspx'

var username;
var password;


var casper = require('casper').create({
//    verbose: true,
//    logLevel: "debug"
});


var x = require('casper').selectXPath;


casper.start(myclub_url, function(){

	var now = new Date();

    casper.echo("> Start Course Registration Script, Current Time :" + now);

    // extract the passcode
    passcode_str = this.getElementInfo(x("//*[contains(@id,'ctl00_ContentPlaceHolder1_img1')]")).attributes.src;
    passcode = passcode_str.substr(passcode_str.indexOf('=')+1);

    username = casper.cli.get("username");
    password = casper.cli.get("password");

    casper.echo('> Login username = ' + username);
    casper.echo('> Login password = ' + password);
    casper.echo('> Login passcode = ' + passcode);

    // Fill in the form
    this.evaluate(function(username, password, passcode) {
        document.getElementById('ctl00_ContentPlaceHolder1_txtId').value = username;
        document.getElementById('ctl00_ContentPlaceHolder1_txtPassword').value = password;
        document.getElementById('ctl00_ContentPlaceHolder1_txtCC').value = passcode;
   
    }, username, password, passcode);
 
    // Ready to go !
    this.click(x("//*[contains(@id,'ctl00_ContentPlaceHolder1_btnLogin')]"));
})


casper.then(function() {

    casper.echo('> We\'re logged in. !');

/*
    this.capture('login.png', {
        top: 0,
        left: 0,
        width: 500,
        height: 800
    });

   // this.captureSelector('login.png', 'html');
    this.log('saved screenshot of ' + this.getCurrentUrl() + 'to test.png', 'warning');
    
*/

    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate()+3); 
    var dd = targetDate.getDate();
    var mm = targetDate.getMonth()+1; //January is 0!
    var yyyy = targetDate.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 


    today = yyyy+'-'+mm+'-'+dd;

    casper.echo('> Target Date:' + today);
    today_linkstr = today+'&NK&B&2'
    today_js_link = "javascript:__doPostBack('btnElection','" + today_linkstr +"')"
    this.log('> Registration Link:' + today_js_link);
    var selector = 'a[href="' + today_js_link + '"]';
//    this.echo("selector:" + selector);
    if (this.exists(selector)) {
        var selector2 = "//*[contains(@href,\""+today_js_link+"\")]";
        this.click(x(selector2));
        this.echo('> Course Selected.');
           
    }else{
        this.echo('> LINK NOT FOUND')
    }
    
    
});

casper.then(function(){

    this.echo('> Logging out');

    this.click(x("//*[contains(@id,'ctl00_btnLogout')]"));

});

casper.then(function(){

    this.echo('> We\'re logged out.');
/*
    this.capture('logout.png', {
        top: 0,
        left: 0,
        width: 500,
        height: 800
    });
*/ 

});


//                                 EVENT HANDLING
/////////////////////////////////////////////////

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.on('run.complete', function() {
    this.echo('script completed');
    this.exit();
});

//                                     EXECUTION
////////////////////////////////////////////////
casper.run(function() {

   
    
}); 
