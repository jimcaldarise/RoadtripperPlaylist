import React from 'react';
import './SearchBar.css';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

class SearchBar extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         term: '',
         lat: null,
         long: null,
         cityName: null,
         stateName: null
      };

      this.search = this.search.bind(this);
      this.handleTermChange = this.handleTermChange.bind(this);
      this.getLocation = this.getLocation.bind(this);
      this.getCoordinates = this.getCoordinates.bind(this);
      this.getCityState = this.getCityState.bind(this);
      this.searchCity = this.searchCity.bind(this);
      this.searchState = this.searchState.bind(this);
   }

   search() {
      this.props.onSearch(this.state.term);
   }

   handleTermChange(event) {
      this.setState({term: event.target.value});
   }

   getLocation() {
      if("geolocation" in navigator) {
         navigator.geolocation.getCurrentPosition(this.getCoordinates);
      } else {
         alert("Geolocation Not Available");
      }
   }

   getCoordinates(position) {
      this.setState({
         lat: position.coords.latitude,
         long: position.coords.longitude
      })
      this.getCityState()
   }

   getCityState(position) {
      const data = {
         method: 'GET',
         url: 'http://localhost:80/'
      }

      if(data.results[0]) {
         var components = data.results[0].address_components;

         for(var component=0; component<(components.length); component++) {
            if(components[component].types[0]==='administrative_area_level_1') {
               this.setState({stateName: components[component].long_name
               })
            }
            if(components[component].types[0]==='locality') {
               this.setState({cityName: components[component].long_name
               })
            }
         }
      }
   }

   searchCity(event) {
      this.setState({term: this.state.cityName});
      this.props.onSearch(this.state.cityName);
   }

   searchState(event) {
      this.setState({term: this.state.stateName});
      this.props.onSearch(this.state.stateName);
   }

   handleLocationError(error) {
      switch(error.code) {
         case error.PERMISSION_DENIED:
            alert("User denied request for Geolocation.")
            break;
         case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
         case error.TIMEOUT:
            alert("Request for user location timed out.")
            break;
         case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
         default:
            alert("An unknown error occurred.")
      }
   }

   render() {
      return(
         <div className='mainContainer'>
            <div className='mapContainer'>
               <div className='FindButtonContainer'>
                  <button className='SearchButton' onClick={this.getLocation}>FIND ME!</button> 
               </div>
               {
                  this.state.lat && this.state.long ?
                  <div className='map'>
                     <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.lat},${this.state.long}&zoom=12&size=400x400&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`} alt="map of current location"/>
                     <div className='Buttons'>
                        <button className="SearchButton" onClick={this.searchCity}>USE CURRENT CITY</button>
                        <button className="SearchButton" onClick={this.searchState}>USE CURRENT STATE</button>
                     </div>
                  </div>
                  :
                  null
               }
            </div>
            <div className="SearchBar">
               <input value={this.props.term} onChange={this.handleTermChange} placeholder="Enter a Location" />
               <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
         </div>
      );
   }
}

export default SearchBar;