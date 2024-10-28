import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import { EyeIcon } from "@heroicons/react/24/outline"; // اطمینان حاصل کنید که این کتابخانه نصب شده است
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ControllerTableItems } from "@/constants";
import Link from "next/link";
import { Decrypt, convertDate, convertFullTime } from "@/lib/utils";
import useData from "@/store/useData";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import secureLocalStorage from "react-secure-storage";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";
interface Complaint {
  id: string;
  trackingNumber: string;
  title: string;
  category: {
    id: string;
    title: string;
    description: string;
  };
  complaintOrganization: {
    id: string;
    title: string;
    description: string;
  };
  status: number;
  registeredAt: string;
  lastChanged: string;
  lastActor: number;
  cipherKeyInspector: string;
}
export default function TableController({
  data,
  pageSize,
  currentPage,
}: {
  data: Complaint[];
  pageSize: number;
  currentPage: number;
}) {
  const router = useRouter();

  return (
    <div className=" overflow-hidden">
      <div className="max-h-[50vh] lg:max-h-[65vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
        <Table className="border-[1px] border-solid border-muted rounded-md w-full min-w-[40rem] mb-8 md:mb-4 2xl:mb-0 ">
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>ردیف</TableHead>
              <TableHead>کد پیگیری</TableHead>
              <TableHead> تاریخ ثبت</TableHead>
              <TableHead>تاریخ آخرین تغییر</TableHead>
              <TableHead>موضوع</TableHead>
              <TableHead>دستگاه مربوطه</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#F5F5F5] min-h-[20rem] ">
            {data?.map((item: Complaint, index: number) => {
              return (
                <TableRow
                  onClick={() => {
                    localStorage.setItem("CompliantData", JSON.stringify(item));
                    router.push(
                      `/UserPanel/ControllerDashboard/Complaints/${item.id}`
                    );
                  }}
                  className="cursor-pointer hover:bg-gray-200 "
                  key={item.id}
                >
                  <TableCell className="w-1/12 font-medium ">
                    {pageSize * (currentPage - 1) + (index + 1)}
                  </TableCell>
                  <TableCell className="w-1/12">
                    {item.trackingNumber}
                  </TableCell>
                  <TableCell className="w-2/12">
                    {convertFullTime(item.registeredAt)}
                  </TableCell>
                  <TableCell className="w-2/12">
                    {convertFullTime(item.lastChanged)}
                  </TableCell>
                  <TableCell className="w-3/12 truncate  max-w-[1em]">
                    {item?.title ? item.title : "-"}
                  </TableCell>
                  <TableCell className="w-3/12">
                    {item?.complaintOrganization
                      ? item?.complaintOrganization.title
                      : "-"}
                  </TableCell>
                  <TableCell className="w-3/12"> {/* اضافه کردن سلول برای عملیات */}
            <div className="relative inline-block text-left">
              <button
                className="flex items-center text-blue-500 bg-blue-500 hover:bg-blue-700 focus:outline-none rounded-md p-2"
                onClick={(e) => {
                  //e.stopPropagation(); // جلوگیری از وقوع رویداد کلیک بر روی سطر
                  localStorage.setItem("CompliantData", JSON.stringify(item));
                    router.push(
                      `/UserPanel/ControllerDashboard/Complaints/${item.id}`
                    );
                }}
              >
<Eye className=" w-4 h-4" />
              </button>
              <span className="absolute z-10 hidden w-32 p-2 text-sm text-white bg-black rounded-lg -translate-x-1/2 left-1/2 bottom-full tooltip">
                مشاهده
                <div className="tooltip-arrow" />
              </span>
            </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
