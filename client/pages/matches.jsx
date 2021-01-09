import React from 'react';
import AppContext from './app-context';

export default class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const userId = this.context.user.userId;
    const token = this.context.token;
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

  handleClick(event) {
    const params = new URLSearchParams();
    params.append('userId', this.state.userId);
    params.append('partnerId', event.target.id);
    this.props.history.push('/messages?' + params);
  }

  render() {
    return (
      <div className="ui grid celled">
        <div className="seven wide column matches-container">
          <h2 className="secondary-header">Matches</h2>
          <div className="ui middle aligned celled list">
            {this.state.matches
              ? this.state.matches.map(match =>
                  <div className="item" key={match.userId}>
                    <img className="ui avatar image" src={match.profileImage} />
                    <div className="content">
                      <div className="header">{match.firstName}</div>
                    </div>
                    <div className="right floated content">
                      <button type="button" id={match.userId} onClick={this.handleClick} className="ui icon button basic message-button">
                          <i className="comments alternate icon" id={match.userId}/>
                      </button>
                    </div>
                  </div>
                )
              : <></>
            }
          </div>
        </div>
        <div className="nine wide column">
          <h2 className="secondary-header">Activities</h2>
          <div className="ui divider"></div>
          <div className="ui middle aligned list">
            {this.state.activities
              ? this.state.activities.map(activity =>
                <div key={activity.activityId}>
                  <div className="item">
                    <div className="content">
                      <div className="header">{activity.label} with {activity.firstName}</div>
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
              : <></>
            }
          </div>
        </div>
      </div>
    );
  }
}
Matches.contextType = AppContext;
