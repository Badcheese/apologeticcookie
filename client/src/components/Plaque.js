import { Entity } from 'aframe-react';
import Text from  'aframe-text-component';
import React from 'react';

const Plaque = props => {

  return (
    <Entity position={props.position} scale="1.9 1 1" rotation={props.rotation}>
      <Text scale="0.2 0.2 0.2" text={{text: props.text}}></Text>
    </Entity>
  );
};

Plaque.propTypes = {
  text: React.PropTypes.string,
  rotation: React.PropTypes.string,
  position: React.PropTypes.string.isRequired
};

export default Plaque;
