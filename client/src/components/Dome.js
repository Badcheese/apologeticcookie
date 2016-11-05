import 'aframe';
import 'aframe-animation-component';
import 'aframe-text-component';
import { Entity } from 'aframe-react';
import React from 'react';

import getDomePositions from '../util/sphereMath';
import Image from './Image';

const Dome = ({arts, fetchRelated}) => {
  return (
    <Entity>
      {
          arts.map(function(art, index) {
            console.log('displaying ' + arts.length + ' arts');
            console.dir(arts);
            const RADIUS = 4 + (Math.floor(arts.length / 4)); // This is pretty arbitrary
            const positions = getDomePositions(arts.length, 1);
            const imageUrl = art.imageUrl;
            const x = positions[index][0] * RADIUS;
            const y = positions[index][1] * RADIUS;
            // The negative flips all items from behind the camera to in front
            const z = positions[index][2] * -RADIUS;
            index++;
            return (
              <Image
              key={art.id}
              src={imageUrl}
              position={`${x} ${y} ${z}`}
              onImageClick={fetchRelated.bind(null, art.id)}
              />
            );
          })
        }
      }
    </Entity>
  );
};

Dome.propTypes = {
  arts: React.PropTypes.array.isRequired,
  fetchRelated: React.PropTypes.func.isRequired
};

export default Dome;
