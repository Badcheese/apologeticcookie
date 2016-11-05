import { Entity } from 'aframe-react';
import React from 'react';

const Camera = props => (
  <Entity>
    <Entity id="camera" camera="userHeight:1.6" look-controls="" wasd-controls="fly: true; acceleration: 200" {...props} />
  </Entity>
);

Camera.propTypes = {

};

export default Camera;
