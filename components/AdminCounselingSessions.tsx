"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convertDate } from "@/lib/utils"; // تبدیل تاریخ میلادی به شمسی
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { toast } from "sonner";
import moment from "jalali-moment";
import {
  GetAllCounselingSessions,
  SubmitCounselingSession,
  UpdateCounselingSession,
  DeleteCounselingSession,
  getMentorsList,
  getPatientGroups,
} from "@/utils/adminApi"; // API متدها
import { Triangle } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Pencil, Trash, Plus } from "lucide-react"; // آیکون‌ها
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input"; // فرض بر این است که کامپوننت Input شما موجود است

const defaultSessionValues = {
  patientGroupId: "",
  mentorId: "",
  scheduledDate: "",
  scheduledTime: "", // اضافه‌شده: زمان جلسه
  topic: "",
  meetingLink: "",
  mentorNote: "",
};

export default function AdminCounselingSessions() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any | null>(null);
  const [sessionForm, setSessionForm] = useState(defaultSessionValues);

  const [page, setPage] = useState(1); // شماره صفحه جاری
  const [totalPages, setTotalPages] = useState(1); // تعداد کل صفحات
  const [totalCount, setTotalCount] = useState(0); // تعداد کل آیتم‌ها
  const pageSize = 10; // تعداد آیتم‌ها در هر صفحه

  // Fetch لیست جلسات مشاوره
  const {
    data: sessionList,
    isLoading: isSessionLoading,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["CounselingSessionList", page],
    queryFn: async () => {
      const data = await GetAllCounselingSessions({
        PageNumber: page,
        PageSize: pageSize,
      });
      const pagination = JSON.parse(data.headers["x-pagination"]);
      setTotalPages(pagination.TotalPages);
      setTotalCount(pagination.TotalCount);
      return data;
    },
  });

  const { data: mentorsList, isLoading: isLoadingMentors } = useQuery({
    queryKey: ["MentorsList"],
    queryFn: () => getMentorsList({ PageNumber: 1, PageSize: 100 }),
    refetchOnWindowFocus: false,
  });

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["PatientGroups"],
    queryFn: () => getPatientGroups(),
    refetchOnWindowFocus: false,
  });

  // Mutation: افزودن جلسه مشاوره
  const addSessionMutation = useMutation({
    mutationFn: SubmitCounselingSession,
    onSuccess: () => {
      toast.success("جلسه با موفقیت اضافه شد!");
      queryClient.invalidateQueries({ queryKey: ["CounselingSessionList"] });
      setIsDialogOpen(false);
      setSessionForm(defaultSessionValues);
    },
    onError: () => {
      toast.error("خطایی در افزودن جلسه رخ داد.");
    },
  });

  // Mutation: ویرایش جلسه مشاوره
  const updateSessionMutation = useMutation({
    mutationFn: UpdateCounselingSession,
    onSuccess: () => {
      toast.success("جلسه با موفقیت ویرایش شد!");
      queryClient.invalidateQueries({ queryKey: ["CounselingSessionList"] });
      setIsDialogOpen(false);
      setEditingSession(null);
      setSessionForm(defaultSessionValues);
    },
    onError: () => {
      toast.error("خطایی در ویرایش جلسه رخ داد.");
    },
  });

  // Mutation: حذف جلسه مشاوره
  const deleteSessionMutation = useMutation({
    mutationFn: DeleteCounselingSession,
    onSuccess: () => {
      toast.success("جلسه با موفقیت حذف شد!");
      queryClient.invalidateQueries({ queryKey: ["CounselingSessionList"] });
    },
    onError: () => {
      toast.error("خطایی در حذف جلسه رخ داد.");
    },
  });

  // هندل کردن باز کردن فرم ویرایش
  const handleEditSession = (session: any) => {
    setEditingSession(session);
    setSessionForm({
      ...session,
      scheduledDate: moment(session.scheduledDate).format("jYYYY/jMM/jDD"),
      scheduledTime: moment(session.scheduledDate).format("HH:mm"),
    });
    setIsDialogOpen(true);
  };

  // هندل کردن حذف
  const handleDeleteSession = (sessionId: string) => {
    deleteSessionMutation.mutate({ id: sessionId });
  };

  // ارسال فرم
  const handleSubmit = () => {
    debugger;
    // فرض کنید تاریخ و زمان از فرم گرفته شده‌اند:
    const jalaliDate = sessionForm.scheduledDate; // تاریخ شمسی (مثل: 1403/11/17)
    const selectedTime = sessionForm.scheduledTime; // زمان (مثل: 11:28)
    // ترکیب تاریخ شمسی و زمان
    const fullJalaliDateTime = `${jalaliDate} ${selectedTime}`;

    debugger
    // تبدیل تاریخ و زمان شمسی به میلادی
    // const gregorianDateTime = moment
    //   .from(fullJalaliDateTime, "jYYYY/jMM/jDD HH:mm")
    //   .format("YYYY-MM-DD HH:mm"); // تبدیل به شیء Date میلادی
    // const gregorianDateTime = moment
    // .from(fullJalaliDateTime, "jYYYY/jMM/jDD HH:mm")
    // .format("YYYY-MM-DDTHH:mm:ss"); // فرمت استاندارد ISO8601

   let gregorianDateTime = moment(fullJalaliDateTime, "jYYYY/jMM/jDD HH:mm")
       .format("YYYY-MM-DDTHH:mm:ss");

    const formData = new FormData();
    formData.append("patientGroupId", sessionForm.patientGroupId);
    formData.append("mentorId", sessionForm.mentorId);
    formData.append("scheduledDate", gregorianDateTime);
    formData.append("topic", sessionForm.topic);
    formData.append("meetingLink", sessionForm.meetingLink);
    formData.append("mentorNote", sessionForm.mentorNote);
    
    if (editingSession) {
      updateSessionMutation.mutate({
        id: editingSession.id,
        payload: formData,
      });
    } else {
      addSessionMutation.mutate(formData);
    }
  };

  // محاسبه وضعیت جلسه
  const getSessionStatus = (isConfirmed: boolean, scheduledDate: string) => {
    const now = new Date();
    const sessionDate = new Date(scheduledDate);

    if (isConfirmed) {
      return "برگزار شده";
    } else if (sessionDate < now) {
      return "منقضی شده";
    } else {
      return "برگزار نشده";
    }
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">
            مدیریت جلسات مشاوره
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-2 shadow-lg"
                onClick={() => {
                  setSessionForm(defaultSessionValues);
                  setEditingSession(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                افزودن جلسه
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingSession ? "ویرایش جلسه مشاوره" : "افزودن جلسه مشاوره"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {/* گروه بیمار */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    گروه بیمار:
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={sessionForm.patientGroupId || ""}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        patientGroupId: e.target.value,
                      })
                    }
                  >
                    <option value="">انتخاب گروه</option>
                    {groups?.map((group: any) => (
                      <option key={group.id} value={group.id}>
                        {group.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* تاریخ جلسه */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    تاریخ جلسه:
                  </label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    className="w-full p-2 border border-blue/30 rounded-md text-sm"
                    containerClassName="w-full"
                    inputClass="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                    value={sessionForm.scheduledDate || null}
                    onChange={(date) =>
                      setSessionForm({
                        ...sessionForm,
                        scheduledDate: date
                          ? moment(date.toDate()).format("jYYYY/jMM/jDD")
                          : "",
                      })
                    }
                  />
                </div>

                {/* زمان جلسه */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    زمان جلسه:
                  </label>
                  <Input
                    type="time"
                    value={sessionForm.scheduledTime || ""}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        scheduledTime: e.target.value,
                      })
                    }
                    placeholder="مثال: 14:30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-right text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // استایل راست‌چین
                    dir="rtl" // راست‌چین کردن متن
                  />
                </div>

                {/* موضوع */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    موضوع:
                  </label>
                  <Input
                    value={sessionForm.topic}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        topic: e.target.value,
                      })
                    }
                    placeholder="موضوع جلسه"
                  />
                </div>
                {/* لینک جلسه */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    لینک جلسه:
                  </label>
                  <Input
                    value={sessionForm.meetingLink}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        meetingLink: e.target.value,
                      })
                    }
                    placeholder="لینک جلسه را وارد کنید"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  {editingSession ? "ذخیره تغییرات" : "افزودن"}
                </Button>
                <Button
                  onClick={() => {
                    setSessionForm(defaultSessionValues);
                    setEditingSession(null);
                    setIsDialogOpen(false);
                  }}
                  variant="outline"
                >
                  انصراف
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* جدول */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ردیف</TableHead>
                <TableHead>گروه بیمار</TableHead>
                <TableHead>منتور</TableHead>
                <TableHead>تاریخ جلسه</TableHead>
                <TableHead>موضوع</TableHead>
                <TableHead>لینک جلسه</TableHead>
                <TableHead>وضعیت</TableHead> {/* ستون وضعیت */}
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSessionLoading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex justify-center">
                      <Triangle
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="triangle-loading"
                        visible={true}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sessionList?.data?.map((session: any, index: number) => (
                  <TableRow key={session.id}>
                    <TableCell>{pageSize * (page - 1) + (index + 1)}</TableCell>
                    <TableCell>{session.patientGroupName}</TableCell>
                    <TableCell>{session.mentorName}</TableCell>
                    <TableCell>
                      {convertDate(session.scheduledDate)}{" "}
                      {moment(session.scheduledDate).format("HH:mm")}
                    </TableCell>
                    <TableCell>{session.topic}</TableCell>
                    <TableCell>{session.meetingLink}</TableCell>
                    <TableCell>
                      {getSessionStatus(
                        session.isConfirmed,
                        session.scheduledDate
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        {/* ویرایش */}
                        <button
                          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          onClick={() => handleEditSession(session)}
                          disabled={
                            session.isConfirmed ||
                            new Date(session.scheduledDate) < new Date()
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* حذف */}
                        <button
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => handleDeleteSession(session.id)}
                          // disabled={
                          //   session.isConfirmed ||
                          //   new Date(session.scheduledDate) < new Date()
                          // }
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            TotalPages={totalPages}
            currentPage={page - 1}
            PageSize={pageSize}
            countPage={totalCount}
            Page={(num: number) => setPage(num + 1)}
          />
        </div>
      </div>
    </div>
  );
}
