import React from "react";
import BABox from "./BABox";
import { Empty, Image } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import apiInstance from "../config/apimethods";

interface ImageViewerProps {
  image?: string;
}

const resolveImageSrc = (image?: string) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  const base = (apiInstance?.defaults?.baseURL || "").replace(/\/?api\/?$/i, "").replace(/\/$/, "");
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
};

const ImageViewer: React.FC<ImageViewerProps> = ({ image }) => {
  const src = resolveImageSrc(image);
  return (
    <BABox className="w-full md:w-1/3 flex flex-col items-center bg-white rounded-2xl shadow-md px-4 py-2 border border-gray-100 relative">
      {/* <span style={{position:'absolute',top:10,left:10,width:10,height:10,background:'#e5e7eb',borderRadius:'50%',zIndex:2,border:'2px solid #fff',boxShadow:'0 1px 4px #0001'}}></span>
      <span style={{position:'absolute',top:10,right:10,width:10,height:10,background:'#e5e7eb',borderRadius:'50%',zIndex:2,border:'2px solid #fff',boxShadow:'0 1px 4px #0001'}}></span>
      <span style={{position:'absolute',bottom:10,left:10,width:10,height:10,background:'#e5e7eb',borderRadius:'50%',zIndex:2,border:'2px solid #fff',boxShadow:'0 1px 4px #0001'}}></span>
      <span style={{position:'absolute',bottom:10,right:10,width:10,height:10,background:'#e5e7eb',borderRadius:'50%',zIndex:2,border:'2px solid #fff',boxShadow:'0 1px 4px #0001'}}></span> */}
      {/* Section Title */}
      <h2 className="text-sm font-semibold mb-1 text-gray-500 tracking-wide">
        Prescription
      </h2>

      {src ? (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden shadow-sm border-2 border-[##242b64] flex justify-center items-center">
          <Image
            src={src}
            alt="Prescription"
            className="object-contain w-full max-h-96 transition-transform duration-300 hover:scale-105"
            style={{ background: "#f9fbff", maxHeight: 384, width: '100%' }}
            preview={{ mask: <span style={{ color: '#f9fbff' }}><EyeOutlined className="text-xl" /></span> }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No prescription uploaded"/>
        </div>
      )}
    </BABox>
  );
};

export default ImageViewer;
