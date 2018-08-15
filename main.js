var tab; // заголовок вкладки
var tabContent; // блок содержащий контент вкладки
var doc = document;
 
window.onload = function(){
	tabContent = doc.getElementsByClassName('tabContent');
	tab = doc.getElementsByClassName('tab');
	hideTabsContent(1);
	loadContent();
}

function loadContent(){
	if(gameData != null){
		var tabsArr = [doc.getElementById("complTab"), doc.getElementById("mteTab"), doc.getElementById("testTab")];
		for(var i = 0; i < gameData.length && i < tabsArr.length; i++){
			if(gameData[i].length == 0){
				var str = doc.createElement("b");
				str.id = "nothing";
				str.appendChild(doc.createTextNode("Nothing =("));
				tabsArr[i].appendChild(str);
			}
			for(var j = 0 ; j < gameData[i].length; j++){
				var elem = gameData[i][j];
				tabsArr[i].appendChild(genContent(elem,i,j));
			}
		}
	}
}
function genContent(elem,i,j){
	/*tabsArr[i].append(
	"<div class = \"gameIcon\" onclick = \"gameChoose(" + i + "_" + j + ")\"><img class = \"gameImg\" src=\"" + elem.imgSrc +"\"><strong> " + elem.name + " </strong><br><i> " + elem.discription + " </i> </div>");*/
	var div = doc.createElement("div");
	div.setAttribute("class", "gameIcon");
	div.setAttribute("onclick", "gameChoose(" + i + "," + j + ")");
	var img = doc.createElement("img");
	img.setAttribute("class", "gameImg");
	img.setAttribute("src", elem.imgSrc);
	div.appendChild(img);
	div.appendChild(doc.createElement("br"));
	var bold = doc.createElement('strong');
	bold.appendChild(doc.createTextNode(elem.name))
	div.appendChild(bold);
	div.appendChild(doc.createElement("br"));
	var italic = doc.createElement('i');
	italic.appendChild(doc.createTextNode(elem.discription))
	div.appendChild(italic);
	return div;
}

function hideTabsContent(a){
	for (var i = a; i < tabContent.length; i++) {
		tabContent[i].classList.remove('show');
		tabContent[i].classList.add("hide");
		tab[i].classList.remove('whiteborder');
	}
}

doc.getElementById('tabs').onclick = function (event){
	var target = event.target;
	if (target.classList.contains("tab") && !target.classList.contains("whiteborder")) {
		for (var i = 0; i < tab.length; i++) {
			if (target == tab[i]) {
				showTabsContent(i);
				break;
			}
		}	
	}
}

function showTabsContent(b){
	if (tabContent[b].classList.contains('hide')){
		hideTabsContent(0);
		tab[b].classList.add('whiteborder');
		tabContent[b].classList.remove('hide');
		tabContent[b].classList.add('show');
	}
}
function gameChoose(c1,c2){
	if(gameData != null){
		window.open(gameData[c1][c2].htmlSrc);
	}
	
}