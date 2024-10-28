"use client";
import { Triangle } from "react-loader-spinner";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full min-h-screen flex justify-center items-center  bg-transparent">
      <Triangle
        visible={true}
        height="80"
        width="80"
        color="#003778"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
