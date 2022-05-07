import ReactDOM from "react-dom";
import React, {Component} from 'react';
import Cropper from 'react-cropper';
import SweetAlert from 'sweetalert2';

let target_img;
var date = new Date();

export default class MyCropper extends Component {
	constructor(props){
		super(props);
		this.state = {
			croppTool: false,
			src: '',
			fileName: '',
			preview: '',
			cropped: false,
      popup:false,
      showModal: false

		}
		this._onChange = this._onChange.bind(this);
		this._crop = this._crop.bind(this);
		this._cropChange = this._cropChange.bind(this);
		this.save = this.save.bind(this);
		this.cansel = this.cansel.bind(this);
    this.uploadImg = this.uploadImg.bind(this);
    this.openGallery = this.openGallery.bind(this);
    this.galleryOrCamera = this.galleryOrCamera.bind(this);
    this.cameraSuccess = this.cameraSuccess.bind(this);
    this.cameraError = this.cameraError.bind(this);
    this.getBaseImg = this.getBaseImg.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
	}
	componentDidMount(){}
	save(){
		$('body').removeClass('fix');
		let	itemImg = {
			img: this.state.preview,
			fileName: this.state.fileName,
			itemId: this.props.itemId,
			folder: this.props.folder
		};
		this.props.dist ? itemImg.paramName = this.props.dist : null;
		this.setState({
			croppTool: false,
			src: '',
			fileName: '',
			preview: ''
		});
		this.props.uploadImg(itemImg);
	}
	cansel(){
		$('body').removeClass('fix');
		this.setState({
			croppTool: false,
			src: '',
			fileName: '',
			preview: ''
		});
		this.props.unsetPreload();
	}
	_onChange(e) {
		e.preventDefault();
		if (e.target.files.length) {
			$('body').addClass('fix');
			this.props.setPreload();
			let ext = e.target.files[0].name.split(".");
			let fileName = global.nDate() + "." + ext[ext.length - 1];
			let files;
			if (e.dataTransfer) {
			files = e.dataTransfer.files;
			} else if (e.target) {
				files = e.target.files;
			}
			if (files[0].size > 9000000) {
				SweetAlert({
					title: 'הקובץ חורג מהמשקל 8 mb',
					text: 'יש לנסות להעלות קובץ שוב',
					type: 'info',
					timer: 3000,
					showConfirmButton: false
				}).catch(SweetAlert.noop);
				this.props.unsetPreload();
			} else {
				let reader = new FileReader();
				reader.onload = () => {
					this.setState({
						fileName: fileName,
						preview: reader.result,
						src: reader.result,
						croppTool: true
					});
				};
				reader.readAsDataURL(files[0]);
				this.setState({	fileSize: files[0].size });
			}
		}
	}
	_cropChange(){
		this.state.cropped ? this.setState({cropped: false}) : null;
	}
	_crop(){
		let preview = this.refs.cropper.getCroppedCanvas({'fillColor': '#FFFFFF'}).toDataURL('image/jpeg');
		var image = document.createElement('img');
		image.src = preview;
		var quality;
		var fileSize = this.state.fileSize;
		image.onload = () => {
			if (fileSize) {
				fileSize < 8000000 && fileSize > 6000000 ? quality = 30 : null;
				fileSize < 6000000 && fileSize > 4000000 ? quality = 70 : null;
				fileSize < 4000000 && fileSize > 1000000 ? quality = 80 : null;
				fileSize < 1000000 ? quality = 80 : null;
			} else {
				quality = 100;
			}
			var output_format = 'jpg';
			target_img = jic.compress(image,quality,output_format);
		}
		this.interval = setInterval(() => {
			if (target_img) {
				this.setState({	preview: target_img.src, cropped: true});
				clearInterval(this.interval);
				target_img = "";
			}
		}, 100);
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
				this.setState({	src:target_img.src, preview: target_img.src, preload: false,croppTool:true });
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
	render() {
		return (
			<div className={this.props.img ? "load-image-wrapper absolute" : "load-image-wrapper"}>
				{!this.props.chat ?
					<div className="addImg">
						<ul>

              {!this.props.appId ?
                <div>
                  <li>
    								<img src={globalFileServer + 'icons/add-circular.svg'} />
    							</li>
    							<li className="upload">
    								<input id="upload-file" type="file" className="upload" onChange={this._onChange} />
    								<span>הוספת תמונה</span>
    							</li>
                </div>
              :
              <li className="upload" onClick={this.galleryOrCamera}>
                <div className="selectGalOrCam flex-container">
  								<div className="col-lg-6">
  									<div className="btn-cont" onClick={this.uploadImg}>
  										<img src={globalFileServer + 'icons/photo-camera.svg'} />
  									</div>
                    <p>מצלמה</p>
  								</div>
  								<div className="btn-cont" className="col-lg-6">
  									<div onClick={this.openGallery}>
  										<img src={globalFileServer + 'icons/frame-landscape.svg'} />
  									</div>
                    <p>אלבום</p>
  								</div>
  							</div>
							</li>
              }
						</ul>
					</div>
				:
				<div className="addImg-custom">
					<img src={globalFileServer + 'icons/img.svg'} />
					<input id="upload-file" type="file" className="upload" onChange={this._onChange} />
				</div>
				}
				{this.state.croppTool ? ReactDOM.createPortal(
					<div className="cropp-tool-wrapper">
						<div className="cropp-tool">
							<div className="flex-container">
								<div id="cropp_view" className="col-lg-6 for-cropp">
									<Cropper
										src={this.state.src}
										aspectRatio={this.props.aspectRatio}
										guides={false}
										checkCrossOrigin={false}
										ref='cropper'
										crop={this._cropChange}
									/>
								</div>
								<div className="col-lg-6">
									<div className='image-preview'>
										<img src={this.state.preview} />
									</div>
								</div>
							</div>
							<ul className="actions">
								<li>
									{this.state.cropped ?
										<button onClick={this.save} className="button-green">שמור</button>
									:
									<button onClick={this._crop.bind(this, true)} className="button-green">גזור</button>
									}
								</li>
								<li><button onClick={this.cansel} className="button-red">ביטול</button></li>
							</ul>
						</div>
					</div>,
					document.getElementById('modal-root')
				)
				: null}
			</div>
		);
	}
}
