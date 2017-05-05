var CLIENT_VERSION_COOKIE_NAME="clientVersion";
var CLIENT_ENV_COOKIE_NAME="clientEnvironment";
var API_ENV={
    "local":"https://uds-local.dealer.com/dist/",
    "qa":"https://uds.qa.int.dealer.com/",
    "dev":"https://uds.dev.int.dealer.com/",
    "live":"https://uds.dealer.com/"
}
var client=getClientObj();
var clientApiSrc = createClientScript(client, onLoad);
function onLoad() {
    if (typeof DDC == "undefined" || typeof DDC.MyCars == "undefined" || typeof DDC.MyCars.CLIENT_API == "undefined") {
        document.getElementById('generalMessage').innerHTML = "MyCars API not loaded.  You may need to accept the certificate from <a href=\"" + clientApiSrc + "\">" + clientApiSrc + "</a>";
    } else {
        var div = document.createElement('div');
        html = "My cars Client Api Version: " + client.clientVersion.fontcolor("red") + "<br>";
        html += "My cars Client Api Environment: " + client.clientEnvironment.toUpperCase().fontcolor("red") + "<br>";
        html += "My cars Client API URL: " + clientApiSrc.fontcolor("red") + "<br>";
        div.innerHTML = html;
        document.body.appendChild(div);
        // this calls back over to the index-local html file, to separate our test harness from code that an actual client would use
        clientApiLoaded();
    }
}
function checkClientVersionCookieValue(clientVersion){
    var clientVersionReg = RegExp("^\\d+(\\.\\d+\\.\\d+)?$");
    return clientVersionReg.test(clientVersion);
}
function getClientVersion(){
    var clientVersion=getCookie(CLIENT_VERSION_COOKIE_NAME);
    if(clientVersion.length==0||!checkClientVersionCookieValue(clientVersion)){
        clientVersion=DEFAULT_CLIENT_VERSION;
    }
    return clientVersion;
}
function getClientObj(){
    var clientVersion=getClientVersion();
    var clientEnvCookieValue = getCookie(CLIENT_ENV_COOKIE_NAME).toLowerCase();
    var clientUrl;
    if (clientEnvCookieValue) {
        clientUrl = API_ENV[clientEnvCookieValue];
    }
    if (!clientUrl) {
        clientEnvCookieValue=DEFAULT_CLIENT_ENV;
        clientUrl=API_ENV[clientEnvCookieValue];
    }
    var client={
        clientVersion:clientVersion,
        clientEnvironment:clientEnvCookieValue,
        clientUrl:clientUrl
    }
    return client;
}
function createClientScript(client, callback){
    var clientScript=document.createElement("script");
    clientScript.setAttribute("id","myCarsClientScript");
    clientScript.setAttribute("src",client.clientUrl.concat("mycars-client-api-").concat(client.clientVersion).concat(".js"));
    clientScript.setAttribute("async", true);
    document.querySelector("head").appendChild(clientScript);
    clientScript.addEventListener("load",function(){callback()})
    clientScript.addEventListener("error",function(){callback()})
    return clientScript.src;
}
//get browser cookie's value
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookieList = decodeURIComponent(document.cookie).split(';');
    for(let i = 0; i <decodedCookieList.length; i++) {
        const trimCookie= decodedCookieList[i].trim();
        if (trimCookie.indexOf(name) == 0) {
            return trimCookie.substring(name.length, trimCookie.length);
        }
    }
    return "";
}
function sendTabInfoToClient(tabName){
    DDC.MyCars.CLIENT_API.sendTabChange(tabName);
}