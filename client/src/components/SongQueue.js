import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSong } from '../actions/QueueActions';

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

    // handles adding songs
    addSong = () => {
        this.props.addSong(this.state.song);
        this.setState({ song: '' });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h2>Current Queue:</h2>
                <ul className="song-list">
                    {this.props.queue.map((song, index) => (
                        <li className="song" key={index}>
                            {song.body}
                        </li>
                    ))}
                </ul>
                
                <input type="text" name="song" onChange={this.changeSong} value={this.state.song}/>
                <button onClick={this.addSong}>ADD SONG</button>
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
    addSong: (song) => dispatch(addSong(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongQueue);