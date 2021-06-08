

const _ = require("lodash")		
	
let debouncer = _.debounce(() => {console.log('Function debounced after 1 second!');}, 1000);
    
debouncer();













