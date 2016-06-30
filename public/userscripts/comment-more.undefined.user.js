// ==UserScript==
// @name CommentMore
// @namespace comment-more
// @description	comment on any web page
// @include http*
// @version 0.73.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @require https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==
var CMVersion="0.73.1"; //@
var hostDomain="http://localhost:3000/"; //@
var CMLogin="undefined"; //@
var CMPassword="undefined"; //@


var cookiesExp= 3600*24*365; //ms
var collapsed= 1;
var oldWebPage= location.href;
var lastDateTime= 0;
var ajaxInProcess= false;
var commentsCount= { "local": 0, "all": 0 };


//getAuth(/*CMLogin,CMPassword*/); // будемо брати попереднє значення, а під час постингу все само виясниться
//echo("login getted",CMLogin);

//--------------------------------o-n---r-e-a-d-y------------------------------(


(function() {
	if (window.top===window.self)	commentMore(); //захист від запусків у фреймах!
})();



function commentMore() {

	//alert(CMLogin);//x

	setInterval(function() {
		if ( !collapsed || location.href!==oldWebPage ) getComments(); //в закритому стані не оновлюємо
	}, 15*1000);

	setTimeout(function() {
		setAppPanel();

		setEnvironmentDisplay();//?
		getComments();//?

	}, 2000);

}


//--------------------------------o-n---r-e-a-d-y------------------------------)


//------------------------------s-t-y-l-e---m-o-r-e----------------------------(
function applyStyle() {
	var resMaxHeight= Math.round( document.documentElement.clientHeight*0.6 )+"px";
	var appPanelBackground= getCookie("app_panel_background") || "145 , 207 , 142 , 0.9";
	$(".cm-font").css({
		"font": "12px   Arial " //Franklin Gothic Medium, , Gabriola, Impact
	});
	$(".cm-black").css({
		"color": "black"
	});
	$(".cm-grey").css({
		"color": "grey"
	});
	$(".cm-red").css({
		"color": "red"
	});
	$(".cm-buttons").css({
		"background": "transparent",
		"border": "0",
		"margin": "0px",
		"padding": "1px"
	});
	$(".cm-link").css({
		"text-decoration": "none" //underline
	});
	$(".cm-comment-tab").css({
		"background": "white",
		"padding": "3px",
		"margin-bottom": "10px"
	});
	$("#cm-app-panel").css({
		"width": "300px",
		"border": "1px solid #DFDFDF",
		"border-radius": "10px 10px 0px 0px",
		"background": str("rgba( ",appPanelBackground," )"),
		"margin": "0px",
		"padding": "10px 10px 5px 10px", //"10px",
		"position": "fixed", //absolute?
		"z-index": "1023"
	});
	$("#cm-comments-area").css({ //style='margin-top:10px; margin-bottom:10px; max-height:"+resMaxHeight+"; overflow:auto; '
		"margin-top": "10px",
		"margin-bottom": "10px",
		"max-height": resMaxHeight,
		"overflow": "auto"
	});
	$(".cm-sans-padding-sans-margin").css({ //style='width:100%; '
		"padding": "0px",
		"margin": "0px",
	});
	$("textarea#cm-user-comment").css({ //style='width:100%; margin-bottom:0px; '
		//maxlength
		"width": "100%",
		"min-width": "auto",//?
		"max-width": "auto",//?
		"resize": "vertical",
		"overflow": "auto",
		"margin-bottom": "0px"
	});
	$("#cm-post-comment").css({ //style='width:100%; '
		"width": "100%"
	});


}
//------------------------------s-t-y-l-e---m-o-r-e----------------------------)


//-----------------------------------p-a-n-e-l---------------------------------(
function setAppPanel() {

	echo("CommentMore panel starts");//dm
	var appPanel= document.createElement('div');
	appPanel.id= "cm-app-panel";

	appPanel.innerHTML= str(
		"<div id='cm-app-head' style='text-align:right;' class='cm-sans-padding-sans-margin ' >",
			"<div style='float:left;' class='cm-sans-padding-sans-margin ' >", //left side
				"<button id='cm-toggle-button' class='cm-buttons cm-font cm-black ' ></button>",
				//"<button id='cm-toggle-env-comm-button' class='cm-buttons cm-font cm-black ' ></button>",
				"<button id='cm-toggle-env-comm-button' class='cm-buttons cm-font cm-black ' >",
					"<span id='cm-toggle-env-comm-ico' class='cm-font cm-black cm-sans-padding-sans-margin' ></span>",
					" ",
					"<span id='cm-comments-count' class='cm-font cm-black cm-sans-padding-sans-margin ' ></span>",
				"</button>",
				//"<span id='cm-comments-count' class='cm-font cm-black ' ></span>",
			"</div> ",

			"<span id='cm-app-status' class='cm-font cm-black cm-sans-padding-sans-margin ' > </span> ",
			"<span class='cm-font cm-grey cm-sans-padding-sans-margin ' ><a href='",hostDomain,"' title='Project site' target=blank class='cm-link cm-font cm-grey ' ><b>CommentMore</a></b><sup id='cm-version' class='cm-grey ' > ",
			CMVersion,
			" </sup></span>",
			//"<button id='cm-options-button' title='Options' class='cm-buttons cm-font cm-black ' >≡</button>", //≡
			//" <span id='cm-version-status' class='cm-font cm-black '  ></span>",
			//" <span id='cm-notice' class='cm-font cm-red ' ></span>",
		"</div>",
		//comments:
		"<div id='cm-enhanced-area' style='display:none; ' >",
			"<div id='cm-comments-area' ></div>", //c
			//"<input id='cm-user-comment' placeholder='Your comment' class='cm-font cm-black ' > ",
			"<textarea id='cm-user-comment' placeholder='Your comment' class='cm-font cm-black cm-sans-padding-sans-margin ' ></textarea>",
			"<button id='cm-post-comment' class='cm-buttons cm-font cm-black ' >Post comment as ",CMLogin,"</button> ",
		"</div>"
	);
	document.body.appendChild(appPanel);

	applyStyle();

	$("#cm-toggle-button").click(toggleAppPanel); //^v
	//$("#cm-options-button").click(showOptions); //≡
	$("#cm-post-comment").click(postComment); //pc
	$("#cm-toggle-env-comm-button").click(toggleEnvComments); //☀☂



	echo("panel height",$('#cm-app-panel').css('height'));
	appPanel.style.bottom= str( -parseInt($('#cm-app-panel').css('height')) , "px" );


	$("#cm-toggle-button").text("▲");
	$("#cm-toggle-button").attr({"title":"Toggle comments"}); //☀☂
	collapsed= 1;
	$(appPanel).animate({bottom: 0}, 500);

	appPanelHorizontalPositioning(appPanel);

}

function appPanelHorizontalPositioning(appPanel) {
	if (getCookie("cm_appPanelLeft")) {
		echo("start from L");
		appPanel.style.left= getCookie("cm_appPanelLeft");
	} else {
		appPanel.style.right= getCookie("cm_appPanelRight") || "50px";
		echo("start from R");
	}
	echo("cookie | right:",getCookie("cm_appPanelRight"),"left:",getCookie("cm_appPanelLeft"));
	$( "#cm-app-panel" ).draggable({
		//addClasses: false,
		axis: "x",
		handle: "div#cm-app-head",
		stop: function( event, ui ) {
			$( "#cm-app-panel" ).css({"top":"auto"});




			var appPanelRight= Math.max(0,parseInt($("#cm-app-panel").css("right")));
			if (isNaN(appPanelRight)) appPanelRight= Math.max(0,document.body.clientWidth-parseInt($("#cm-app-panel").css("left"))-parseInt($("#cm-app-panel").css("width"))); //may be in Chrome
			var appPanelLeft= Math.max(0,parseInt($("#cm-app-panel").css("left")));

			if ( appPanelRight==="auto" || appPanelRight>appPanelLeft ) {
				setCookie("cm_appPanelRight", "", { path: "/", expires: -1 });
				setCookie("cm_appPanelLeft", appPanelLeft+"px", { path: "/", expires: cookiesExp });
				echo("from left",appPanelLeft);
			} else /*if ( appPanelRight<appPanelLeft )*/ {
				setCookie("cm_appPanelRight", appPanelRight+"px", { path: "/", expires: cookiesExp });
				setCookie("cm_appPanelLeft", "", { path: "/", expires: -1 });
				echo("from right",appPanelRight);
			}



		}
	});
}
/**/


function toggleAppPanel() {

	//getComments();


	if (collapsed) {
		$("div#cm-enhanced-area").css({"display": "block"});
		//$("#cm-app-panel").animate({bottom: "0px"}, 500);
		$("#cm-toggle-button").text("▼");
		collapsed= false;
	} else {
		$("div#cm-enhanced-area").css({"display": "none"});
		//$("#cm-app-panel").animate({bottom: waterLine}, 500); //!
		$("#cm-toggle-button").text("▲");
		collapsed= 1;
	}
}

function toggleEnvComments() { //☀☂
	if ( getCookie("cm_localCommentsOnly") ) {
		setCookie( "cm_localCommentsOnly", "", { path: "/", expires: -1 } );
	} else {
		setCookie("cm_localCommentsOnly", 1, { path: "/", expires: cookiesExp });
	}
	setEnvironmentDisplay();

}

function setEnvironmentDisplay() {
	//echo( "localCommentsOnly?", getCookie("cm_localCommentsOnly") );
	if ( getCookie("cm_localCommentsOnly") ) { //☀☂
		//$("#cm-toggle-env-comm-button").text("☂"); //☀☂
		$("#cm-toggle-env-comm-ico").text("☂"); //☀☂
		$("#cm-toggle-env-comm-button").attr({"title":"Switch to all comments"}); //☀☂
		$(".cm-external-comments").css({ "display":"none" });
		$("#cm-comments-count").text(commentsCount.local);


	} else {
		//$("#cm-toggle-env-comm-button").text("☀"); //☀☂
		$("#cm-toggle-env-comm-ico").text("☀"); //☀☂
		$("#cm-toggle-env-comm-button").attr({"title":"Switch to local comments"}); //☀☂
		$(".cm-external-comments").css({ "display":"block" });
		$("#cm-comments-count").text(commentsCount.all);


	}

}

//-----------------------------------p-a-n-e-l---------------------------------)




//----------------------------c-o-m-m-e-n-t---m-o-r-e--------------------------(

/*
function getAuth(/*CMLogin,CMPassword*) {
	echo("[get auth]");//dm
	$.ajax({
		url: str(hostDomain,"AJAX/get-auth"), // "https://comment-more.herokuapp.com/AJAX/post-comment", //
		dataType: "json",
		method: "post",
		data: {
			CMLogin: CMLogin,
			CMPassword: CMPassword
		},
		success: function(res) {
			echo("get auth: Success",res.answer);//dm
			console.log(res.answer);//xx
			//return res.answer;
			CMLogin= res.answer;
		},
		error: function() {
			echo("get auth  Error ",res.answer);//dm
			CMLogin= undefined;
			//playSound("http://wav-library.net/effect/windows/xp/windows_xp_-_kriticheskaya_oshibka.mp3");//sm //"http://nobuna.pp.ua/dload/windows_xp_-_kriticheskaya_oshibka.mp3"
		}
	});
}
*/


function getComments(scrollToLastComment) {
	if (ajaxInProcess) { echo( ">>> ajax in process. get omitted"); return undefined; }
	ajaxInProcess= true;


	echo("[get comments]");//dm

	$("#cm-app-status").text(" ⌛ "); //⌛



	var commentArea= document.getElementById("cm-comments-area");//$("div#results-area");//$("#private-msg");
	if (location.href!==oldWebPage) { //очистка, якщо змінилася url
		echo(oldWebPage,location.href);

		oldWebPage= location.href;
		commentArea.innerHTML= "";
		lastDateTime= 0;

		commentsCount= { "local": 0, "all": 0 }; // 0.27
	}


	$.ajax({
     url: str(hostDomain,"AJAX/get-comments"), // "https://comment-more.herokuapp.com/AJAX/get-comments", //
		 dataType: "json",
		 method: "post",
		 data: {
			 webPage: location.href,
			 lastDateTime: lastDateTime
		 },
     success: function(res) {
	     echo("Success get");//dm

			 //console.log(res);//x

			 $("#cm-app-status").text(" "); //⌛

			 for (var key in res.answer) { //res.answer?
					var tab= document.createElement('div');

					var current= res.answer[key];

					var truncatedCurrentWebPage= truncateLeftAll(current.webPage);
					var truncatedLocationHref= truncateLeftAll(location.href);

					tab.className= (truncatedCurrentWebPage===truncatedLocationHref)? "cm-comment-tab cm-font cm-black ": "cm-comment-tab cm-font cm-grey cm-external-comments "; //☀☂
					if (truncatedCurrentWebPage===truncatedLocationHref) commentsCount.local++;
					commentsCount.all++;


					var dateTimeStr= new Date(current.dateTime); //
					dateTimeStr= str( dateTimeStr.getDate(),".",dateTimeStr.getMonth()+1,".",dateTimeStr.getFullYear(), " " ,dateTimeStr.getHours(),":",dateTimeStr.getMinutes() );
					//echo(dateTimeStr);


					tab.innerHTML= str(
						"<b>",current.author,"</b> (",dateTimeStr,"):<br>",
						current.userComment.replace(/\n/g,"<br>"),
						(truncatedCurrentWebPage===truncatedLocationHref)? " ": str(" <a class='cm-link cm-font cm-grey ' href='",current.webPage,"' >➦</a>") //перехід на сторінку, з якої написано коментар
					);
					tab.title= str(current.webPageTitle,"\n",current.webPage);

					commentArea.appendChild(tab);

					if (current.dateTime>lastDateTime) lastDateTime= current.dateTime;
					echo("last date time",lastDateTime);//x
			 }
			 ajaxInProcess= false;
			 echo("var ajaxInProcess",ajaxInProcess);//x

			 applyStyle();

			 if (scrollToLastComment) commentArea.scrollTop = commentArea.scrollHeight;
			 setEnvironmentDisplay();//?


     },
     error: function() {
       echo("Error get comment");//dm
			 $("#cm-app-status").text(" error "); //⌛

			 ajaxInProcess= false;
     }
	});

}




/* AJAX by GET *
function getCommentsGET(scrollToLastComment) {
	if (ajaxInProcess) { echo( ">>> ajax in process. get omitted"); return undefined; }
	ajaxInProcess= true;
	echo("[get comments]");//dm
	$("#cm-app-status").text(" ⌛ "); //⌛
	var commentArea= document.getElementById("cm-comments-area");//$("div#results-area");//$("#private-msg");
	if (location.href!==oldWebPage) { //очистка, якщо змінилася url
		echo(oldWebPage,location.href);
		oldWebPage= location.href;
		commentArea.innerHTML= "";
		lastDateTime= 0;
		commentsCount= { "local": 0, "all": 0 }; // 0.27
	}
	$.get(str(hostDomain,"AJAX/GET/get-comments/?webPage=",webPage,"&lastDateTime=",lastDateTime), function(res) {
		echo("Success get");//dm
		//console.log(res);//x
		$("#cm-app-status").text(" "); //⌛
		for (key in res.answer) { //res.answer?
			 var tab= document.createElement('div');
			 var current= res.answer[key];
			 var truncatedCurrentWebPage= truncateLeftAll(current.webPage);
			 var truncatedLocationHref= truncateLeftAll(location.href);
			 tab.className= (truncatedCurrentWebPage===truncatedLocationHref)? "cm-comment-tab cm-font cm-black ": "cm-comment-tab cm-font cm-grey cm-external-comments "; //☀☂
			 if (truncatedCurrentWebPage===truncatedLocationHref) commentsCount.local++;
			 commentsCount.all++;
			 var dateTimeStr= new Date(current.dateTime); //
			 dateTimeStr= str( dateTimeStr.getDate(),".",dateTimeStr.getMonth()+1,".",dateTimeStr.getFullYear(), " " ,dateTimeStr.getHours(),":",dateTimeStr.getMinutes() );
			 //echo(dateTimeStr);
			 tab.innerHTML= str(
				 "<b>",current.author,"</b> (",dateTimeStr,"):<br>",
				 current.userComment.replace(/\n/g,"<br>"),
				 (truncatedCurrentWebPage===truncatedLocationHref)? " ": str(" <a class='cm-link cm-font cm-grey ' href='",current.webPage,"' >➦</a>") //перехід на сторінку, з якої написано коментар
			 );
			 tab.title= str(current.webPageTitle,"\n",current.webPage);
			 commentArea.appendChild(tab);
			 if (current.dateTime>lastDateTime) lastDateTime= current.dateTime;
			 //echo("last date time",lastDateTime);
		}
		applyStyle();
		if (scrollToLastComment) commentArea.scrollTop = commentArea.scrollHeight;
		setEnvironmentDisplay();//?
		ajaxInProcess= false;
	});
}
/**/





function postComment() {

	echo("[post comment]");//dm
	$("#cm-app-status").text(" ⌛ "); //⌛



	var userComment= $("#cm-user-comment").val();
	if (userComment) {
		$("#cm-user-comment").val("");

		$.ajax({
	     url: str(hostDomain,"AJAX/post-comment"), // "https://comment-more.herokuapp.com/AJAX/post-comment", //
			 dataType: "json",
			 method: "post",
			 data: {
				 "webPage": location.href,
				 "webPageTitle": document.title,
				 "CMLogin": CMLogin,
				 "CMPassword": CMPassword,
				 "userComment": userComment
			 },
	     success: function(res) {
					echo("post: Success",res.answer);//dm

					$("#cm-app-status").text(" "); //⌛

					getComments(1);

	     },
	     error: function() {
				 echo("Error post");//dm
				 $("#cm-app-status").text(" error "); //⌛

				 playSound("http://wav-library.net/effect/windows/xp/windows_xp_-_kriticheskaya_oshibka.mp3");//sm //"http://nobuna.pp.ua/dload/windows_xp_-_kriticheskaya_oshibka.mp3"

	     }
		});
	}


}



//----------------------------c-o-m-m-e-n-t---m-o-r-e--------------------------)











//--------------------------------e-x-t-e-r-i-o-r------------------------------(

function playSound(src) {
  var audio = new Audio();
  audio.src = src;
  audio.autoplay = true;
}

function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function scrollToElement(theElement) {
  if (typeof theElement === "string") theElement = document.getElementById(theElement);
  var selectedPosX = 0;
  var selectedPosY = 0;
  while (theElement != null) {
      selectedPosX += theElement.offsetLeft;
      selectedPosY += theElement.offsetTop;
      theElement = theElement.offsetParent;
  }
  window.scrollTo(0, selectedPosY);
}

// Модуль прокрутки сторінки до елемента по id (http://javascript.ru/forum/dom-window/21283-prokrutka-stranicy-do-id.html)
function scrollToElement(theElement) {
  if (typeof theElement === "string") theElement = document.getElementById(theElement);
  var selectedPosX = 0;
  var selectedPosY = 0;
  while (theElement != null) {
      selectedPosX += theElement.offsetLeft;
      selectedPosY += theElement.offsetTop;
      theElement = theElement.offsetParent;
  }
  window.scrollTo(0, selectedPosY);
}


//--------------------------------e-x-t-e-r-i-o-r------------------------------)

//--------------------------------m-i-c-r-o-l-i-b------------------------------(

/**
* Concatenates a number of arguments into the one resulting string
* with a warranty that the result is certainly should be a string.
* Also, some (or all) arguments can contain a Math operations
* (even without parentheses)
*/
function str() {
	for (var i= 0, txt= ""; i<arguments.length; i++) {
		txt+= arguments[i];
	}
	return txt;
}

/**
* Concatenates a number of arguments into the one resulting string
* and print it to the console if cookie "dev_mode" is true
*/
function echo() { //dm
	//if ( getCookie("dev_mode") )
	{

		for (var i= 0, txt= ""; i<arguments.length; i++) {
			var delimiter= (i===arguments.length-1)? "": " | ";
			txt+= arguments[i] + delimiter;
		}
		console.log(txt);

		//console.log(arguments);
	}
}

function leftSlice(url,str) {
	return (url.indexOf(str)>-1)? url.slice(str.length): url;
}

function truncateLeftAll(url) {
	var webPage= url;
	webPage= leftSlice( webPage , "http://m." );
	webPage= leftSlice( webPage , "http://www." );
	webPage= leftSlice( webPage , "https://m." );
	webPage= leftSlice( webPage , "https://www." );

	webPage= leftSlice( webPage , "https://" );
	webPage= leftSlice( webPage , "http://" );
	return webPage;
}

//--------------------------------m-i-c-r-o-l-i-b------------------------------)
