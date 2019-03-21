import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, ListGroup, ListGroupItem } from 'reactstrap';
import { removeSong, voteSong } from '../../actions/QueueActions';

export class SongQueue extends Component {
  // returns the song's current vote (-1 or 1)
  getSongVote = songId => {
    return this.props.votes[songId];
  };

  // handler for removing songs
  removeSong = songId => {
    this.props.removeSong(songId);
  };

  // handler for upvoting songs
  upvoteSong = songId => {
    // if the song has not been voted on, do a normal upvote
    if (!this.getSongVote(songId)) {
      this.props.voteSong(songId, 1);
    }

    // if the song has been downvoted, do an upvote and cancel out the old vote
    else if (this.getSongVote(songId) < 0) {
      this.props.voteSong(songId, 2);
    }
  };

  // handler for downvoting songs
  downvoteSong = songId => {
    // if the song has not been voted on, do a normal upvote
    if (!this.getSongVote(songId)) {
      this.props.voteSong(songId, -1);
    }

    // if the song has been upvoted, do a downvote and cancel out the old vote
    else if (this.getSongVote(songId) > 0) {
      this.props.voteSong(songId, -2);
    }
  };

  render() {
    return (
      <div>
        <h3>Queue:</h3>
        {this.props.queue && (
          <ListGroup className="song-list">
            {this.props.queue.map(song => (
              <ListGroupItem className="song" key={song._id}>
                <span>{song.title}</span>
                <div className="float-right">
                  <span>{song.currentVote}</span>
                  <ButtonGroup className="ml-2" vertical>
                    <Button
                      color={this.getSongVote(song._id) > 0 ? 'success' : 'secondary'}
                      onClick={() => this.upvoteSong(song._id)}
                    >
                      &#8593;
                    </Button>
                    <Button
                      color={this.getSongVote(song._id) < 0 ? 'danger' : 'secondary'}
                      onClick={() => this.downvoteSong(song._id)}
                    >
                      &#8595;
                    </Button>
                  </ButtonGroup>
                  <Button className="ml-3" color="danger" onClick={() => this.removeSong(song._id)}>
                    &#215;
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    queue: state.queueReducer.queue,
    votes: state.queueReducer.votes
  };
};

const mapDispatchToProps = dispatch => ({
  removeSong: songId => dispatch(removeSong(songId)),
  voteSong: (songId, vote) => dispatch(voteSong(songId, vote))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongQueue);
