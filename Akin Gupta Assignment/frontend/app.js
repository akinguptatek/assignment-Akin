const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');

const app = express();

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'logs', 'access.log'),
	{ flags: 'a' }
  );

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({
    extended: false,
  }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let resultValue = 'Please Enter Value';
let Squaretime = 0, Cubetime = 0, Fibonaccitime = 0;

app.get('/', (req, res) => {
  res.send(`
    <html>
		<head>
			<link rel="stylesheet" href="styles.css">
		</head>
		<body>
			<header>
			  <h2>My Application</h2>
			</header>
			<section>
			  <nav>
			  <form action="/" method="POST">
			  <div class="form-control">
				<label>Input Value</label>
				<br>  </br>
				<input type="Number" name="inputvalue">
			   </div>
				<div>
				  <br><button type = "submit" formaction="/square" >Square</button></br>
				  <br><button type = "submit" formaction="/cube" >Cube</button></br>
				  <br><button type = "submit" formaction="/fibonacci" >Fibonacci</button></br>
				  <br><button type = "submit" formaction="/metric" >Metric</button></br>
				</div>
			  </nav>
			  <article>
			  <br>  </br>
			   <h3>Result : ${resultValue}</h3>
			   <br>  </br>
			   <br>  </br>

			   <table id="FetchDBOutput">
					<tr>
						<td>Performance Metrics</td>
					</tr>
					<tr>
						<td>Square Function</td>
						<td>${Squaretime}</td>
					</tr>
					<tr>
						<td>Cube Function</td>
						<td>${Cubetime}</td>
					</tr>
					<tr>
						<td>Fibonacci Function</td>
						<td>${Fibonaccitime}</td>
					</tr>
				</table>
				<br>  </br>
				<br>  </br>
				<br>  </br>
				<br>  </br>
			  </article>
			</section>
		</body>
	</html>
  `);
});

const http = require('http');
const request = require('request');
app.post('/cube', (req, res) => {
const enteredValue = Number(req.body.inputvalue);
console.log(enteredValue);
const requestData = {text:enteredValue};
console.log(requestData);
const options = {
    url: 'http://backendcube:8082/cube',
    json: true,
    body: requestData
};
request.post(options, (err, res1, body) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Status: ${res1.statusCode}`);
    console.log(body.result);
	resultValue=body.result;
	res.redirect('/');
});


});

app.post('/square', (req, res) => {
const enteredValue = Number(req.body.inputvalue);
console.log(enteredValue);
const requestData = {text:enteredValue};
console.log(requestData);
const options = {
	url: 'http://backendsquare:8083/square',
	json: true,
	body: requestData
};
request.post(options, (err, res1, body) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Status: ${res1.statusCode}`);
	console.log(body);
	console.log(body.result);
	resultValue=body.result;
	res.redirect('/');
});
});

app.post('/fibonacci', (req, res) => {
const enteredValue = Number(req.body.inputvalue);
console.log(enteredValue);
const requestData = {text:enteredValue};
console.log(requestData);
const options = {
	url: 'http://backendfibonacci:8085/fibonacci',
	json: true,
	body: requestData
};
request.post(options, (err, res1, body) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Status: ${res1.statusCode}`);
	console.log(body.result);
	resultValue=body.result;
	res.redirect('/');
});
});

app.post('/metric', (req, res) => {
const options = {
	url: 'http://backendmetric:8084/metric'
};
request.get(options, (err, res1, body) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Status: ${res1.statusCode}`);
	console.log(body);
	const obj=JSON.parse(body);
	console.log(obj);
	console.log(obj.squareresult);
	Squaretime =obj.squareresult;
	Cubetime = obj.cuberesult;
	Fibonaccitime = obj.fibonacciresult;
	res.redirect('/');
});
});

app.listen(8081);