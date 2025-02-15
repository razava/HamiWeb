"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { convertDate } from "@/lib/utils";
import {
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
  FileText,
  Users,
  LineChart,
} from "lucide-react";

interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  groupName: string | null;
  city: string;
  registrationStatus: number;
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

  return (
    <div className="overflow-hidden">
      <div className="max-h-[50vh] lg:max-h-[65vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
        <Table className="border-[1px] border-solid border-muted rounded-md w-full min-w-[40rem] mb-8 md:mb-4 2xl:mb-0">
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

          <TableBody className="bg-[#F5F5F5] min-h-[20rem]">
            {Array.isArray(data) &&
              data.map((user: User, index: number) => (
                <TableRow key={user.id} className="hover:bg-gray-200 cursor-pointer">
                  <TableCell className="w-1/12 font-medium">
                    {pageSize * (currentPage - 1) + (index + 1)}
                  </TableCell>
                  <TableCell className="w-2/12">{user.userName}</TableCell>
                  <TableCell className="w-3/12">{user.firstName} {user.lastName}</TableCell>
                  <TableCell className="w-2/12">{convertDate(user.dateOfBirth)}</TableCell>
                  <TableCell className="w-3/12">{user.groupName || "-"}</TableCell>
                  <TableCell className="w-2/12">{user.city || "-"}</TableCell>

                  {/* ستون عملیات */}
                  <TableCell className="w-3/12">
                    <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                      {userRole == "Admin" && (
                        <button
                          title="مشاهده اطلاعات"
                          className="p-2 bg-indigo-200 text-indigo-800 rounded-md hover:bg-indigo-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/UserPanel/AdminDashboard/PatientManagement/${user.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {user.registrationStatus === 1 && (
                        <>
                          <button
                            title="تأیید کاربر"
                            className="p-2 bg-indigo-300 text-indigo-900 rounded-md hover:bg-indigo-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/UserPanel/AdminDashboard/PatientManagement/${user.id}/approved`);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>

                          <button
                            title="رد کاربر"
                            className="p-2 bg-indigo-400 text-indigo-900 rounded-md hover:bg-indigo-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/UserPanel/AdminDashboard/PatientManagement/${user.id}/rejected`);
                            }}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {user.registrationStatus === 2 && (
                        <>
                          <button
                            title="ارزیابی روانی"
                            className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/UserPanel/ControllerDashboard/PatientManagement/${user.id}/mentalAssessment`);
                            }}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>

                          <button
                            title="تست‌های آزمایشگاهی"
                            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/UserPanel/ControllerDashboard/PatientManagement/${user.id}/testLabs`);
                            }}
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            title="گزارش جلسات"
                            className="p-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/UserPanel/ControllerDashboard/PatientManagement/${user.id}/sessionReport`);
                            }}
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          <button
                            title="گزارش مود روزانه"
                            className="p-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/UserPanel/ControllerDashboard/PatientManagement/${user.id}/dailyMoodReport`);
                            }}
                          >
                            <LineChart className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
