import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Eye, Check, BarChart, FolderClosed, PieChartIcon } from "lucide-react"; // آیکون‌ها
import { useRouter } from "next/navigation";
import { convertDate } from "@/lib/utils"; // تبدیل تاریخ میلادی به شمسی
import { FaChartPie } from "react-icons/fa";

// تعریف نوع داده‌ی کاربر
interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  groupName: string | null;
  city: string;
  registrationStatus: number; // وضعیت ثبت‌نام (1: منتظر تأیید، 2: تأیید‌شده، 3: رد‌شده)
}

export default function TableController({
  data,
  pageSize,
  currentPage,
  userRole = "Mentor",
}: {
  data: User[];
  pageSize: number;
  currentPage: number;
  userRole: string;
}) {
  const router = useRouter();

  const handleApprove = (userId: string) => {
    console.log(`تأیید کاربر با شناسه: ${userId}`);
  };

  const handleChangeGroup = (userId: string) => {
    console.log(`تغییر گروه کاربر با شناسه: ${userId}`);
  };

  return (
    <div className="overflow-hidden">
      <div className="max-h-[50vh] lg:max-h-[65vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
        <Table className="border-[1px] border-solid border-muted rounded-md w-full min-w-[40rem] mb-8 md:mb-4 2xl:mb-0">
          {/* هدر جدول */}
          <TableHeader>
            <TableRow>
              <TableHead>ردیف</TableHead>
              <TableHead>نام کاربری</TableHead>
              <TableHead>نام و نام خانوادگی</TableHead>
              <TableHead>تاریخ تولد</TableHead>
              <TableHead>گروه درمانی</TableHead>
              <TableHead>شهر</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>

          {/* بدنه جدول */}
          <TableBody className="bg-[#F5F5F5] min-h-[20rem]">
            {Array.isArray(data) && data.map((user: User, index: number) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-200 cursor-pointer"
              >
                {/* ستون ردیف */}
                <TableCell className="w-1/12 font-medium">
                  {pageSize * (currentPage - 1) + (index + 1)}
                </TableCell>

                {/* ستون نام کاربری */}
                <TableCell className="w-2/12">{user.userName}</TableCell>

                {/* ستون نام و نام خانوادگی */}
                <TableCell className="w-3/12">
                  {user.firstName} {user.lastName}
                </TableCell>

                {/* ستون تاریخ تولد */}
                <TableCell className="w-2/12">
                  {convertDate(user.dateOfBirth)} {/* تبدیل تاریخ به شمسی */}
                </TableCell>

                {/* ستون ایمیل */}
                <TableCell className="w-3/12">
                  {user.groupName ? user.groupName : "-"}
                </TableCell>

                {/* ستون شهر */}
                <TableCell className="w-2/12">
                  {user.city ? user.city : "-"}
                </TableCell>

                {/* ستون عملیات */}
                <TableCell className="w-3/12">
                  <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                    {/* دکمه مشاهده اطلاعات */}

                    {userRole == "Admin" && (
                      <button
                        className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={(e) => {
                          e.stopPropagation(); // جلوگیری از کلیک روی ردیف
                          router.push(
                            `/UserPanel/AdminDashboard/PatientManagement/${user.id}`
                          ); // هدایت به صفحه اطلاعات کاربر
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* عملیات وضعیت منتظر تأیید */}
                    {user.registrationStatus === 1 && (
                      <>
                        <button
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/AdminDashboard/PatientManagement/${user.id}/approved`
                            ); // هدایت به صفحه اطلاعات کاربر
                            //handleApprove(user.id); // تأیید کاربر
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/AdminDashboard/PatientManagement/${user.id}/rejected`
                            ); // هدایت به صفحه اطلاعات کاربر
                            //handleApprove(user.id); // تأیید کاربر
                          }}
                        >
                          <FolderClosed className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* عملیات وضعیت تأیید‌شده */}
                    {user.registrationStatus === 2 && userRole == "Admin" && (
                      <>
                        <button
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/AdminDashboard/PatientManagement/${user.id}/mentalAssessment`
                            ); // هدایت به صفحه ارزیابی روانی
                          }}
                        >
                          <BarChart className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/AdminDashboard/PatientManagement/${user.id}/sessionReport`
                            ); // هدایت به صفحه گزارش جلسات کاربر
                          }}
                        >
                          <FolderClosed className="w-4 h-4" />
                        </button>
                        {/* دکمه گزارش مود روزانه */}
                        <button
                          className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/AdminDashboard/PatientManagement/${user.id}/dailyMoodReport`
                            ); // هدایت به صفحه گزارش مود روزانه بیمار
                          }}
                        >
                          <PieChartIcon className="w-4 h-4" />
                        </button>
                      </>

                      // <button
                      //   className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      //   onClick={(e) => {
                      //     e.stopPropagation();
                      //     router.push(
                      //       `/UserPanel/AdminDashboard/PatientManagement/${user.id}/changeGroup`
                      //     );  // تغییر گروه کاربر
                      //   }}
                      // >
                      //   <Group className="w-4 h-4" />
                      // </button>
                    )}

                    {user.registrationStatus === 2 && userRole == "Mentor" && (
                      <>
                        <button
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/ControllerDashboard/PatientManagement/${user.id}/mentalAssessment`
                            ); // هدایت به صفحه ارزیابی روانی
                          }}
                        >
                          <BarChart className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/ControllerDashboard/PatientManagement/${user.id}/sessionReport`
                            ); // هدایت به صفحه گزارش جلسات کاربر
                          }}
                        >
                          <FolderClosed className="w-4 h-4" />
                        </button>
                        {/* دکمه گزارش مود روزانه */}
                        <button
                          className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/UserPanel/ControllerDashboard/PatientManagement/${user.id}/dailyMoodReport`
                            ); // هدایت به صفحه گزارش مود روزانه بیمار
                          }}
                        >
                          <PieChartIcon className="w-4 h-4" />
                        </button>
                      </>

                      // <button
                      //   className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      //   onClick={(e) => {
                      //     e.stopPropagation();
                      //     router.push(
                      //       `/UserPanel/ControllerDashboard/PatientManagement/${user.id}/changeGroup`
                      //     );  // تغییر گروه کاربر
                      //   }}
                      // >
                      //   <Group className="w-4 h-4" />
                      // </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* نمایش پیغام در صورت خالی بودن لیست */}
        {/* {data?.length === 0 && (
          <p className="text-center mt-5 text-gray-500">
            کاربری برای نمایش وجود ندارد.
          </p>
        )} */}
      </div>
    </div>
  );
}
