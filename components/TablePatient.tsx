import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminTableItems } from "@/constants";
import Link from "next/link";
import { BiEditAlt } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";

export default function TablePatient() {
  return (
    <Table className="border-[1px] border-solid border-muted rounded-md ">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-[#EFF4FA] ">
        <TableHead className="text-[#8F9BB3]  text-right  pr-4">نام و نام خانوادگی</TableHead>
         <TableHead className="text-[#8F9BB3]  text-right  pr-4">  نام کاربری </TableHead>
          <TableHead className="text-[#8F9BB3]  text-right">وضعیت کاربر</TableHead>
          <TableHead className="text-[#8F9BB3]  text-right">تاریخ عضویت</TableHead>
          <TableHead className="text-[#8F9BB3]  text-right">توضیحات</TableHead>
          <TableHead className="text-[#8F9BB3]  text-right">ویرایش</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white ">
        {AdminTableItems.map((item) => {
          return (
            <TableRow key={item.id}>
              <Link
                href={`#`}
                className="contents h-14"
              >
                <TableCell className="w-3/12 font-medium text-black text-right pr-4">
                  {item.name}
                  <p className="text-slate-500 text-xs">{item.phone}</p>
                </TableCell>
                <TableCell className="w-2/12 text-black  text-right">
                  <p className="bg-blue rounded-lg text-white w-1/2  text-center">
                    {item.useRole}
                  </p>
                </TableCell>
                <TableCell className="w-2/12 text-black  text-right">
                  {item.date}
                </TableCell>
                <TableCell className="w-4/12 text-black  text-right">
                  {item.desc}
                </TableCell>
                <TableCell className="w-1/12 min-w-full flex gap-2 pt-4 text-muted-foreground  text-right">
                  <HiOutlineTrash size="20px"/>
                  <BiEditAlt size="20px"/>
                </TableCell>
              </Link>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
