import 'aframe';
import 'aframe-animation-component';
import 'aframe-text-component';
import { Entity } from 'aframe-react';
import React from 'react';

import getDomePositions from '../util/sphereMath';
import Image from './Image';

const Dome = ({arts, images, fetchRelated}) => {
  const RADIUS = 4 + (Math.floor(images.length / 4)); // This is pretty arbitrary
  const positions = getDomePositions(images.length, 1);

  return (
    <Entity>
      {
        (function() {
          const jsxImageList = [];
          var index = 0;
          for (var key in arts) {
            var imageUrl = arts[key].smallUrl;
            const x = positions[index][0] * RADIUS;
            const y = positions[index][1] * RADIUS;

            // The negative flips all items from behind the camera to in front
            const z = positions[index][2] * -RADIUS;
            index++;
            jsxImageList.push(
              <Image
              key={imageUrl}
              src={imageUrl}
              position={`${x} ${y} ${z}`}
              onImageClick={fetchRelated.bind(null, arts[key].id)}
              />
            );
          }
          return jsxImageList;
        })()
      }
    </Entity>
  );
};

Dome.propTypes = {
  images: React.PropTypes.array.isRequired
};

export default Dome;
