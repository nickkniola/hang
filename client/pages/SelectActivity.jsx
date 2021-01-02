import React from 'react';

export default class SelectActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      neighborhood: '',
      state: '',
      date: '',
      activityType: '',
      preferredActivity: '',
      responseLocation: '',
      externalGoogleMapsUrl: '',
      activityObject: '',
      activeView: 'Pairing',
      userId: 2,
      acceptedActivityObject: '',
      activityFound: true,
      isLoading: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const fields = ['city', 'neighborhood', 'state', 'date', 'activityType', 'preferredActivity'];
    const params = new URLSearchParams();
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = this.state[field];
      params.append(field, value);
    }
    const url = '/pairing/confirm?' + params;
    this.props.history.push(url);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const error = params.get('error');
    const fields = ['city', 'neighborhood', 'state', 'date', 'activityType', 'preferredActivity'];
    const formData = { error: error };
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = params.get(field);
      formData[field] = value;
    }
    if (error) {
      this.setState(formData);
    }
  }

  render() {
    return (
      <div>
        { this.state.error &&
          <>
            <div className="ui red header secondary-header ">No Activity Found. Please Try Again.</div>
            <div className="ui divider"></div>
          </>
        }
        <h2 className="ui header secondary-header">
          Select Activity
        </h2>
        <div className="ui segment">
          <form className="ui form" onSubmit={this.handleSubmit}>
            <div className="two fields">
              <div className="field">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" placeholder="ex. Chicago" value={this.state.city} onChange={this.handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="neighborhood" >Neighborhood</label>
                <input type="text" name="neighborhood" id="neighborhood" placeholder="ex. Uptown" value={this.state.neighborhood} onChange={this.handleChange} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <input type="text" name="state" id="state" placeholder="ex. Illinois" value={this.state.state} onChange={this.handleChange} required/>
            </div>
            <div className="field">
              <label htmlFor="date">Date</label>
              <input type="date" name="date" id="date" placeholder="yyyy-mm-dd"
                value={this.state.date} onChange={this.handleChange}
                min="2021-01-01" max="2030-01-01" required />
            </div>
              <>
                <div className="field">
                  <label htmlFor="activityType">Activity Type</label>
                  <select type="menu" name="activityType" id="activityType" value={this.state.activityType} onChange={this.handleChange} required>
                    <option value="">Select Activity...</option>
                    <option name="food" value="Food">Food</option>
                    <option name="museum" value="Museum">Museum</option>
                    <option name="sports" value="Sports">Sports</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="preferredActivity">Preferred Activity</label>
                  <input type="text" name="preferredActivity" id="preferredActivity" placeholder="ex. Tennis" value={this.state.preferredActivity} onChange={this.handleChange} required/>
                </div>
              </>
            <button className="ui primary button" type='submit'>
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}
