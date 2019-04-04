import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { MdPlayArrow, MdPause, MdSkipNext } from 'react-icons/md';
import { playSong, pauseSong, skipSong } from '../../actions/PlaybackActions';
import Authenticate from '../../utils/Auth';

export class NowPlaying extends Component {
  // handler for skipping the current song
  skipSong = () => {
    this.props.skipSong();
  };

  // checks if the current user is owner
  isOwner = () => {
    return Authenticate(this.props.ownerId);
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
                <br />
                {song.artist}
              </div>

              <div className="song-voting">
                <Button
                  color="primary"
                  className="btn-play"
                  onClick={
                    this.props.isPlaying && this.isOwner()
                      ? () => this.props.pauseSong(this.props.currentSong._id)
                      : () => this.props.playSong(this.props.currentSong._id)
                  }
                >
                  {this.props.isPlaying ? <MdPause size="1.4em" /> : <MdPlayArrow size="1.4em" />}
                </Button>

                <Button
                  className="ml-3"
                  color="secondary"
                  onClick={this.isOwner() ? () => this.props.skipSong(this.props.currentSong._id) : null}
                >
                  <MdSkipNext size="1.4em" />
                </Button>
              </div>
            </ListGroupItem>
          </ListGroup>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentSong: state.playbackReducer.currentSong,
    isPlaying: state.playbackReducer.isPlaying,
    ownerId: state.roomReducer.ownerId
  };
};

const mapDispatchToProps = dispatch => ({
  playSong: songId => dispatch(playSong(songId)),
  pauseSong: songId => dispatch(pauseSong(songId)),
  skipSong: songId => dispatch(skipSong(songId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NowPlaying);
