var CLIENT_VERSION_COOKIE_NAME="clientVersion";
var CLIENT_ENV_COOKIE_NAME="clientEnvironment";

var API_ENV={
	"local":"https://uds-local.dealer.com/dist/",
	"qa":"https://uds.qa.int.dealer.com/",
	"dev":"https://uds.dev.int.dealer.com/",
	"live":"https://uds.dealer.com/"
}

var client=getClientObj();

var clientApiSrc=createClientScript(client, checkLoad);

document.write("My cars Client Api Version:"+client.clientVersion.fontcolor("red"));
document.write("<br>")
document.write("My cars Client Api Environment:"+client.clientEnvironment.toUpperCase().fontcolor("red"));
document.write("<br>")
document.write("My cars Client API URL:"+clientApiSrc.fontcolor("red"));

function checkLoad() {
	if (typeof DDC == "undefined" || typeof DDC.MyCars == "undefined" || typeof DDC.MyCars.CLIENT_API == "undefined") {
		var apiSource = document.getElementById("myCarsClientScript").src;
		document.getElementById('generalMessage').innerHTML = "MyCars API not loaded.  You may need to accept the certificate from <a href=\"" + apiSource + "\">" + apiSource + "</a>";
	} else {
		// TODO: maybe find a better way to do this in the asynchronous loading story
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
	document.querySelector("head").appendChild(clientScript);
	window.addEventListener("load",function(){callback()})
	return clientScript.src;
}

//get browser cookie's value
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
