import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSong, removeSong, upvoteSong, downvoteSong } from '../actions/QueueActions';
import { Button, ButtonGroup, Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem } from 'reactstrap';

export class SongQueue extends Component {
    constructor(props) {
        super(props);

        // initialize component state
        this.state = { song: '' };
    }

    // returns the song's current vote (-1 or 1)
    getSongVote(songId) {
        return this.props.votes[songId];
    }

    // handle song input change event
    changeSong = (event) => {
        this.setState({ song: event.target.value });
    }


    // handlers for adding and removing songs
    addSong = () => {
        // check to make sure a song is provided
        if (!this.state.song) {
            console.log('You must enter a song title!');
            return;
        }

        this.props.addSong(this.state.song);
        this.setState({ song: '' });
    }
    removeSong = (songId) => {
        this.props.removeSong(songId);
    }

    // handlers for upvoting and downvoting songs
    upvoteSong = (songId) => {
        // checks to make sure the song hasn't already been upvoted
        if (this.getSongVote(songId) !== 1) {
            this.props.upvoteSong(songId);
        }
    }
    downvoteSong = (songId) => {
        // checks to make sure the song hasn't already been downvoted
        if (this.getSongVote(songId) !== -1) {
            this.props.downvoteSong(songId);
        }
    }

    render() {
        return (
            <div>
                <InputGroup className="mb-3">
                    <Input type="text" name="song" onChange={this.changeSong} value={this.state.song}/>
                    <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={this.addSong}>Add Song</Button>
                    </InputGroupAddon>
                </InputGroup>

                <h3>Queue:</h3>
                {this.props.queue &&
                    <ListGroup className="song-list">
                        {this.props.queue.map((song, index) => (
                            <ListGroupItem className="song" key={index}>
                                <span>{song.title}</span>
                                <div className="float-right">
                                    <span>{song.currentVote}</span>
                                    <ButtonGroup className="ml-2" vertical>
                                        <Button color={this.getSongVote(song._id) === 1 ? 'success' : 'secondary'} 
                                                onClick={() => this.upvoteSong(song._id)}>&#8593;</Button>
                                        <Button color={this.getSongVote(song._id) === -1 ? 'danger' : 'secondary'} 
                                                onClick={() => this.downvoteSong(song._id)}>&#8595;</Button>
                                    </ButtonGroup>

                                    <Button className="ml-3" color="danger" onClick={() => this.removeSong(song._id)}>&#215;</Button>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        queue: state.queueReducer.queue,
        votes: state.queueReducer.votes
    };
};

const mapDispatchToProps = dispatch => ({
    addSong: (songTitle) => dispatch(addSong(songTitle)),
    removeSong: (songId) => dispatch(removeSong(songId)),
    upvoteSong: (songId) => dispatch(upvoteSong(songId)),
    downvoteSong: (songId) => dispatch(downvoteSong(songId))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongQueue);