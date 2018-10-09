import React, { Component } from 'react';
import * as signalR from '@aspnet/signalr';

class App extends Component {
  state = {
    con: new signalR.HubConnectionBuilder().withUrl('/chathub').build(),
    chat: [],
    currentChat: {
      username: '',
      message: ''
    }
  };

  inputRef = React.createRef();

  componentDidMount() {
    this.state.con.on('UpdateMessages', (username, message) => {
      this.setState(({ chat }) => ({ chat: [...chat, { username, message }] }));
    });

    this.state.con.start().catch(e => alert(e));

    this.inputRef.current.focus();
  }

  invokeChat = e => {
    e.preventDefault();

    const { username, message } = this.state.currentChat;

    if (!message.trim()) return;

    this.state.con
      .invoke('SendMessage', username, message)
      .then(() =>
        this.setState({
          currentChat: { ...this.state.currentChat, message: '' }
        })
      )
      .catch(err => alert(err));
  };

  render() {
    const { chat, currentChat } = this.state;

    return (
      <>
        <div>
          <input
            placeholder="Username"
            value={currentChat.username}
            onChange={e =>
              this.setState({
                currentChat: { ...currentChat, username: e.target.value }
              })
            }
          />
          <form onSubmit={this.invokeChat}>
            <input
              ref={this.inputRef}
              placeholder="Message"
              value={currentChat.message}
              onChange={e =>
                this.setState({
                  currentChat: { ...currentChat, message: e.target.value }
                })
              }
            />
            <button type="submit">Chat</button>
          </form>
        </div>
        <div>
          {chat.map((item, i) => (
            <div key={i}>
              {item.message}{' '}
              <small style={{ color: 'lightgray' }}>
                From: {item.username}
              </small>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default App;
