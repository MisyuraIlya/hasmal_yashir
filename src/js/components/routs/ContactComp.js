import React, { Component, Fragment } from 'react';

export default class ContactComp extends Component {
    constructor(props) {
        super();
        this.state = {
            toggleInput:false,
            name:"",
            email:"",
            phone:"",
            msg:""
        }
    }
    render() {
        const {toggleInput,name,email,phone,msg} = this.state;
        return (
            <div className="contact-comp">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.7091893925126!2d34.75208638445265!3d31.995898030706915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b3a228bcaf47%3A0x9e28fb80da29f430!2z157XqdeUINep16jXqiAxLCDXqNeQ16nXldefINec16bXmdeV158!5e0!3m2!1siw!2sil!4v1590915221256!5m2!1siw!2sil" allowFullScreen></iframe>
            </div>
        )
    }
}