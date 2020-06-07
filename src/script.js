function api_call(jsonObj){
		browser.tabs.query({currentWindow: true,active: true,active: true})
			.then((tabs) => {
				for(let tab of tabs){
							browser.tabs.sendMessage(
							tab.id,
							jsonObj,
						).then(response => {
							return response;
						})
						.catch(reject => {
							return reject;;
						});
				}
				
			})
			.catch((err) => {
				return reject;
			});
}

window.onload = function(){
		var paste=document.getElementById('paste');
		var upload = document.getElementById('upload');
		
		paste.addEventListener('click',function(){
			api_call({optionNo:1});
		});
		upload.addEventListener('click',function(){
			console.log('upload');
			api_call({optionNo:2});
		});
}
