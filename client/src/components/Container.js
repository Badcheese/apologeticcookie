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
      images: []
    };

    this.handleUploadComplete = this.handleUploadComplete.bind(this);
    // this.fetchImages = this.fetchImages.bind(this);
    this.fetchArts = this.fetchArts.bind(this);
    this.fetchRelatedArts = this.fetchRelatedArts.bind(this);
  }

  componentDidMount() {
    this.fetchImages();
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
    const newArts = {};
    for (var i = 0; i < 10; i++) {
      artPromises.push(axios.get('/api/arts'));
    }
    axios.all(artPromises)
    .then(axios.spread(function() {
      let imageUrls = [];
      let newArt;
      const transformImageUrl = function transformImageUrl(url) {
        while (url.indexOf('/') >= 0) {
          url = url.replace('/', 'SLASH');//this is needed to transfer the url over http request
        }
        return '/api/get/' + url;
      };
      for (var key in arguments) {
        newArt = arguments[key].data;
        newArts[key] = newArt;
        newArt.smallUrl = transformImageUrl(newArt.smallUrl);
        imageUrls.push(newArt.smallUrl);
      }
      context.setState({
        arts: newArts,
        images: imageUrls,
        scene: 'PhodomeScene'
      });
    }));
  }

  fetchRelatedArts(id) {
    const context = this;
    const artPromises = [];
    const arts = this.state.arts;
    artPromises.push(axios.get('/api/arts/related/' + id));
    axios.all(artPromises)
    .then(axios.spread(function() {
      let imageUrls = [];
      let newArt;
      const transformImageUrl = function transformImageUrl(url) {
        while (url.indexOf('/') >= 0) {
          url = url.replace('/', 'SLASH');//this is needed to transfer the url over http request
        }
        return '/api/get/' + url;
      };
      const newArts = arguments[0].data;
      newArts.forEach(function(newArt) {
        newArt.smallUrl = transformImageUrl(newArt.smallUrl);
        imageUrls.push(newArt.smallUrl);
      });
      context.setState({
        arts: newArts,
        images: imageUrls,
        scene: 'PhodomeScene'
      });
    }));
  }

  changeScene(scene) {
    console.log('CHANGE SCENE');
    this.setState({
      scene: scene
    });
  }

  handleUploadComplete() {
    this.fetchImages();
  }

  render() {
    return (
      <div>
        <Sidebar handleUploadComplete={this.handleUploadComplete} toggleDemo={this.props.toggleDemo} />
        { this.state.scene === 'PhodomeScene' ? <PhodomeScene arts={this.state.arts} images={this.state.images} fetchRelated={this.fetchRelatedArts} /> : null }
        { this.state.scene === 'TestScene' ? <TestScene images={this.state.images} /> : null }
      </div>
    );
  }
}

Container.propTypes = {
  toggleDemo: React.PropTypes.func.isRequired
};

export default Container;
