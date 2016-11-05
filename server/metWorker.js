const request = require('request');
const ArtController = require('./db/controllers/ArtController');
const requestsPerTick = 1;
const period = 150;
const startingId = 900000;
const endingId = 1000000;
const maxOpenRequests = 10;
var openRequests = 0;
const pendingRequests = [];
var mainTick;

const findBetween = function findBetween(iString, firstChar, lastChar) {
  const indexes = [];
  for (var i = 0; indexes.length < 2 && i < iString.length; i++) {
    if (iString[i] === firstChar && indexes.length === 0) {
      indexes.push(i);
    } else if (iString[i] === lastChar && indexes.length === 1) {
      indexes.push(i);
    }
  }
  if (indexes.length === 2) {
    return iString.slice(indexes[0] + 1, indexes[1]);
  }
  return null;
};

const cutHere = function cutHere(iString, cutString) {
  const index = iString.indexOf(cutString);
  if (index !== -1) {
    return iString.slice(0, index);
  } else {
    return null;
  }
};

const cutBefore = function cutBefore(iString, cutString) {
  const index = iString.indexOf(cutString);
  if (index !== -1) {
    return iString.slice(index);
  } else {
    return null;
  }
};

const addArt = function addArt(id, endingId, availableArtIds) {

  openRequests++;
  request.get('http://www.metmuseum.org/art/collection/search/' + id, function(error, response, body) {
    openRequests--;
    if (error) {
      console.error(error);
      const hours = function (hours) {
        milliseconds = hours * 60 * 60 * 1000;
      };
      if (error.code !== 'ETIMEDOUT') {
        clearInterval(mainTick);
        setTimeout(function() {
          grabNew(id, endingId, availableArtIds);
        }, hours(.5));  
      }
      return;
    }

    //MET HTML PARSER
    const art = {id: id, related: []};
    body = cutBefore(body, '#collectionImage');
    if (body === null) { //if there is no #collectionImage, then this item doesn't exist
      return;
    }
    body = cutBefore(body, 'ng-src=');
    art.smallUrl = findBetween(body, '\'', '\'');

    body = cutBefore(body, 'utility-menu__item utility-menu__item--download');
    if (body === null) { //if there is no download button, this image doesn't have a picture
      return;
    }
    body = cutBefore(body, '&#039');
    art.url = findBetween(body, ';', '&');
    
    body = cutBefore(body, 'collection-details__object-title');
    art.title = findBetween(body, '>', '<');

    while (cutBefore(body, 'collection-details__tombstone--label') !== null) {
      body = cutBefore(body, 'collection-details__tombstone--label');
      const key = findBetween(body, '>', ':');
      body = cutBefore(body, 'collection-details__tombstone--value');
      const value = findBetween(body, '>', '<');
      art[key] = value; 
    }

    while (cutBefore(body, 'card__standard-image') !== null) {
      body = cutBefore(body, 'card__standard-image');
      body = cutBefore(body, 'href');
      const id = findBetween(body, '"', '"');
      const indexOfId = id.indexOf('search/') + 7;
      art.related.push(Number(id.slice(indexOfId)));
    }     
    ArtController.insertArt(art);
  });
};


const addAll = function(idArray) {
  const length = idArray.length;
  var i = 0;
  var j = i;

  mainTick = setInterval(function() {
    j += requestsPerTick;
    for (i = i; i < j && i < length; i++) {
      addArt(idArray[i]);
    }
    if (i >= length) {
      clearInterval(mainTick);
      console.log('WORKER COMPLETE');
      setTimeout(function() { }, 15000);//allow any remaining requests to finish
      return;
    }
  }, period);
};

//Grab related of all in DB, this is disabled by default
const grabRelated = function grabRelated() {
  ArtController.initArts(function(availableArtIds, requiredArtIds) {
    const idsToRequest = [];
    requiredArtIds.forEach(function(id) {
      if (!availableArtIds.includes(id)) {
        idsToRequest.push(id);
      }
    });
    addAll(idsToRequest);
  });
};

//Grab new 
const grabNew = function grabNew(startingId, endingId, availableArtIds, requiredArtIds) {
  var i = startingId;
  var j = i;
  // THROTTLING BY TIME
  mainTick = setInterval(function() {
    if (i >= endingId) {
      clearInterval(mainTick);
      mainTick = setInterval(function() {
        if (openRequests === 0) {
          console.log('COMPLETE');
          clearInterval(mainTick);
        }
      }, 100);//allow open request to close
      return;
    }
    if (openRequests < maxOpenRequests) {
      console.log(`Fetching ${i} until ${endingId}, there are ${openRequests} open requests.`);
      j += requestsPerTick;
      for (i = i; i < j && i < endingId; i++) {
        if (!availableArtIds.includes(i)) {
          addArt(i, endingId, availableArtIds);
        }
      }
    }
  
  }, period);
};

const requestLauncher = function requestLauncher() {
  if (pendingRequests.length > 0 && openRequests < maxOpenRequests) {
    addArt(pendingRequests.pop());
  }
};

ArtController.initArts(function(availableArtIds, requiredArtIds) {
  grabNew(startingId, endingId, availableArtIds, requiredArtIds);
});