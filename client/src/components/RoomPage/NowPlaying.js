import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem, Badge, Progress } from 'reactstrap';
import { MdPlayArrow, MdPause, MdSkipNext } from 'react-icons/md';
import { isMobile, isBrowser } from 'react-device-detect';
import { playSong, pauseSong, skipSong } from '../../actions/PlaybackActions';
import SpotifyPlayer from './SpotifyPlayer';

export class NowPlaying extends Component {
  // handler for skipping the current song
  skipSong = () => {
    // make sure the user is the room owner
    if (this.props.isRoomOwner) {
      this.props.skipSong();
    }
  };

  // toggles between play and pause actions
  togglePlaying = () => {
    // make sure the user is the room owner
    if (this.props.isRoomOwner) {
      if (this.props.isPlaying) {
        this.props.pauseSong();
      } else {
        this.props.playSong(this.props.deviceId, this.props.currentSong);
      }
    }
  };

  // returns the current progress of the track as a percent
  playbackProgressPercent = () => {
    return this.props.position ? (this.props.position / this.props.duration) * 100 : 0;
  };

  render() {
    const song = this.props.currentSong;
    return (
      <div>
        {this.props.currentSong && (
          <div>
            <h4>Now Playing:</h4>
            <ListGroup className="now-playing song-list">
              <ListGroupItem className="song">
                {song.artwork && <img className="song-art" src={song.artwork} alt={song.title} />}

                <div className="song-info">
                  <b>{song.title}</b>
                  <br />
                  {song.artist}
                  {song.explicit ? (
                    <span className="ml-2">
                      &#183;
                      <Badge className="ml-2" color="light">
                        {isMobile ? 'EXPL' : 'EXPLICIT'}
                      </Badge>
                    </span>
                  ) : null}

                  <Progress className="song-progress mt-2" value={this.playbackProgressPercent()} />
                </div>

                {this.props.isRoomOwner && (
                  <div className="song-voting">
                    <Button
                      color="primary"
                      className="btn-play"
                      onClick={this.togglePlaying}
                      disabled={!this.props.isRoomOwner}
                    >
                      {this.props.isPlaying ? <MdPause size="1.4em" /> : <MdPlayArrow size="1.4em" />}
                    </Button>

                    <Button color="secondary" className="btn-skip" onClick={this.skipSong}>
                      <MdSkipNext size="1.4em" />
                    </Button>
                  </div>
                )}
              </ListGroupItem>
            </ListGroup>
          </div>
        )}

        {this.props.isRoomOwner && isBrowser && <SpotifyPlayer />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentSong: state.playbackReducer.currentSong,
    isPlaying: state.playbackReducer.isPlaying,
    duration: state.playbackReducer.duration,
    position: state.playbackReducer.position,
    deviceId: state.spotifyReducer.deviceId,
    isRoomOwner: state.spotifyReducer.isRoomOwner
  };
};

const mapDispatchToProps = dispatch => ({
  playSong: (deviceId, currentSong) => dispatch(playSong(deviceId, currentSong)),
  pauseSong: () => dispatch(pauseSong()),
  skipSong: () => dispatch(skipSong())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NowPlaying);
