import React from 'react';
import io from 'socket.io-client';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.messageBottomRef = React.createRef();
    this.state = {
      message: '',
      chat: [],
      liveChat: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.scrollMessages = this.scrollMessages.bind(this);
  }

  componentDidMount() {
    this.params = new URLSearchParams(this.props.location.search);
    this.userId = this.params.get('userId');
    this.partnerId = this.params.get('partnerId');
    this.partnerName = this.params.get('partnerName');
    this.socket = io('/', { query: { userId: this.userId, partnerId: this.partnerId } });
    const data = JSON.parse(localStorage.getItem('userData'));
    const token = data.token;
    fetch(`/api/messages/${this.userId}/${this.partnerId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'x-access-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          chat: data
        });
      })
      .catch(() => console.error('An unexpected error occurred.'));
    this.socket.on('message', data => {
      const liveChat = [...this.state.liveChat];
      liveChat.push(data);
      this.setState({
        liveChat: liveChat
      });
    });
  }

  componentDidUpdate() {
    this.scrollMessages();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleClick() {
    this.props.history.push('/matches');
  }

  handleChange(event) {
    this.setState({
      message: event.target.value
    });
  }

  handleSend(event) {
    this.socket.emit('send-message', { message: this.state.message, userId: this.userId, partnerId: this.partnerId });
    this.setState({ message: '' });
  }

  scrollMessages() {
    this.messageBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const messages = this.state.chat;
    const userId = parseInt(this.userId);
    const liveChat = this.state.liveChat;

    return (
      <>
        <button className="ui icon button basic message-button" onClick={this.handleClick}>
          <i className="angle left icon"></i>
        </button>
        <h3 className="secondary-header message-header">{this.partnerName}</h3>
        <div className="ui divider message-divider"></div>
        <div className="ui grid two columns message-container">
          { messages.map((message, index) =>
            message.userId === userId
              ? <React.Fragment key={message.messageId}>
                  <div className="row blue-message-right" >
                    <div className="ui compact blue message right floated column">
                    <p>{message.messageContent}</p>
                    </div>
                  </div>
                  <div className="row date-time-container">
                    <div className="ui compact basic label mini right floated column date-time">
                      Thu Jan 14 2021 10:51:17
                    </div>
                  </div>
                </React.Fragment>
              : <React.Fragment key={message.messageId}>
                  <div className="row blue-message-left" key={message.messageId}>
                    <div className="ui compact gray message left floated column" >
                      <p>{message.messageContent}</p>
                    </div>
                  </div>
                  <div className="row left-date-time-container">
                    <div className="ui compact basic label mini left floated column date-time">
                      Thu Jan 14 2021 10:51:17
                    </div>
                  </div>
                </React.Fragment>
          )
          }
          { liveChat.map((liveMessage, index) =>
            liveMessage.senderUserId === userId
              ? <div className="row blue-message-right" key={index}>
                  <div className="ui compact blue message right floated column" >
                    <p>{liveMessage.message}</p>
                  </div>
                </div>
              : <div className="row blue-message-left" key={index}>
                  <div className="ui compact gray message left floated column" >
                    <p>{liveMessage.message}</p>
                  </div>
              </div>
          )
          }
          <div className="message-bottom" ref={this.messageBottomRef} />
        </div>
        <div className="ui fluid action input send-message ">
          <input type="text" placeholder="" value={this.state.message} onChange={this.handleChange}/>
          <button type="button" className="ui icon button blue" onClick={this.handleSend}>
            <i className="send icon "></i>
          </button>
        </div>
      </>
    );
  }
}
