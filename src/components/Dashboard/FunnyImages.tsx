import React, {useState, useEffect} from 'react'
import Image from 'next/image'



const listImages = [
    "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
    "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
    "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
    "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
    "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp",
];

const listAnimations = [
    "animate-spin",
    "animate-bounce",
    "animate-ping",
    "animate-pulse",
]

const listMasks = [
    "mask-squircle",
    "mask-heart",
    "mask-hexagon",
    "mask-diamond",
    "mask-star-2",
    "mask-circle"
]

const initDataImage = {
    image: listImages[0],
    animation: listAnimations[0],
    mask: listMasks[0]
}

const FunnyImages = () => {
    const [dataImage, setDataImage] = useState(initDataImage);

    const getRandom = (list: string[]) => {
        return list[Math.floor(Math.random() * list.length)];
    }

    const changeImage = () => {
        setDataImage({
            image: getRandom(listImages),
            animation: getRandom(listAnimations),
            mask: getRandom(listMasks)
        });
    }

    useEffect(() => {
        setTimeout(() => {
            changeImage();
        }, 600);
    }, [dataImage]);
    

  return (
    <div className='flex justify-center my-4' >
        <Image
            src={dataImage.image}
            alt="Drink"
            width={200}
            height={200}
            className={`${dataImage.animation} mask ${dataImage.mask}`}
        />
    </div>
  )
}

export default FunnyImages