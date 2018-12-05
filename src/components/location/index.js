import React, { Component } from 'react';
import styled from 'styled-components';

import Tooltip from 'src/components/location/tooltip';
import BackgroundBlocker from 'src/components/reusable/backgroundblocker';

const $LocationContainer = styled.section`
  cursor: pointer;
  position:absolute;
  width:8rem;
  height:8rem;

  .marker-bg{
    position:absolute;
    left:-50%;
    top:-50%;
    height:100%;
    width:100%;
    background-image: url('images/target-green.png');
    background-size:contain;
  }

  &.type-turret{
    .marker-bg{
      background-image: url('images/target-red.png');
    }

    .location-tooltip{
      background-color: ${props => props.theme.color.orange};
    }
  }
  &.type-location{
    .marker-bg{
      background-image: url('images/target-blue.png');
    }

    .location-tooltip{
      background-color: ${props => props.theme.color.blue};
    }
  }

  &.open{
    .marker-bg{
      transition: all .2s cubic-bezier(.65,1.64,.57,1.01);
      transform:scale(1.25, 1.25);
      transform-origin:50% 50%;
      filter: brightness(150%);
    }

    .location-tooltip{
      opacity:1;
      transition: opacity .2s ease-in-out;
      pointer-events:all;
    }
  }

  .location-tooltip{
    opacity: 0;
    transition: opacity .2s ease-in-out;

    position: absolute;
    left:2rem;
    top:2rem;

    z-index: 1000;
    background-color: white;
    border-radius: 5px;
    padding: 1rem;
    box-shadow: ${props => props.theme.shadow.z2};
    min-width: 20rem;
    pointer-events: none;

    ul{
      list-style-type: none;
    }

    &.open-left{
      right:10rem;
      left:auto;
    }

    &.open-up{
      top:auto;
      bottom:10rem;
    }

    .location-tooltip-header{
      .left{
        width:100%;
        padding-right:2.5rem;
      }
      .right{
        position:absolute;
        top:1rem;
        right:1rem;
        width:2rem;
        height:2rem;
        background-size:contain;
        background-image: url('images/settings-gear.png');
      }
    }

    .button-container{
      margin-top:1rem;

      button{
        width:100%;
        height:100%;
      }
    }

    .connected-turrets{
      margin:1rem;
      background-color: ${props => props.theme.color.blue};
      border-radius: 5px;
      padding: .25rem .5rem .5rem 1rem;
      position:relative;

      button{
        position:absolute;
        top:1rem;
        right:1rem;
        width:2rem;
        height:2rem;
        background-size:contain;
        background-image: url('images/settings-gear.png');
      }
    }
  }
`;


class Location extends Component {
  constructor(){
    super();

    this.state = {
      isOpen: false
    };
  }

  onContextMenu(e){
    if(!this.props.debugMode){
      // console.log('location.contextMenu',e);
      e.preventDefault();
      e.stopPropagation();
      this.setState({ isOpen: true });
    }
  }

  onSettings(e, id){
    // console.log('onSettings');
    e.stopPropagation();
    if(this.props.locationData.get('type') === 'turret'){
      this.setState({ isOpen:false });
    }else{
      // console.log('only turrets can set location settings');
    }

    this.props.onLocationSettings(id);
  }

  onButtonFire(e){
      console.log('onButtonFire', e);
    if(e.button === 0 && this.props.locationData.get('type') === 'target'){
      const calibrationData = this.props.locationData.get('calibration')
      this.props.fireCommand(calibrationData);
    }
  }

  onBackgroundBlocker(e){
    // console.log('Location.onBackgroundBlocker', e.type);
    this.setState({ isOpen:false });
  }

  renderMarker(){
    return (
      <div  className='marker-bg' 
            onTouchStart={(e) => this.onButtonFire(e)}
            onMouseDown={(e) => this.onButtonFire(e)}
            onContextMenu={(e) => this.onContextMenu(e)}/>
    );
  }

  render() {
    let className = 'location';
    if(this.state.isOpen) className += ' open';
    if(this.props.locationData.get('type')) className += ' type-' + this.props.locationData.get('type');

    const positionStyle = { left: this.props.locationData.get('x'), top:this.props.locationData.get('y') };

    if(this.state.isOpen){
      return (
        <$LocationContainer className={className} style={positionStyle} >
          <Tooltip  id={this.props.id}
                    title={this.props.locationData.get('title')}
                    description={this.props.locationData.get('description')}
                    calibrationData={this.props.locationData.get('calibration')}
                    openLeft={this.props.locationData.get('percX') > .5}
                    openUp={this.props.locationData.get('percY') > .5}
                    type={this.props.locationData.get('type')}
                    onSettings={this.onSettings}
                    onButtonFire={this.props.fireCommand} />
          { this.renderMarker() }
          <BackgroundBlocker onSelected={e => this.onBackgroundBlocker(e)}/>
        </$LocationContainer>
      );
    }else{
      return (
        <$LocationContainer className={className} style={positionStyle} >
          { this.renderMarker() }
        </$LocationContainer>
      );
    }
  }
}

export default Location;
