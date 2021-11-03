console.log('Loading data...');

let table;

var x;
var y;

const canvasWidth = window.innerWidth;
const canvasHeight = 6000; // ⚠️ size limit if too long
const xPosAxis1 = 100; // px
const xPosAxis2 = 400; // px
const xPosAxis3 = 700;
const xPosAxis4 = 1000;

// https://p5js.org/reference/#/p5/loadTable
function preload() {
  table = loadTable('future_cities_data_truncated.csv', 'csv', 'header');
}

function setup() {
  
  createCanvas(canvasWidth, canvasHeight);

  const barMargin = 10;
  const barHeight = 30;

  // count the columns
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print('All cities:', table.getColumn('current_city'));

  for (let i = 0; i < table.getRowCount(); i++) {
    const city = table.get(i, 'current_city');
    const meanTemp = table.get(i, 'Annual_Mean_Temperature');
    const futureMeanTemp = table.get(i, 'future_Annual_Mean_Temperature');
    const minTemp = table.get(i, 'Min_Temperature_of_Coldest_Month');
    const maxTemp = table.get( i,'Max_Temperature_of_Warmest_Month');

    position = convertDegreesToPosition(meanTemp);
    drawTempToday(position);
    drawLabelToday(position, city, meanTemp);

    futurePosition = convertDegreesToPosition(futureMeanTemp);
    drawTempFuture(futurePosition);
    drawLabelFuture(futurePosition, city, futureMeanTemp);

    futurePosition2 = convertDegreesToPosition(minTemp);
    drawTempMin(futurePosition2);
    drawLabelMin(futurePosition2, city, minTemp); 

    futurePosition3 = convertDegreesToPosition(maxTemp);
    drawTempMax(futurePosition3);
    drawLabelMax(futurePosition3, city, maxTemp);  
   
  }

  // drawAxes();
  // drawAxesLabels();
}

function convertDegreesToPosition(temp) {
  // we need to map the temperatures to a new scale
  // 0° = 600px, 25° = 300px, 20° = 30px
  // https://p5js.org/reference/#/p5/map
  const position = map(temp, -15, 35, 900, 50);
  return position;
}

// the two temp drawing functions could also be combined into a single function
// adding the x-position as a new parameter. For simplicity we have two functions
function drawTempToday(pos) {
  fill('black');
  circle(xPosAxis1, pos, 30);
}

function drawTempFuture(pos) {
  fill('black');
  circle(xPosAxis2, pos, 30);
}

function drawTempMin(pos) {
  fill('black');
  circle(xPosAxis3, pos, 10);
}
function drawTempMax(pos) {
  fill('black');
  circle(xPosAxis4, pos, 40);
}

function drawLabelToday(pos, city, temp) {
  fill('black');
  const label = `${city}: ${temp}°C`;
  text(label, xPosAxis1 + 30, pos + 5);
}

function drawLabelFuture(pos, city, temp) {
  fill('black');
  const label = `${city}: ${temp}°C`;
  text(label, xPosAxis2 + 30, pos + 5);
}

function drawLabelMin(pos, city, temp) {
  fill('black');
  const label = `${city}: ${temp}°C`;
  text(label, xPosAxis3 + 30, pos + 5);
}

function drawLabelMax(pos, city, temp) {

  fill('black');
  const label = `${city}: ${temp}°C`;
  text(label, xPosAxis4 + 30, pos + 5);
}

function draw() { 
  noStroke();
  textSize(32);
  fill( 1);
  text('Today', 80, 50);
  
  // background(220);
  // line(random(400),random(400),random(400),random(400));
  noStroke();
  textSize(32);
  text('Tomorrow', 380, 50);
  fill(1);

  noStroke();
  textSize(32);
  text('Future Min', 680, 50);
  fill( 1);

  noStroke();
  textSize(32);
  text('Future Max', 980, 50);
  fill( 1);
  


  
  var x2 = 1;
  var y2 =646;
  stroke(1);
  strokeWeight(3);
  line(x,y,x2,y2);
  x = innerWidth;
  y = 646;


}