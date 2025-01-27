import React from "react";
import Image from "next/image";

const Carousel = () => {
  return (
    <div>
      <div className="carousel carousel-end rounded-box">
        <div className="carousel-item">
          <Image
            src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
            alt="Drink"
            width={400}
            height={400}
          />
        </div>
        <div className="carousel-item">
          <Image
            src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
            alt="Drink"
            width={400}
            height={400}
          />
        </div>
        <div className="carousel-item">
          <Image
            src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
            alt="Drink"
            width={400}
            height={400}
          />
        </div>
        <div className="carousel-item">
          <Image
            src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
            alt="Drink"
            width={400}
            height={400}
          />
        </div>
        <div className="carousel-item">
          <Image
            src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
            alt="Drink"
            width={400}
            height={400}
          />
        </div>
        <div className="carousel-item">
          <Image
            src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
            alt="Drink"
            width={400}
            height={400}
          />
        </div>
        <div className="carousel-item">
          <Image
            src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
            alt="Drink"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
