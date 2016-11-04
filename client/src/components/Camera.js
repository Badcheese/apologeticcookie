import { Entity } from 'aframe-react';
import React from 'react';

const Camera = props => (
  <Entity>
    <Entity id="camera" camera="" look-controls="" wasd-controls="fly: true" {...props} />
  </Entity>
);

Camera.propTypes = {

};

export default Camera;
