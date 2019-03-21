import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSong, removeSong, voteSong, resetQueue } from '../actions/QueueActions';
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
        // if the song has not been voted on, do a normal upvote
        if (!this.getSongVote(songId)) {
            this.props.voteSong(songId, 1);
        }
        
        // if the song has been downvoted, do an upvote and cancel out the old vote
        else if (this.getSongVote(songId) < 0) {
            this.props.voteSong(songId, 2)
        }
    }
    downvoteSong = (songId) => {
        // if the song has not been voted on, do a normal upvote
        if (!this.getSongVote(songId)) {
            this.props.voteSong(songId, -1);
        }
        
        // if the song has been upvoted, do a downvote and cancel out the old vote
        else if (this.getSongVote(songId) > 0) {
            this.props.voteSong(songId, -2)
        }
    }

    resetQueue = () => {
        //console.log('SongQueue');
        this.props.resetQueue();
        this.setState({queue: []});
    }

    render() {
        return (
            <div>
                <InputGroup className="mb-3">
                    <Input type="text" name="song" onChange={this.changeSong} value={this.state.song}/>
                    <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={this.addSong}>Add Song</Button>
                        <Button className ="ml-3" color="danger" onClick={this.resetQueue}>Reset Queue</Button>

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
                                        <Button color={this.getSongVote(song._id) > 0 ? 'success' : 'secondary'} 
                                                onClick={() => this.upvoteSong(song._id)}>&#8593;</Button>
                                        <Button color={this.getSongVote(song._id) < 0 ? 'danger' : 'secondary'} 
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
    voteSong: (songId, vote) => dispatch(voteSong(songId, vote)),
    resetQueue: () => dispatch(resetQueue())
});

export default connect(mapStateToProps, mapDispatchToProps)(SongQueue);