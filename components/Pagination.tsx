"use client";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export default function Pagination({
  TotalPages,
  currentPage,
  PageSize,
  Page,
  countPage,
  length,
}: {
  TotalPages?: any;
  currentPage?: any;
  PageSize?: number;
  Page?: any;
  countPage?: any;
  length?: any;
}) {
  const handlePageClick = (event: any) => {
    Page(event.selected);
  };

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        onPageActive={(e) => console.log(e)}
        nextLabel={<MdKeyboardArrowLeft className="w-5 h-5 " />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        forcePage={currentPage}
        pageCount={
          TotalPages
            ? TotalPages
            : Math.ceil(countPage / (PageSize ? PageSize : 5))
        }
        previousLabel={<MdKeyboardArrowRight className="w-5 h-5 " />}
        pageClassName="  w-10 h-10 grid place-content-center rounded-lg !text-blue shadow-md"
        className={twMerge(
          " flex flex-wrap gap-3 text-sm md:text-base w-full rounded-md p-2 pb-3 bg-white/30 backdrop-blur-lg justify-center text-blue mt-0 "
        )}
        activeClassName=" bg-blue text-blue shadow-md shadow-main"
        activeLinkClassName=" text-white w-full p-1 h-full"
        previousLinkClassName=" w-10 h-10 grid place-content-center rounded-lg text-sm shadow-md"
        nextLinkClassName=" w-10 h-10 grid place-content-center rounded-lg text-sm shadow-md"
        pageLinkClassName="p-4"
      />
    </>
  );
}
