import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { addSong } from '../../actions/QueueActions';
import { searchSongs, refreshToken } from '../../actions/SpotifyActions';

export class AddSong extends Component {
  constructor(props) {
    super(props);

    // TODO: this is temporary
    this.props.refreshToken();

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
      this.props.searchSongs(this.state.query, this.props.accessToken);

      // make sure the suggestion dropdown is visible
      if (!this.state.displayResults) {
        this.setState(() => ({
          displayResults: true
        }));
      }
    }
  };

  // handler for adding songs
  handleSubmit = songData => {
    // check to make sure song data is provided
    if (!songData) {
      console.log('You must select a song!');
    }

    console.log(songData);

    // submit the niew song to the queue
    this.props.addSong({
      title: songData.name,
      artist: songData.artists[0] ? songData.artists[0].name : null,
      artwork: songData.album ? songData.album.images[0].url : null,
      uri: songData.uri
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
        {this.props.searchResults.length > 0 && this.state.query.length > 0 && (
          <Dropdown isOpen={this.state.displayResults} toggle={() => {}}>
            <DropdownToggle className="song-dropdown-toggle" disabled />
            <DropdownMenu className="song-dropdown-menu">
              {this.props.searchResults.map(song => (
                <DropdownItem key={song.id} onClick={() => this.handleSubmit(song)}>
                  <b>{song.name}</b>
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
    accessToken: state.spotifyReducer.accessToken,
    searchResults: state.spotifyReducer.searchResults
  };
};

const mapDispatchToProps = dispatch => ({
  addSong: songTitle => dispatch(addSong(songTitle)),
  searchSongs: (query, token) => dispatch(searchSongs(query, token)),
  refreshToken: () => dispatch(refreshToken())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSong);
