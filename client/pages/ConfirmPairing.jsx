import React from 'react';
import { Redirect } from 'react-router';

export default class ConfirmPairing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      result: null
    };
    this.handleAccept = this.handleAccept.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActivityCreation = this.handleActivityCreation.bind(this);
  }

  componentDidMount() {
    const data = JSON.parse(localStorage.getItem('userData'));
    const userId = data.user.userId;
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const fields = ['city', 'neighborhood', 'state', 'date', 'activityType', 'preferredActivity'];
    const formData = { userId: userId };
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = params.get(field);
      formData[field] = value;
    }
    this.setState({
      city: formData.city,
      neighborhood: formData.neighborhood,
      state: formData.state,
      date: formData.date,
      preferredActivity: formData.preferredActivity,
      userId: formData.userId,
      activityType: formData.activityType
    }, () => this.handleSubmit());
  }

  handleSubmit() {
    const formData = this.state;
    const savedUserDataJson = localStorage.getItem('userData');
    let savedUserData = null;
    let token = null;
    if (savedUserDataJson !== null) {
      savedUserData = JSON.parse(savedUserDataJson);
      token = savedUserData.token;
    }
    fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.activityObject && !data.responseLocation) {
          this.setState({
            isLoading: false,
            activityObject: data.activityObject,
            externalGoogleMapsUrl: data.activityObject.externalGoogleMapsUrl,
            activityFound: true,
            activityType: data.activityType
          });
        } else if (data.responseLocation) {
          this.setState({
            isLoading: false,
            responseLocation: data.responseLocation,
            externalGoogleMapsUrl: data.mapUrl,
            googlePlacesLink: data.googlePlacesLink,
            activityFound: true,
            activityType: data.activityType
          });
        } else {
          this.setState({
            isLoading: false,
            activityFound: false
          });
        }
      })
      .catch(() => console.error('An unexpected error occurred'));
  }

  handleAccept() {
    // modal should appear, which when clicked runs handleActivityCreation()
    this.handleActivityCreation();
  }

  handleActivityCreation() {
    const formData = this.state;
    const savedUserDataJson = localStorage.getItem('userData');
    let savedUserData = null;
    let token = null;
    if (savedUserDataJson !== null) {
      savedUserData = JSON.parse(savedUserDataJson);
      token = savedUserData.token;
    }
    if (this.state.responseLocation) {
      fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => this.setState({ result: data }))
        .then(() => {
          const params = new URLSearchParams();
          params.append('userId', this.state.userId);
          this.props.history.push('/matches?' + params);
        })
        .catch(() => console.error('An unexpected error occurred'));
    } else if (this.state.activityObject) {
      fetch(`/api/activities/${this.state.activityObject.activityId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => this.setState({ result: data }))
        .then(() => {
          const params = new URLSearchParams();
          params.append('userId', this.state.userId);
          this.props.history.push('/matches?' + params);
        })
        .catch(() => console.error('An unexpected error occurred'));
    }
  }

  getName() {
    let name = 'Another User';
    if (this.state.activityObject) {
      name = this.state.activityObject.firstName;
    }
    return name;
  }

  getActivityAction() {
    let activityAction = 'Eat at';
    if (this.state.activityType === 'Sports') {
      if (this.state.preferredActivity) {
        activityAction = `Play ${this.state.preferredActivity} at`;
      } else {
        activityAction = 'Play at';
      }
    } else if (this.state.activityType === 'Museum') {
      activityAction = 'Visit';
    }
    return activityAction;
  }

  getLocation() {
    let location = '';
    if (this.state.activityObject) {
      location = this.state.activityObject.location;
    } else if (this.state.responseLocation) {
      location = this.state.responseLocation.name;
    }
    return location;
  }

  getExternalGoogleMapsUrl() {
    let url = '/';
    if (this.state.activityObject) {
      url = this.state.activityObject.externalGoogleMapsUrl;
    } else if (this.state.responseLocation) {
      url = this.state.externalGoogleMapsUrl;
    }
    return url;
  }

  getDate() {
    let date = '';
    if (this.state.activityObject) {
      date = this.state.activityObject.date;
    } else if (this.state.responseLocation) {
      date = this.state.date;
    }
    return date;
  }

  getProfileImage() {
    let profileImage = 'https://semantic-ui.com/images/avatar2/large/molly.png';
    if (this.state.activityObject) {
      profileImage = this.state.activityObject.profileImage;
    }
    return profileImage;
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <div className="ui card centered">
          <div className="ui placeholder">
            <div className="content">
              <div className="ui placeholder">
                <div className="square image"></div>
                <div className="ui active inverted dimmer">
                  <div className="ui massive text loader">Loading</div>
                </div>
                <div className="header">
                  <div className="line"></div>
                </div>
                <div className="paragraph">
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
                <div className="paragraph">
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (!this.state.activityObject && !this.state.responseLocation && this.state.isLoading === false && !this.state.activityType) {
      return <Redirect to={ '/random/select' + this.props.location.search + '&error=true'} />;
    } else if (!this.state.activityObject && !this.state.responseLocation && this.state.isLoading === false) {
      return <Redirect to={ '/pairing/select' + this.props.location.search + '&error=true'} />;
    }
    const activity = this.state.activityType;
    const name = this.getName();
    const activityAction = this.getActivityAction();
    const locationName = this.getLocation();
    const externalGoogleMapsUrl = this.getExternalGoogleMapsUrl();
    const date = this.getDate();
    const profileImage = this.getProfileImage();
    return (
      <>
        <div className="ui active modal">
          <div className="header">Header</div>
          <div className="content">
            <p></p>
          </div>
          <div className="actions">
            <div className="ui approve button">Approve</div>
            <div className="ui button">Neutral</div>
            <div className="ui cancel button">Cancel</div>
          </div>
        </div>
        <div className="ui card centered">
          <div className="image">
            <img src={profileImage} />
          </div>
          <div className="content">
            <div className="header">{activity} with {name}</div>
            <div className="description">
              {activityAction} <a href={externalGoogleMapsUrl} rel="noreferrer" target="_blank">{locationName}</a> with <span className="name-text">{name}</span> on {date} at 1PM.
            </div>
          </div>
          <div className="extra content">
            <div className='ui two buttons'>
              <button className="ui primary button" type="button" onClick={this.handleAccept}>
                Accept
              </button>
              <button className="ui red button" type="button" onClick={this.handleSubmit}>
                Reject
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
