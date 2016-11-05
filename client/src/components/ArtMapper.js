import 'aframe';
import 'aframe-animation-component';
import 'aframe-text-component';
import { Entity } from 'aframe-react';
import React from 'react';

import Art from './Bart';

  let changeSideArt = function(side) {
    if (Math.sign(side) === 1) {
      return -9;
    } 
    return 9;
  }

  let changeSideLight = function(side) {
    if (Math.sign(side) === 1) {
      return -8;
    } 
    return 8;
  }
  
const ArtMapper = props => {
  const z = 9;
  const y = 3;
  let x = 0;
  let count = 0;
  let lightX = 0;
  let artSide = 9;
  let lightSide = 8;

  let LightXRotation = function(x) {
    let val = -120;
    if (count % 2 !== 0) {
      val = -60;
    } 
    count++;
    return val;
  };

  return (
    <Entity>
      {
        props.arts.map((art, index) => {
          // The negative flips all items from behind the camera to in front
          // 8 12 6 light position
          var imageUrl = art.imageUrl;
          x += 8;
          
          lightX = LightXRotation(count); 
          artSide = changeSideArt(artSide); 
          lightSide = changeSideLight(lightSide);
          
          return (
            <Entity>
              <Art
              key={imageUrl}
              src={imageUrl}
              position={`${x} ${6} ${artSide}`}/>

              <Entity 
              light="type: spot; angle: 30; penumbra: .4"
              intensity="1"
              look-at="" 
              rotation={`${lightX} ${180} ${0}`}
              position={`${x} ${18} ${lightSide}`}/>

            </Entity>
          );
        })
      }
    </Entity>
  );
};


export default ArtMapper;
