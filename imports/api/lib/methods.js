import { Meteor } from 'meteor/meteor';

const fs = Npm.require('fs');
//const child_process = Npm.require('child_process');
//console.log(fs, child_process);

Meteor.methods({
  getApp(hostDomain) {
    const dateTime = new Date().getTime();
    console.log('getApp', hostDomain);
    const user = Meteor.user();
    let CMUser = {};
    if (user) {
      CMUser = {
        email: user.emails[0].address,
        name: user.emails[0].address.substring(0, user.emails[0].address.indexOf('@')),
        password: user.services.password.bcrypt,
      };
    }

    console.log(CMUser);

    let projectPath = process.cwd();
    projectPath = projectPath.substr(0, projectPath.indexOf('/.meteor'));

    let fileStamp = fs.readFileSync(`${projectPath}/public/comment-more.user.js`, 'utf8');
    const CMVersion = fs.readFileSync(`${projectPath}/public/CMVersion.txt`, 'utf8').trim();

    fileStamp = fileStamp.replace('var CMLogin=undefined;', `var CMLogin="${CMUser.email}";`)
      .replace('var CMPassword=undefined;', `var CMPassword="${CMUser.password}";`)
      .replace('var hostDomain="http://localhost:3000/";', `var hostDomain="${hostDomain}";`)
      .replace('var CMVersion="0.0";', `var CMVersion="${CMVersion}";`);

    const headerStamp = fs.readFileSync(`${projectPath}/public/headerStamp.js`, 'utf8');
    fileStamp = headerStamp.replace('{{CMVersion}}', CMVersion)
      .replace('{{hostDomain}}', hostDomain)
      + fileStamp;

/*
`// ==UserScript==
// @name CommentMore
// @namespace comment-more
// @description	comment on any web page
// @include http*
// @version ${CMVersion}
// @require ${hostDomain}jquery/jquery-1.12.0.min.js
// @require ${hostDomain}jquery-ui-1.11.4.custom/jquery-ui.min.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==`
*/


    console.log(fileStamp, CMVersion);



  },
});
