//XYZ Camp Auto-detailing backend
//Where all the magic happens
//FYI, the version here runs seperate from the main page version

//Revision 2.22122015
//Bootstrap-Select: v1.9.3



//All People
var gunner = ["Nash", "Ci Ding", "Nav", "Rad", "Farud", "Randal", "Ahmad", "Zul"];
var service = ["James", "Kuo Wei", "Dave", "Samuel", "Betrand", "Naz"];
var musGunner = ["Nav", "Farud", "Ahmad", "Zul"];
var musService = ["Naz"];

function fillSelector(type, id) {
	for (var i =0; i < type.length; i++) {
		var option = document.createElement("option");
		var name = document.createTextNode(type[i]);
		option.appendChild(name);
		id.appendChild(option);
	}
}


//Filling up the names on selector
fillSelector(gunner, document.getElementById("gunnernames"));
fillSelector(service, document.getElementById("serviceS"));
fillSelector(gunner, document.getElementById("serviceG"));
fillSelector(gunner, document.getElementById("poG"));
fillSelector(service, document.getElementById("poS"));



var detailingType;
var selectedGunners = [];
var selectedService = [];
var selectedPO = [];

function captureSelection(type) {
	detailingType;
	selectedGunners = [];
	selectedService = [];
	selectedPO = [];

	//Detailing Type (Normal/Friday/Half-Day/ICT) - argument passed back from html
	detailingType = type;

	function selection(id, array) {
		var selector = id;
		var selectorlength = selector.length;
		for (var i = 0; i < selectorlength; i++) {
			if(selector[i].selected === true) {
				array.push(selector[i].value);
			}
		}
	}

	//Grabbing chosen names
	selection(document.getElementById("gunnernames"), selectedGunners);
	selection(document.getElementById("servicenames"), selectedService);
	selection(document.getElementById("ponames"), selectedPO);

	if(selectedGunners === null || selectedService === null || selectedPO === null) {
		alert("WARNING\n\nPlease select at least 4 gunners, 4 service and 2 Pass Office!");
		return;
	}

	if(detailingType === "normal" || detailingType === "friday") {
		if(selectedGunners.length < 4 || selectedService.length < 4 || selectedPO.length < 2) {
			alert("WARNING\n\nPlease select at least 4 gunners, 4 service and 2 Pass Office!");
			return;
		}	
	}

	if(detailingType === "halfday") {
		if(detailingType === "halfday" && selectedGunners.length < 2 || selectedService.length < 3) {
			alert("WARNING\n\nPlease select at least 2 gunners, 3 service and 1 Pass Office!")
			return;
		}
	}

	if(detailingType === "ict") {
		if(selectedGunners.length < 5 || selectedService.length < 5 || selectedPO.length < 2) {
			alert("WARNING\n\nPlease select at least 5 gunners, 5 service and 2 Pass Office!");
			return;
		}
	}

	cacat();
}



//Checking for cacat!
function cacat() {
	var altogether = [];
	altogether = selectedGunners.concat(selectedService, selectedPO);
	for (var i = 0; i < altogether.length; i++) {
		if(altogether.lastIndexOf(altogether[i]) !== i) {
			alert("You cacat!\n\nYou selected someone to be gunner and service OR you selected someone outside to do pass office also!");
			return false;
		}
	}

	if(detailingType === "normal") {
		shuffleNames();
	}

	if(detailingType === "friday") {
		shuffleNamesFriday();
	}

	if(detailingType === "halfday") {
		shuffleNamesNoG2();
	}

	if(detailingType === "ict") {
		shuffleNamesICT();
	}
}



//Fisher-Yates Shuffle
function shuffle(array) {
	var i = 0;
	var j = 0;
	var temp = null;
	var arlength = array.length;

  	for (i = arlength-1; i > 0; i--) {
    	j = Math.floor(Math.random() * (i + 1));
    	temp = array[i];
    	array[i] = array[j];
    	array[j] = temp;
  	}
  return array;
}


//Randomly pick people from inital gantry list for Gantry 2
function randNo(outsideStrength) {
	var randNum = Math.floor(Math.random() * outsideStrength);
	return randNum;
}


//Declaring Global Variables
var serviceICT = [];
var gantryICT = [];
var finalGunner = [];
var gunnerStrength;
var finalService = [];
var serviceStrength;
var finalGantry = [];
var gantryStrength;
var finalGantry2 = [];
var gantry2Strength;
var finalPO = [];
var poStrength;
var muslimGunners = [];
var muslimService = [];


function clearArray() {
	serviceICT = [];
	gantryICT = [];
	finalGunner = [];
	finalService = [];
	finalGantry = [];
	finalGantry2 = [];
	finalPO = [];
	muslimGunners = [];
	muslimService = [];
}


function shuffleNames() {
	clearArray();
	finalGunner = shuffle(selectedGunners);
	finalService = shuffle(selectedService);
	finalPO = shuffle(selectedPO);

	//Removing the first and last gunner/service from selection of Gantry 2 as they will clash regardless
	preGantry$1 = finalGunner.slice(1, finalGunner.length-1);
	preGantry$2 = finalService.slice(1, finalService.length-1);
	preGantry = preGantry$1.concat(preGantry$2);
	var fglen = preGantry.length;

	//Picking Gantry 2
	var randIndex = randNo(fglen);
	var randIndex2 = randNo(fglen);
	while (randIndex === randIndex2) {
		randIndex2 = randNo(fglen);
	}
	finalGantry2 = [preGantry[randIndex], preGantry[randIndex2]];
	
	//Removing Gantry 2 people from the main Gantry list
	finalGantry = finalGunner.concat(finalService);
	var indG2M = finalGantry.indexOf(finalGantry2[0]);
	finalGantry.splice(indG2M, 1);
	var indG2E = finalGantry.indexOf(finalGantry2[1]);
	finalGantry.splice(indG2E, 1);

	//Counting Strength
	gunnerStrength = finalGunner.length;
	serviceStrength = finalService.length;
	gantryStrength = finalGantry.length;
	poStrength = finalPO.length;

	//Checking Clash
	while(checkClash()) {
		shuffle(finalGantry);
		shuffle(finalGantry2);
	}

	displayDetailing();
}

function shuffleNamesFriday() {
	clearArray();
	finalPO = shuffle(selectedPO);
	var frontPpl;
	var preGunnerLen = selectedGunners.length;
	var preServiceLen = selectedService.length;
	var muslimGunnersLen;
	var muslimServiceLen;

	//Checking maximum allowed muslims to do first few slots of gunners/service
	if(selectedGunners.length < 6 || selectedService.length < 6) {
		frontPpl = 2;
	}
	else {
		frontPpl = 3;
	}

	var mergedGunners = selectedGunners.concat(musGunner);	
	console.log(mergedGunners);
	mergedGunners.reduce(function(a,b){
		if(a.indexOf(b) < 0) {
			console.log(a.indexOf(b))
			muslimGunners.push(b);
		}
		
	});
	console.log(muslimGunners);
	//for (var i = 0; i < preGunnerLen; i++) {
	//	if(mergedGunners.lastIndexOf(mergedGunners[i]) !== i) {
	//		console.log(mergedGunners.lastIndexOf(mergedGunners[i]));
	//		muslimGunners.push(mergedGunners[i]);
	//		selectedGunners.splice(i, 1);
	//	}
	//}
	muslimGunnersLen = muslimGunners.length;
	console.log(selectedGunners);

	if(preGunnerLen < 5 && muslimGunnersLen > 3 || preGunnerLen > 5 && muslimGunnersLen > 4) {
		alert("Not all muslims will be able to go for prayers!\n\nAuto-Detailing will plan without consideration for prayer timing");
		shuffleNamesNoG2();
		return;
	}

	var mergedService = selectedService.concat(musService);
	for (var i = 0; i < preServiceLen; i++) {
		if(mergedService.lastIndexOf(mergedService[i]) !== i) {
			muslimService.push(mergedService[i]);
			nonMuslimService = selectedService.splice(i, 1);
		}
	}
	muslimServiceLen = muslimService.length;
	console.log(muslimService);

	if(preServiceLen < 5 && muslimServiceLen > 3 || preServiceLen > 5 && muslimServiceLen > 4) {
		alert("Not all muslims will be able to go for prayers!\n\nAuto-Detailing will plan without consideration for prayer timing");
		shuffleNamesNoG2();
		return;
	}

	if(muslimGunnersLen === 0 && muslimServiceLen === 0) {
		shuffleNamesNoG2();
		return;
	}

	finalGunner = shuffle(nonMuslimGunners);
	shuffle(muslimGunners);
	for (var i = 0; i < frontPpl; i++) {
		finalGunner.unshift(muslimGunners[i]);
	}
	finalGunner.push(muslimGunners[muslimGunners.length-1]);

	finalService = shuffle(nonMuslimService);
	shuffle(muslimService);
	for (var i = 0; i < frontPpl; i++) {
		finalService.unshift(muslimService[i]);
	}
	finalService.push(muslimService[muslimService.length-1]);

	var preGantry2 = nonMuslimGunners.concat(nonMuslimService);
	var fglen = preGantry2.length;
	var randIndex = randNo(fglen);
	finalGantry2 = [preGantry2[randIndex]];

	preGantry = preGantry2.splice(randIndex, 1);
	finalGantry = preGantry.concat(muslimGunners, muslimService);

	gunnerStrength = finalGunner.length;
	serviceStrength = finalService.length;
	gantryStrength = finalGantry.length;

	while(checkClashF()) {
		shuffle(finalGantry);
	}

	displayDetailing();
}

function shuffleNamesNoG2() {
	clearArray();
	finalGunner = shuffle(selectedGunners);
	finalService = shuffle(selectedService);
	finalPO = shuffle(selectedPO);

	//Removing the first and last gunner/service (& 2nd service) from selection of Gantry 2 as they will clash regardless
	preGantry$1 = finalGunner.slice(1, finalGunner.length);
	preGantry$2 = finalService.slice(2, finalService.length);
	preGantry = preGantry$1.concat(preGantry$2);
	var fglen = preGantry.length;

	//Picking Gantry 2
	var randIndex = randNo(fglen);
	finalGantry2 = [preGantry[randIndex]];
	
	//Removing Gantry 2 people from the main Gantry list
	finalGantry = finalGunner.concat(finalService);
	var indG2M = finalGantry.indexOf(finalGantry2[0]);
	finalGantry.splice(indG2M, 1);

	//Counting Strength
	gunnerStrength = finalGunner.length;
	serviceStrength = finalService.length;
	gantryStrength = finalGantry.length;
	poStrength = finalPO.length;

	//Check Clash
	if(detailingType === "friday") {
		while(checkClash()) {
			shuffle(finalGantry);
		}
	}

	if(detailingType === "halfday") {
		while(checkClash()) {
			shuffle(finalGantry);
		}
	}

	displayDetailing();
}

function shuffleNamesICT() {
	clearArray();
	finalGunner = shuffle(selectedGunners);
	finalService = shuffle(selectedService);
	finalPO = shuffle(selectedPO);

	//Picking ICT People and Gantry 2
	var ictGunner = finalGunner.slice(1, finalGunner.length-1);
	var ictService = finalService.slice(1, finalService.length-1);
	var ictPeople = ictGunner.concat(ictService);
	shuffle(ictPeople);
	serviceICT = [ictPeople[1], ictPeople[2], ictPeople[3]];
	gantryICT = [ictPeople[4], ictPeople[5]];
	finalGantry2 = [ictPeople[0]];

	//Removing Gantry 2 from main Gantry list
	finalGantry = finalGunner.concat(finalService);
	var gantry2Index = finalGantry.indexOf(finalGantry[0]);
	finalGantry.splice(gantry2Index, 1);

	//Counting Strength
	gunnerStrength = finalGunner.length;
	serviceStrength = finalService.length;
	gantryStrength = finalGantry.length;
	poStrength = finalPO.length;

	//Check Clash
	while(checkClash()) {
		shuffle(finalGantry);
	}

	displayDetailing();
}



//Timing (hard-coded to prevent nonsensical timing)
var gunnerTimingOptions = {
	//8: ["08:00:00", "09:15:00", "10:30:00", "11:45:00", "13:00:00", "14:15:00", "15:30:00", "16:45:00"],
	7: ["08:00:00", "09:30:00", "10:55:00", "12:20:00", "13:45:00", "15:10:00", "16:35:00"],
	6: ["08:00:00", "09:40:00", "11:20:00", "13:00:00", "14:40:00", "16:20:00"],
	5: ["08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00"],
	4: ["08:00:00", "10:30:00", "13:00:00", "15:30:00"],
	3: ["08:00:00", "11:20:00", "14:40:00"]
}

var gunnerTimingOptionsHd = {
	7: ["08:00:00", "08:50:00", "09:40:00", "10:30:00", "11:15:00", "12:00:00", "12:45:00"],
	6: ["08:00:00", "08:55:00", "09:50:00", "10:45:00", "11:40:00", "12:35:00"],
	5: ["08:00:00", "09:10:00", "10:15:00", "11:20:00", "12:25:00"],
	4: ["08:00:00", "09:25:00", "10:45:00", "12:10:00"],
	3: ["08:00:00", "09:50:00", "11:40:00"],
	2: ["08:00:00", "10:45:00"]
}

var serviceTimingOptions = {
	//8: ["07:00:00", "08:25:00", "09:50:00", "11:10:00", "12:30:00", "13:50:00", "15:10:00", "16:35:00"],
	7: ["07:00:00", "08:40:00", "10:15:00", "11:50:00", "13:20:00", "14:55:00", "16:25:00"],
	6: ["07:00:00", "08:50:00", "10:40:00", "12:30:00", "14:20:00", "16:10:00"],
	5: ["07:00:00", "09:15:00", "11:30:00", "13:40:00", "15:50:00"],
	4: ["07:00:00", "09:45:00", "12:30:00", "15:15:00"],
	3: ["07:00:00", "10:40:00", "14:20:00"]
}

var serviceTimingOptionsHd = {
	7: ["07:00:00", "08:00:00", "08:55:00", "09:50:00", "10:45:00", "11:40:00", "12:35:00"],
	6: ["07:00:00", "08:05:00", "09:10:00", "10:15:00", "11:20:00", "12:25:00"],
	5: ["07:00:00", "08:20:00", "09:40:00", "11:00:00", "12:15:00"],
	4: ["07:00:00", "08:40:00", "10:20:00", "11:55:00"],
	3: ["07:00:00", "09:10:00", "11:20:00"]
}

var serviceTimingOptionsICT = {
	//8: ["07:00:00", "08:25:00", "09:50:00", "11:10:00", "12:30:00", "13:50:00", "15:10:00", "16:35:00"],
	7: ["09:00:00", "10:20:00", "11:40:00", "13:00:00", "14:15:00", "15:30:00", "16:45:00"],
	6: ["09:00:00", "10:30:00", "12:00:00", "13:30:00", "15:00:00", "16:30:00"],
	5: ["09:00:00", "10:50:00", "12:35:00", "14:30:00", "16:15:00"]
}

var gantryTimingOptions = {
	//15: ["07:00:00", "07:45:00", "08:30:00", "09:15:00", "10:00:00", "10:45:00", "11:30:00", "12:10:00", "12:50:00", "13:35:00", "14:20:00", "15:00:00", "15:45:00", "16:30:00", "17:15:00"],
	//14: ["07:00:00", "07:50:00", "08:40:00", "09:30:00", "10:15:00", "11:00:00", "11:45:00", "12:30:00", "13:20:00", "14:10:00", "14:55:00", "15:40:00", "16:25:00", "17:10:00"],
	13: ["07:00:00", "07:55:00", "08:45:00", "09:35:00", "10:25:00", "11:15:00", "12:05:00", "12:55:00", "13:45:00", "14:35:00", "15:25:00", "16:15:00", "17:05:00"],
	12: ["07:00:00", "07:55:00", "08:50:00", "09:45:00", "10:40:00", "11:35:00", "12:30:00", "13:25:00", "14:20:00", "15:15:00", "16:10:00", "17:05:00"],
	11: ["07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"],
	10: ["07:00:00", "08:10:00", "09:15:00", "10:20:00", "11:30:00", "12:35:00", "13:40:00", "14:45:00", "15:50:00", "16:55:00"],
	9: ["07:00:00", "08:15:00", "09:30:00", "10:40:00", "11:55:00", "13:05:00", "14:15:00", "15:30:00", "16:50:00"],
	8: ["07:00:00", "08:25:00", "09:50:00", "11:10:00", "12:30:00", "13:50:00", "15:15:00", "16:40:00"],
	7: ["07:00:00", "08:35:00", "10:10:00", "11:45:00", "13:20:00", "14:50:00", "16:25:00"],
	6: ["07:00:00", "08:50:00", "10:40:00", "12:30:00", "14:20:00", "16:10:00"],
	5: ["07:00:00", "09:15:00", "11:30:00", "13:40:00", "15:50:00"],
	4: ["07:00:00", "09:45:00", "12:30:00", "15:15:00"]

}

var gantryTimingOptionsHd = {
	12: ["07:00:00", "07:35:00", "08:10:00", "08:45:00", "09:20:00", "09:50:00", "10:20:00", "10:50:00", "11:20:00", "11:55:00", "12:25:00", "13:00:00"],
	11: ["07:00:00", "07:40:00", "08:15:00", "08:50:00", "09:25:00", "10:00:00", "10:35:00", "11:10:00", "11:45:00", "12:20:00", "12:55:00"],
	10: ["07:00:00", "07:40:00", "08:20:00", "09:00:00", "09:35:00", "10:10:00", "10:50:00", "11:30:00", "12:10:00", "12:50:00"],
	9: ["07:00:00", "07:45:00", "08:30:00", "09:10:00", "09:50:00", "10:30:00", "11:15:00", "12:00:00", "12:45:00"],
	8: ["07:00:00", "07:50:00", "08:40:00", "09:30:00", "10:15:00", "11:00:00", "11:50:00", "12:40:00"],
	7: ["07:00:00", "08:00:00", "08:55:00", "09:50:00", "10:45:00", "11:40:00", "12:35:00"],
	6: ["07:00:00", "08:05:00", "09:10:00", "10:15:00", "11:20:00", "12:25:00"],
	5: ["07:00:00", "08:20:00", "09:40:00", "11:00:00", "12:15:00"],
	4: ["07:00:00", "08:40:00", "10:20:00", "11:55:00"]

}

var gantryTimingOptionsICT = {
	//15: ["07:00:00", "07:45:00", "08:30:00", "09:15:00", "10:00:00", "10:45:00", "11:30:00", "12:10:00", "12:50:00", "13:35:00", "14:20:00", "15:00:00", "15:45:00", "16:30:00", "17:15:00"],
	//14: ["07:00:00", "07:50:00", "08:40:00", "09:30:00", "10:15:00", "11:00:00", "11:45:00", "12:30:00", "13:20:00", "14:10:00", "14:55:00", "15:40:00", "16:25:00", "17:10:00"],
	13: ["09:00:00", "09:45:00", "10:25:00", "11:05:00", "11:45:00", "12:30:00", "13:15:00", "13:55:00", "14:35:00", "15:15:00", "15:55:00", "16:35:00", "17:15:00"],
	12: ["09:00:00", "09:45:00", "10:30:00", "11:15:00", "12:00:00", "12:45:00", "13:30:00", "14:15:00", "15:00:00", "15:45:00", "16:30:00", "17:15:00"],
	11: ["09:00:00", "09:50:00", "10:35:00", "11:20:00", "12:10:00", "13:00:00", "13:50:00", "14:40:00", "15:30:00", "16:20:00", "17:10:00"],
	10: ["09:00:00", "09:55:00", "10:45:00", "11:35:00", "12:30:00", "13:25:00", "14:20:00", "15:15:00", "16:10:00", "17:05:00"],
	9: ["09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"],
	8: ["09:00:00", "10:10:00", "11:20:00", "12:25:00", "13:35:00", "14:45:00", "15:50:00", "16:55:00"]
}

var gantry2TimingOptions = {
	13: ["07:30:00", "08:25:00", "16:35:00", "17:30:00"],
	12: ["07:30:00", "08:25:00", "16:35:00", "17:30:00"],
	11: ["07:30:00", "08:30:00", "16:30:00", "17:30:00"],
	10: ["07:30:00", "08:40:00", "16:20:00", "17:30:00"],
	9: ["07:30:00", "08:45:00", "16:15:00", "17:30:00"],
	8: ["07:30:00", "08:55:00", "16:05:00", "17:30:00"],
	7: ["07:30:00", "09:00:00", "16:00:00", "17:30:00"],
	6: ["07:20:00", "09:10:00", "16:00:00", "17:40:00"]
}

var gantry2TimingOptionsF = {
	13: ["07:30:00", "08:25:00"],
	12: ["07:30:00", "08:25:00"],
	11: ["07:30:00", "08:30:00"],
	10: ["07:30:00", "08:40:00"],
	9: ["07:30:00", "08:45:00"],
	8: ["07:30:00", "08:55:00"],
	7: ["07:30:00", "09:00:00"],
	6: ["07:20:00", "09:10:00"]
}

var gantry2TimingOptionsICT = {
	13: ["16:45:00", "17:30:00"],
	12: ["16:45:00", "17:30:00"],
	11: ["16:40:00", "17:30:00"],
	10: ["16:35:00", "17:30:00"],
	9: ["16:30:00", "17:30:00"],
	8: ["16:20:00", "17:30:00"]
}

var poTimingOptions = {
	4: ["07:00:00", "09:45:00", "12:30:00", "15:15:00"],
	3: ["07:00:00", "10:40:00", "14:20:00"],
	2: ["07:00:00", "12:30:00"]
}

var poTimingOptionsHd = {
	4: ["07:00:00", "08:40:00", "10:20:00", "11:55:00"],
	3: ["07:00:00", "09:10:00", "11:20:00"],
	2: ["07:00:00", "10:15:00"],
	1: ["07:00:00"]
}



function innerTiming(strength, type, timing, timing2) {
	var gantry2Timing = gantry2TimingOptions[gantryStrength];
	for (var i = 0; i < strength; i++) {
		var startTime = logicalTime(timing[i]);
		var endTime;
		var gantryIndex = finalGantry.indexOf(type[i]);
		if(i === strength-1) {
			if(detailingType === "halfday") {
				endTime = logicalTime("13:30:00");
			}
			else {
				endTime = logicalTime("18:00:00");
			}	
		}
		else {
			endTime = logicalTime(timing[i+1]);
		}
		if(gantryIndex >= 0) {
			var gantryStartTime = logicalTime(timing2[gantryIndex]);
			var gantryEndTime;
			if (gantryIndex === finalGantry.length-1) {
				if(detailingType === "halfday") {
					gantryEndTime = logicalTime("13:30:00");
				}
				else {
					gantryEndTime = logicalTime("18:00:00");					
				}
			}
			else {
				gantryEndTime = logicalTime(timing2[gantryIndex+1]);
			}
			if(startTime <= gantryEndTime && endTime >= gantryEndTime) {
				return true;
				break;
			}
			if(startTime <= gantryStartTime && endTime >= gantryStartTime) {
				return true;
				break;
			}
			if(startTime < gantryStartTime && endTime > gantryEndTime) {
				return true;
				break;
			}
		}
		if(detailingType === "normal") {
			if(gantryIndex === -1) {
				var gantry2Index = finalGantry2.indexOf(type[i]);
				var gantry2StartTime;
				var gantry2EndTime;
	
				if(gantry2Index === 0) {
					gantry2StartTime = logicalTime(gantry2Timing[0]);
					gantry2EndTime = logicalTime(gantry2Timing[1]);
					if(startTime <= gantry2EndTime && endTime >= gantry2EndTime) {
						return true;
						break;
					}
				}
				if(gantry2Index === 1) {
					gantry2StartTime = logicalTime(gantry2Timing[2]);
					gantry2EndTime = logicalTime(gantry2Timing[3]);
					if(startTime <= gantry2StartTime && endTime >= gantry2EndTime) {
						return true;
						break;
					}
				}
			}
		}
	}		
}


//Checking Clash
function checkClash() {
	var gunnerTiming = gunnerTimingOptions[gunnerStrength];
	var serviceTiming = serviceTimingOptions[serviceStrength];
	var gantryTiming = gantryTimingOptions[gantryStrength];

	//Check First and Last between gunner, service and gantry
	if(detailingType === "normal" || detailingType === "halfday" || detailingType === "friday") {
		if(finalService[0] === finalGantry[gantryStrength-1]) {
			return true;	
		}
		if(finalGantry[0] === finalGunner[gunnerStrength-1] || finalGantry[0] === finalService[serviceStrength-1]) {
			return true;
		}		
	}

	//Return true result if there is a need
	if(detailingType === "normal" || detailingType === "friday") {
		var result$1 = innerTiming(gunnerStrength, finalGunner, gunnerTiming, gantryTiming);
		if(result$1 === true) {
			return true;
		}
		var result$2 = innerTiming(serviceStrength, finalService, serviceTiming, gantryTiming);
		if(result$2 === true) {
			return true;
		}		
	}
	if(detailingType === "halfday") {
		var gunnerHdTiming = gunnerTimingOptionsHd[gunnerStrength];
		var serviceHdTiming = serviceTimingOptionsHd[serviceStrength];
		var gantryHdTiming = gantryTimingOptionsHd[gantryStrength];
		var result$1 = innerTiming(gunnerStrength, finalGunner, gunnerHdTiming, gantryHdTiming);
		if(result$1 === true) {
			return true;
		}
		var result$2 = innerTiming(serviceStrength, finalService, serviceHdTiming, gantryHdTiming);
		if(result$2 === true) {
			return true;
		}
	}
	if(detailingType === "ict") {
		var serviceIctTiming = serviceTimingOptionsICT[serviceStrength];
		var gantryIctTiming = gantryTimingOptionsICT[gantryStrength];
		var result$1 = innerTiming(gunnerStrength, finalGunner, gunnerTiming, gantryIctTiming);
		if(result$1 === true) {
			return true;
		}
		var result$2 = innerTiming(serviceStrength, finalService, serviceIctTiming, gantryIctTiming);
		if(result$2 === true) {
			return true;
		}		
	}

	return false;
}


function checkClashF() {
	var gunnerTiming = gunnerTimingOptions[gunnerStrength];
	var serviceTiming = serviceTimingOptions[serviceStrength];
	var gantryTiming = gantryTimingOptions[gantryStrength];
	var muslimGantry = muslimGunners.concat(muslimService);
	console.log(gantryTiming);
	for (var i = 0; i < muslimGantry.length; i++) {
		var prayerStartTime = logicalTime("12:50:00");
		var prayerEndTime = logicalTime("15:15:00");
		var gantryIndex = finalGantry.indexOf(muslimGantry[i]);
		console.log(gantryIndex);
		var gantryStartTime = logicalTime(gantryTiming[gantryIndex]);
		var gantryEndTime = logicalTime(gantryTiming[gantryIndex+1]);
		if(PrayerStartTime <= gantryEndTime && PrayerEndTime >= gantryEndTime) {
			return true;
			break;
		}
		if(PrayerStartTime <= gantryStartTime && PrayerEndTime >= gantryStartTime) {
			return true;
			break;
		}
		if(PrayerStartTime < gantryStartTime && PrayerEndTime > gantryEndTime) {
			return true;
			break;
		}
	}
	for (var i = 0; i < gunnerStrength; i++) {
		var startTime = logicalTime(gunnerTiming[i]);
		var endTime;
		var gantryIndex = finalGantry.indexOf(type[i]);
		if(i === gunnerStrength-1) {
			endTime = logicalTime("18:00:00");				
		}
		else {
			endTime = logicalTime(gunnerTiming[i+1]);
		}
		if(gantryIndex >= 0) {
			var gantryStartTime = logicalTime(gantryTiming[gantryIndex]);
			var gantryEndTime;
			if (gantryIndex === finalGantry.length-1) {
				gantryEndTime = logicalTime("18:00:00");					
			}
			else {
				gantryEndTime = logicalTime(gantryTiming[gantryIndex+1]);
			}
			if(startTime <= gantryEndTime && endTime >= gantryEndTime) {
				return true;
				break;
			}
			if(startTime <= gantryStartTime && endTime >= gantryStartTime) {
				return true;
				break;
			}
			if(startTime < gantryStartTime && endTime > gantryEndTime) {
				return true;
				break;
			}
		}
	}
	for (var i = 0; i < serviceStrength; i++) {
		var startTime = logicalTime(serviceTiming[i]);
		var endTime;
		var gantryIndex = finalGantry.indexOf(type[i]);
		if(i === serviceStrength-1) {
			endTime = logicalTime("18:00:00");				
		}
		else {
			endTime = logicalTime(serviceTiming[i+1]);
		}
		if(gantryIndex >= 0) {
			var gantryStartTime = logicalTime(gantryTiming[gantryIndex]);
			var gantryEndTime;
			if (gantryIndex === finalGantry.length-1) {
				gantryEndTime = logicalTime("18:00:00");					
			}
			else {
				gantryEndTime = logicalTime(gantryTiming[gantryIndex+1]);
			}
			if(startTime <= gantryEndTime && endTime >= gantryEndTime) {
				return true;
				break;
			}
			if(startTime <= gantryStartTime && endTime >= gantryStartTime) {
				return true;
				break;
			}
			if(startTime < gantryStartTime && endTime > gantryEndTime) {
				return true;
				break;
			}
		}
	}

	return false;			
}



function readableTiming(timing) {
	for (var i = 0; i < timing.length; i++)	{
			timing[i] = timing[i].slice(0, timing[i].length-3);
			timing[i] = timing[i].replace(":", "");
	}
}


function createTable(nameList, timing, id) {
	for (var i = 0; i < nameList.length; i++) {
		var tableRow = document.createElement("tr");
		var rowTime = document.createElement("td");
		var rowName = document.createElement("td");
		rowName.setAttribute("class", "text-center");
		if(i === nameList.length-1) {
			if (detailingType === "halfday") {
				var howlong = document.createTextNode(timing[i] + " - 1330");
			}
			else {
				var howlong = document.createTextNode(timing[i] + " - 1800");
			}
			rowTime.appendChild(howlong);
		}
		else {
			var howlong = document.createTextNode(timing[i] + " - " + timing[i+1]);
			rowTime.appendChild(howlong);
		}
		var theperson = document.createTextNode(nameList[i]);
		rowName.appendChild(theperson);
		tableRow.appendChild(rowTime);
		tableRow.appendChild(rowName);
		id.appendChild(tableRow);	
	}
}


function createIctTable(nameList, id) {
	var nameList$ = nameList.length;
	var tableRow = document.createElement("tr");
	var colTime = document.createElement("td");
	colTime.setAttribute("rowspan", nameList$);
	var ictTime = document.createTextNode("0700 - 0900");
	colTime.appendChild(ictTime);
	tableRow.appendChild(colTime);
	var firstICT = document.createElement("td");
	firstICT.setAttribute("class", "text-center");
	var firstICTGuy = document.createTextNode(nameList[0]);
	firstICT.appendChild(firstICTGuy);
	tableRow.appendChild(firstICT);
	id.appendChild(tableRow);
	for(var i = 1; i < nameList$; i++) {
		var emptyRow = document.createElement("tr");
		var colName = document.createElement("td");
		colName.setAttribute("class", "text-center");
		var name = document.createTextNode(nameList[i]);
		colName.appendChild(name);
		emptyRow.appendChild(colName);
		id.appendChild(emptyRow);
	}
}


function createTableG2(start, end, person) {
	var tableId = document.getElementById("gantry2");
	var tableRow = document.createElement("tr");
	var rowTime = document.createElement("td");
	var rowName = document.createElement("td");
	rowName.setAttribute("class", "text-center");		
	var howlong = document.createTextNode(start + " - " + end);
	rowTime.appendChild(howlong);
	var theperson = document.createTextNode(person);
	rowName.appendChild(theperson);
	tableRow.appendChild(rowTime);
	tableRow.appendChild(rowName);
	tableId.appendChild(tableRow);
}


function createTableG2$1(start, end, person) {
	var tableId = document.getElementById("gantry2");
	var tableRow = document.createElement("tr");
	var rowTime = document.createElement("td");
	var rowName = document.createElement("td");
	rowName.setAttribute("class", "text-center");
	var howlong = document.createTextNode(start + " - " + end);
	rowTime.appendChild(howlong);
	var theperson = document.createTextNode(person);
	rowName.appendChild(theperson);
	tableRow.appendChild(rowTime);
	tableRow.appendChild(rowName);
	tableId.appendChild(tableRow);
}


//Detailing Display
function displayDetailing() {
	//Clear Table
	document.getElementById("gunners").innerHTML = "";
	document.getElementById("service").innerHTML = "";
	document.getElementById("gantry").innerHTML = "";
	document.getElementById("gantry2").innerHTML = "";
	document.getElementById("passOffice").innerHTML = "";

	var gunnerTiming = gunnerTimingOptions[gunnerStrength].slice(0);
	var serviceTiming = serviceTimingOptions[serviceStrength].slice(0);
	var gantryTiming = gantryTimingOptions[gantryStrength].slice(0);
	var gantry2Timing = gantry2TimingOptions[gantryStrength].slice(0);	
	var poTiming = poTimingOptions[poStrength].slice(0);
	
	//Filling table based on detailing type
	switch(detailingType) {
		case "normal":
			readableTiming(gunnerTiming);
			readableTiming(serviceTiming);
			readableTiming(gantryTiming);
			readableTiming(gantry2Timing);
			readableTiming(poTiming);
		
			createTable(finalGunner, gunnerTiming, document.getElementById("gunners"));
			createTable(finalService, serviceTiming, document.getElementById("service"));
			createTable(finalGantry, gantryTiming, document.getElementById("gantry"));
			createTable(finalPO, poTiming, document.getElementById("passOffice"));
		
			createTableG2(gantry2Timing[0], gantry2Timing[1], finalGantry2[0]);
			createTableG2(gantry2Timing[2], gantry2Timing[3], finalGantry2[1]);
			break;
		case "friday":
			var gantry2FTiming = gantry2TimingOptionsF[gantryStrength].slice(0);
			readableTiming(gunnerTiming);
			readableTiming(serviceTiming);
			readableTiming(gantryTiming);
			readableTiming(gantry2FTiming);
			readableTiming(poTiming);
		
			createTable(finalGunner, gunnerTiming, document.getElementById("gunners"));
			createTable(finalService, serviceTiming, document.getElementById("service"));
			createTable(finalGantry, gantryTiming, document.getElementById("gantry"));
			createTable(finalPO, poTiming, document.getElementById("passOffice"));
		
			createTableG2$1(gantry2FTiming[0], gantry2FTiming[1], finalGantry2[0]);
			break;
		case "halfday":
			var gunnerHdTiming = gunnerTimingOptionsHd[gunnerStrength].slice(0);
			var serviceHdTiming = serviceTimingOptionsHd[serviceStrength].slice(0);
			var gantryHdTiming = gantryTimingOptionsHd[gantryStrength].slice(0);
			var poHdTiming = poTimingOptionsHd[poStrength].slice(0);	
			var gantry2FTiming = gantry2TimingOptionsF[gantryStrength].slice(0);
			readableTiming(gunnerHdTiming);
			readableTiming(serviceHdTiming);
			readableTiming(gantryHdTiming);
			readableTiming(gantry2FTiming);
			readableTiming(poHdTiming);

			createTable(finalGunner, gunnerHdTiming, document.getElementById("gunners"));
			createTable(finalService, serviceHdTiming, document.getElementById("service"));
			createTable(finalGantry, gantryHdTiming, document.getElementById("gantry"));
			createTable(finalPO, poHdTiming, document.getElementById("passOffice"));
		
			createTableG2$1(gantry2FTiming[0], gantry2FTiming[1], finalGantry2[0]);
			break;			
		case "ict":
			var serviceIctTiming = serviceTimingOptionsICT[serviceStrength].slice(0);
			var gantryIctTiming = gantryTimingOptionsICT[gantryStrength].slice(0);
			var gantry2IctTiming = gantry2TimingOptionsICT[gantryStrength].slice(0);
			readableTiming(gunnerTiming);
			readableTiming(serviceIctTiming);
			readableTiming(gantryIctTiming);
			readableTiming(gantry2IctTiming);
			readableTiming(poTiming);
		
			createTable(finalGunner, gunnerTiming, document.getElementById("gunners"));
			createIctTable(serviceICT, document.getElementById("service"));
			createTable(finalService, serviceIctTiming, document.getElementById("service"));
			createIctTable(gantryICT, document.getElementById("gantry"));
			createTable(finalGantry, gantryIctTiming, document.getElementById("gantry"));
			createTable(finalPO, poTiming, document.getElementById("passOffice"));
		
			createTableG2$1(gantry2IctTiming[0], gantry2IctTiming[1], finalGantry2[0]);		
	}
	document.getElementById("detailing").setAttribute("style", "display: block");
}


//Converting time to javascript-recgonised time
function logicalTime(time) {
	var dateFormat = "Wed Dec 18 2013 #TIME# GMT+0800 (Malay Peninsula Standard Time)";
	return new Date(dateFormat.replace("#TIME#", time)).getTime();
}