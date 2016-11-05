import 'aframe';
import 'aframe-animation-component';
import 'aframe-text-component';
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import Ceiling from './Ceiling';

import ArtMapper from './ArtMapper';

const TestScene = ({arts}) => (
  <Scene fog="type: linear; color: #AAA; far: 60; near: 10" >
    <Entity id="camera" active camera position="-8 2 0" rotation="0 -90 0" wasd-controls="acceleration: 200" look-controls />


    <Entity geometry="primitive: box; width: 2, height: 1, depth: 3"
            position="0 0 -4" material="color: #666; metalness: 0.5" />

    <Entity
      geometry="primitive: plane; height: 500; width: 500"
      position="0 -0.5 0"
      rotation="-90 0 0"
      material="src: url(../assets/concrete5.jpg); repeat: 25 25"
    />

      <Ceiling position="0 18 0"/>

    <Entity
      geometry="primitive: plane; height: 50; width: 500"
      position="0 0 -9"
      rotation="0 0 0"
      material="side: double; src: url(../assets/concrete5.jpg); repeat: 25 25; metalness: 0.5"
    />

    <Entity
      geometry="primitive: plane; height: 50; width: 500"
      position="0 0 9"
      rotation="0 0 0"
      material="side: double; src: url(../assets/concrete5.jpg); repeat: 25 25; metalness: 0.5"
    />
    <Entity
      light="type: spot; angle: 100; color: red"
      intensity="8"
      look-at=""
      rotation="180 90 0"
      position="72 4 2"/>

    <Entity
      light="type: spot; angle: 100; color: blue; penumbra: 1; intensity: 100"
      look-at=""
      rotation="90 270 0"
      position="62 30 0"/>

    <Entity
      light="type: spot; angle: 100; color: blue; penumbra: 1; intensity: 100"
      look-at=""
      rotation="90 270 0"
      position="100 30 0"/>  

    <Entity
      light="type: spot; angle: 100; color: blue; penumbra: 1; intensity: 100"
      look-at=""
      rotation="90 270 0"
      position="100 30 0"/>  


    <Entity light="type: hemisphere; color: #999; groundColor: #666; intensity: 2"/>

    <ArtMapper arts={ arts } />
  </Scene>
);

TestScene.propTypes = {
  arts: React.PropTypes.array.isRequired
};

export default TestScene;

