import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import { connect } from 'react-redux';

class FullScreenView extends Component {
  componentDidMount() {
    // Add an event listener that calls the close event everytime a key is pressed
    document.addEventListener('keydown', this.closeEvent, false);
  }

  componentWillUnmount() {
    // Remove the keydown event listener
    document.removeEventListener('keydown', this.closeEvent, false);
  }

  // Handles the event that a key was pressed
  closeEvent = e => {
    // Check if the key that was pressed was the escape key
    if (e.keyCode === 27) {
      // Call the close callback event that was provided by the parent
      this.props.closeCallback();
    }
  };

  render() {
    const song = this.props.currentSong;
    if (this.props.fullscreen) {
      return (
        <div className="fullscreen-view">
          <div className="fullscreen-view">
            <div className="fullscreen-bg" style={{ backgroundImage: `url(${song ? song.artwork : null})` }} />
            <div className="fullscreen-content">
              {song && (
                <div className="fullscreen-song">
                  {song.artwork && <img className="song-art" src={song.artwork} alt={song.title} />}
                  <div className="song-info">
                    <h1>
                      {song.title}
                      {song.explicit ? (
                        <Badge className="ml-2" color="dark">
                          EXPLICIT
                        </Badge>
                      ) : null}
                    </h1>
                    <h2>{song.artist}</h2>
                  </div>
                </div>
              )}
              <div className="room-info">
                Go to <b>{window.location.origin.toString()}</b> and enter the room code <Badge color="dark">{this.props.joinCode}</Badge> to add or vote on songs!
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    currentSong: state.playbackReducer.currentSong,
    joinCode: state.roomReducer.room
  };
};

export default connect(mapStateToProps)(FullScreenView);
