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
    for (var i = 0; i < 10; i++) {
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
    const arts = this.state.arts;
    var clickedArt = arts.filter(function(art) { return art.id === id; })[0];
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
      const newArts = arguments[0].data;
      newArts.forEach(function(newArt) {
        newArt.imageUrl = transformImageUrl(newArt.smallUrl);
      });
      newArts.push(clickedArt);
      newArts.filter(function(art) { return art !== undefined; });
      const uniqueArts = [];
      newArts.forEach(function(art) {
        if (!uniqueArts.includes(art)) {
          uniqueArts.push(art);
        }
      });
      context.setState({
        arts: uniqueArts,
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
    this.fetchArts();
  }

  render() {
    return (
      <div>
        <Sidebar handleUploadComplete={this.handleUploadComplete} toggleDemo={this.props.toggleDemo} />
        { this.state.scene === 'PhodomeScene' ? <PhodomeScene arts={this.state.arts} fetchRelated={this.changeScene} /> : null }
        { this.state.scene === 'TestScene' ? <TestScene arts={this.state.arts} /> : null }
      </div>
    );
  }
}

Container.propTypes = {
  toggleDemo: React.PropTypes.func.isRequired
};

export default Container;
