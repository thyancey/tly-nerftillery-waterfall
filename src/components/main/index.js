import React, { Component } from 'react';
import Icon_Example from '../../images/icon.svg';
import styled, { ThemeProvider } from 'styled-components';


import defaultPlayArea from 'src/components/main/data-defaultplayarea.json';

import { connect } from 'src/store';

import PlayArea from 'src/components/playarea'

import theme from 'src/themes/theme.js';

const $MainContainer = styled.div`
  position:absolute;
  width:100%;
  height:100%;
  overflow:hidden;
  background-color:${props => props.theme.color.black};

  .container-playarea{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    border:2px solid red;

    overflow:auto;
    text-align:center;
  }

  .header{
    position:absolute;

    div{
      background-color:${props => props.theme.color.orange};
      width:20px;
      height:20px;
    }
  }
`;


class Main extends Component {
  //- TODO, this gets called twice??
  constructor(){
    super();

    this.loadStoreData();
    this.state = {
    };
  }

  loadStoreData(){
    const url = './data/data-playarea.json';
    console.log(`reading app data from '${url}'`);

    fetch(url).then(response => {
                      return response.json();
                    }, 
                    err => {
                      console.error('Error fretching url, using default data', err);
                      this.setDefaultData();
                    }) //- bad url responds with 200/ok? so this doesnt get thrown
              .then(json => {
                      this.props.actions.setPlayAreaData(json);
                      return true;
                    }, 
                    err => {
                      console.error('Error parsing store JSON (or the url was bad), using default data', err);
                      this.setDefaultData();
                    });
  }

  setDefaultData(){
    this.props.actions.setPlayAreaData(defaultPlayArea);
  }

  onFireCommand(calibrationData){
    console.log('onFireCommand', calibrationData);
    let fireMessage = '';

    // if(calibrationData){
    //   calibrationData.map((cd, i) => {
    //     if(i !== 0){
    //       fireMessage += '\n';
    //     }
    //     fireMessage += `${this.state.debugMessageCounter} - ${cd.get('id')} - ( rotX: ${cd.get('rotX')}°, rotY: ${cd.get('rotY')}° )`;
    //   })

    //   this.addDebugMessage(fireMessage);
    // }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <$MainContainer>
          <div className="header">
            <div/>
          </div>
          <div className="container-playarea">
            <PlayArea onFireCommand={this.onFireCommand} />
          </div>
        </$MainContainer>
      </ThemeProvider>
    );
  }
}

export default connect(state => ({ 
  loaded: state.loaded
}))(Main);
