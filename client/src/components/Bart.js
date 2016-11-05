import { Entity } from 'aframe-react';
import React from 'react';

const Art = (props) => {
  console.log('theesseee are the proppsss!!!!!', props);
  return (
    <Entity>  
      <Entity
        geometry={{
          primitive: 'box',
          width: 8,
          height: 8,
          depth: 1
        }}
        rotation=""
        position={props.position}
       
        material={{
          src: `url(${props.src})`
        }}
      />
      <Entity
        geometry={{
          primitive: 'box', 
          height: 9, 
          width: 9, 
          depth: .9
        }}
        position={props.position}
        material="src: url(../assets/wood.jpg);"
      />
    </Entity>
  ); 
};

export default Art;
