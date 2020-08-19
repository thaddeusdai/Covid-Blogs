import React, { Component } from "react";

import SlickSlider from "react-slick";

import "./Slider.css";

class Slider extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      arrows: true,
      slidesToScroll: 1,
      centerMode: true,
      initialSlide: 1,
    };
    let s;
    if (this.props.elements.length < 2) {
      s = this.props.elements.length;
    } else {
      s = 2;
    }
    return (
      <div className="mt-4">
        <h3>{this.props.title}</h3>
        <div
          className="slick mt-2 bg-dark p-3 d-none d-xl-block"
          id={this.props.type}
        >
          <SlickSlider {...settings} slidesToShow={s}>
            {this.props.elements}
          </SlickSlider>
        </div>
        <div
          className="slick mt-2 bg-dark p-3 d-block d-xl-none"
          id={this.props.type}
        >
          <SlickSlider {...settings}>{this.props.elements}</SlickSlider>
        </div>
        <br />
      </div>
    );
  }
}

export default Slider;
