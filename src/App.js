import React, { Component } from 'react';
import './App.css';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 80; 
const MIN_PIPE_HEIGHT = 40;
const speed = 1.5;
const FPS = 120;


class Bird {

  constructor(contx) {

    this.ctx = contx;
    this.x = 100;
    this.y = 150;
    this.gravity = 1;
    this.velocity = 0;
    
  }

  draw() { 
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillRect(this.x, this.y, this.width , this.height);
  }

  update = () => {
    this.y +=  this.gravity;
  }

  jump = () => {
    this.velocity = 10;
  }

}

class Pipe {

  constructor(contx, height, space) {

    this.ctx = contx;
    this.isDead = false;
    this.x = WIDTH;
    this.y = height ? HEIGHT - height : 0;
    this.width = PIPE_WIDTH;
    this.height = height || MIN_PIPE_HEIGHT + Math.random() * 
    (HEIGHT - space - MIN_PIPE_HEIGHT * 2);

  }

  draw() { 
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(this.x, this.y, this.width , this.height);
  }

  update = () => {

    this.x -= speed; 

    if ((this.x + PIPE_WIDTH) < 0) {
      this.isDead = true;
    }
  }

}


class App extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.frameCount = 0;
    this.space = 80;
    this.pipes = [];
    this.birds = [];
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);

    var ctx = this.getCtx();

    this.pipes = this.generatePipes();
    this.birds = [new Bird(ctx)];

    setInterval(this.gameLoop, 1000 / FPS);
  }

  onKeYdOWN = (e) => {
    if (e.code === 'Space') {
      this.birds[0].jump();
    }
  }

  getCtx = () => this.canvasRef.current.getContext("2d");

  generatePipes = () => {
    var ctx = this.getCtx();


    const firstPipe = new Pipe(ctx, null, this.space);
    const secondPipeHeight = HEIGHT - firstPipe.height - this.space; 
    const secondPipe = new Pipe(ctx, secondPipeHeight, this.space);

    return [firstPipe, secondPipe];
  }

  gameLoop = () => {
    this.update();
    this.draw();

  }

  update = () =>{

    this.frameCount = this.frameCount + 1;
    if (this.frameCount % (320) === 0) {
      const pipes = this.generatePipes();
      this.pipes.push(...pipes);
    }

    this.pipes.forEach(pipe => pipe.update());

    this.pipes = this.pipes.filter(pipe => !pipe.isDead);
  
    this.birds.forEach(bird => bird.update());
  }

  draw() {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    this.pipes.forEach(pipe => pipe.draw());
    this.birds.forEach(bird => bird.draw());
  }

  shiftLeft() {

  }

  render() {
    return (
      <div className="App">

      <canvas
      ref = {this.canvasRef} 
      id="myCanvas" 
      width={WIDTH} 
      height={HEIGHT} 
      style={{ marginTop: '24px', border: '1px solid #d3d3d3' }}>
      
       fdfdfd  
      
      </canvas>

      </div>
    );
  }
}

export default App;
