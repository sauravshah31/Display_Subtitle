var toRemoveHistory = []; //Keeps track of what needs to be removed first, elements & listeners added to DOM
var appTitle = "Display subtitle";
var optionBoxRendered = false;
var displayingSubtitle = false;
var stop = false;
var text="",l=0,lineNo=0;
var all_subtitle = [];
var newNode,textNode;
var customDelay=0;
var optionNo=0;
var displayingLine=0;
var cc_="<b>By Saurav Shah</b><br/><a href='https://github.com/sauravshah31/' style='color:white;'>https://github.com/sauravshah31/</a>";

//XSS prevention
//reference: https://medium.com/@shashankvivek.7/understanding-xss-and-preventing-it-using-pure-javascript-ef0668b37687
String.prototype.escape = function(){
		var tags = {
			'&' : '&amp;',
			'<': '&lt;',
       '>': '&gt;'
		};
		var allowed = ["b","i","u","br"];
		var res= this.replace(/[&<>]/g, function(tag) {
        return  tags[tag] || tag;
    });
    
    for(var str of allowed){
			var reg = new RegExp("&lt;"+str+"&gt;","g")
			res = res.replace(reg,"<"+str+">");
			reg = new RegExp("&lt;/"+str+"&gt;","g");
			res = res.replace(reg,"</"+str+">");
		}
		return res;
};

function removeAll(){
		while(toRemoveHistory.length!==0){
				toRemoveHistory.pop()();
		}
		optionBoxRendered = false;
}

function removeEle(Ele){
/*
 * This function removes the passed element from DOM
*/
		Ele.remove();
}


function getStyleElement(){
/*
 * This function returns style element
*/

		var style = document.createElement('style');
		style.textContent = `
#main_93842 {
	min-width:400px;
	max-width: 450px;
	min-height:30px; /*300px*/
	border: 1px solid black;
	background-color: #F6E3E3;
}
#main_93842 div{
	margin: 0px;
}
#header_93842{
	height : 20px;
	border-bottom: 1px solid black;
	font-size: 1.2em;
	text-transform: uppercase;
	font-family: monospace;
	color: #630000;
	padding: 3px;
	cursor: all-scroll;
}
#header_93842 span{
	display: inline-block;
	text-align: center;
}
#close_93842{
	cursor: pointer;
	font-weight: bold;
	font-size: 1.2em;
}
#close_93842:hover{
	background-color:#FF0000; 
}
#close_93842:active{
	background-color:#3BE920;
}

#main_93842 form{
	margin : 0px;
}
#main_93842 .input_93842 textarea{
	margin: 0;
	padding:0;
	border:0;
	padding-top:5px;
	width:100%;
	min-height: 250px;
	resize: none;
	overflow: auto;
	background-color: #F6E3E3;
}

#main_93842 .input_93842 textarea::-moz-placeholder { 
  color: #1221DA;
}

.controls_93842{
	padding:0;
	border:0;
	border: 0;
	width:100%;
	margin:0;
	border-top: 1px solid black;
}

.controls_93842 >*{
	position:relative;
	border: 0px;
	background-color: #57FD4E;
	height: 47px;
}

#main_93842 button:hover{
	background-color: #FF758A;
	cursor: pointer;
}

#file_93842{
	margin: 0;
	padding:0;
	width:auto;
	resize: none;
}
#file_93842 >*{
	width:100%;
	height:40px;
	font-size : 1.2em;
	background-color: #F6E3E3;
	padding: 0px;
	/*border-bottom: 1px solid black;*/
}

#delay_93842{
	height: 34px;
	width:100%;
	border-top: 1px solid black;
	padding-top:1px;
}


#delay_93842 span{
	border: 0px;
	font-size: 1.2em;
	display: inline-block;
}

#subtitle_file>*{
	width: 50%;
	cursor:pointer;
}

#delay_93842 span input{
	width: 100%;
}
#main_93842 .hidden {
	display:none;
}
.zindex_93842{
	z-index : 99999;
}
`;

return style;
}

function createElement(name,attr={}){
/*
 * This function returns a DOM element
 * parameters:
 * 	name : string, DOM element name
 * 	attr : object, attributes to be assigned to the element (optional)
*/

		var ele = document.createElement(name);
		for (var key in attr){
				ele.setAttribute(key,attr[key]);
		}
		return ele;
}


function getSubtitleBar(msg=''){
/*
 * This function returns a 'div' element where subtitles are to be displayed
 * parameters: 
 * 	msg(optional) - What message to put into the div element, default = empty string
 * returns:
 * 	newNode - 'div' element
 * 	textNode - text element inside newNode
*/
 
	var newNode,textNode,closeNode;
	newNode = createElement('div',
	{
		"id":"subtitle_box_93842",
		"style":"position:fixed;bottom:0px;left:0px;background-color:black;height:100px;width:100%;z-index:9999;opacity:0.5;color:white;text-align:center;font-size:min(30px,4vw);margin:0px;padding:0px;overflow:auto;",
		"title":"close subtitle box"
	});
	
	closeNode = createElement('span',
	{
		"style":"font-size:0.5em;float:right;background-color:red;width:40px;font-family:serif;cursor:pointer;display: none;"
	});
	closeNode.textContent = "X";
	
	
	textNode = createElement('span',
	{
		"style":"opacity:1;font-family:monospace;"
	});
	textNode.textContent=msg;
	
	newNode.appendChild(closeNode);
	newNode.appendChild(textNode);
	
	closeNode.addEventListener('mouseover',function(){
			closeNode.style.backgroundColor="green";
	});
	closeNode.addEventListener('mouseout',function(){
			closeNode.style.backgroundColor="red";
	});
	closeNode.addEventListener('click',function(){
			removeEle(newNode);
			displayingSubtitle = false;
	});
	newNode.addEventListener('mouseover',function(){
			closeNode.style.display="inline";
	});
	newNode.addEventListener('mouseout',function(){
			closeNode.style.display="none";
	});
	return [newNode,textNode];
}


function getOptionBox(option){
/*
 * This function returns a box containing options
 * parameters:
 * 	option :		
 *		1 -> paste from clipboard
 * 		2 -> upload from file
 * returns:
 * 	[main_93842,form,inpField,delay_93842,controls_93842]
*/

		var main_93842 = createElement('div',{"id":"main_93842","style":"position: fixed;top: 20%;left: 1%;","class":"zindex_93842"});
		
		var style = getStyleElement();
		
		var header_93842 = createElement('div',{"id":"header_93842"});
		var title = createElement('span',{"style":"width:96%;"});
		title.textContent=appTitle;
		var close_93842 = createElement('span',{"id":"close_93842","title":"close_93842","style":"width:4%;"});
		close_93842.textContent = "X";
		header_93842.appendChild(title);
		header_93842.appendChild(close_93842);
		
		var form = createElement('form',{"class":"input_93842", "action":"#"});
		
		var inpField;
		if(option === 1){
			var paste_93842 = createElement('div',{"id":"paste_93842"});
			var textarea = createElement('textarea',{"placeholder":" Paste the srt format subtitle Here","id":"subtitle_text"});
			paste_93842.appendChild(textarea);
			
			inpField = paste_93842;
		}else if(option === 2){
				
				var file_93842 = createElement('div',{"id":"file_93842"});
				var div = createElement('div');
				div.textContent = "Please Choose a file with 'srt' format";
				var browse = createElement('input',{"type":"file","accept":".srt","id":"subtitle_file"});
				file_93842.appendChild(div);
				file_93842.appendChild(browse);
				
				inpField = file_93842;
		}else{
				return null;
		}
		
		var delay_93842 = createElement('div',{"id":"delay_93842","title":"Use this if the subtitle displays after or before it was supposed to"});
		var delayText = createElement('span',{"style":""});
		delayText.textContent = "Delay";
		var delayInp = createElement('input',{"type":"number","id":"inpDelay","style" : "padding-left:2%;padding-right:2%;","placeholder":"delay in milliseconds", "title":"negative value is also allowed"});
		var delayFormating = createElement('span',{"style":"","id":"delayTime","title":"minute:second:millisecond"});
		delayFormating.textContent  = "00:00:00";
		delay_93842.appendChild(delayText);
		delay_93842.appendChild(delayInp);
		delay_93842.appendChild(delayFormating);
		
		var controls_93842 = createElement('div',{"class":"controls_93842","id":"ctrl"});
		var ctrl1 = createElement('button',{"type":"button","id":"subtile_done"});
		ctrl1.textContent = "Display Subtitle";
		controls_93842.appendChild(ctrl1);
		
		form.appendChild(inpField);
		form.appendChild(delay_93842);
		form.appendChild(controls_93842);
		
		main_93842.appendChild(style);
		main_93842.appendChild(header_93842);
		main_93842.appendChild(form);
		
		return [main_93842,form,inpField,delay_93842,controls_93842];
}

function removeEventListener(ele,event,func){
/*
 * This function removes eventlistener
 * parameters:
 * 	ele: element 
 * 	event: event to remove
 * 	func : function name
*/
		ele.removeEventListener(event,func);
}

function startDragAction(e,main_93842=document.getElementById('main_93842')){
	e.preventDefault();
	
	var x = e.clientX;
	var y = e.clientY;
	
	document.addEventListener('mousemove',dragBox);
	document.addEventListener('mouseup',stopDragAction);
	
	function dragBox(e){
		var diffX,diffY;
		diffX = x - e.clientX;
		diffY = y - e.clientY;
		
		x = e.clientX;
		y = e.clientY;
		
		main_93842.style.top = (main_93842.offsetTop-diffY)+"px";
		main_93842.style.left = (main_93842.offsetLeft-diffX)+"px";
	}
	function stopDragAction(){
		removeEventListener(document,'mousemove',dragBox);
		removeEventListener(document,'mouseup',stopDragAction);
	}
}


function milliToTime(e){
/*
 *	This function converts millisecond to min:sec:millisec format
*/
		var ele=e.target;
		var min,sec,tot,sign;
		min=sec=mil=0;
		if(ele.value<0){
				sign='-';
				tot = -1 * ele.value;
		}else{
				sign='';
				tot = ele.value;
		}
		min = parseInt(tot/60000);
		tot = tot - min*60000;
		sec = parseInt(tot/1000);
		tot = tot - sec*1000;
		document.getElementById('delayTime').textContent = sign+min+":"+sec+":"+tot;
}

function initEventListeners(){
/*
 * This function adds all the listeners needed initially
 * parameters:
 * 	option: paste(1) / upload(2)
*/
	var close_93842 = document.getElementById('close_93842');
	close_93842.addEventListener('click',removeAll);
	toRemoveHistory.push(function(){removeEventListener(close_93842,'click',removeAll)});
	
	var header_93842 = document.getElementById('header_93842');
	header_93842.addEventListener('mousedown',startDragAction);
	toRemoveHistory.push(function(){removeEventListener(header_93842,'mousedown',startDragAction)});
	
	var delay_93842 = document.querySelector("#delay_93842 input");
	delay_93842.addEventListener('input',milliToTime);
	toRemoveHistory.push(function(){removeEventListener(delay_93842,'input',milliToTime)});
}




//---------------------------------------------------

function initialDelay(){
/*
 * This function returns start time of first line of subtitle in seconds
*/

	var i=2;
	var hour=parseInt(text[i]+text[i+1]);
	i+=3;
	var min=parseInt(text[i]+text[i+1]);
	i+=3;
	min=parseInt(min);
	var sec = parseInt(text[i]+text[i+1]);
	i+=3;
	var mil=parseInt(text[i]+text[i+1]+text[i+2]);
	var toSec = hour*60*60+min*60+sec+mil/1000;
	return isNaN(toSec)?0:toSec;
}


function displaySubtitle(txt){
	textNode.innerHTML = txt;
}

//Object to store subtitle elements
SubtitleObj = function(stm,etm,ct){
		this.startTime = stm;
		this.endTime = etm;
		this.content = ct;
}


function searchLessThan(fac){
/*
 * This function returns the closest subtitle to time "fac" given
*/

		var left,right,mid;
		left = 0;
		right = l-1;
		while(left<=right){
				mid = parseInt((left+right)/2);
				if(fac>=(all_subtitle[mid].startTime) && (fac<=all_subtitle[mid].endTime)){
						return mid;
				}else if(fac>=all_subtitle[mid].endTime){
						left = mid+1;
				}else{
						right = mid-1;
				}
		}
		return lineNo;
}


function handleChangeTime(ele){
/*
 * Change subtitle when the video element's current time changes
*/

	var fac = ele.currentTime;
	if(fac>=(all_subtitle[lineNo].startTime) && fac<=(all_subtitle[lineNo].endTime)){
		
	}else if(fac>=(all_subtitle[lineNo+1].startTime) && fac<=(all_subtitle[lineNo+1].endTime)){
		lineNo++;
	}else{
			lineNo = searchLessThan(fac);
	}
	
	if(displayingLine!=lineNo){
			displaySubtitle(all_subtitle[lineNo].content);
			displayingLine = lineNo;
	}
}


function addBorder(e){
		e.target.style.border = "14px solid green";
}

function removeBorder(e){
		e.target.style.border = null;
}



function getVideoTagElement(ele){
/*
 * This function returns all the video elements of current page
*/

	if(ele.tagName == "VIDEO")
		return ele;			
	var ret = null;
	if(ele.childElementCount == 0)
		return null;
	for(var child of ele.childNodes){
		ret = getVideoTagElement(child);
		if(ret!=null)
			break;
	}
	return ret;
}


function getNext(){
/*
 * This function returns next subtitle text 
 * returns:
 * 	 [stime,etime,htmlContent,i] - startTime,endTime,currentSubtitleText,currentCharNo
*/
	var i=lineNo;
	if((i+5)>=l){
		stop=true;
		return [0,0,'',0]
	}
	var hour="",min="",sec="",milsec="",htmlContent="";
	var ehour="",emin="",esec="",emilsec="";
	//skip the line number
	while((i<l) && (text[i]!='\n' && !(text[i]=='\\'&&text[i+1]=='n'))){
		++i;
	}
	i+=1;
	hour=text.substring(i,i+2);
	i+=3;
	min=text.substring(i,i+2);
	i+=3;
	sec=text.substring(i,i+2);
	i+=3;
	milsec=text.substring(i,i+3);
	
	i+=8;
	ehour=text.substring(i,i+2);
	i+=3;
	emin=text.substring(i,i+2);
	i+=3;
	esec=text.substring(i,i+2);
	i+=3;
	emilsec=text.substring(i,i+3);
	i+=4;
	//get the current subtitle
	while(true)
	{
		htmlContent+=text[i];
		++i;
		if((i>=l) || (text[i]=='\n'&&text[i+1]=='\n') || (text[i]=='\\'&&text[i+1]=='n'&&text[i+2]=='\\'&&text[i+3]=='n'))
			break;
	}
	i+=2;
	if(i+3>=l)
		stop=true;
	hour = parseInt(hour);
	min = parseInt(min);
	sec = parseInt(sec);
	milsec = parseInt(milsec);
	
	ehour = parseInt(ehour);
	emin = parseInt(emin);
	esec = parseInt(esec);
	emilsec = parseInt(emilsec);
	var stime = hour*60*60 + min*60 + sec + milsec / 1000;
	var etime = ehour*60*60 + emin*60 + esec + emilsec / 1000;
	return [stime,etime,htmlContent,i];
}

//listen to the change in player currentTime
function listen(ele){
	setTimeout(function(){
		if(displayingSubtitle){
			handleChangeTime(ele);
			listen(ele);
		}else{
				//reset all the values
				toRemoveHistory = [];
				stop = false;
				text="";l=0;lineNo=0;
				all_subtitle = [];
				customDelay=0;
				optionNo=0;
				displayingLine=0;
				return;
		}
	},50);
}

function play(){
/*
 * This function inititlize all_subtitle with all the subtitle and corresponding startTime,endTime
*/
		var stm,etm,ct;
		textNode.textContent = '....Displaying Subtitle....';
		l=text.length;
		lineNo = 0;
		all_subtitle.push(new SubtitleObj(0,initialDelay()+customDelay,textNode.textContent));
		while(!stop){
			[stm,etm,ct,lineNo] = getNext();
			all_subtitle.push(new SubtitleObj(stm+customDelay,etm+customDelay,ct.escape()));
		}
		all_subtitle.push(new SubtitleObj(etm+customDelay,etm+customDelay+10000,cc_));
		all_subtitle.push(new SubtitleObj(etm+customDelay+10000,etm+customDelay+100000,cc_));
		
		l = all_subtitle.length; //this variable will now store no of subtitle
		lineNo = 0; //this variable will now be used as current subtitle no
		
		displayingSubtitle = true;
		listen(clickedEle);
		clickedEle.play();
		text="";
		
}

//get the player which was clicked, if none, select the first player
function getClickedElement(e){
	e.preventDefault();
	clickedEle = e.target;
	document.removeEventListener('click',getClickedElement);
	var video_ele = document.getElementsByTagName('video');
	for(var ele of video_ele){
			ele.removeEventListener('mouseenter',addBorder);
			ele.removeEventListener('mouseleave',removeBorder)
	}
	
	removeBorder(e);
	clickedEle = getVideoTagElement(clickedEle);
	if(clickedEle === null && video_ele.length !== 0 )
		clickedEle = video_ele[0];
		
	if(clickedEle === null){
			textNode.textContent('Something went wrong: No player found');
			return;
	}
	
	play();
	text="";
	clickedEle.play();
}



//get all the video player in current page
function getVideoElement(){
	
		var video_ele = document.getElementsByTagName('video');
		for(var ele of video_ele){
				ele.addEventListener('mouseenter',addBorder);
				ele.addEventListener('mouseleave',removeBorder)
		}
		if(video_ele.length !== 0){
			textNode.textContent = 'Select the video player (just click on the player)';
			document.addEventListener('click',getClickedElement);
		}else{
			textNode.textContent = '!!! No video Element Found';
		}
}

function preProcess(file){
		var i = 0;
		var text='';
		var l = file.length;
		while(!(file[i]>='0' && file[i]<='9') &&i<l)
			i++;
		while(i<l){
			if (file[i]!=='\r' )
			{
				text+=file[i];
			}
			i++;
		}
		return text;
}

function displayBtnHandler_util(){
		[newNode,textNode] =getSubtitleBar('...Please Wait...');
		document.body.appendChild(newNode);
		
		customDelay = parseInt(document.querySelector('#delay_93842 input').value) || 0;
		customDelay /=1000;
		
		text = preProcess(text);
		l=text.length;
		removeAll();//now we can remove optionBox
		getVideoElement();
}

function displayBtnHandler(e){
	if(!displayingSubtitle){ //display subtitle only if subtitle is not displaying
		if(optionNo===1){
			//get textarea value
			setTimeout(function(){
				text = document.getElementById('subtitle_text').value;
				if(text!="")
					displayBtnHandler_util();
				},100);
		}else if (optionNo===2){
			//get subtitle from file
			var fileInp = document.querySelector('#file_93842 input');
				if(fileInp.files && fileInp.files[0]){
					var reader = new FileReader();
					
					reader.onload = function(e){
						text = reader.result;
						displayBtnHandler_util();
					}
					
					reader.readAsBinaryString(fileInp.files[0]);
			}else{
					console.log('no file');
			}
		}
		
	}
}

function initSubtitleBox(option){
		optionBoxRendered = true;
		var main_93842,form,inpField,delay_93842,controls_93842;
		[main_93842,form,inpField,delay_93842,controls_93842] = getOptionBox(option);
		document.body.appendChild(main_93842);
		toRemoveHistory.push(function(){removeEle(main_93842)});
		initEventListeners();
		
		var display_btn = document.querySelector('.controls_93842 button');
		display_btn.addEventListener('click',displayBtnHandler);
		toRemoveHistory.push(function(){removeEventListener(display_btn,'click',displayBtnHandler)});
}


//Display subtitle when user presses the display button
window.addEventListener('load',function(){
browser.runtime.onMessage.addListener(request => {
	optionNo = parseInt(request.optionNo);
	if(!optionBoxRendered){
				initSubtitleBox(optionNo);
	}
});
});


