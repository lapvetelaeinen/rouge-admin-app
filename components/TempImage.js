import React from "react";
import Image from "next/image";

export default function TempImage({ selectedImage }) {
  return (
    <div>
      <div className="relative w-full h-[350px] rounded-2xl overflow-clip drop-shadow-md">
        <Image
          src={URL.createObjectURL(selectedImage)}
          layout="fill"
          alt="event image"
          className="object-cover"
        />
      </div>
    </div>
  );
}
