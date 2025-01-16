"use client";
import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CiSearch } from "react-icons/ci";
import { X } from "lucide-react";

export default function Search({
  mode,
  value,
  action,
  Cancel,
  changeValue,
}: {
  mode?: string;
  value?: any;
  action?: (any: any) => any;
  Cancel: (any: any) => any;
  changeValue?: (any: any) => any;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cancel, setCancel] = useState<boolean>(false);

  // تغییر handleSubmit برای اجرای جستجو
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setCancel(true);
    if (action) {
      action(value); // اجرای تابع جستجو با مقدار ورودی
    }
  };

  const cancelSearch = (e: any) => {
    e.preventDefault();
    setCancel(false);
    if (changeValue !== undefined) {
      changeValue("");
    }
    Cancel(true);
  };
  
  return (
    <form
      onSubmit={handleSubmit}  // اجرای جستجو با زدن دکمه Enter
      className="relative flex items-center w-full bg-gray-300 lg:w-1/5 rounded-xl"
    >
      <Input
        ref={inputRef}
        id="default-search"
        className={`mb-0 h-8 bg-[#E9E9E9] border-none focus-visible:none rounded-lg
                       block w-full text-xs md:text-sm text-black 
                       text-opacity-60  dark:text-white 
                       ${mode === "controller" && "h-14 "}
                       ${mode === "admin" && "w-full min-w-full bg-white lg:min-w-full h-11"}
                       `}
        value={value}
        onChange={(e) => {
          if (changeValue) {
            setCancel(false);
            changeValue(e.target.value);
          }
        }}
        placeholder=" نام کاربری"
      />
      {cancel ? (
        <button
          onClick={cancelSearch}
          type="button"
          className="absolute left-3"
        >
          <X className=" text-gray-600 h-5 w-5" />
        </button>
      ) : (
        <button type="submit" className="absolute left-3">
          <CiSearch className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
