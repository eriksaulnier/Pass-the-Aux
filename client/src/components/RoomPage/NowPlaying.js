import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { MdPlayArrow, MdPause, MdSkipNext } from 'react-icons/md';
import { playSong, pauseSong, skipSong } from '../../actions/PlaybackActions';

export class NowPlaying extends Component {
  // handler for skipping the current song
  skipSong = () => {
    this.props.skipSong();
  };

  render() {
    return (
      <div>
        {this.props.currentSong && (
          <ListGroup className="now-playing mb-4">
            <h4>Now Playing:</h4>
            <ListGroupItem className="song">
              <span>{this.props.currentSong.title}</span>
              <div className="float-right">
                <Button
                  color="primary"
                  onClick={
                    this.props.isPlaying
                      ? () => this.props.pauseSong(this.props.currentSong._id)
                      : () => this.props.playSong(this.props.currentSong._id)
                  }
                >
                  {this.props.isPlaying ? <MdPause size="1.4em" /> : <MdPlayArrow size="1.4em" />}
                </Button>

                <Button
                  className="ml-3"
                  color="secondary"
                  onClick={() => this.props.skipSong(this.props.currentSong._id)}
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
    isPlaying: state.playbackReducer.isPlaying
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
