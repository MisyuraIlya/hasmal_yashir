import React, { Component, Fragment } from 'react';
import LogoMedias from '../tools/LogoMedias.js'
import ContactFooter from '../tools/ContactFooter.js'
import { NavLink, useParams } from "react-router-dom";


const Dept2Heb = `
<p>
מדי-מרקט מספקת ליותר מ- 400 מרפאות וטרינריות, מוסדות מחקר, ורשויות מקומיות מגוון רחב של
תרופות, ציוד מתכלה, מכשור וציוד רפואי.
</p>
<p>
מדי-מרקט, הינה החברה היחידה בארץ המעניקה שירות הן למוסדות רפואיים בתחום ההומני, למגוון
תושבי חוץ המגיעים לארץ לטיפולים רפואיים, וכמובן למאות מרפאות וטרינריות ברחבי הארץ.
 היותה של מדי מרקט יבואן יחיד של ציוד רפואי והמפיצה היחידה המפיצה תרופות למוסדות הומניים
ולמרפאות וטרינריות מבין כלל המפיצים למרפאות וטרינריות, מאפשרת לחברה להעמיד לרשות
לקוחותיה הווטרינריים מגוון רחב של מוצרים במחירים ללא תחרות, תוך ניצול היתרון לגודל על פני
 האלטרנטיבות בענף הווטרינריה.
</p>
<p>
בימים אלה, שוקדת החברה על רישום מגוון רחב של תרופות וטרינריות  המיוצרות ע"י חברות מהמובילות
בעולם בתחומן, תהליך אשר עם סיומו, יעמיד בפניך הווטרינר/ית אלטרנטיבות רבות נוספות לרכישת
תרופות וטרינריות על כל המשתמע מכך.
</p>
`;


const Dept1Heb = `
<p>
חברת איי. אל. מדי- מרקט, מתמחה במתן פתרון מקיף למגוון צרכיהם השוטפים של לקוחותיה בתחום התרופות, הציוד הרפואי מוצרים מתכלים, ומגוון מוצרים נלווים נוספים המצויים בשימוש יומיומי של מגוון לקוחותיה.
</p>
<p>
למדי- מרקט רישיון משרד הבריאות לניהול בית מרקחת ובית מסחר לתרופות. כמו כן מאושרת החברה לתקני ISO9001 ובעלת תקן GMP.
</p>
<p>
יכולותיה של החברה להעמיד מגוון רחב של תרופות, הכנות רוקחיות  ומוצרים מתכלים לעוסקים במגוון תחומי הרפואה ובכללם  בתי חולים, מרפאות, בתי אבות, מרפאות לרפואה דחופה, מוסדות מחקר ומוסדות ממשלתיים אחרים, ממצבות אותה כחברה ייחודית ומובילה בתחומה.
</p>
<p>
חברת מדי-מרקט ערה לשימוש הגובר והולך של תרופות מיוחדות שאינן רשומות בישראל ואשר מומלצות ע"י מיטב הרופאים בישראל כחלק בלתי נפרד מהמערך הטיפולי המוענק  לחולים במחלות קשות.
</p>
<p>
לאור זאת, פיתחה החברה מערך ליבוא מיוחד של תרופות מיוחדות אשר אינן רשומות בישראל, מדי-מרקט מתחייבת להספקה  בתוך 4 ימי עסקים ממועד ההזמנה בפועל.
כמו כן מעמידה החברה תנאי מימון מיוחדים לתושבים ישראלים, אשר חברות הביטוח אינן מעניקות כיסוי ביטוחי לתרופות המומלצות לשימוש ע"י הרופאים המטפלים בישראל.

</p>
`;

const Dept3Heb = `
<p>
בשנים האחרונות, התפתח בישראל ענף תיירות חדש וחדשני הוא ענף "תיירות המרפא"
הרפואה המתקדמת בישראל, לצד הכמות הגדולה יחסית של דוברי השפה הרוסית בישראל בכלל ובבתי חולים בפרט, הפכה את ישראל ליעד מוביל בקרב יוצאי ארצות ברית המועצות לשעבר וארצות נוספות אחרות, לצורך קבלת טיפולים רפואיים מורכבים ומסובכים.
</p>
<p>
חברת מדי-מרקט, מעמידה לרשות תושבי החוץ (באמצעות הגופים המקצועיים המעניקים למטופלים את מכלול השירותים הכרוכים בקבלת הטיפולים), את האפשרות לרכוש את מגוון התרופות הנדרשות לטיפול (במהלכו ולאחר חזרתו של המטופל לארץ המקור).
חברת מדי מרקט, הינה ה"גב" עבור הצוות הרפואי, המטופל ובני משפחתו. השירות הייחודי של מדי-מרקט, מאפשרת למטופל ובני משפחתו הסועדים אותו, להתמקד בהחלמתו, חוסכת מהמשפחה את הריצה לאיתור התרופות ורכישתם, ודואגת להספקת התרופה באמצעות נציג החברה בזמן ולמקום שמתואם עם המטופל או בן משפחתו.
</p>
<p>
הספקת התרופות יכולות להתבצע לבית המלון, בית החולים, ישירות לשדה התעופה או למקום מגוריו של המטופל בארץ המקור שלו.
חברת מדי מרקט מתחייבת על תרופות חדשניות ואיכותיות בשינוע מבוקר ומוקפד. אנו פועלים מול חברות הפצת תרופות מהמובילות בעולם המערבי, עם תקני האיכות המחמירים בעולם. לאור המוניטין שצברנו, כחברה אמינה, אנו זוכים לתנאים המאפשרים לנו לספק תרופות חדשניות במהירות ובמחיר הוגן.
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
    let deptId = parseInt(this.props.match.params.id);
    let dataObj;
    switch(deptId){
      case 2:
        dataObj = {'banner': 'Banner_vet_hativa.png',
                  'h1Heb': 'חטיבה וטרינרית',
                  'h1Eng': '',
                  'img': 'vet_dept.png',
                  'icon': 'cat1.png',
                  'textHeb': Dept2Heb
                  }
      break;
      case 1:
        dataObj = {'banner': 'Banner_humane_hativa.png',
                  'h1Heb': 'חטיבה הומאנית',
                  'h1Eng': '',
                  'img': 'humane_dept.png',
                  'icon': 'cat2.png',
                  'textHeb': Dept1Heb
                  }
      break;
      case 3:
        dataObj = {'banner': 'Banner_travel_dept.png',
                  'h1Heb': 'תיירות מרפא',
                  'h1Eng': '',
                  'img': 'travel_dept.png',
                  'icon': 'cat3.png',
                  'textHeb': Dept3Heb
                  }
      break;
    }

    return (
      <div className="department-page">
        <div className="department-page-container flex-container">

          <div className="showcase">
            <div className="img">
              <img src={globalFileServer + 'about/' + dataObj.banner} alt=""/>
            </div>
          </div>

          <LogoMedias />

          <div className="img-text">
  					<div className="container">
  						<div className="items">
                <div className="flex-container item">
                  <div className="col-lg-6">
                    <div className="img">
                      <img src={globalFileServer + 'about/' + dataObj.img} alt=""/>
                      <img className="icon" src={globalFileServer + 'categories/' + dataObj.icon} alt=""/>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="wrapp">
                      <div className="h1-cont">
                        <h1>{lang == "he" ? dataObj.h1Heb : dataObj.h1Eng}</h1>
                      </div>
                      <div className="text" dangerouslySetInnerHTML={lang == "he" ? {__html: dataObj.textHeb} : null}></div>
                      <div className="btn-container">
                        <NavLink to={'/category-page/' + deptId + '/0/0/' + lang}>
                          <p>{lang == "he" ? "לקטלוג החטיבה" : ""}</p>
                        </NavLink>
                      </div>
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
