import React, { Component } from 'react';
import styled from 'styled-components';

const $BackgroundBlocker = styled.div`
  position:fixed;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background-color: ${props => props.theme.color.white};
  opacity:.7;
  z-index:1;
`;

class BackgroundBlocker extends Component {
  onBackgroundBlocker(e){
    e.preventDefault(e);
    e.stopPropagation(e);

    this.props.onSelected && this.props.onSelected(e);
  }

  render() {
    return (
      <$BackgroundBlocker  
        id='background-blocker' 
        onTouchStart={e => this.onBackgroundBlocker(e)} 
        onMouseDown={e => this.onBackgroundBlocker(e)}
        onContextMenu={e => this.onBackgroundBlocker(e)} />
    );
  }
}

export default BackgroundBlocker;
