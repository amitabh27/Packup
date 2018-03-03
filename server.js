var express=require('express'); 
var app=express();
var bodyParser=require('body-parser');
var request=require('request');
var err="No information available: Please check the details that you have provided";

app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

var port = process.env.PORT || 5000;


var server=app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
  
  
app.get('/',function(req,res){
	res.status(200).send('Welcome to Ami\'s RESTFUL Server');
});


//live train status-------------------------------------------------------------------------------------------------------
app.get('/r/livetrainstatus/:train/:date/:key',function(req,res){
	
	var key=req.params.key;
	var train=req.params.train;
	var date=req.params.date;
	var result="";
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	request('http://api.railwayapi.com/v2/live/train/'+train+'/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log("---->"+body+"-----");
	if(o.response_code==200)
	{
	result='The train '+o.train.name+' is currently running '+o.current_station.status+'. Its last tracked position is '+o.current_station.station_.name+' where its scheduled arrival date and time were '+o.current_station.scharr_date+' ,'+o.current_station.scharr+' and it actually arrived at '+o.current_station.actarr_date+' ,'+o.current_station.actarr;
	console.log("response="+result);
	callback(second);
	}
	else
	{
	result="Incorrect Details:Please enter correct data";
	callback(second);	
	}
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});
	}
	first(second);
	

});

//PNR status-------------------------------------------------------------------------------------------------------
app.get('/r/pnrstatus/:pnr/:key',function(req,res){
	
	var key=req.params.key;
	var pnr=req.params.pnr;
	var result="";
	var flag=0;
	
	function second()
	{
		if(flag==0)
			result="Please re-check the PNR number that you have entered";
		
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	request('http://api.railwayapi.com/v2/pnr-status/pnr/'+pnr+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	result='The current status of PNR '+pnr+' is: '+'\n';
	for (var i=0;i<o.passengers.length;i++)
	{  
		flag=1;
       var info='Passenger '+o.passengers[i].no+' booking status:'+o.passengers[i].booking_status+' current status:'+o.passengers[i].current_status+'\n';
	   result=result.concat(info);
	}
	console.log("response="+result);
	callback(second);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});
	}
	first(second);
	
});




//Cancelled Trains-------------------------------------------------------------------------------------------------------
app.get('/r/cancelledtrains/:date/:key',function(req,res){
	var date=req.params.date;
	var key=req.params.key;
	var result="";
	var flag=0;
	
	function second()
	{
		if(flag==0)
			result="No trains have been cancelled";
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	request('http://api.railwayapi.com/v2/cancelled/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	result='The Trains that have been cancelled on '+date+' are: ';
	for (var i=0;i<o.trains.length;i++)
	{  
	   flag=1;
       var info='Train '+o.trains[i].number+' : '+o.trains[i].name+',    ';
	   result=result.concat(info);
	}
	console.log("response="+result);
	callback(second);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
	
});



//Rescheduled Trains-------------------------------------------------------------------------------------------------------
app.get('/r/rescheduledtrains/:date/:key',function(req,res){
	var date=req.params.date;
	var key=req.params.key;
	var result="";
	var flag=0;
	
	function second()
	{
			if(flag==0)
				result="No trains have been rescheduled";
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	
	function first(callback)
	{
	request('http://api.railwayapi.com/v2/rescheduled/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	result='The Trains that have been rescheduled on '+date+' are: ';
	for (var i=0;i<o.trains.length;i++)
	{  
	   flag=1;
       var info='Train '+o.trains[i].number+' : '+o.trains[i].name+' Rescheduled to: '+o.trains[i].rescheduled_date+' ,'+o.trains[i].rescheduled_time+',    ';
	   result=result.concat(info);
	}
	console.log("response="+result);
	callback(second);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});
	}
	first(second);
	
});



//Train Route-------------------------------------------------------------------------------------------------------
app.get('/r/trainroute/:train/:key',function(req,res){
	var train=req.params.train;
	var key=req.params.key;
	var result="";
	
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	function first(callback)
	{
	request('http://api.railwayapi.com/v2/route/train/'+train+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	
	if(o.response_code==200)
	{
	result='Train '+o.train.name+' runs on: ';
	
	//result=result.concat('It runs on: ');
	for (var i=0;i<o.train.days.length;i++)
	{  
	   if(o.train.days[i].runs=='Y')
	   {result=result.concat(o.train.days[i].code);
   
         if(i!=o.train.days.length-1)
         result=result.concat(',');
	   }
	}
	//result=result.concat('\n');
	/*result=result.concat('        Classes Available in this train are: ');
	for (var i=0;i<o.train.classes.length;i++)
	{  
	   if(o.train.classes[i].available=='Y')
	   {result=result.concat(o.train.classes[i].code);
         if(i!=o.train.classes.length-1)
         result=result.concat(',');
	   }
	}*/
	
	
	//result=result.concat('\n');
	result=result.concat('        Route:');
	for (var i=0;i<o.route.length;i++)
	{  
	   if(o.route[i].scharr=='SOURCE')
	   result=result.concat(o.route[i].station.name).concat('-').concat(o.route[i].schdep).concat(', ');
	   else
       result=result.concat(o.route[i].station.name).concat('-').concat(o.route[i].scharr).concat(', ');
	}
	console.log("response="+result);
	callback(second);
	}
	else
	{
	result="Incorrect Details:Please enter correct data";
	callback(second);	
	}
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
});




//Train Between stations **--------------------------------------------------------------------------------------------
app.get('/r/trainbetweenstations/:source/:destination/:date/:key',function(req,res){
	

	var source=req.params.source;
	var key=req.params.key;
	var destination=req.params.destination;
	var date=req.params.date;
	
	source=source.toUpperCase();
	destination=destination.toUpperCase();
	
	var rsource=source.replace(/\s+/, "");
	var rdestination=destination.replace(/\s+/, "") ;
    var result="";
	var flag=0;
		
	function fourth()
	{
	console.log("enetering 4th"+result);
	if(flag==0)
		result="Incorrect details:Please enter correct data";
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');	
	}
	
	
	function third(callback){
	console.log("entering 3rd");
	//console.log("***********"+source+"   "+destination);
	request('http://api.railwayapi.com/v2/between/source/'+source+'/dest/'+destination+'/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	//console.log(body);
	var o=JSON.parse(body);
	result='The results are as follows:  ';
	for (var i=0;i<o.trains.length;i++)
	{  
	   flag=1;
       var info='Train '+o.trains[i].number+' : '+o.trains[i].name+' takes '+o.trains[i].travel_time+', ';
	   result=result.concat(info);
	}
	console.log("response="+result);
	console.log("leaving 3rd");
	callback(fourth);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});
	}


	
	
	function second(callback){
		console.log("entering 2nd");
	var f1=0;
	request('http://api.railwayapi.com/v2/name-to-code/name/'+rdestination+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].fullname==destination || o.stations[i].fullname==rdestination || o.stations[i].fullname.includes(destination) || o.stations[i].fullname.includes(rdestination))
	   {
			f1=1;
			destination=o.stations[i].code;
			break;
	   }
	}
	if(f1==0)
		destination=o.stations[0].code;
	}
	
	console.log("destination="+destination);
	console.log("leavinf 2nd");
	callback(third);
	
	});
	
	}
	
	
	
	function first(callback){

	console.log("entering first");
	var f=0;
	request('http://api.railwayapi.com/v2/name-to-code/name/'+rsource+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].fullname==source || o.stations[i].fullname==rsource || o.stations[i].fullname.includes(source) || o.stations[i].fullname.includes(rsource))
	   {
			f=1;
			source=o.stations[i].code;
			break;
	   }
	}
	if(f==0)
		source=o.stations[0].code;
	
	}
	
	console.log("source="+source);
	console.log("leaving first");
	callback(second);
	});
	}


	
    first(second);
	
	
});



//SEAT Availability ---------------------------------------------------------------------------------------------------
app.get('/r/seatavailability/:train/:source/:destination/:date/:classs/:quota/:key',function(req,res){
	
	var key=req.params.key;
	var train=req.params.train;
	var classs=req.params.classs;
	var quota=req.params.quota;
	var source=req.params.source;
	var destination=req.params.destination;
	var date=req.params.date;
	
	source=source.toUpperCase();
	destination=destination.toUpperCase();
	
	var rsource=source.replace(/\s+/, "");
	var rdestination=destination.replace(/\s+/, "") ;
    var result="";
	var flag=0;
	
    function fourth()
	{
	console.log("enetering 4th"+result);
	if(flag==0)
		result="Incorrect details:Please enter correct data";
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');	
	}
	
	
	function third(callback){
		console.log("3e");	
	console.log("***********"+source+"   "+destination);
	request('http://api.railwayapi.com/v2/check-seat/train/'+train+'/source/'+source+'/dest/'+destination+'/date/'+date+'/class/'+classs+'/quota/'+quota+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	result='The results are as follows for few consecutive days:  ';
	for (var i=0;i<o.availability.length;i++)
	{  
		flag=1;
       var info=o.availability[i].date+' : '+o.availability[i].status+'   ';
	   result=result.concat(info);
	}
	console.log("response="+result);
	console.log("3l");	
	callback(fourth);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});
	
	}
	
	
	
	function second(callback){
		console.log("2e");	
	var f1=0;
	request('http://api.railwayapi.com/v2/name-to-code/name/'+rdestination+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].fullname==destination || o.stations[i].fullname==rdestination || o.stations[i].fullname.includes(destination) || o.stations[i].fullname.includes(rdestination))
	   {
			f1=1;
			destination=o.stations[i].code;
			break;
	   }
	}
	if(f1==0)
		destination=o.stations[0].code;
	}
	    console.log("destination="+destination);
		console.log("2l");	
		callback(third);
	});

	}
	
	
	
	
    function first(callback){
    console.log("1e");		
	var f=0;
	request('http://api.railwayapi.com/v2/name-to-code/name/'+rsource+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].fullname==source || o.stations[i].fullname==rsource || o.stations[i].fullname.includes(source) || o.stations[i].fullname.includes(rsource))
	   {
			f=1;
			source=o.stations[i].code;
			break;
	   }
	}
	if(f==0)
		source=o.stations[0].code;
	
	}
				console.log("source="+source);
				console.log("1l");	
				callback(second);
	});
	
	}
	
	
	
	first(second);

});


//TrainArrivals---------------------------------------------------------------------------------------------------
app.get('/r/trainarrivals/:source/:hours/:key',function(req,res){
	
	var source=req.params.source;
	var hours=req.params.hours;
	var key=req.params.key;
	
	source=source.toUpperCase();
	
	var rsource=source.replace(/\s+/, "");
    var result="";
	var flag=0;
	
	
	function third()
	{
		if(flag==0)
			result="Incorrect details:Please enter correct data";
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	
	function second(callback){
	request('http://api.railwayapi.com/v2/arrivals/station/'+source+'/hours/'+hours+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	result='The results are as follows:  ';
	for (var i=0;i<o.train.length;i++)
	{  
		flag=1;
	   if(o.train[i].name.length > 5){
       var info=o.train[i].name+' at '+o.train[i].scharr+',  ';
	   result=result.concat(info);
	   }
	}
	console.log("response="+result);
	callback(third);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});
	}
	
	function first(callback)
    {	
	var f=0;
	request('http://api.railwayapi.com/v2/name-to-code/name/'+rsource+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].fullname==source || o.stations[i].fullname==rsource || o.stations[i].fullname.includes(source) || o.stations[i].fullname.includes(rsource))
	   {
			f=1;
			source=o.stations[i].code;
			console.log("source="+source);
			break;
	   }
	}
	if(f==0)
		source=o.stations[0].code;
	callback(second);
	}
	
	});
	}
	first(second);
	
});



//flights------------------------------------------------------------------------------------------------------------------------------------------------------------
	var names=["delhi","mumbai","bangalore","chennai","kolkata","cochin","ahmedabad","hyderabad","pune","dabolim",
									"trivandrum","lucknow","jaipur","guwahati","kozikhode","srinagar","bhubneshwar","vishakapatnam","coimbatore","indore",
									"mangalore","nagpur","patna","chandigarh","tiruchilapalli","varanasi","raipur","amritsar","jammu","bagdogra",
									"vadodra","agartala","portblair","madurai","imphal","ranchi","udaipur","dehradun","bhopal","leh",
									"rajkot","vijaywada","tirupati","dibrugarh","jodhpur","aurangabad","rajahmundry","silchar","jabalpur","aizwal"
									];
	var codes=[
									"DEL","BOM","BLR","MAA","CCU","COK","AMD","HYD","PNQ","GOI",
									"TRV","LKO","JAI","GAU","CCJ","SXR","BBI","VTZ","CJB","IDR",
									"IXE","NAG","PAT","IXC","TRZ","VNS","RPR","ATQ","IXJ","IXB",
									"BDQ","IXA","IXZ","IXM","IMF","IXR","UDR","DED","BHO","IXL",
									"RAJ","VJA","TIR","DIB","JDH","IXU","RJA","IXS","JLR","AJL"
									];								
	
	
app.get('/f/cheapest/:source/:destination/:date',function(req,res){
	var source=req.params.source;
	var destination=req.params.destination;
	var date=req.params.date;
	var result="";
	
	
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	
	function first(callback)
	{
	
	var s,d;
	for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{s=codes[i];}
									else if(names[i]==destination)
									{d=codes[i];}
								}
							
    console.log(s+"    "+d);							
	request('http://developer.goibibo.com/api/search/?app_id=<APP_ID>&app_key=<APP_KEY>&source='+s+'&destination='+d+'&dateofdeparture='+date+'&seatingclass=E&adults=1&children=0&infants=0&counter=100', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	var amt=0;
	result="";
	if(o.data.Error !== undefined)
	{
	result="Incorrect details:Please enter correct data";
	callback(second);
	}
	else
	{
	for (var i=0;i<o.data.onwardflights.length;i++)
	{  

	   if(o.data.onwardflights[i].fare.adulttotalfare<amt || amt==0){
	   amt=o.data.onwardflights[i].fare.adulttotalfare;
       var info='The cheapest flight available is of airline '+o.data.onwardflights[i].airline+', flight number-'+o.data.onwardflights[i].flightcode+' departing at '+o.data.onwardflights[i].deptime+' which costs Rs '+o.data.onwardflights[i].fare.adulttotalfare;
	   result=info;
	   }
	}
	
	console.log("response="+result);
	callback(second);
	}
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
	
	
});


//SpecificAirline---------------------------------------------------------------------------------------------

app.get('/f/specific/:source/:destination/:date/:airline/:class',function(req,res){
	var source=req.params.source;
	var destination=req.params.destination;
	var date=req.params.date;
	var airline=req.params.airline;
	var classs=req.params.class;
	var result="";
	
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	var s,d;
	for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{s=codes[i];}
									else if(names[i]==destination)
									{d=codes[i];}
								}
							
    console.log(s+"    "+d);	

	if(airline.includes("indigo") || airline.includes("Indigo"))
		airline="Indigo";
	if( (airline.includes("air") || airline.includes("Air")) && (airline.includes("india") || airline.includes("India")))
		airline="Air India";
	if( (airline.includes("air") || airline.includes("Air")) && (airline.includes("go") || airline.includes("Go")))
		airline="GoAir";
	if( (airline.includes("spice") || airline.includes("Spice")) && (airline.includes("Jet") || airline.includes("jet")))
		airline="Spicejet";
	if( (airline.includes("Jet") || airline.includes("jet")) && (airline.includes("Airways") || airline.includes("airways")))
		airline="Jet Airways";
	if(airline.includes("Vistara") || airline.includes("vistara"))
		airline="Vistara";	
	
	if(classs=='economy' || classs=='Economy')
		classs='E';
	if(classs=='business' || classs=='Business')
		classs='B';
	
	request('http://developer.goibibo.com/api/search/?app_id=<APP_ID>&app_key=<APP_KEY>&source='+s+'&destination='+d+'&dateofdeparture='+date+'&seatingclass='+classs+'&adults=1&children=0&infants=0&counter=100', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	//console.log(body);
	var o=JSON.parse(body);
	result="The flights of airline  "+airline+" are as follows:  ";
	if(o.data.Error !== undefined)
	{
	result="Incorrect details:Please enter correct data";
	callback(second);
	}
	else
	{
	for (var i=0;i<o.data.onwardflights.length;i++)
	{  
	   if(o.data.onwardflights[i].airline==airline && classs==o.data.onwardflights[i].seatingclass){
       var info='Flight-'+o.data.onwardflights[i].flightcode+': '+o.data.onwardflights[i].deptime+',Rs '+o.data.onwardflights[i].fare.adulttotalfare+',Available-'+o.data.onwardflights[i].seatsavailable+'.    ';
	   result=result.concat(info);
	   }
	}
	
	console.log("response="+result);
	callback(second);
	}
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	
	}
	first(second);
	
});


//Anyairline--------------------------------------------------------- NOT INCLUDING IN CHATBOT Because it returns too much of details.
/*
Example-http://localhost:5000/f/any/mumbai/bangalore/20171229/economy
Response:
{ "data":{"type":"text","text":"The flights are as follows: GoAir-517: 06:05,Rs 3252,Available-5. GoAir-323: 14:30,Rs 3782,Available-20. GoAir-396: 21:00,Rs 3782,Available-19. GoAir-525: 22:40,Rs 3252,Available-5. Spicejet-497: 08:20,Rs 2778,Available-1. Spicejet-415: 18:05,Rs 4194,Available-1. Spicejet-467: 13:05,Rs 3942,Available-1. Spicejet-703: 22:45,Rs 4938,Available-1. Indigo-848: 00:10,Rs 2946,Available-15. Indigo-199: 06:05,Rs 3445,Available-15. Indigo-715: 07:30,Rs 3445,Available-8. Indigo-236: 09:30,Rs 3786,Available-14. Indigo-6939: 12:40,Rs 3786,Available-11. Indigo-3177: 15:45,Rs 3786,Available-13. Indigo-5533: 17:20,Rs 3445,Available-1. Indigo-463: 17:35,Rs 4102,Available-20. Indigo-799: 19:10,Rs 3786,Available-15. Indigo-949: 20:35,Rs 3786,Available-18. Indigo-825: 21:30,Rs 3445,Available-12. Indigo-565: 22:30,Rs 3445,Available-11. Indigo-461: 06:20,Rs 3838,Available-3. Indigo-366: 09:10,Rs 5098,Available-8. Indigo-3834: 09:45,Rs 4154,Available-7. Indigo-419: 15:15,Rs 7798,Available-52.
 Indigo-834: 16:55,Rs 4154,Available-10. Air India-809: 10:00,Rs 9683. Air India-615: 06:20,Rs 5387. Air India-866: 09:00,Rs 9683. Air India-615: 06:20,Rs 6647. Air India-617: 13:55,Rs 5772. Air India-348: 08:15,Rs 9683. Air India-603: 06:15,Rs 3625. Air India-50: 20:50,Rs 8012. Air India-94: 18:30,Rs 8003. Air India-50: 20:50,Rs 5912. Air India-864: 07:00,Rs 9683. Air India-607: 16:40,Rs 4150. Air India-657: 11:05,Rs 8717. Air India-33: 02:10,Rs 9998. Air India-965: 15:00,Rs 5020. Air India-677: 13:00,Rs 8896. Air India-671: 09:00,Rs 7478. Air India-50: 20:50,Rs 5404. Air India-806: 08:00,Rs 9683. Air India-617: 13:55,Rs 5020. Air India-619: 19:30,Rs 5020. Air India-619: 19:30,Rs 5020. Air India-617: 13:55,Rs 5020. Air India-570: 06:15,Rs 7478. Air India-615: 06:20,Rs 5387. Air India-965: 15:00,Rs 5020. Air India-639: 09:20,Rs 3625. Air India-619: 19:30,Rs 7120. Air India-609: 20:15,Rs 4150. Air India-677: 13:00,Rs 9946. Jet Airways-487: 20:30,Rs 7410. Jet Airways-463: 02:55,Rs 6418. Jet Airways-467: 19:15,Rs 6754. 
 Jet Airways-483: 18:00,Rs 4554. Jet Airways-467: 19:15,Rs 6754. Jet Airways-477: 20:20,Rs 4554. Jet Airways-414: 08:35,Rs 6859. Jet Airways-7013: 23:00,Rs 7410. Jet Airways-7105: 13:00,Rs 7078. Jet Airways-381: 02:15,Rs 2958. Jet Airways-397: 08:50,Rs 3640. Jet Airways-467: 19:15,Rs 6754. Jet Airways-487: 20:30,Rs 7410. Jet Airways-463: 02:55,Rs 6418. Jet Airways-7178: 10:05,Rs 3640. Jet Airways-7013: 23:00,Rs 7410. Jet Airways-495: 21:30,Rs 3504. Jet Airways-7082: 10:20,Rs 7340. Jet Airways-414: 08:35,Rs 6859. Jet Airways-498: 19:10,Rs 4554. Jet Airways-487: 20:30,Rs 7410. Jet Airways-467: 19:15,Rs 6754. Jet Airways-411: 06:35,Rs 3640. Jet Airways-413: 15:50,Rs 2958. Jet Airways-415: 15:05,Rs 3504. Jet Airways-7035: 17:35,Rs 7078. Jet Airways-463: 02:55,Rs 6418. Jet Airways-394: 13:35,Rs 3504. Jet Airways-451: 16:05,Rs 7078.
 Jet Airways-463: 02:55,Rs 6418. Vistara-944: 14:30,Rs 10803. Vistara-930: 07:30,Rs 11397. Vistara-930: 07:30,Rs 10803. Vistara-944: 14:30,Rs 10803. Vistara-994: 10:25,Rs 12279. Vistara-988: 20:45,Rs 11397. Vistara-930: 07:30,Rs 11397. Vistara-902: 15:40,Rs 10803. Vistara-950: 21:50,Rs 11397. Vistara-944: 14:30,Rs 11397. Vistara-996: 18:30,Rs 10803. Vistara-735: 13:10,Rs 17048. Vistara-950: 21:50,Rs 11397. Vistara-960: 11:50,Rs 11397. Vistara-940: 19:30,Rs 10803. Vistara-988: 20:45,Rs 10803. Vistara-960: 11:50,Rs 10803. Vistara-950: 21:50,Rs 10803. Vistara-902: 15:40,Rs 10803. Vistara-970: 08:45,Rs 11397. Vistara-940: 19:30,Rs 11397. Vistara-996: 18:30,Rs 11397. Vistara-994: 10:25,Rs 11685. Vistara-970: 08:45,Rs 11397. Vistara-994: 10:25,Rs 12279. Vistara-970: 08:45,Rs 10803. Vistara-960: 11:50,Rs 10803. Vistara-960: 11:50,Rs 11397. Vistara-970: 08:45,Rs 10803. Vistara-950: 21:50,Rs 11397. "}}
*/
app.get('/f/any/:source/:destination/:date/:class',function(req,res){
	var source=req.params.source;
	var destination=req.params.destination;
	var date=req.params.date;
	var classs=req.params.class;
	var result="";

	
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	var s,d;
	for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{s=codes[i];}
									else if(names[i]==destination)
									{d=codes[i];}
								}
							
    console.log(s+"    "+d);		
	
	if(classs=='economy' || classs=='Economy')
		classs='E';
	if(classs=='business' || classs=='Business')
		classs='B';
	
	request('http://developer.goibibo.com/api/search/?app_id=24047e2c&app_key=6ec16de23b3fe49715476134a1b5e372&source='+s+'&destination='+d+'&dateofdeparture='+date+'&seatingclass='+classs+'&adults=1&children=0&infants=0&counter=100', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	//console.log(body);
	var o=JSON.parse(body);
	result="The flights are as follows:  ";
	
	if(o.data.Error !== undefined)
	{
	result="Incorrect details:Please enter correct data";
	callback(second);
	}
	else
	{
	for (var i=0;i<o.data.onwardflights.length;i++)
	{  
	   if(classs==o.data.onwardflights[i].seatingclass){
	   var info;
       if(o.data.onwardflights[i].seatsavailable!=9999)	   
       info=o.data.onwardflights[i].airline+'-'+o.data.onwardflights[i].flightcode+': '+o.data.onwardflights[i].deptime+',Rs '+o.data.onwardflights[i].fare.adulttotalfare+',Available-'+o.data.onwardflights[i].seatsavailable+'.    ';
	   else
	   info=o.data.onwardflights[i].airline+'-'+o.data.onwardflights[i].flightcode+': '+o.data.onwardflights[i].deptime+',Rs '+o.data.onwardflights[i].fare.adulttotalfare+'.    ';
	    
	   result=result.concat(info);
	   }
	}
	
	console.log("response="+result);
	callback(second);
	}
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
	
	
});




//buses-------------------------------------------------------------------------------------
app.get('/b/list/:source/:destination/:date',function(req,res){
	var source=req.params.source;
	var destination=req.params.destination;
	var date=req.params.date;
	var result="";
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	request('http://developer.goibibo.com/api/bus/search/?app_id=<APP_ID>&app_key=<APP_KEY>&format=json&source='+source+'&destination='+destination+'&dateofdeparture='+date, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The buses are as follows:  ";
	
	if(o.data.onwardflights.length == 0)
	{
	result="No data available for this route : Please reconsider the input parameters";
	console.log("No data");
	callback(second);
	}
	else
	{
		console.log("data available");
	for (var i=0;i<o.data.onwardflights.length;i++)
	{  
	   
	   info=o.data.onwardflights[i].BPPrims.list[0].BPId+'-'+o.data.onwardflights[i].TravelsName+' at '+o.data.onwardflights[i].DepartureTime+' Rs'+o.data.onwardflights[i].fare.totalbasefare+'    '; 
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(second);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
	
	
});



//Nearby-food------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/n/food/:location/:key',function(req,res){
	var type="food";
	var location=req.params.location;
	var key=req.params.key;
	var result="";
	
	
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'+city+food&language=en&key='+key, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The spots are as follows:  ";
	
	if(o.results.length == 0)
	{
	result="No data available for this location. Please try some other name";
	callback(second);
	}
	else
	{
	for (var i=0;i<o.results.length;i++)
	{  
	   
	   info=o.results[i].name.concat('##');
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(second);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
	
	
});


//nearby-nature-------------------------------------------------------------------------------------------
app.get('/n/natural/feature/:location/:key',function(req,res){
	var type="natural+feature";
	var location=req.params.location;
	var key=req.params.key;
	var result="";
	
	
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'+city+natural+feature&language=en&key='+key, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The spots are as follows:  ";
	
	if(o.results.length == 0)
	{
	result="No data available for this location. Please try some other name";
	callback(second);
	}
	else
	{
	for (var i=0;i<o.results.length;i++)
	{  
	   
	   info=o.results[i].name.concat('##');
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(second);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
	
	
});


//nearby-worship--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/n/place/of/worship/:location/:key',function(req,res){
	var type="place+of+worship";
	var location=req.params.location;
	var key=req.params.key;
	var result="";
	
	
	
	function second()
	{
	return res.status(200).send('{ \"data\":{\"type":\"text\",\"text\":\"'+result+'\"}}');
	}
	
	function first(callback)
	{
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'+city+place+of+worship&language=en&key='+key, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The spots are as follows:  ";
	
	if(o.results.length == 0)
	{
	result="No data available for this location. Please try some other name";
	callback(second);
	}
	else
	{
	for (var i=0;i<o.results.length;i++)
	{  
	   
	   info=o.results[i].name.concat('##');
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(second);
	}
	else	
	{
	console.log("error..");
	return err;
	}
	});	
	}
	first(second);
	
	
});






































