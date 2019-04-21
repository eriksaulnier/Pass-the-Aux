import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem, Badge, Progress } from 'reactstrap';
import { MdPlayArrow, MdPause, MdSkipNext } from 'react-icons/md';
import { playSong, pauseSong, skipSong } from '../../actions/PlaybackActions';
import SpotifyPlayer from './SpotifyPlayer';

export class NowPlaying extends Component {
  // handler for skipping the current song
  skipSong = () => {
    // make sure the user is the room owner
    if (this.isOwner()) {
      this.props.skipSong();
      console.log('skipping');
    }
  };

  // toggles between play and pause actions
  togglePlaying = () => {
    // make sure the user is the room owner
    if (this.isOwner()) {
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

  // checks if the current user is owner
  isOwner = () => {
    return this.props.userId === this.props.ownerId;
  };

  render() {
    const song = this.props.currentSong;
    return (
      <div>
        {this.props.currentSong && (
          <ListGroup className="now-playing song-list mb-4">
            <h4>Now Playing:</h4>
            <ListGroupItem className="song">
              {song.artwork && <img className="song-art mr-2" src={song.artwork} alt={song.title} />}

              <div className="song-info">
                <b>{song.title}</b>
                {song.explicit ? (
                  <Badge className="ml-2" color="dark">
                    EXPLICIT
                  </Badge>
                ) : null}
                <br />
                {song.artist}

                <Progress className="song-progress mt-2" value={this.playbackProgressPercent()} />
              </div>

              <div className="song-voting">
                <Button color="primary" className="btn-play" onClick={this.togglePlaying} disabled={!this.isOwner()}>
                  {this.props.isPlaying ? <MdPause size="1.4em" /> : <MdPlayArrow size="1.4em" />}
                </Button>

                <Button className="ml-3" color="secondary" onClick={this.skipSong}>
                  <MdSkipNext size="1.4em" />
                </Button>
              </div>
            </ListGroupItem>
          </ListGroup>
        )}

        {this.isOwner() && <SpotifyPlayer />}
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
    ownerId: state.roomReducer.ownerId,
    userId: state.spotifyReducer.userId,
    deviceId: state.spotifyReducer.deviceId
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
