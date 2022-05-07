import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';

export default class Adress extends Component {
	constructor(props){
		super(props);
		this.state = {
			tel: false,
			town: false,
			streetName: false,
			streetNumber: false,
			houseNumber: false,
			floor: false,
			entry: false,
			zip: false,
			polygons: [],
			neib: [],
			telError: false,
			streetNumberError: false,
			houseNumberError: false,
			floorError: false,
			zipError: false,
			lat: false,
			lng: false
		}
		this.initAPI = this.initAPI.bind(this);
		this.setLocation = this.setLocation.bind(this);
		this.loadApi = this.loadApi.bind(this);
		this.continue = this.continue.bind(this);
		this.getPolygons = this.getPolygons.bind(this);
		this.setError = this.setError.bind(this);
		this.mobileFix = this.mobileFix.bind(this);
	}
	componentWillMount(){
		if (typeof google == 'undefined') {
			const script = document.createElement("script");
	        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAmSz5YciOiq-rPQ9Pjy3ntdfB60Swex_s&libraries=places,geometry&language=he-IL";
	        script.async = true;
			script.defer = true;
			script.onload = this.loadApi();
	        document.body.appendChild(script);
		} else {
			this.loadApi();
		}
		this.getPolygons();
	}
	componentDidMount(){
		$('body').addClass('fix');
		$('#root').addClass('blur');
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('#root').removeClass('blur');
	}
	mobileFix(e){
		e.target.blur();
		setTimeout(() => { $('#pac-input').focus() }, 100);
	}
	setError(){
		!this.state.tel ? this.setState({telError : true}) : null;
		!this.state.streetNumber ? this.setState({streetNumberError : true}) : null;
		!this.state.houseNumber ? this.setState({houseNumberError : true}) : null;
		!this.state.floor ? this.setState({floorError : true}) : null;
		!this.state.zip ? this.setState({zipError : true}) : null;
	}
	getPolygons(){
		$.ajax({
			url: globalServer + 'new-api/polygon_view.php',
			type: 'POST'
		}).done(function(data) {
			let polygons = data.Polygons;
			polygons.map((item) => {
				item.Coord = JSON.parse(item.Coord)
			});
			this.setState({polygons});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	continue(){
		let address = this.props.state.address;
		let id = [0];
		address.map((item) => {id.push(item.id)});
		let newId = Math.max(...id);
		let completeAdress = [];
		completeAdress.push("רחוב:" + this.state.streetName);
		completeAdress.push("מס:" + this.state.streetNumber);
		completeAdress.push("דירה:" + this.state.houseNumber);
		completeAdress.push("קומה:" + this.state.floor);
		completeAdress.push("כניסה:" + this.state.entry);
		let newAddress = {
			id: newId + 1,
      polygonId: this.state.neib[0].Id,
			tel: this.state.tel,
			town: this.state.town,
			streetName: this.state.streetName,
			streetNumber: this.state.streetNumber,
			houseNumber: this.state.houseNumber,
			floor: this.state.floor,
			entry: this.state.entry ? this.state.entry : '',
			lat: this.state.lat,
			lng: this.state.lng,
			address: completeAdress.join(','),
			zip: this.state.zip
		};
		address.push(newAddress);
		let val = {
			sess_id: localStorage.session_id,
			token: localStorage.token,
			UserId: localStorage.userId,
			paramName: 'Address1',
			val: JSON.stringify(address)
		};
		this.props.pushAddress(JSON.parse(val.val));
	}
	setLocation(place){
		let neib = [];
		let exist = false;
		let coord = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
		this.state.polygons.map((item) => {
			let opts = {
				paths: item.Coord,
				strokeColor: '#ff0000',
				strokeOpacity: 0.8,
				strokeWeight: 3,
				fillColor: '#ff0000',
				fillOpacity: 0.2
			}
			let newPolygon = new google.maps.Polygon(opts);
			exist = google.maps.geometry.poly.containsLocation(coord, newPolygon);
			exist ? neib.push(item) : null;
		});
		if (neib.length) {
			this.setState({neib});
			if (window.innerWidth < 900) {
				setTimeout(() => {
					var element = document.getElementById("details");
					element.scrollIntoView({behavior: "smooth"});
				}, 500);
			}
			if (place.address_components.length == 5) {
				this.setState({
					streetName: place.address_components[0].long_name,
					town: place.address_components[1].long_name,
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng()
				});
			}
			if (place.address_components.length == 6) {
				this.setState({
					streetName: place.address_components[1].long_name,
					streetNumber: place.address_components[0].long_name,
					town: place.address_components[2].long_name,
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng()
				});
			}
			if (place.address_components.length < 5) {
				SweetAlert({
					title: 'אנא הזינו את שם הרחוב ועיר המגורים',
					type: 'error',
					showConfirmButton: false,
					timer: 4000
				}).catch(SweetAlert.noop);
			}
		} else {
			SweetAlert({
				title: 'אופס',
				text: 'איננו מבצעים משלוחים לאיזור זה. עמכם הסליחה.',
				type: 'error',
				showConfirmButton: false,
				timer: 4000
			}).catch(SweetAlert.noop);
		}

	}
	loadApi(){
		setTimeout(() => { this.initAPI() }, 1000);
	}
	initAPI(){
		var map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 32.3354702, lng: 34.7723849},
			zoom: 9,
			mapTypeId: 'roadmap'
		});
		var input = document.getElementById('pac-input');
		var card = document.getElementById('pac-card');

		var options = {
			componentRestrictions: {country: "IL"}
		};

		//var autocomplete = new google.maps.places.Autocomplete(input, {types: ['address']});
		var autocomplete = new google.maps.places.Autocomplete(input, options);
		autocomplete.setComponentRestrictions({'country': ['IL']});
		var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
        	map: map,
	        anchorPoint: new google.maps.Point(0, -29)
        });

		autocomplete.addListener('place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				window.alert("No details available for input: '" + place.name + "'");
				return;
			}
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				    (place.address_components[0] && place.address_components[0].short_name || ''),
				    (place.address_components[1] && place.address_components[1].short_name || ''),
				    (place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindowContent.children['place-icon'].src = place.icon;
			infowindowContent.children['place-name'].textContent = place.name;
			infowindowContent.children['place-address'].textContent = address;
			infowindow.open(map, marker);
			this.setLocation(place);
        }.bind(this));
	}
	render(){
		return (
			<div className="popup adress">
				<div className={this.state.town && this.state.streetName ? "popup-wrapper big flex-container animated zoomIn" : "popup-wrapper animated zoomIn" }>
					<div className="col-lg-6">
						<div className="wrapp">
							<div onClick={this.props.close} className="close-popup">
								<img src={globalFileServer + 'icons/cross-white.svg'} alt="" />
							</div>
							<div className="top">
								<h2>הוסיפו את הכתובת שלכם</h2>
							</div>
							<div className="map">
								<div className="pac-card" id="pac-card">
									<div id="pac-container">
										<input id="pac-input" type="text" placeholder="רחוב, עיר"/>
									</div>
								</div>
								<div data-tap-disabled="true" id="map"></div>
								<div id="infowindow-content">
									<img src="" width="16" height="16" id="place-icon" />
									<span id="place-name"  className="title"></span><br/>
									<span id="place-address"></span>
								</div>
							</div>
						</div>
					</div>
					{this.state.town && this.state.streetName ?
						<div id="details" className="col-lg-6 details">
							<div className="wrapp">
								<div className="top">
									<h2>פירטי קשר</h2>
								</div>
								<div className="inputs flex-container">
									<div className="wr">
										<input
											type="text"
											value={this.state.tel ? this.state.tel : ''}
											onChange={(e) => this.setState({tel: e.target.value})}
											onClick={() => this.setState({telError: false})}
											placeholder="מס' טלפון"
											id="tel"
										/>
										{this.state.streetNumberError ? <label htmlFor="">!</label> : null}
									</div>
									<div className="wr">
										<input
											type="text"
											value={this.state.town ? this.state.town : ''}
											onChange={(e) => this.setState({town: e.target.value})}
											placeholder="עיר"
										/>
									</div>
									<div className="wr">
										<input
											type="text"
											value={this.state.streetName ? this.state.streetName : ''}
											onChange={(e) => this.setState({streetName: e.target.value})}
											placeholder="רחוב"
										/>
									</div>
									<div className="wr">
										<input
											type="text"
											value={this.state.streetNumber ? this.state.streetNumber : ''}
											onChange={(e) => this.setState({streetNumber: e.target.value})}
											onClick={() => this.setState({streetNumberError: false})}
											placeholder="מס' בית"
											id="streetNumber"
										/>
										{this.state.streetNumberError ? <label htmlFor="">!</label> : null}
									</div>
									<div className="wr">
										<input
											type="text"
											value={this.state.houseNumber ? this.state.houseNumber : ''}
											onChange={(e) => this.setState({houseNumber: e.target.value})}
											onClick={() => this.setState({houseNumberError: false})}
											placeholder="מס' דירה"
											id="houseNumber"
										/>
										{this.state.houseNumberError ? <label htmlFor="">!</label> : null}
									</div>
									<div className="wr">
										<input
											type="text"
											value={this.state.floor ? this.state.floor : ''}
											onChange={(e) => this.setState({floor: e.target.value})}
											onClick={() => this.setState({floorError: false})}
											placeholder="קומה"
											id="floor"
										/>
										{this.state.floorError ? <label htmlFor="">!</label> : null}
									</div>
									<div className="wr">
										<input
											type="text"
											value={this.state.entry ? this.state.entry : ''}
											onChange={(e) => this.setState({entry: e.target.value})}
											placeholder="כניסה"
										/>
									</div>
									<div className="wr">
										<input
											type="text"
											value={this.state.zip ? this.state.zip : ''}
											onClick={() => this.setState({zipError: false})}
											onChange={(e) => this.setState({zip: e.target.value})}
											placeholder="מיקוד"
										/>
										{this.state.zipError ? <label htmlFor="">!</label> : null}
									</div>
								</div>
								<ul className="accept">
									<li>
										<button onClick={this.state.tel && this.state.zip && this.state.streetNumber && this.state.houseNumber && this.state.floor ? this.continue : this.setError}>המשך</button>
									</li>
								</ul>
							</div>
						</div>
					: null}
				</div>
			</div>
		)
	}
}
