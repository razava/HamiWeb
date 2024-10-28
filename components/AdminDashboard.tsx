import React from "react";
import BoxDashboard from "./BoxDashboard";
import LineChart from "./LineChart";
import { HorizontalChart } from "./HorizontalChart";
import  VerticalChart  from "./VerticalChart";
import { PieChart } from "./PieChart";

export default function AdminDashboard() {
  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mt-8 max-sm:mt-16 pt-9">
     
      <div className="w-full mb-6 flex flex-col gap-4  ">
      
        <div className="w-full md:h-36 flex flex-row max-md:flex-wrap justify-center md:justify-between gap-3 ">
          {/* <BoxDashboard />
          <BoxDashboard />
          <BoxDashboard />
          <BoxDashboard />
          <BoxDashboard />
          <BoxDashboard /> */}
        </div>

        <div className="w-full flex flex-col md:flex-row gap-12 md:gap-1 ">
          <div className="w-full md:w-1/3 h-full flex justify-center">
            <PieChart />
          </div>
          <hr />
          <div className="w-full md:w-2/3 h-full flex justify-center">
            {/* <VerticalChart /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
