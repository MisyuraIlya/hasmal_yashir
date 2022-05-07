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
			preview: ''
		}
		this._onChange = this._onChange.bind(this);
		this._crop = this._crop.bind(this);
		this.save = this.save.bind(this);
		this.cansel = this.cansel.bind(this);
	}
	componentDidMount(){}
	save(){
		let	itemImg = {
			Img: this.state.preview,
			fileName: this.state.fileName,
			productId: this.props.productId
		};
		this.setState({
			croppTool: false,
			src: '',
			fileName: '',
			preview: ''
		});
		this.props.uploadImg(itemImg);
	}
	cansel(){
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
				this.setState({	preview: target_img.src, cropped: true });
				clearInterval(this.interval);
				target_img = "";
			}
		}, 50);
	}
	render() {
		return (
			<div className={this.props.img ? "load-image-wrapper absolute" : "load-image-wrapper"}>
				<div className="addImg">
					<img src={globalFileServer + 'icons/image.svg'} />
					<input id="upload-file" type="file" className="upload" onChange={this._onChange} />
				</div>
				{this.state.croppTool ?
					<div className="cropp-tool-wrapper">
						<div className="cropp-tool">
							<div className="flex-container">
								<div className="col-lg-6 for-cropp">
									<Cropper
										src={this.state.src}
										aspectRatio={this.props.aspectRatio}
										guides={false}
										checkCrossOrigin={false}
										ref='cropper'
										crop={this._crop}
									/>
								</div>
								<div className="col-lg-6">
									<div className='image-preview'>
										<img src={this.state.preview} />
									</div>
								</div>
							</div>
							<ul className="actions">
								<li><button onClick={this.save} className="button-green">שמור</button></li>
								<li><button onClick={this.cansel} className="button-red">ביטול</button></li>
							</ul>
						</div>
					</div>
				: null}
			</div>
		);
	}
}
