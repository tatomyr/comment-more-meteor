import React from 'react';

import Header from '../components/Header.jsx';
import AppGetter from '../components/AppGetter.jsx';

// App component - represents the whole app
export default class HomePage extends React.Component {

  render() {
    return (
      <div className="container">
        <Header />

        <AppGetter />

      </div>
    );
  }

}
