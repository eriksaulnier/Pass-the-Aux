import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Badge } from 'reactstrap';
import * as _ from 'lodash';
import { addSong } from '../../actions/QueueActions';
import { searchSongs } from '../../actions/SpotifyActions';

export class AddSong extends Component {
  constructor(props) {
    super(props);

    // initialize component state
    this.state = {
      query: '',
      displayResults: false
    };
  }

  // handle song input change event
  handleInputChange = event => {
    this.setState({ query: event.target.value });

    if (this.state.query.length > 0) {
      _.debounce(() => {
        console.log(this.state.query);

        this.props.searchSongs(this.state.query);

        // make sure the suggestion dropdown is visible
        if (!this.state.displayResults) {
          this.setState(() => ({
            displayResults: true
          }));
        }
      }, 350)();
    }
  };

  // handler for adding songs
  handleSubmit = songData => {
    // check to make sure song data is provided
    if (!songData) {
      console.log('You must select a song!');
    }

    // submit the niew song to the queue
    this.props.addSong({
      title: songData.name,
      artist: songData.artists[0] ? songData.artists[0].name : null,
      artwork: songData.album ? songData.album.images[0].url : null,
      spotifyUri: songData.uri,
      explicit: songData.explicit
    });

    // hide the suggestion dropdown and reset input
    this.setState(() => ({
      query: '',
      displayResults: false
    }));
  };

  toggleResultsDisplay = () => {
    this.setState(prevState => ({
      displayResults: !prevState.displayResults
    }));
  };

  render() {
    return (
      <div className="search-song">
        <Input type="text" name="query" autoComplete="off" onChange={this.handleInputChange} value={this.state.query} />
        {this.props.searchResults && this.props.searchResults.length > 0 && this.state.query.length > 0 && (
          <Dropdown isOpen={this.state.displayResults} toggle={() => {}}>
            <DropdownToggle className="song-dropdown-toggle" disabled />
            <DropdownMenu className="song-dropdown-menu">
              {this.props.searchResults.map(song => (
                <DropdownItem key={song.id} onClick={() => this.handleSubmit(song)}>
                  <b>{song.name}</b>
                  {song.explicit ? (
                    <Badge className="ml-2" color="dark">
                      EXPLICIT
                    </Badge>
                  ) : null}
                  <br />
                  {song.artists[0].name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    searchResults: state.spotifyReducer.searchResults
  };
};

const mapDispatchToProps = dispatch => ({
  addSong: songTitle => dispatch(addSong(songTitle)),
  searchSongs: (query, token) => dispatch(searchSongs(query, token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSong);
