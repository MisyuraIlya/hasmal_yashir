import React, {Component} from 'react';
import Cropper from 'react-cropper';
//import { Modal } from 'react-bootstrap';
import SweetAlert from 'sweetalert2';

import styles from './LoadImage.scss';

let target_img;

export default class LoadChatImage extends Component {
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
		this.popupOnLoad = this.popupOnLoad.bind(this);
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
	showModal(){
		this.setState({	showModal: true });
	}
	popupOnLoad(){
		$('#upload-file-add').trigger('click');
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
				<div onClick={this.showModal} className="edit-image"><img src={globalFileServer + 'icons/attach.svg'} alt="" /></div>

				<button type="button" className="close-pop" data-dismiss="modal" aria-label="Close" onClick={this.hideModal}>
					<img src={globalFileServer + 'icons/close.png'} alt="" />
				</button>
				<div className="modal-body">
					{this.state.preload ?
						<div className="loader-container">
							<div className="loader"></div>
						</div> : null}
					{!isAndroid ?
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
					{/*<div className='upload-img'>
							<input id="upload-file-add" type="file" className="upload" onChange={this._onChange} />
							<div className='input-masc'><span>בחר/י תמונה</span><img src={globalFileServer + 'icons/upload.png'} alt="" /></div>
					</div>*/}
					<div className="flex-container">
						<div className="col-lg-6">
							{!this.state.mobile ?
								<Cropper
									ref='cropper'
									src={this.state.src}
									aspectRatio={this.props.ratio}
									guides={false}
									checkCrossOrigin={false}
								/>
							: <img src={this.state.preview} /> }
						</div>
						<div className="col-lg-6">
							<div className='image-preview'>
								<img src={this.state.preview} />
							</div>
						</div>
					</div>
					<ul className="actions">
						{!this.state.mobile ?
							<li><button onClick={this._crop} className="button-crop">גזור</button></li>
						:
						<li><span>אפשריות עריכה נוספות במחשב</span></li>
						}
						{this.state.cropped ?
							<li><button onClick={this.save} className="button-green">שמור</button></li>
						: null}
						<li><button onClick={this.cansel} className="button-red">ביטול</button></li>
					</ul>
				</div>

			</div>
		);
	}
}
