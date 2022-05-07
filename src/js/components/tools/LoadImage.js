import React, {Component} from 'react';
/*import CropperJS from 'react-cropperjs';*/
import Cropper from 'react-cropper';
import MyCropper from "../tools/MyCropper";

//import { Modal } from 'react-bootstrap';
import SweetAlert from 'sweetalert2';
import styles from './LoadImage.scss';

let target_img;
var date = new Date();

export default class LoadImage extends Component {
	constructor(props){
		super(props);
		this.state = {
			showModal: false,
			src: "",
			preview: '',
			fileName: '',
			cropped: false,
			preload: false,
			fileSize: false,
			mobile: false,
			popup: false
		}
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this._crop = this._crop.bind(this);
		this._onChange = this._onChange.bind(this);
		this.save = this.save.bind(this);
		this.cansel = this.cansel.bind(this);
		this.getBaseImg = this.getBaseImg.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.cameraSuccess = this.cameraSuccess.bind(this);
		this.cameraError = this.cameraError.bind(this);
		this.galleryOrCamera = this.galleryOrCamera.bind(this);
		this.openGallery = this.openGallery.bind(this);
	}
	componentDidMount(){
		window.outerWidth < 600 ? this.setState({mobile: true}) : null;
	}
	galleryOrCamera(){
		this.setState({popup: true})
	}
	openGallery() {
		this.setState({preload: true, popup: false});
		let cameraOptions = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			encodingType: Camera.EncodingType.JPEG,
			correctOrientation:true,
			saveToPhotoAlbum: true
		}
		navigator.camera.getPicture(this.cameraSuccess, this.cameraError, cameraOptions);
	}
	uploadImg(){
		this.setState({preload: true, popup: false});
		let cameraOptions = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			encodingType: Camera.EncodingType.JPEG,
			correctOrientation:true,
			saveToPhotoAlbum: true
		}
		navigator.camera.getPicture(this.cameraSuccess, this.cameraError, cameraOptions);
	}
	cameraSuccess(data){
		let src = "data:image/jpeg;base64," + data;
		var image = document.createElement('img');
		image.src = src;
		var quality = 50;
		image.onload = () => {
			var output_format = 'jpg';
			target_img = jic.compress(image,quality,output_format);
		}
		this.interval = setInterval(() => {
			if (target_img) {
				this.setState({	src:target_img.src, preview: target_img.src, preload: false });
				clearInterval(this.interval);
				target_img = "";
			}
		}, 50);
	}
	cameraError(e){}
	getBaseImg(){
		let src = globalFileServer + this.props.img;
		var x = new XMLHttpRequest();
		x.open('GET', src);
		x.responseType = 'blob';
		x.onload = function() {
			var blob = x.response;
			var fr = new FileReader();
			fr.onloadend = function() {
				this.setState({ src: fr.result });
				if (this.state.mobile) {
					var image = document.createElement('img');
					image.src = fr.result;
					var quality;
					var fileSize = this.state.fileSize;
					image.onload = () => {
						if (fileSize) {
							fileSize < 8000000 && fileSize > 1000000 ? quality = 20 : null;
							fileSize < 1000000 && fileSize > 500000 ? quality = 40 : null;
							fileSize < 500000 && fileSize > 300000 ? quality = 50 : null;
							fileSize < 300000 ? quality = 100 : null;
						} else {
							quality = 100;
						}
						var output_format = 'jpg';
						target_img = jic.compress(image,quality,output_format);
					}
					this.interval = setInterval(() => {
						if (target_img) {
							this.setState({	preview: target_img.src, cropped: true, preload: false });
							clearInterval(this.interval);
							target_img = "";
						}
					}, 50);
				}
			}.bind(this);
			fr.readAsDataURL(blob);
		}.bind(this);
		x.send();
	}
	showModal(){
		this.props.img ? this.getBaseImg() : null;
		this.setState({	showModal: true });
	}
	hideModal(){
		this.setState({	showModal: false });
	}
	_crop(){
		this.setState({preload: true});
		let preview = this.refs.cropper.getCroppedCanvas({'fillColor': '#FFFFFF'}).toDataURL('image/jpeg');
		var image = document.createElement('img');
		image.src = preview;
		var quality;
		var fileSize = this.state.fileSize;
		image.onload = () => {
			if (isAndroid) {
				quality = 40;
			} else if (fileSize) {
				fileSize < 8000000 && fileSize > 1000000 ? quality = 20 : null;
				fileSize < 1000000 && fileSize > 500000 ? quality = 40 : null;
				fileSize < 500000 && fileSize > 300000 ? quality = 50 : null;
				fileSize < 300000 ? quality = 100 : null;
			} else {
				quality = 100;
			}
			var output_format = 'jpg';
			target_img = jic.compress(image,quality,output_format);
		}
		this.interval = setInterval(() => {
			if (target_img) {
				this.setState({	preview: target_img.src, cropped: true, preload: false });
				clearInterval(this.interval);
				target_img = "";
			}
		}, 50);
	}
	_onChange(e) {
		this.setState({preload: true});
		e.preventDefault();
		let fileName = e.target.files[0].name;
		let newTime = new Date().getTime();
		let files;
		if (e.dataTransfer) {
		files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;
		}
		if (files[0].size > 8000000) {
			SweetAlert({
				title: 'הקובץ חורג מהמשקל 8 mb',
				text: 'יש לנסות להעלות קובץ שוב',
				type: 'info',
				timer: 3000,
				showConfirmButton: false
			}).catch(SweetAlert.noop);
			this.setState({preload: false});
		} else {
			let reader = new FileReader();
			reader.onload = () => {
				this.setState({
					src: reader.result,
					fileName: newTime + fileName,
					preload: false
				});
				if (this.state.mobile) {
					var image = document.createElement('img');
					image.src = reader.result;
					var quality;
					var fileSize = this.state.fileSize;
					image.onload = () => {
						if (fileSize) {
							fileSize < 8000000 && fileSize > 1000000 ? quality = 20 : null;
							fileSize < 1000000 && fileSize > 500000 ? quality = 40 : null;
							fileSize < 500000 && fileSize > 300000 ? quality = 50 : null;
							fileSize < 300000 ? quality = 100 : null;
						} else {
							quality = 100;
						}
						var output_format = 'jpg';
						target_img = jic.compress(image,quality,output_format);
					}
					this.interval = setInterval(() => {
						if (target_img) {
							this.setState({	preview: target_img.src, cropped: true, preload: false });
							clearInterval(this.interval);
							target_img = "";
						}
					}, 50);
				}
			};
			reader.readAsDataURL(files[0]);
			this.setState({	fileSize: files[0].size });
		}
	}
	save(){
		let newTime = new Date().getTime();
		let itemImg = [];
		if (!this.state.fileName) {
			itemImg = {
				Img: this.state.preview,
				fileName: newTime + '.jpg'
			}
		} else {
			itemImg = {
				Img: this.state.preview,
				fileName: this.state.fileName
			}
		}
		this.props.uploadImg(this.props.itemId, itemImg);
		this.setState({	showModal: false });
	}
	cansel(){
		this.setState({
			showModal: false,
			src: this.state.src
		});
	}

	render() {
		return (
			<div className="edit-image-wrapper">
				<div onClick={this.showModal} className="edit-image"><img src={globalFileServer + 'icons/photo-camera.png'} alt="" /></div>
				{this.props.img ? <img src={globalFileServer + this.props.img} alt="" /> : null}

				<button type="button" className="close-pop" data-dismiss="modal" aria-label="Close" onClick={this.hideModal}>
					<img src={globalFileServer + 'icons/close.svg'} alt="" />
				</button>
				{this.state.popup ? <div className="popup" id="gallery-camera">
					<div className="popup-wrapper">
						<div className="wrapp">
							<div onClick={() => this.setState({popup: false})} className="close-popup">
								<img src={globalFileServer + 'icons/cancel.png'} alt="" />
							</div>
							<div className="select flex-container">
								<div className="col-lg-6">
									<button onClick={this.uploadImg}>
										<img src={globalFileServer + 'icons/photo-camera.svg'} />
										<span>מצלמה</span>
									</button>
								</div>
								<div className="col-lg-6">
									<button onClick={this.openGallery}>
										<img src={globalFileServer + 'icons/frame-landscape.svg'} />
										<span>אלבום</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div> : null}
				<div className="modal-body">
					{this.state.preload ?
						<div className="loader-container">
							<div className="loader"></div>
						</div> : null}
					{!this.props.props.props.state.appId ?
						<div className='upload-img'>
							<input id="upload-file" type="file" className="upload" onChange={this._onChange} />
							<div className='input-masc'><span>בחר/י תמונה</span><img src={globalFileServer + 'icons/upload.png'} alt="" /></div>
						</div>
					:
					<button id="camera_upload" onClick={this.galleryOrCamera}>
						<span>בחר/י תמונה</span>
						<img src={globalFileServer + 'icons/upload.png'} />
					</button>
					}
					<div className="flex-container">
						<div className="col-lg-6 for-cropp">
              <Cropper
                src={this.state.src}
                aspectRatio={16 / 16}
                guides={false}
                checkCrossOrigin={false}
                ref='cropper'
              />
						</div>
						<div className="col-lg-6">
							<div className='image-preview'>
								<img src={this.state.preview} />
							</div>
						</div>
					</div>
					<ul className="actions">
						{!this.state.mobile || isAndroid ?
							<li><button onClick={this._crop} className="button-crop">גזור</button></li>
						:
						<li><span>אפשריות עריכה נוספות במחשב</span></li>
						}
						{this.state.cropped ?
							<li>{!this.state.preload ? <button onClick={this.save} className="button-green">שמור</button> : null}</li>
						: null}
						<li>{!this.state.preload ? <button onClick={this.cansel} className="button-red">ביטול</button> : null}</li>
					</ul>
				</div>

			</div>
		);
	}
}
