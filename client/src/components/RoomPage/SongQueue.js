import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdClose } from 'react-icons/md';
import { removeSong, voteSong } from '../../actions/QueueActions';
import AuthGuard from '../../guards/AuthGuard';

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
                </div>

                <div className="song-voting">
                  <span>{song.currentVote}</span>
                  <ButtonGroup className="ml-2" vertical>
                    <Button
                      color={this.getSongVote(song._id) > 0 ? 'success' : 'secondary'}
                      onClick={() => this.upvoteSong(song._id)}
                    >
                      <MdKeyboardArrowUp size="1.5em" />
                    </Button>
                    <Button
                      color={this.getSongVote(song._id) < 0 ? 'danger' : 'secondary'}
                      onClick={() => this.downvoteSong(song._id)}
                    >
                      <MdKeyboardArrowDown size="1.5em" />
                    </Button>
                  </ButtonGroup>
                  <AuthGuard>
                    <Button className="ml-3" color="danger" onClick={() => this.removeSong(song._id)}>
                      <MdClose size="1.2em" />
                    </Button>
                  </AuthGuard>
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
