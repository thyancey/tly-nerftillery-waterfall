import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'src/store';

import Location from 'src/components/location';

const $PlayArea = styled.div`
  position:absolute;
  
  .playarea-image{
    width:100%;
    height:100%;
    background-size: 100% 100%;
  }

  .container-locations{
    position:absolute;
    width:100%;
    height:100%;
    overflow:hidden;
  }
`;


class PlayArea extends Component {
  onContextMenu(e){
  }

  onLocationSettings(id){
    console.log('onLocationSettings');
    this.props.loadLocationSettings(id);
  }

  updateLocation(id, x, y){
    // console.log('updateLocation (' + id + ', ' + x + ', ' + y + ')');

    const offsetX = $('.container-playarea').scrollLeft();
    const offsetY = $('.container-playarea').scrollTop();

    this.props.updateLocation({
      id: id,
      x: x + offsetX,
      y: y + offsetY
    });
  }

  componentDidMount(){
  }

  //- for debugging for now
  setPlayAreaScale(scaleValue){
    this.props.setPlayAreaScale(scaleValue);
  }

  getSizing(multiplier, isOuterMap){
    multiplier = multiplier || 1;

    const coreValues = {
      width: this.props.mapWidth * multiplier,
      height: this.props.mapHeight * multiplier,
      left:0,
      top:0
    }

    if(isOuterMap){
      const mapDiv = document.querySelector('.container-playarea');

      if(coreValues.width < mapDiv.offsetWidth){
        coreValues.left = (mapDiv.offsetWidth - coreValues.width) / 2;
      }
      if(coreValues.height < mapDiv.offsetHeight){
        coreValues.top = (mapDiv.offsetHeight - coreValues.height) / 2;
      }
    }

    return coreValues;
  }

  render() {
    global.testMapController = this;
    
    if(this.props.mapImage){
      return (
        <$PlayArea  className="map" 
              onContextMenu={this.onContextMenu}
              style={this.getSizing(null, true)}>
          <div className="container-locations" style={this.getSizing()}>
            {this.props.locations.map((l, idx) => (
              <Location key={idx} id={idx} 
                        locationData={l} 
                        updateLocation={(id, x, y) => this.updateLocation(id, x, y)} 
                        onLocationSettings={this.onLocationSettings}
                        debugMode={this.props.debugMode}
                        fireCommand={this.props.onFireCommand} /> 
            ))}
          </div>
          <div className="playarea-image" style={{backgroundImage: 'url("' + this.props.mapImage + '")'}}/>
        </$PlayArea>
      );
    }else{
      return (
        <$PlayArea>
          <h1>{'Map loading'}</h1>
        </$PlayArea>
      );
    }
  }
}

export default connect(state => ({ 
  loaded: state.loaded,
  debugMode: state.debugMode,
  locations: state.locations,
  mapScale: state.playAreaData.get('scale'),
  mapWidth: state.playAreaData.get('width'),
  mapHeight: state.playAreaData.get('height'),
  mapImage: state.playAreaData.get('image'),
  mapTitle: state.playAreaData.get('title')
}))(PlayArea);
