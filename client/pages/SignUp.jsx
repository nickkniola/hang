import React from 'react';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      invalidLogin: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit() {
    event.preventDefault();
    const formData = this.state;
    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.userId);
        if (!data.userId) {
          console.log('set to true');
          this.setState({ invalidLogin: true });
          return;
        }
        if (JSON.stringify(data) && JSON.stringify(data) !== undefined) {
          const dataJson = JSON.stringify(data);
          console.log('set to false');
          this.setState({ invalidLogin: false });
          localStorage.setItem('userData', dataJson);
        }
      })
      .then(() => {
        console.log('invalidLogin', this.state.invalidLogin);
        if (!this.state.invalidLogin) {
          console.log('doesnt enter here');
          this.props.history.push('/pairing/select');
        }
      })
      .catch(() => console.error('An unexpected error occurred'));
  }

  render() {
    return (
      <div className="sign-up-container">
        <div className="activity-form">
          <h2 className="secondary-header">Sign Up</h2>
          <form className="ui form" onSubmit={this.handleSubmit}>
            <div className="ui segment sign-up-segment">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" id="firstName" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="name">Last Name</label>
                <input type="text" name="lastName" id="lastName" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Password" autoComplete="on" value={this.state.password} onChange={this.handleChange} required />
              </div>
              <div className="button-container">
                <button className="large ui primary button" type="submit">Create Account</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
