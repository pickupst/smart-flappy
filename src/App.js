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

const TOTAL_BIRDS = 100;

class Bird {

  constructor(contx, brain) {

    this.ctx = contx;

    this.x = birdX;
    this.y = birdY;
    
    this.gravity = 0;
    this.velocity = 0.3;

    this.isDead = false;

    this.brain = brain ? brain.copy() : new NeuralNetwork(2, 5, 1);

    this.age = 0;
    this.fitness = 0;
  }

  draw() { 
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillRect(this.x, this.y, this.width , this.height);
  }

  update = () => {

    this.age += 1;
    this.gravity += this.velocity;
    
    if (this.gravity > 4) {
      this.gravity = 4;
    }

    this.y += this.gravity; 

    if (this.y < 0) {
      this.y = 0;
    }else if (this.y > HEIGHT){
      this.y = HEIGHT;
    }

    this.think();
  }

  think = () => {
    const inputs = 
    [
      this.x / WIDTH,
      this.y / HEIGHT,

    ];

    const output = this.brain.predict(inputs);
  
    if (output[0] < 0.5) {
      this.jump();
    }
  }

  mutate = () => {

    this.brain.mutate((x) => {

      function mutate(x) {
        if (Math.random() < 0.1) {
          let offset = Math.random() * 0.5;
          return x + offset;
        } else {
          return x;
        }
      }


    });

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
    this.deadBirds = [];
  }

  componentDidMount() {
    //document.addEventListener('keydown', this.onKeyDown);
    this.startGame();
    
  }

  startGame = (birdBrain) => {
    this.pipes = this.generatePipes();
    this.birds = this.generateBirds(birdBrain);

    this.loop = setInterval(this.gameLoop, 1000 / FPS);
  }

  // onKeyDown = (e) => {
  //   if (e.code === 'Space') {
  //     this.birds[0].jump();
  //   }
  // }

  getCtx = () => this.canvasRef.current.getContext("2d");

  generatePipes = () => {
    var ctx = this.getCtx();


    const firstPipe = new Pipe(ctx, null, this.space);
    const secondPipeHeight = HEIGHT - firstPipe.height - this.space; 
    const secondPipe = new Pipe(ctx, secondPipeHeight, this.space);

    return [firstPipe, secondPipe];
  }

  generateBirds = (brain) => {
    const birds = [];
    var ctx = this.getCtx();

    for (let i = 0; i < TOTAL_BIRDS; i += 1) {

     birds.push(new Bird(ctx, brain));
      
    }

    return birds;
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
    //delete pipes
    this.pipes = this.pipes.filter(pipe => !pipe.isDead);
  
    //update bird position
    this.birds.forEach(bird => bird.update());
    //Delete bad birds
    this.updateBirdDeadState();

    this.deadBirds.push(...this.birds.filter(bird => bird.isDead));
    this.birds = this.birds.filter(bird => !bird.isDead);
    
    if (this.birds.length === 0) {
      let totalAge = 0;

      this.deadBirds.forEach((deadBird) => {totalAge += deadBird.age; });

      this.deadBirds.forEach((deadBird) => { deadBird.fitness = deadBird.age / totalAge; });
      this.deadBirds.sort((a, b) => a.fitness <= b.fitness);

      const strongest = this.deadBirds[0];
      strongest.mutate(0.1);

      this.birds = this.generateBirds(strongest.brain);

    }

  }

  updateBirdDeadState = () => {

    //detect colliison 
    this.birds.forEach(bird => {
      this.pipes.forEach(pipe => {
        
        if (bird.y < 0 ||bird.y > HEIGHT ||
            (bird.x >= pipe.x && bird.x <= pipe.x + pipe.width
              && bird.y >= pipe.y && bird.y <= pipe.y + pipe.height)) {
        
                bird.isDead = true;
        
              }
            });
          });

  }

  draw() {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    this.pipes.forEach(pipe => pipe.draw());
    this.birds.forEach(bird => bird.draw());
  }

  reset () {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
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
