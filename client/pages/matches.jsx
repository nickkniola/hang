import React from 'react';

export default class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const data = JSON.parse(localStorage.getItem('userData'));
    let userId = null;
    let token = null;
    if (data) {
      userId = data.user.userId;
      token = data.token;
      this.setState({
        userId: userId
      });
      fetch('/api/matches/' + userId, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'x-access-token': token
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            activities: data.activities,
            matches: data.matches
          });
        })
        .catch(() => console.error('An unexpected error occurred'));
    }
  }

  handleClick(event) {
    const params = new URLSearchParams();
    params.append('userId', this.state.userId);
    params.append('partnerId', event.target.id);
    const match = this.state.matches.filter(match => match.userId === parseInt(event.target.id));
    params.append('partnerName', match[0].firstName);
    this.props.history.push('/messages?' + params);
  }

  render() {
    return (
      <div className="ui grid celled matches-activities-container">
        <div className="seven wide column matches-container">
          <h2 className="secondary-header">Matches</h2>
          <div className="ui middle aligned celled list">
            {this.state.matches
              ? this.state.matches.length === 0
                  ? <> <div className="ui divider"></div>
                    <div className="ui center aligned red small header no-matches">No Matches</div> </>
                  : this.state.matches.map(match =>
                    <div className="item" key={match.userId}>
                      <img className="ui avatar image" src={match.profileImage} />
                      <div className="content">
                        <div className="header match-header">{match.firstName}</div>
                      </div>
                      <div className="right floated content">
                        <button type="button" id={match.userId} onClick={this.handleClick} className="ui icon button basic message-button">
                            <i className="comments alternate icon" id={match.userId}/>
                        </button>
                      </div>
                    </div>
                  )
              : <div className="ui active centered inline loader"></div>
            }
          </div>
        </div>
        <div className="nine wide column matches-container">
          <h2 className="secondary-header">Activities</h2>
          <div className="ui divider thin-divider"></div>
          <div className="activities-container">
            {this.state.activities
              ? this.state.activities.length === 0
                  ? <div className="ui center aligned red small header no-matches">No Activities</div>
                  : this.state.activities.map(activity =>
                    <div key={activity.activityId}>
                      <div className="item">
                        <div className="content paragraph-description">
                          <div className="header activity-header">{activity.label} with {activity.firstName}</div>
                          <div className="description">
                            {activity.label === 'Food' ? 'Eat at' : <></>}
                            {activity.label === 'Sports' ? `Play ${activity.specificActivity ? activity.specificActivity : <></>} at` : <></>}
                            {activity.label === 'Museum' ? 'Visit' : <></>}
                            <a href={activity.externalGoogleMapsUrl} rel="noreferrer" target="_blank">
                              <b> {activity.location} </b>
                            </a>
                            on {activity.date}.
                          </div>
                        </div>
                      </div>
                      <br/>
                    </div>
                  )
              : <div className="ui active centered inline loader"></div>
            }
          </div>
        </div>
      </div>
    );
  }
}
