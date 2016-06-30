import { Meteor } from 'meteor/meteor';
import React from 'react';

export default class Header extends React.Component {

  getApp() {
    const hostDomain = window.location.protocol+"//"+window.location.host+"/";
    Meteor.call('getApp', hostDomain, function(err, res) {
      if (err) throw err;
      console.log(`[RES]`,res);
      $("#app-link-shell").html(`And <a href="${res.userLink}">download</a> the CommentMore app v${res.CMVersion}. Confirm installation. Refresh the page`);
    });

  }

  render() {
    return (
      <div>
        <button onClick={this.getApp} >Get the app!</button>
        <div id="app-link-shell"></div>
      </div>
    );
  }
}
