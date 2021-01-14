import React from 'react';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.history.push('/signup');
  }

  render() {
    return (
      <div className="main-container ui middle aligned center aligned grid">
        <div className="column">
          <div className="text-container">
            <h1 className="header-main"><img className="header-logo" src="images/hang_logo.png"></img>Hang</h1>
            <p className="subtitle-main">The only web app which makes plans for you!</p>
          </div>
          <form className="ui large form login-form">
            <div className="ui segment">
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon"></i>
                  <input type="text" name="email" placeholder="E-mail address" />
                </div>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input type="password" name="password" placeholder="Password" />
                </div>
              </div>
              <div className="ui fluid large primary submit button">Try It Out</div>
            </div>
          </form>
          <div className="button-container">
            <button className="ui primary button sign-up-button" type="button" onClick={this.handleClick}>Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
}
