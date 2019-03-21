import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { MdSkipNext } from 'react-icons/md';
import { removeSong } from '../../actions/QueueActions';

export class NowPlaying extends Component {
  // handler for skipping the song
  skipSong = songId => {
    this.props.removeSong(songId);
  };

  render() {
    return (
      <div>
        {this.props.queue && this.props.queue.length > 0 && (
          <ListGroup className="now-playing mb-4">
            <h4>Now Playing:</h4>
            <ListGroupItem className="song">
              <span>{this.props.queue[0].title}</span>
              <div className="float-right">
                <span>{this.props.queue[0].currentVote}</span>

                <Button className="ml-3" color="secondary" onClick={() => this.skipSong(this.props.queue[0]._id)}>
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
    queue: state.queueReducer.queue
  };
};

const mapDispatchToProps = dispatch => ({
  removeSong: songId => dispatch(removeSong(songId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NowPlaying);
