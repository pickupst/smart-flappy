import React, { Component } from 'react';
import './App.css';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 80; 
const MIN_PIPE_HEIGHT = 40;
const speed = 1.5;
const FPS = 120;

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
  }

  componentDidMount() {

    this.pipes = this.generatePipes();

    setInterval(this.gameLoop, 1000 / FPS);
  }

  generatePipes = () => {
    var ctx = this.canvasRef.current.getContext("2d");


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
  }

  draw() {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    this.pipes.forEach(pipe => pipe.draw());

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
