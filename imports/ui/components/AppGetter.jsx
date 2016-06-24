import { Meteor } from 'meteor/meteor';
import React from 'react';

export default class Header extends React.Component {

  getApp() {
    const hostDomain = window.location.protocol+"//"+window.location.host+"/";
    Meteor.call('getApp', hostDomain);
  }

  render() {
    return (
      <div>
        <button onClick={this.getApp} >Get the app!</button>
      </div>
    );
  }
}
