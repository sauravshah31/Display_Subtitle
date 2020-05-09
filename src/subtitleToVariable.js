//Convert multiline subtitle to single line
function convertToVariable(file){
	var l = file.length;
	var i = 0;

	var searchEle = ['\'','\"','\n','\r'];
	var replacedEle = ["\\'","\\\"","\\n",'\\r'];
	var ind;
	var curr="";
	//process.stdout.write(replacedEle[3]);
	//process.stdout.write(curr);
	var text='';
	while(i<l){
		if(file[i]=='*'&&file[i+1]=='*')
			break;
		ind = searchEle.indexOf(file[i]);
		if(ind!=-1){
			text+=replacedEle[ind];
		}else{
			text+=file[i];
		}
		i++;
	}
	return text;
}

//check if user want's to display subtitle
window.addEventListener('load',(event) => {
	var subtitle_done = document.getElementById('subtitle_done');
	var input = document.getElementById('subtitle_text');
	subtitle_done.addEventListener('click',(event) => {
		browser.tabs.query({currentWindow: true,active: true,active: true})
		.then((tabs) => {
			for(let tab of tabs){
						browser.tabs.sendMessage(
						tab.id,
						{"subtitle": input.value}
					).then(response => {
						input.value=response;
					})
					.catch(reject => {
						input.value = 'Something went wrong:\n'+reject;
					});
			}
		})
		.catch((err) => {
			input.value = 'Couldn\'t sent subtitle:\n'+reject;
		});
	});
});
