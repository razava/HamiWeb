"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  GetAllPatientGroups,
  SubmitPatientGroup,
  UpdatePatientGroup,
  DeletePatientGroup,
  getPatientsList,
  getMentorsList,
} from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Pencil, Trash, RefreshCw, Plus } from "lucide-react"; // آیکون‌ها
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// کامپوننت Pagination
import Pagination from "@/components/Pagination"; // فرض بر این است که کامپوننت Pagination شما موجود است

const defaultGroupValues = {
  organ: "",
  diseaseType: "",
  stage: 1,
  description: "",
  mentorId: "",
  // mentorName: "",
};

// مپ کردن مقادیر به فارسی
const organMap: { [key: string]: string } = {
  1: "تخمدان",
  2: "پستان",
  3: "پروستات",
};

const diseaseTypeMap: { [key: string]: string } = {
  1: "بدخیم",
  2: "خوش‌خیم",
};

export default function AdminPatientGroups() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [groupForm, setGroupForm] = useState(defaultGroupValues);

  const [page, setPage] = useState(1); // شماره صفحه جاری
  const [totalPages, setTotalPages] = useState(1); // تعداد کل صفحات
  const [totalCount, setTotalCount] = useState(0); // تعداد کل آیتم‌ها
  const pageSize = 10; // تعداد آیتم‌ها در هر صفحه

  // Fetch لیست گروه‌ها
  const {
    data: groupList,
    isLoading: isGroupLoading,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ["PatientGroupList", page],
    queryFn: async () => {
      const data = await GetAllPatientGroups({
        PageNumber: page,
        PageSize: pageSize,
      });
      const pagination = JSON.parse(data.headers["x-pagination"]);
      setTotalPages(pagination.TotalPages);
      setTotalCount(pagination.TotalCount);
      return data;
    },
  });

  const { data: mentors, isLoading: isLoadingMentors } = useQuery({
    queryKey: ["MentorsList"],
    queryFn: () => getMentorsList({ PageNumber: 1, PageSize: 100 }),
    refetchOnWindowFocus: false,
  });

  // Mutation: افزودن گروه
  const addGroupMutation = useMutation({
    mutationFn: SubmitPatientGroup,
    onSuccess: () => {
      toast.success("گروه با موفقیت اضافه شد!");
      queryClient.invalidateQueries({ queryKey: ["PatientGroupList"] });
      setIsDialogOpen(false);
      setGroupForm(defaultGroupValues);
    },
    onError: () => {
      toast.error("خطایی در افزودن گروه رخ داد.");
    },
  });

  // Mutation: ویرایش گروه
  const updateGroupMutation = useMutation({
    mutationFn: UpdatePatientGroup,
    onSuccess: () => {
      toast.success("گروه با موفقیت ویرایش شد!");
      queryClient.invalidateQueries({ queryKey: ["PatientGroupList"] });
      setIsDialogOpen(false);
      setEditingGroup(null);
      setGroupForm(defaultGroupValues);
    },
    onError: () => {
      toast.error("خطایی در ویرایش گروه رخ داد.");
    },
  });

  // Mutation: حذف گروه
  const deleteGroupMutation = useMutation({
    mutationFn: DeletePatientGroup,
    onSuccess: () => {
      toast.success("گروه با موفقیت حذف شد!");
      queryClient.invalidateQueries({ queryKey: ["PatientGroupList"] });
    },
    onError: () => {
      toast.error("خطایی در حذف گروه رخ داد.");
    },
  });

  // هندل کردن باز کردن فرم ویرایش
  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setGroupForm({
      organ: group.organ,
      diseaseType: group.diseaseType,
      stage: group.stage,
      description: group.description,
      mentorId: group.mentorId || "",
    });
    setIsDialogOpen(true);
  };

  // هندل کردن حذف
  const handleDeleteGroup = (groupId: string) => {
    deleteGroupMutation.mutate({ id: groupId });
  };

  // ارسال فرم
  const handleSubmit = () => {
    const formData = {
      organ: groupForm.organ,
      diseaseType: groupForm.diseaseType,
      stage: groupForm.stage,
      description: groupForm.description,
      mentorId: groupForm.mentorId || null,
    };

    if (editingGroup) {
      const formDataInstance = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataInstance.append(key, value as string | Blob);
      });
      updateGroupMutation.mutate({
        id: editingGroup.id,
        payload: formDataInstance,
      });
    } else {
      const formDataInstance = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataInstance.append(key, value as string | Blob);
      });
      addGroupMutation.mutate(formDataInstance);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center bg-[#f9f9f9] mt-20">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        {/* هدر */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-800">مدیریت گروه‌ها</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-2 shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                افزودن گروه
              </Button>
             
              {/* <Button className="bg-blue-500 text-white hover:bg-blue-600">
                افزودن گروه جدید
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingGroup ? "ویرایش گروه" : "افزودن گروه"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                {/* فیلد ارگان */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    ارگان:
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={groupForm.organ}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, organ: e.target.value })
                    }
                  >
                    <option value="">انتخاب ارگان</option>
                    {Object.entries(organMap).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                {/* نوع بیماری */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    نوع بیماری:
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={groupForm.diseaseType}
                    onChange={(e) =>
                      setGroupForm({
                        ...groupForm,
                        diseaseType: e.target.value,
                      })
                    }
                  >
                    <option value="">انتخاب نوع بیماری</option>
                    {Object.entries(diseaseTypeMap).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                {/* سطح بیماری */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    سطح بیماری:
                  </label>
                  <Input
                    type="number"
                    value={groupForm.stage}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, stage: +e.target.value })
                    }
                    placeholder="سطح بیماری"
                  />
                </div>
                {/* توضیحات */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    توضیحات:
                  </label>
                  <Input
                    value={groupForm.description}
                    onChange={(e) =>
                      setGroupForm({
                        ...groupForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="توضیحات گروه"
                  />
                </div>
                {/* انتخاب منتور */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    منتور:
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={groupForm.mentorId || ""}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, mentorId: e.target.value })
                    }
                  >
                    <option value="">انتخاب منتور</option>
                    {mentors?.data &&
                      mentors.data.map((mentor: any) => (
                        <option key={mentor.id} value={mentor.id}>
                          {mentor.firstName} {mentor.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  {editingGroup ? "ذخیره تغییرات" : "افزودن"}
                </Button>
                <Button
                  onClick={() => {
                    setGroupForm(defaultGroupValues);
                    setEditingGroup(null);
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
                <TableHead>ارگان</TableHead>
                <TableHead>نوع بیماری</TableHead>
                <TableHead>سطح بیماری</TableHead>
                <TableHead>توضیحات</TableHead>
                <TableHead>منتور</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isGroupLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>
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
                groupList?.data?.map((group: any, index: number) => (
                  <TableRow key={group.id}>
                    <TableCell>{pageSize * (page - 1) + (index + 1)}</TableCell>
                    <TableCell>
                      {organMap[group.organ] || group.organ}
                    </TableCell>
                    <TableCell>
                      {diseaseTypeMap[group.diseaseType] || group.diseaseType}
                    </TableCell>
                    <TableCell>{group.stage}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>
                      {group.mentorName ? `${group.mentorName}` : "بدون منتور"}
                    </TableCell>{" "}
                    {/* نمایش منتور */}
                    <TableCell>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <button
                          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          {!group.isDeleted && <Trash className="w-4 h-4" />}
                          {group.isDeleted && <RefreshCw className="w-4 h-4" />}
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
