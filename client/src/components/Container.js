import React from 'react';
import PhodomeScene from './PhodomeScene';
import TestScene from './TestScene';
import Sidebar from './Sidebar';
import axios from 'axios';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      arts: [],
      numberOfClicks: 0,
      relatedArts: []
    };

    this.handleUploadComplete = this.handleUploadComplete.bind(this);
    // this.fetchImages = this.fetchImages.bind(this);
    this.fetchArts = this.fetchArts.bind(this);
    this.fetchRelatedArts = this.fetchRelatedArts.bind(this);
    this.changeScene = this.changeScene.bind(this);
  }

  componentDidMount() {
    this.fetchArts();
  }

  // fetchImages() {
  //   axios.get('/api/images')
  //   .then(response => (
  //     response.data.files
  //   ))
  //   .then( (images) => {
  //     let imageUrls = [];

  //     images.forEach(imageObj => {
  //       imageUrls.push(imageObj.url);
  //     });

  //     this.setState({
  //       images: imageUrls,
  //       scene: 'PhodomeScene'
  //     });
  //   });
  // }

  fetchArts() {
    const context = this;
    const artPromises = [];
    const arts = this.state.arts;
    const newArts = [];
    for (var i = 0; i < 50; i++) {
      artPromises.push(axios.get('/api/arts'));
    }
    axios.all(artPromises)
    .then(axios.spread(function() {
      let newArt;
      const transformImageUrl = function transformImageUrl(url) {
        while (url.indexOf('/') >= 0) {
          url = url.replace('/', 'SLASH');//this is needed to transfer the url over http request
        }
        return '/api/get/' + url;
      };
      for (var key in arguments) {
        newArt = arguments[key].data;
        newArt.imageUrl = transformImageUrl(newArt.smallUrl);
        newArt ? newArts.push(newArt) : 0;
      }
      context.setState({
        arts: newArts,
        scene: 'PhodomeScene'
      });
    }));
  }

  fetchRelatedArts(id) {
    const context = this;
    const artPromises = [];
    var arts = this.state.arts;
    const numberOfClicks = this.state.numberOfClicks + 1;
    const relatedArts = this.state.relatedArts;
    var clickedArtIndex;
    var clickedArt = arts.filter(function(art, index) {
      if (art.id === id) {
        clickedArtIndex = index;
        return true;
      }
      return false;
    })[0];
    arts.splice(clickedArtIndex, 1);
    artPromises.push(axios.get('/api/arts/related/' + id));
    axios.all(artPromises)
    .then(axios.spread(function() {
      let newArt;
      const transformImageUrl = function transformImageUrl(url) {
        while (url.indexOf('/') >= 0) {
          url = url.replace('/', 'SLASH');//this is needed to transfer the url over http request
        }
        return '/api/get/' + url;
      };
      var newArts = arguments[0].data;
      newArts.forEach(function(newArt) {
        newArt.imageUrl = transformImageUrl(newArt.smallUrl);
      });
      newArts.unshift(clickedArt);
      newArts.filter(function(art) { return art !== undefined; });
      newArts = newArts.concat(relatedArts);
      if (numberOfClicks < 3) {
        context.setState({
          relatedArts: newArts,
          scene: 'PhodomeScene',
          numberOfClicks: numberOfClicks
        });
      } else {
        const uniqueArts = [];
        newArts.forEach(function(art) {
          if (!uniqueArts.includes(art)) {
            uniqueArts.push(art);
          }
        });
        context.setState( {
          arts: uniqueArts,
          scene: 'TestScene'
        });
      }
    
    }));
  }

  changeScene(scene) {
    console.log('CHANGE SCENE');
    this.setState({
      scene: scene
    });
  }

  handleUploadComplete() {
    this.fetchArts();
  }

  render() {
    return (
      <div>
        {/*<Sidebar handleUploadComplete={this.handleUploadComplete} toggleDemo={this.props.toggleDemo} />*/}
        { this.state.scene === 'PhodomeScene' ? <PhodomeScene arts={this.state.arts} fetchRelated={this.fetchRelatedArts.bind(this)} /> : null }
        { this.state.scene === 'TestScene' ? <TestScene arts={this.state.arts} /> : null }
      </div>
    );
  }
}

Container.propTypes = {
  toggleDemo: React.PropTypes.func.isRequired
};

export default Container;
