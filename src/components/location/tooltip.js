import React, { Component } from 'react';
import styled from 'styled-components';

class ToolTip extends Component {
  listConnectedTurrets(calibrationData){
    if(calibrationData){
      const turretMarkup = [];
        
      calibrationData.map((calObj, i) => {
        turretMarkup.push(
          <li key={i}>
            <div className="connected-turrets">
              <h4>{calObj.get('id')}</h4>
              <p>{`rotX: ${calObj.get('rotX')}°`}</p>
              <p>{`rotY: ${calObj.get('rotY')}°`}</p>
            </div>
          </li>
        );
      });

      if(turretMarkup.length > 0){
        return (
          <div>
            <h4>{'Connected Turrets:'}</h4>
            <ul>
              {turretMarkup}
            </ul>
          </div>
        );
      }else{
        return null;
      }
    }else{
      return null;
    }
  }

  onButtonFire(e){
    console.log(`onButtonFire! ${e.type}`);

    this.props.onButtonFire(this.props.calibrationData);
  }

  render() {
    let className = "location-tooltip";
    if(this.props.openLeft) className += ' open-left';
    if(this.props.openUp) className += ' open-up';

    return (
      <div className={className}>
        <div className="location-tooltip-header">
          <h3 className="left">{this.props.title}</h3>
          {this.props.type === 'turret' && (
            <div  className="right" 
                  onMouseDown={e => this.props.onSettings(e, this.props.id)} 
                  onTouchStart={e => this.props.onSettings(e, this.props.id)}/>
          )}
        </div>
        {this.props.description && (<p>{this.props.description}</p>)}
        {this.listConnectedTurrets(this.props.calibrationData)}
        {this.props.calibrationData && (
          <div className="button-container">
            <button onTouchStart={e => this.onButtonFire(e)} 
                    onMouseDown={e => this.onButtonFire(e)}>{'FIRE'}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default ToolTip;
