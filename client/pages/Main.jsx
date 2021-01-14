import React from 'react';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'du@email.com',
      password: 'demouser'
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleTestUser = this.handleTestUser.bind(this);
  }

  handleClick() {
    this.props.history.push('/signup');
  }

  handleTestUser(event) {
    event.preventDefault();
    const formData = this.state;
    fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        const dataJson = JSON.stringify(data);
        localStorage.setItem('userData', dataJson);
      })
      .then(() => {
        this.props.history.push('/pairing/select');
      })
      .catch(() => console.error('An unexpected error occurred'));
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
                  <input type="text" name="email" placeholder="E-mail address" value={this.state.email} disabled />
                </div>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input type="password" name="password" placeholder="Password" value={this.state.password} disabled />
                </div>
              </div>
              <button type="button" className="ui fluid large primary submit button" onClick={this.handleTestUser}>Try It Out</button>
            </div>
          </form>
          <div className="button-container">
            <button className="ui button sign-up-button" type="button" onClick={this.handleClick}>Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
}
