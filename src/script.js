window.addEventListener('load',(event) => {
	var form = document.getElementsByTagName('form')[0];
	//the form can't be submitted
	form.addEventListener('submit',(event) => {
			event.preventDefault();
	});
});
