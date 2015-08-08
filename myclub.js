var myclub_url = 'http://203.74.127.188:5566/userlogin.aspx';
var base_url = 'http://203.74.127.188:5566/';
var username;
var password;

var casper = require('casper').create({
});

var x = require('casper').selectXPath;

casper.start(myclub_url, function(){

	var now = new Date();

    var childProcess;
    try {
        childProcess = require("child_process");
        
    } catch (e) {
        casper.echo(e, "error");
        
    }

    casper.echo("> Start Course Registration Script, Current Time :" + now);

    // extract the passcode
    passcode_str = this.getElementInfo(x("//*[contains(@id,'ctl00_ContentPlaceHolder1_img1')]")).attributes.src;
    passcode_url = base_url+passcode_str;
    casper.echo("> passcode url: "+passcode_url);

    var code;
    username = casper.cli.get("username");
    password = casper.cli.get("password");
    var filename = username+'_passcode.jpg';
    
    this.download(passcode_url, filename);

    if (childProcess) {
        childProcess.execFile("node", ["passcode.js", filename], null, function (err, stdout, stderr) {
            
            if(err) casper.echo ("error:"+err);
            else{
                code =  JSON.stringify(stdout).replace(/['"\\n]+/g,'');

                casper.echo('> Login username = ' + username);
                casper.echo('> Login password = ' + password);
                casper.echo('> Login passcode = ' + code);

                // Fill in the form
                casper.evaluate(function(username, password, code) {
                    document.getElementById('ctl00_ContentPlaceHolder1_txtId').value = username;
                    document.getElementById('ctl00_ContentPlaceHolder1_txtPassword').value = password;
                    document.getElementById('ctl00_ContentPlaceHolder1_txtCC').value = code;
                    
                }, username, password, code);
                
                // Ready to go !
                casper.click(x("//*[contains(@id,'ctl00_ContentPlaceHolder1_btnLogin')]"));
            }

                
        });
    } else {
        casper.echo("> Unable to require child process", "warning");
          
    }

    
    this.wait(1000, function() {
        this.echo("Waited for 1 second.");
        
    });
})


casper.then(function() {

    casper.echo('> We\'re logged in. !');

    var login_filename = username+'_login.png';
    casper.echo('> taking login pic');
    this.capture(login_filename, {
        top: 0,
        left: 0,
        width: 500,
        height: 800
    });    


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

    if (this.exists(selector)) {
        var selector2 = "//*[contains(@href,\""+today_js_link+"\")]";
        this.click(x(selector2));
        this.echo('> Course Selected.');
           
    }else{
        this.echo('> LINK NOT FOUND')
    }
});

/*
casper.then(function(){

    this.echo('> Logging out');

    this.click(x("//*[contains(@id,'ctl00_btnLogout')]"));

});
*/
casper.then(function(){

    this.echo('> We\'re logged out.');
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
