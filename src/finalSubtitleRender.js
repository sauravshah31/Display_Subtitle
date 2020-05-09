/*
Created with ❤ by Saurav Shah
https://github.com/sauravshah31/Youtube_Subtitle

Feel free to use this code.

*/
//---------------------------------------------
//ELEMENT TO DISPLAY SUBTITLE
var newNode;
var textNode;

function initSubtitleBar(msg='Test'){
	newNode=document.createElement('div');
	newNode.style='position:fixed;bottom:0px;left:0px;background-color:black;height:100px;width:100%;z-index:1000000000000;';
	document.getElementsByTagName('body')[0].append(newNode);
	newNode.style.opacity='0.5';
	newNode.style.color='white';
	newNode.style.textAlign='center';
	newNode.style.fontFamily='monospace';
	newNode.style.fontSize='3em';
	
	
	textNode=document.createElement('span');
	newNode.append(textNode);
	textNode.style.opacity='1';
	textNode.textContent=msg;
}
//---------------------------------------------





//---------------------------------------------
//BLACKBOX -> UTILS FOR SUBTITLE OPERATIONS
/*
getNext(file){
PARAMETERS:
file : string, contains subtitle

RETURNS:
i : int, position from where the next subtitle is to be rendered
hour : int, next hour in subtitle
min : int, next minute in subtitle
sec : int, next second in subtitle
milsec : int, next milli second in subtitle
htmlContent : string, current subtitle text to be displayed
}


getTimeMilsec(hour1,hour2,min1,min2,sec1,sec2,mil1.mil2){

RETURNS:
duration for which the subtitle is to be displayed
}

initialDelay(){
function to get the time from which the subtitle starts
RETURNS:
Array:
[delay(int),start_hour(int),start_minute(int),start_second(int),start_millisecond(int)]
}

SubtitleObj(): object for storing subtitle stuffs

sleep(delay): kinda synchronous timeout
*/
var l=0;
var	SubtitleObj,//Creates Objects: 
	file1, //Object: FileObj
	contactMessage,
	playBtn
;
var playing=false;
var text='';
var stop=false;
var customDelay=-1070;

function getNext(file){
	var i=file.currLine;
	if((i+5)>=l){
		stop=true;
		return [0,0,0,0,0,'']
	}
	var hour="",min="",sec="",milsec="",htmlContent="";
	//skip the line number
	while((i<l) && (text[i]!='\n' && !(text[i]=='\\'&&text[i+1]=='n'))){
		++i;
	}
	i+=18;
	hour=text.substring(i,i+2);
	i+=3;
	min=text.substring(i,i+2);
	i+=3;
	sec=text.substring(i,i+2);
	i+=3;
	milsec=text.substring(i,i+3);
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
	return [parseInt(i),parseInt(hour),parseInt(min),parseInt(sec),parseInt(milsec),htmlContent];
}

//function that gets the initial time and delay from which subtitle displays
function initialDelay(){
	var i=2;
	var hour=parseInt(text[i]+text[i+1]);
	i+=3;
	var min=parseInt(text[i]+text[i+1]);
	i+=3;
	min=parseInt(min);
	var sec = parseInt(text[i]+text[i+1]);
	i+=3;
	var mil=parseInt(text[i]+text[i+1]+text[i+2]);
	console.log(hour*60*60*1000+min*60*1000+sec*1000+mil,hour,min,sec,mil);
	return [hour*60*60*1000+min*60*1000+sec*1000+mil,hour,min,sec,mil];
}
function getTimeMilsec(hour1,hour2,min1,min2,sec1,sec2,mil1,mil2){
		var time1 = hour1*60*60*1000 + min1*60*1000 + sec1*1000 + mil1;
		var time2 = hour2*60*60*1000 + min2*60*1000 + sec2*1000 + mil2;
		return time2-time1;
}

function displaySubtitle(txt){
	textNode.innerHTML = txt;
}

SubtitleObj = function(){
	this.currLine = 0;
	this.currHour = 0;
	this.currMin = 0;
	this.currSec = 0;
	this.currMilsec = 0;
	this.prevHour=0;
	this.prevMin = 0;
	this.prevSec = 0;
	this.prevMilsec = 0;
	this.currContent = "";
	this.render = function(){
			[this.prevHour,this.prevMin,this.prevSec,this.prevMilsec]=[this.currHour,this.currMin,this.currSec,this.currMilsec];
			[this.currLine,this.currHour,this.currMin,this.currSec,this.currMilsec,this.currContent] = getNext(this);
	}
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
//---------------------------------------------



//---------------------------------------------
//ASYNCHRONOUSLY DISPLAY SUBTITLE SO THAT THE BROWSER DOESN'T CRASH

function async_render(txt,delay,split=0,currSplit=0){
		setTimeout(() => {
				displaySubtitle(txt);
		},delay+split*currSplit);
}
function start(){
	l = text.length;
	var prevSplit=0;
	var currSplit=0;
	var split = 10000000; //to handle hour into millisec ,out of range of int
	var delay=0;
	file1 =new SubtitleObj();
	var sumDelays;
	[sumDelays,file1.currHour,file1.currMin,file1.currSec,file1.currMilsec] = initialDelay();
	sumDelays+=customDelay;
	while(!stop){
		file1.render();	delay=getTimeMilsec(file1.prevHour,file1.currHour,file1.prevMin,file1.currMin,file1.prevSec,file1.currSec,file1.prevMilsec,file1.currMilsec);
		async_render(file1.currContent,sumDelays,split,currSplit);
		sumDelays += delay;
		if(sumDelays>split){
				sumDelays=sumDelays%split;
				currSplit = prevSplit+1;
		}else{
				currSplit = prevSplit;
		}
		prevSplit=currSplit;
	}
	text = ''; //clear the original subtitle (to save memory)
	
}
//---------------------------------------------


function play(){
	if(playing==false){
		playing=true;
		textNode.textContent = '....Displaying Subtitle....';
		playBtn = document.getElementsByClassName('ytp-play-button ytp-button')[0];
		start();
		document.getElementsByTagName('body')[0].removeEventListener('click',play);
	}
	
}

//Display subtitle when user presses the display button
browser.runtime.onMessage.addListener(request => {
	text=request.subtitle;//get the subtitle from textarea
	l = text.length;

	//resolve "Autoplay is only allowed when approved by the user, the site is activated by the user, or media is muted."
	initSubtitleBar('Please click the play button to start');
	
	document.getElementsByTagName('body')[0].addEventListener('click',play);
	
	return Promise.resolve('Displaying Subtitle');//subtitle displaying
});
