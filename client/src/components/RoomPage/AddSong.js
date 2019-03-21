import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { addSong } from '../../actions/QueueActions';

export class AddSong extends Component {
  constructor(props) {
    super(props);

    // initialize component state
    this.state = { song: '' };
  }

  // handle song input change event
  changeSong = event => {
    this.setState({ song: event.target.value });
  };

  // handler for adding songs
  addSong = () => {
    // check to make sure a song is provided
    if (!this.state.song) {
      console.log('You must enter a song title!');
      return;
    }

    this.props.addSong(this.state.song);
    this.setState({ song: '' });
  };

  render() {
    return (
      <InputGroup className="mb-3">
        <Input type="text" name="song" onChange={this.changeSong} value={this.state.song} />
        <InputGroupAddon addonType="append">
          <Button color="primary" onClick={this.addSong}>
            Add Song
          </Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addSong: songTitle => dispatch(addSong(songTitle))
});

export default connect(
  null,
  mapDispatchToProps
)(AddSong);
