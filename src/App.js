import React, { Component } from 'react';
import './App.css';
import { NeuralNetwork } from './neural/nn';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 60; 
const MIN_PIPE_HEIGHT = 40;
const speed = 1.5;
const FPS = 120;

const birdX = 150;
const birdY = 150;


class Bird {

  constructor(contx) {

    this.ctx = contx;

    this.x = birdX;
    this.y = birdY;
    
    this.gravity = 0;
    this.velocity = 0.3;

    this.brain = new NeuralNetwork();
  }

  draw() { 
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillRect(this.x, this.y, this.width , this.height);
  }

  update = () => {

    this.gravity += this.velocity;
    
    if (this.gravity > 4) {
      this.gravity = 4;
    }

    this.y += this.gravity; 

    //console.log(this.velocity);
  }

  jump = () => {
    this.gravity = -4;
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
    this.space = 120;
    this.pipes = [];
    this.birds = [];
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);

    var ctx = this.getCtx();

    this.pipes = this.generatePipes();
    this.birds = [new Bird(ctx)];

    this.loop = setInterval(this.gameLoop, 1000 / FPS);
  }

  onKeyDown = (e) => {
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

    //update pipe position
    this.pipes.forEach(pipe => pipe.update());
    this.pipes = this.pipes.filter(pipe => !pipe.isDead);
  
    //update bird position
    this.birds.forEach(bird => bird.update());
  
    if(this.isGameOver()){
      alert("game over");
      clearInterval(this.loop);

    };

  }

  isGameOver = () => {


    let gameOver = false;
    //detect colliison 
    this.birds.forEach(bird => {
      this.pipes.forEach(pipe => {
        
        if (bird.y < 0 ||bird.y > HEIGHT ||
            (bird.x > pipe.x && bird.x < pipe.x + pipe.width
              && bird.y > pipe.y && bird.y < pipe.y + pipe.height)) {
        
                gameOver = true;
        
              }
            });
          });

    return gameOver;
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
      <div onClick = {() => this.setState({})}>
        {this.frameCount}
      </div>
      </div>
    );
  }
}

export default App;
