var QOne = document.getElementById("Q-one");
var QTwo = document.getElementById("Q-two");
var TOne = document.getElementById("T-one");
var TTwo = document.getElementById("T-two");
var Treq = document.getElementById("T-required");
var butt = document.getElementById("button");
var butt2 = document.getElementById("button2");
var butt3 = document.getElementById("button3");
var text1 = document.getElementById("tinf");
var text2 = document.getElementById("tau");
var simulate = document.getElementById("simulate");

var Vol = 790;
var tau = 0;
var Tinf = 0;
var qone = 0;
var tone = 0;
var ttwo = 0;
var qtwo = 0;
var treq = 0;
var r0 = 0.5;
var Kt = 1;
var Ki = 0.005;
var Kd = 0;
var requiredTemp = 0;

butt.addEventListener("click", Initialize);

function Initialize(){
	qone = parseFloat(QOne.value) || 0;
	tone = parseFloat(TOne.value) || 0;
	qtwo = parseFloat(QTwo.value) || 0;
	ttwo = parseFloat(TTwo.value) || 0;
	treq = parseFloat(Treq.value) || 0;
	simulate.innerHTML = "V ="+Vol+ " m&sup3 Q1 = " + qone + " l/s" + " Q2 = "+  qtwo + " l/s" + " T1 = " +  tone + "&degC" + " T2 = " + ttwo + "&degC";
	Tinf = Math.round((parseFloat((tone * qone) + (ttwo * qtwo)) / (qone + qtwo))*100)/100;
	if(qone+qtwo > 0){
	tau =Math.round((Vol/(qone + qtwo))*100) / 100;
	text1.innerHTML ="T" + "&#8734".sub() + "="	+  Tinf + "&degC";
	//text2.innerHTML ="&#964 = " + tau;
	return Tinf;
	return tau;
	return qone;
	return qtwo;
	return ttwo;
	return tone;
	return treq;
	}
	else{
		alert("Dzielenie przez zero");
	}
}

function LoadGraph() {
var dps = []; // dataPoints
var chart = new CanvasJS.Chart("chartContainer", {
	title :{
		text: "Przebieg temperatury strumienia wypływającego"
	},
	axisY: {
		includeZero: false,
		title: "T[°C]"
	},   
	axisX: {
		includeZero: true,
		title: "t[s]"
	},      	
	data: [{
		type: "line",
		dataPoints: dps
	}]
});
var xVal = 0;
var yVal = tone; 
var dataLength = 6000; // number of dataPoints visible at any point

var updateChart = function (count) {

	count = count || 1;

	for (var j = 0; j < count; j++) {
		yVal = Tinf*(1-Math.exp(-(0.05/tau)))+yVal*Math.exp(-(0.05/tau));
		dps.push({
			x: xVal,
			y: yVal
		});
		xVal += 0.05;
	}

	if (dps.length > dataLength) {
		dps.shift();
	}

	chart.render();
};

updateChart(dataLength);
}

function LoadGraph2() {
var dps = []; // dataPoints
var chart = new CanvasJS.Chart("chartContainer2", {
	title :{
		text: "Zmiana strumienia Q2 w czasie"
	},
	axisY: {
		includeZero: false,
		title: "Q[l/s]"
	},   
	axisX: {
		includeZero: true,
		title: "t[s]"
	},      	
	data: [{
		type: "line",
		dataPoints: dps
	}]
});
requiredTemp = treq;
var xVal = 0;
var yVal = tone; 
var yValQ = 0; 
var e0 = requiredTemp - yVal;
var e1 = requiredTemp - yVal;
var e2 = requiredTemp - yVal;
var z0 = r0*(1+(Kt/2*Ki)+(Kd/Kt)); 
var z1 = -(r0*(1-(Kt/2*Ki)+2*(Kd/Kt)));
var z2 = r0*(Kd/Kt);
var dataLength = 6000; // number of dataPoints visible at any point
var updateChart = function (count) {
	
	count = count || 1;

	tone = 10;
	qone = 10;
	ttwo = 100;
	for (var j = 0; j < count; j++) {
		Tinf=Math.round((parseFloat((tone * qone) + (ttwo * yValQ)) / (qone + yValQ))*100)/100;
		tau = Math.round((Vol/(qone + yValQ))*100) / 100;
		console.log(Tinf)
		console.log("yValQ",yValQ)
		yVal = Tinf*(1-Math.exp(-(0.05/tau)))+yVal*Math.exp(-(0.05/tau));
		e0 = e1;
		e1 = e2;
		e2 = requiredTemp - yVal;
		console.log(Tinf)
		yValQ = (z0*e2)+(z1*e1)+(z2*e0)+yValQ;

		dps.push({
			x: xVal,
			y: yValQ
		});
		xVal += 0.05;
	}

	if (dps.length > dataLength) {
		dps.shift();
	}

	chart.render();
};

updateChart(dataLength);
}


butt2.addEventListener("click", LoadGraph);
butt3.addEventListener("click", LoadGraph2);