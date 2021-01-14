import React from 'react';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
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
      <div className="sign-up-container">
        <form className="ui form" onSubmit={this.handleSubmit}>
          <div className="ui segment sign-up-segment">
            <h2 className="secondary-header">Sign Up</h2>
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
    );
  }
}
