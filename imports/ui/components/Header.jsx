import React from 'react';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

export default class Header extends React.Component {

  render() {
    return (
      <header>
        <h1>
          Comment More
        </h1>
        <AccountsUIWrapper />
      </header>
    );
  }
}
