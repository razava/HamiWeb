"use client";
import React from "react";
import Search from "./Search";
import { MdOutlineManageSearch } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";
import { AdminCardItems } from "@/constants";
import TableAdmin from "./TableAdmin";

export default function AdminUserManagement() {
  return (
    <div className="w-full bg-[#F5F5F5] min-h-[85vh] flex justify-center">
      <div className="w-[95vw] lg:w-[85vw] 3xl:w-[70vw] mt-8 max-sm:mt-16 pt-9 ">
        <div className="w-full flex flex-col gap-5  ">
          {/* 1 */}
          {/* <div className="w-full flex flex-col justify-start gap-3">
            <div className="w-full text-right text-neutral-600 text-lg font-bold">
              مدیریت کاربران
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-6 ">
              <div className="w-full lg:w-3/5 h-11 bg-white rounded-[5px] block">
              </div>

              <div className="w-full lg:w-2/5  flex flex-row justify-between items-center gap-2 ">
                <MdOutlineManageSearch size="1.5em" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className="gap-3 hover:no-underline focus-visible:ring-0"
                    >
                      <IoIosArrowDown /> جستجوی پیشرفته
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧P</DropdownMenuShortcut> 
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⇧B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      className="gap-3 hover:no-underline focus-visible:ring-0"
                    >
                      <IoIosArrowDown /> مرتب سازی
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⇧B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className=" bg-blue hover:bg-blue/90 rounded-lg">
                  + افزودن کاربر
                </Button>

              </div>
            </div>
          </div> */}

          {/* 2 */}
          {/* <div className="w-full flex flex-row max-md:flex-wrap justify-center gap-3">
            {AdminCardItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className=" flex flex-col justify-center items-end gap-2 w-2/5 lg:w-1/4 h-28 px-5 bg-white rounded-md shadow-md"
                >
                  <p className="  text-slate-400 text-sm font-normal  leading-none">
                    {item.name}
                  </p>
                  <p className="  text-slate-800 text-xl font-bold  leading-normal">
                    {item.count}
                  </p>
                </div>
              );
            })}
          </div> */}

          {/* 3 */}
          <div className="w-full flex flex-col justify-start bg-white rounded-md">
            <div className="w-full text-right text-neutral-600 text-lg font-bold py-5 pr-4">
              لیست کاربران
            </div>

            <TableAdmin />
          </div>
        </div>
      </div>
      
      </div> 
  );
}
