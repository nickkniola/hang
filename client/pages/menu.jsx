import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Menu extends React.Component {
  render() {
    const data = JSON.parse(localStorage.getItem('userData'));
    let navAccess = false;
    if (data) {
      navAccess = true;
    }
    return (
      <div className="ui menu">
        <NavLink className="item" to="/main">
          <img src="/images/hang_logo.png"></img>
        </NavLink>
        <NavLink className="item" to={ navAccess ? '/pairing/select' : '/'} >
          Pairing
        </NavLink>
        <NavLink className="item" to={ navAccess ? '/random/select' : '/'} >
          Random
        </NavLink>
        <NavLink className="item" to={ navAccess ? '/matches' : '/'}>
          Matches
        </NavLink>
      </div>
    );
  }
}
