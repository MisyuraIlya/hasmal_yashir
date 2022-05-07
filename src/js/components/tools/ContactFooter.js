import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import UserContext from '../../UserContext';
import SweetAlert from 'sweetalert2';


const PHeb1 = `
<p>

עמוד זה מיועד ליצירת קשר בלבד ואינו בא
להחליף ייעוץ על ידי גורמים מקצועיים.
מדי-מרקט אינה יכולה לתת מענה לשאלות
מתחום הרפואה. ככל שיש לך שאלה
בתחומים אלו, אנו ממליצים  להתייעץ עם
הרופא המטפל.
</p>
`;

const ContactUsForm = params => {

  	const [name, SetName] = useState('');
  	const [mail, SetMail] = useState('');
  	const [company, SetCompany] = useState('');
    const [phone, SetPhone] = useState('');


  	const [msg, SetMsg] = useState('');
    const [contactActive, SetContactActive] = useState(0);
    const [contactPopUpActive, SetContactPopUpActive] = useState(false);
    const [contactPopObj, SetContactPopObj] = useState({'Name':"",'Mail':"",'Phone':"",'ProdTitle':"",'DueDate':"", 'Atzva':"", 'Message':""});
    const [dumi, SetDumi]= useState(false);
    const [preload, SetPreload]= useState(false);
    const [inputInfoHover, SetInputInfoHover]= useState(false);



    	const app = useContext(UserContext);
    	let constant = app.returnConstant;


    	const showError = () => {
    		SweetAlert({
    			title: 'פרטים חסרים',
    			type: 'error',
    			showConfirmButton: false,
    			timer: 5000
    		}).then(function () {}.bind(this)).catch(SweetAlert.noop);
    	}

      const close = () => {

        SetContactPopObj({'Name':"",'Mail':"",'Phone':"",'ProdTitle':"",'DueDate':"", 'Atzva':"", 'Message':""});
        SetContactPopUpActive(false);
        params.SetContactPopUpActive();
      }
      const open = () => {
        SetContactPopUpActive(true);
      }
      const setInputState = (param, val) => {
        contactPopObj[param] = val;
        SetContactPopObj(contactPopObj);
        SetDumi(JSON.stringify(contactPopObj));
      }

      const sendPopFormFunc = () => {
        if(contactPopObj.Name != "" && contactPopObj.Mail != "" && contactPopObj.Phone != "" && contactPopObj.ProdTitle != "" && contactPopObj.Message != ""){
          SetPreload(true);
          let valMail = {
            siteName: params.regConstants.constants.SITE_NAME,
            from: params.regConstants.constants.FROM_MAIL,
            to: params.regConstants.constants.TO_MAIL,
            name: contactPopObj.Name,
            mail: contactPopObj.Mail,
            phone: contactPopObj.Phone,
            prodTitle: contactPopObj.ProdTitle,
            dueDate: contactPopObj.DueDate,
            atzva: contactPopObj.Atzva,
            message: contactPopObj.Message
          };


          $.ajax({
            url: 'https://statos.co/statos_web_mail/send_from_contacts_b2b.php',
            type: 'POST',
            data: valMail,
            dataType: "json",
          }).done(function(d) {

            SweetAlert({
              title: app.state.lang == "he" ? 'הודעה נשלחה בהצלחה' : 'Message was sent successfully',
              type: 'success',
              showConfirmButton: false,
              timer: 4000
            }).catch(SweetAlert.noop);
              close();
              SetContactPopObj({'Name':"",'Mail':"",'Phone':"",'ProdTitle':"",'DueDate':"", 'Atzva':"", 'Message':""});
              SetPreload(false);
          }.bind(this)).fail(function() {
             SetPreload(false);
          }.bind(this));
        }else{

          SweetAlert({
            title: app.state.lang == "he" ? 'אנא מלא את כל השדות החובה' : "Please fill in all fields",
            type: 'info',
            showConfirmButton: false,
            timer: 4000
          }).catch(SweetAlert.noop);
        }
      }


      return(
    		<div className="contact-us">
          {preload ?
            <div className="spinner-wrapper">
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </div>
          : null}
    			<div className="container">
            {ReactDOM.createPortal(
    					<div className="my-modal contact-pop">
    						<div className="modal-wrapper animated">
                  <div className="close-cont">
      							<div onClick={close} className="close">
      								<img src={globalFileServer + 'icons/close-dark.svg'} />
      							</div>
                  </div>
                  <div className="wrapper">
                    <div className="sup-wrapper">
                      <img className="h1-img" src={globalFileServer + '/Raport_icon_black.png'} />
                      <h1>{app.state.lang == "he" ? "דיווח תופעות לוואי" : ""}</h1>
                      <p dangerouslySetInnerHTML={app.state.lang == "he" ? {__html: PHeb1} : null}></p>
                      <div className="inputs-cont">
                        <div className="input-div">
                          <p>{app.state.lang == "he" ? "שם מלא" : ""}</p>
                          <input
                            type="text"
                            value={contactPopObj.Name ? contactPopObj.Name : ""}
                            placeholder=""
                            onChange={(e) => setInputState("Name", e.target.value)}
                          />

                        </div>

                        <div className="input-div">
                          <p>{app.state.lang == "he" ? "כתובת מייל" : ""}</p>
                          <input
                            type="text"
                            value={contactPopObj.Mail ? contactPopObj.Mail : ""}
                            placeholder=""
                            onChange={(e) => setInputState("Mail", e.target.value)}
                          />
                        </div>

                        <div className="input-div">
                          <p>{app.state.lang == "he" ? "מספר טלפון" : ""}</p>
                          <input
                            type="text"
                            value={contactPopObj.Phone ? contactPopObj.Phone : ""}
                            placeholder=""
                            onChange={(e) => setInputState("Phone", e.target.value)}
                          />

                        </div>
                        <div className="input-div">
                          <p>{app.state.lang == "he" ? "שם המוצר" : ""}</p>
                          <input
                            type="text"
                            value={contactPopObj.ProdTitle ? contactPopObj.ProdTitle : ""}
                            placeholder=""
                            onChange={(e) => setInputState("ProdTitle", e.target.value)}
                          />
                          <div className="info-cont">
                            <img
                              onMouseEnter={() => SetInputInfoHover("ProdTitle")}
                              onMouseLeave={() => SetInputInfoHover(false)}
                              src={globalFileServer + '/icons/contact/input_info.svg'} alt=""/>
                          </div>

                          {inputInfoHover == "ProdTitle" ?
                            <div className="info-value-cont">
                              <p className="info-value">{app.state.lang == "he" ? "שם המוצר והמינון המופיעים על גבי האריזה" : ""}</p>
                            </div>
                          :null}

                        </div>

                        <div className="input-div">
                          <p>{app.state.lang == "he" ? "שם המוצר" : ""}</p>
                          <input
                            type="text"
                            value={contactPopObj.DueDate ? contactPopObj.DueDate : ""}
                            placeholder=""
                            onChange={(e) => setInputState("DueDate", e.target.value)}
                          />

                        </div>

                        <div className="input-div">
                          <p>{app.state.lang == "he" ? "תאריך תפוגה" : ""}</p>
                          <input
                            type="text"
                            value={contactPopObj.Atzva ? contactPopObj.Atzva : ""}
                            placeholder=""
                            onChange={(e) => setInputState("Atzva", e.target.value)}
                          />
                          <div className="info-cont">
                            <img
                              onMouseEnter={() => SetInputInfoHover("Atzva")}
                              onMouseLeave={() => SetInputInfoHover(false)}
                              src={globalFileServer + '/icons/contact/input_info.svg'} alt=""/>
                          </div>

                          {inputInfoHover == "Atzva" ?
                            <div className="info-value-cont">
                              <p className="info-value">{app.state.lang == "he" ? "LOT / BATCH" : ""}</p>
                            </div>
                          :null}
                        </div>
                        <textarea
      										placeholder=""
      										type="text"
      										value={contactPopObj.Message ? contactPopObj.Message : ""}
      										placeholder={app.state.lang == "he" ? "הערות" : ""}
      										onChange={(e) => setInputState('Message', e.target.value)}
      										id="Msg"
        								/>

                      </div>
                      <button onClick={sendPopFormFunc}>{constant('CONTACT_FORM_BTN')}</button>
                    </div>
                  </div>
    						</div>
    						<div onClick={close} className="overflow"></div>
    					</div>,
    					document.getElementById('modal-root')
    				) }
    			</div>
    		</div>
    	);
}


export default class ContactFooter extends Component {
	state = {
		contacts: [],
    ContactBtm: [],
    ContactFormInputs: [],
		about: [],
    name:"",
    mail:"",
    phone:"",
    msg:"",
    preload: false,
    contactPopUpActive: false,
    company:""
	};
	componentDidMount = () => {
		setTimeout(() => window.scrollTo(0, 0), 100);
	}


  SetContactPopUpActive = () => {
    this.setState({contactPopUpActive:false})

  }

  sendForm = () =>{

    if(this.state.name != "" && this.state.mail != "" && this.state.phone != "" && this.state.msg != ""){
      this.setState({preload:true});

      let valMail = {
        siteName: globalSiteName,
        from: this.props.props.state.defaults.statosMail,
        to: this.props.props.state.defaults.toMail,
        name: this.state.name,
        mail: this.state.mail,
        phone: this.state.phone,
        company: this.state.company,
        message: this.state.msg
      };

      $.ajax({
        url: 'https://statos.co/statos_web_mail/send_from_contacts_b2b.php',
        type: 'POST',
        data: valMail,
        dataType: "json",
      }).done(function(d) {

        SweetAlert({
          title: 'הודעה נשלחה בהצלחה',
          type: 'success',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);

        this.setState({name:"",mail:"",phone:"",msg:"",company:"",preload:false});

      }.bind(this)).fail(function() {
         console.log('error');
         this.setState({preload:false});
      }.bind(this));
    }else{
      SweetAlert({
        title: 'אנא מלא את כל השדות',
        type: 'info',
        showConfirmButton: false,
        timer: 4000
      }).catch(SweetAlert.noop);
    }

  }


	render(){
		let lang;
    if(this.props.lang){
      lang = this.props.lang;
    }

    let number = '+972504201412';
    //let number = '+972584018761';
    let message = 'היי, אני פונה אליכם דרך האתר. האם תוכלו לעזור לי ?';
    let subject = 'היי, אני פונה אליכם דרך האתר. האם תוכלו לעזור לי ?';
		return (
      <div className="contact-footer" id="contact-footer">
        <div className="container">
          <div className="main-sub-cont">
            <div className="sub-cont flex-container">
              {this.state.contactPopUpActive ?
                <ContactUsForm SetContactPopUpActive={()=> this.SetContactPopUpActive()}/>
              :null}
{/*
              <div className="col-lg-2 map-cont">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3379.5996732666895!2d34.96860451561274!3d32.10710358117942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d30c199a82f45%3A0x56fb2b1bd39426be!2sHaMelacha%20St%2020%2C%20Rosh%20Haayin!5e0!3m2!1sen!2sil!4v1606141120855!5m2!1sen!2sil"
                  frameBorder="0"
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                />
              </div>
*/}
              <div className="col-lg-4 form-cont">
                <div className="form">
                  <div className="wr">
                    <div className="input-group">
                      <input
                        type="text"
                        value={this.state.name ? this.state.name : ""}
                        placeholder={lang == "he" ? "שם": ""}
                        onChange={(e) => this.setState({name: e.target.value})}
                        id="Name"
                      />
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        value={this.state.mail ? this.state.mail : ""}
                        placeholder={lang == "he" ? "מייל": ""}
                        onChange={(e) => this.setState({mail: e.target.value})}
                        id="Mail"
                      />
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        value={this.state.phone ? this.state.phone : ""}
                        placeholder={lang == "he" ? "טלפון": ""}
                        onChange={(e) => this.setState({phone: e.target.value})}
                        id="Tel"
                      />
                    </div>
                  {/*  <div className="input-group">
                      <input
                        type="text"
                        value={this.state.company ? this.state.company : ""}
                        placeholder={lang == "he" ? "חברה": ""}
                        onChange={(e) => this.setState({company: e.target.value})}
                        id="Tel"
                      />
                    </div>*/}
                    <div className="input-group">
                      <textarea
                        placeholder={lang == "he" ? "הודעה": ""}
                        type="text"
                        value={this.state.msg ? this.state.msg : ""}
                        onChange={(e) => this.setState({msg: e.target.value})}
                        id="Msg"
                      />
                    </div>
                    <div className="button-wrapper">
                      <button onClick={()=> this.sendForm()}>{lang == "he" ? "שלח" : ""}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 cont-about-us">
                <div className="cont-about-us-cont">
                  <div className="h2-cont">
                  </div>


                  <p>א.פ.י חורי הפצה, שהחלה את דרכה בשנת 1978, היא חברת ייבוא והפצה של מוצרי קוסמטיקה, בישום וטואלטיקה המיועדים למכירה בשוק הפרטי וברשתות השיווק בישראל.</p>
                  <p>לצד מכירת המותגים של היבואנים המובילים בענף כגון: לוריאל, סנו, יוניליוור, דיפלומט, לילית, גורי ורבים אחרים, החברה פיתחה למעלה מ – 20 מותגים פרטיים המאפשרים ללקוחותיה לרכוש מוצרי איכות במחיר הוגן. כמו כן, החברה מנהלת קשרי מסחר עם חברות ברחבי העולם, בעיקר בתחום הייבוא המקביל של בישום וטואלטיקה.</p>
                  <p>א.פ.י חורי הפצה מספקת שירות ללמעלה מ – 2000 נקודות מכירה החל מחנויות פרטיות, מינימרקטים, סופרמרקטים, תמרוקיות וקיבוצים וכלה בסיטונאים ורשתות שיווק מהמובילות בשוק הישראלי. </p>
                  <p>מערך ההפצה של א.פ.י חורי הפצה חולש על כל מדינת ישראל מדן ועד אילת ומאפשר לכל אחד מלקוחות החברה לקבל שירות מקצועי ויעיל "עד הבית".</p>

                </div>
              </div>


              <div className="col-lg-3 info-cont">
                <div className="contact-info">
                  <div className="flex-container row-cont">
                    <div className="col-lg-2">
                      <div className="img">
                        <img src={globalFileServer + 'place_icon_wh.svg'} alt=""/>
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <ul>
                        <li className="title"> {lang == "he" ? "כתובת:": ""}</li>
                        <li> {lang == "he" ? "רח’ הפרת 2 יבנה, ישראל": ""}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex-container row-cont">
                    <div className="col-lg-2">
                      <div className="img">
                        <img src={globalFileServer + 'phone_icon_wh.svg'} alt=""/>
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <ul>
                        <li className="title">{lang == "he" ? "טלפון רב קווי:": ""}</li>
                        <li>{lang == "he" ? "03-5608005": ""}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex-container row-cont">
                    <div className="col-lg-2">
                      <div className="img">
                        <img src={globalFileServer + 'mail_icon_wh.svg'} alt=""/>
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <ul>
                        <li className="title">{lang == "he" ? "אימייל:": ""}</li>
                        <li>{lang == "he" ? "churi@churi.co.il": ""}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>


                {/*
              <div className="col-lg-4 social-cont">
                <div className="social">
                  <div className="network-cont">
                    <div className="network-subcont flex-container">
                      <div className="img-cont col-lg-12">
                        <img src={globalFileServer + 'ew_logo.jpg'} alt=""/>
                      </div>
                      <div className="img-cont col-lg-12">
                        <img src={globalFileServer + 'icons/whatsapp_icon.png'} alt=""/>
                      </div>

                      <div className="img-cont col-lg-12">
                        <img src={globalFileServer + 'icons/facebooc_icon.png'} alt=""/>
                      </div>
                      <div className="img-cont col-lg-12">
                        <img src={globalFileServer + 'icons/instagram_icon.png'} alt=""/>
                      </div>



                    </div>
                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
		)
	}
}
