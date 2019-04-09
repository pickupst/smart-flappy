import React, { Component } from 'react';
import './App.css';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 50; 
const MIN_PIPE_HEIGHT = 40;


class App extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    var ctx = this.canvasRef.current.getContext("2d");
    ctx.fillStyle = "#000";

    const space = 80;
    const firstPipeHeight = MIN_PIPE_HEIGHT + Math.random() * 
                              (HEIGHT - space - MIN_PIPE_HEIGHT);     
    const secondPipeHeight = HEIGHT - firstPipeHeight - space; 

    ctx.fillRect(50, 0, PIPE_WIDTH , firstPipeHeight);
    ctx.fillRect(50, firstPipeHeight + space, PIPE_WIDTH , secondPipeHeight);
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
