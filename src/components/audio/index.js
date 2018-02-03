import React, { Component } from 'react';

import './audio.css';

export default class Audio extends Component {
  render() {
    const {src, controls} = this.props;
    return (
      <div className='audio'>
        <audio controls={controls}
               src={src} />
      </div>
    )
  }
}