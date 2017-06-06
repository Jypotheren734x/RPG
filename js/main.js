/**
 * Created by komar on 6/5/2017.
 */
function $(element) {
	if(element[0] === '#') {
		return document.getElementById(element.slice(1, element.length));
	}
	if(element[0] === '.'){
		return document.getElementsByClassName(element.slice(1,element.length));
	}else{
		return document.getElementsByTagName(element);
	}
}