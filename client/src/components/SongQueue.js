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

    // handle song input change event
    changeSong = (event) => {
        this.setState({ song: event.target.value });
    }


    // handles song actions
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
    upvoteSong = (songId) => {
        this.props.upvoteSong(songId);
    }
    downvoteSong = (songId) => {
        this.props.downvoteSong(songId);
    }

    render() {
        return (
            <div>
                <h2>Current Queue:</h2>
                <ListGroup className="song-list">
                    {this.props.queue.map((song, index) => (
                        <ListGroupItem className="song" key={index}>
                            {song.title}

                            <ButtonGroup vertical className="ml-4">
                                <Button onClick={() => this.upvoteSong(song._id)}>&#8593;</Button>
                                {song.currentVote}
                                <Button onClick={() => this.downvoteSong(song._id)}>&#8595;</Button>
                            </ButtonGroup>

                            <Button className="ml-4" color="danger" onClick={() => this.removeSong(song._id)}>&#215;</Button>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                
                <InputGroup>
                    <Input type="text" name="song" onChange={this.changeSong} value={this.state.song}/>
                    <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={this.addSong}>Add Song</Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        queue: state.roomReducer.queue
    };
};

const mapDispatchToProps = dispatch => ({
    addSong: (songTitle) => dispatch(addSong(songTitle)),
    removeSong: (songId) => dispatch(removeSong(songId)),
    upvoteSong: (songId) => dispatch(upvoteSong(songId)),
    downvoteSong: (songId) => dispatch(downvoteSong(songId))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongQueue);