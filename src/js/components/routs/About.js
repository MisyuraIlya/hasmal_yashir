import React, { Component, Fragment } from 'react';
import LogoMedias from '../tools/LogoMedias.js'
import ContactFooter from '../tools/ContactFooter.js'



const Heb1 = `
<p>
חברת איי. אל מדי- מרקט הינה חברה ייחודית המתמחה במתן פתרון מקיף למגוון צרכיהם השוטפים של כל מגוון המוסדות רפואיים ברחבי הארץ.
</p>
<p>
מגוון מוצרי החברה כולל תרופות, (לרבות יבוא תרופות שאינן רשומות בישראל-29ג'), ציוד ומכשור רפואי ומגוון מוצרים נלווים נוספים המצויים בשימוש שוטף  של מגוון לקוחותיה כמו גם לקוחותיה הפוטנציאליים.
למדי- מרקט רישיון משרד הבריאות לניהול בית מרקחת ובית מסחר לתרופות. כמו כן מאושרת החברה לתקני ISO9001 ובעלת תקן GMP.
</p>
<p>
החברה מתמקדת בשלושה פלחי שוק עיקריים:
</p>
<p class="bullet">
התחום ההומאני
</p>
<p class="bullet">
התחום הווטרינרי
</p>
<p class="bullet">
תיירות מרפא
</p>

`;

const Heb2 = `
<p class="bullet">
מייצגים מעל 60 יצרני תרופות בעולם
</p>
<p class="bullet">
עשרות תרופות רשומות ועשרות בהליכי רישום
</p>
`;

const Heb3 = `
<p>
רכבי הובלה ומשאיות מובילים בטמפרטורה
מבוקרת ובפיקוח רוקחי קפדני את התרופות
והציוד במהירות ובאחריות מלאה.
</p>
`;

const Heb4= `
<p class="bullet">
כמעט כל המוצרים מיובאים ישירות מהיצרנים
בעולם כדי להבטיח מחירים מעולים ואיכות
ללא פשרה.
</p>
<p class="bullet">
שיווק, אכסון והפצה - הכל תחת קורת גג אחת
כדי שתוכלו להנות מהמחירים הטובים בארץ
וללא דמי תיווך.
</p>
`;


export default class About extends Component {
  constructor(props) {
      super();
      this.state = {

      }
  }


  render() {
    let lang;
    if(this.props.state.lang){
      lang = this.props.state.lang;
    }
    return (
      <div className="about-page">
        <div className="about-page-container flex-container">

          <div className="showcase">
            <div className="img">
              <img src={globalFileServer + 'about/Banner_company.png'} alt=""/>
            </div>
          </div>

          <LogoMedias />

          <div className="who-are-we">
  					<div className="container wrapper">
              <div className= "h1-cont">
    						<h1>{lang == "he" ? "מי אנחנו" : ""}</h1>
              </div>
          	</div>
            <div className="round-ele-cont">
    					<div className="masc">
    						<div className="container">
    							<div className="flex-container">
    								<div className="col-lg-4 col-lg">
    									<div className="wrapper round-cont">
    										<div className="img">
    											<img src={globalFileServer + 'about/iso1.png'} alt=""/>
    										</div>
    									</div>
    								</div>
                    <div className="col-lg-4 col-lg">
    									<div className="wrapper round-cont">
    										<div className="img">
    											<img src={globalFileServer + 'about/iso2.png'} alt=""/>
    										</div>
    									</div>
    								</div>
                    <div className="col-lg-4 col-lg">
    									<div className="wrapper round-cont">
    										<div className="img">
    											<img src={globalFileServer + 'about/iso3.png'} alt=""/>
    										</div>
    									</div>
    								</div>
    							</div>
    						</div>
    					</div>
            </div>
  				</div>

          <div className="img-text">
  					<div className="container">
  						<div className="items">
                <div className="flex-container item">
                  <div className="col-lg-6">
                    <div className="wrapp">
                      <div className="text" dangerouslySetInnerHTML={lang == "he" ? {__html: Heb1} : null}></div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="img">
                      <img src={globalFileServer + 'about/about1.png'} alt=""/>
                    </div>
                  </div>
                </div>

                <div className="flex-container item">
                  <div className="col-lg-6">
                    <div className="img">
                      <img src={globalFileServer + 'about/about2.png'} alt=""/>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="wrapp">
                      <div className="h1-cont">
                        <h1>{lang == "he" ? "מגוון התרופות והציוד הרפואי הרחב ביותר" : ""}</h1>
                      </div>
                      <div className="text" dangerouslySetInnerHTML={lang == "he" ? {__html: Heb2}: null}></div>
                    </div>
                  </div>
                </div>

                <div className="flex-container item">
                  <div className="col-lg-6">
                    <div className="wrapp">
                      <div className="h1-cont">
                        <h1>{lang == "he" ? "אספקה תוך 24 שעות לכל הארץ" : ""}</h1>
                      </div>
                      <div className="text" dangerouslySetInnerHTML={lang == "he" ? {__html: Heb3} : null}></div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="img">
                      <img src={globalFileServer + 'about/about3.png'} alt=""/>
                    </div>
                  </div>
                </div>

                <div className="flex-container item">
                  <div className="col-lg-6">
                    <div className="img">
                      <img src={globalFileServer + 'about/about4.png'} alt=""/>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="wrapp">
                      <div className="h1-cont">
                        <h1>{lang == "he" ? "במחירים הטובים בישראל" : ""}</h1>
                      </div>
                      <div className="text" dangerouslySetInnerHTML={lang == "he" ? {__html: Heb4} : null}></div>
                    </div>
                  </div>
                </div>
  						</div>
  					</div>
  				</div>

          <ContactFooter lang={lang}/>

        </div>
      </div>
    )
  }
}
