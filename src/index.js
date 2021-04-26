// import React from 'react'
// import ReactDOM from 'react-dom'
// import App from './app'
import Icon from './imgs/bg.jpg'

// ReactDOM.render(<App />, document.getElementById('root'));

function component() {
    const element = document.createElement('div');
  
    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = "Hello World ~ Webpack!!Ha Ha Ha!!!"
  
    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);
    return element;
  }
  
  document.body.appendChild(component());