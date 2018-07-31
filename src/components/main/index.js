import React, { Component } from 'react';
import Icon_Example from '../../images/icon.svg';

import { connect } from 'src/store';
require('./style.less');

class Main extends Component {

  render() {
    if(!this.props.loaded){
      return (
        <div>
          <div id="sample">
            <h1>{'Click this button to change loaded state'}</h1>
            <button onClick={() => this.props.actions.toggleLoaded()}>{'toggle loaded'}</button>
          </div>
          <br/>
          <br/>
          <br/>
          <div>
            <h1>{'Image examples'}</h1>

            <h2>{'image defined on image src:'}</h2>
            <img src={require('images/giffy.gif')} />

            <h2>{'image defined in style:'}</h2>
            <div id="imageholder">
              <div id="cssbackgroundimage" />
            </div>

            <h2>{'svg:'}</h2>
            <Icon_Example />
          </div>
        </div>
      );
    }else{
      return (
        <div id="sample" className="loaded">
          <h1>{'LOADED'}</h1>
          <button onClick={() => this.props.actions.toggleLoaded()}>{'toggle'}</button>
        </div>
      );
    }

  }
}

//- pass this component through the connect method to attach store values to props.
//- actions get mapped to props without explicitly stating anything. you can use any action from the store.
export default connect(state => ({ 
  loaded: state.loaded
}))(Main);
