"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPatientLabTests, SubmitPatientLabTest } from "@/utils/adminApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertFullTime } from "@/lib/utils";

// تبدیل تاریخ میلادی به شمسی
const convertDateToPersian = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// لیست آزمایش‌های تومور مارکر
const labTests = [
  { label: "PSA", value: 1, unit: "ng/ml" },
  { label: "CEA", value: 2, unit: "mcg/l" },
  { label: "CA 125", value: 3, unit: "U/ml" },
  { label: "CA 15-3", value: 4, unit: "U/ml" },
  { label: "CA 27-29", value: 5, unit: "U/ml" },
];

// دریافت نام تست بر اساس مقدار `testType`
const getTestLabel = (testType: number) => {
  const test = labTests.find((t) => t.value === testType);
  return test ? test.label : "نامشخص";
};

export default function PatientLabTests() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [testValue, setTestValue] = useState<string>("");

  // دریافت لیست آزمایش‌های ثبت‌شده
  const {
    data: labTestList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["patientLabTests"],
    queryFn: getPatientLabTests,
    refetchOnWindowFocus: false,
  });

  // ثبت آزمایش جدید
  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedTest || !testValue) {
        throw new Error("لطفاً مقدار آزمایش را وارد کنید.");
      }

      const test = labTests.find((t) => t.value === Number(selectedTest));
      if (!test) throw new Error("نوع آزمایش نامعتبر است.");

      const testData = {
        testType: Number(selectedTest),
        testValue: parseFloat(testValue),
        unit: test.unit,
      };

      return SubmitPatientLabTest(testData);
    },
    onSuccess: () => {
      toast.success("آزمایش با موفقیت ثبت شد!");
      setTestValue("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
    },
  });

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] mx-auto mt-12">
      {/* عنوان صفحه */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-blue-900">
          آزمایش‌های پزشکی
        </h2>
      </div>

      {/* فرم ثبت آزمایش جدید */}
      <div className="mb-6 p-4 border rounded-lg shadow-md bg-white">
        <h3 className="text-md font-semibold text-gray-800 mb-3">
          ثبت آزمایش جدید
        </h3>

        {/* انتخاب نوع آزمایش */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            نوع آزمایش:
          </label>
          <Select onValueChange={(value) => setSelectedTest(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="انتخاب آزمایش" />
            </SelectTrigger>
            <SelectContent>
              {labTests.map((test) => (
                <SelectItem key={test.value} value={test.value.toString()}>
                  {test.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* مقدار آزمایش */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            جواب آزمایش:
          </label>
          <Input
            type="number"
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            placeholder="عدد وارد کنید"
          />
        </div>

        {/* دکمه ارسال */}
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "در حال ارسال..." : "ثبت آزمایش"}
        </Button>
      </div>

      {/* نمایش لیست آزمایش‌های ثبت‌شده */}
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-40 bg-transparent">
          <p className="text-gray-500 text-center">در حال بارگذاری...</p>
        </div>
      ) : labTestList?.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>هنوز آزمایشی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labTestList?.map((test: any, index: number) => (
            <div
              key={test.id}
              className="p-4 shadow-md rounded-lg border border-gray-300 bg-gray-100"
            >
              {/* عنوان آزمایش */}
              <h3 className="text-md font-bold text-blue-800">
                {index + 1}. {getTestLabel(test.testType)}
              </h3>

              {/* مقدار آزمایش */}
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-semibold text-gray-700">جواب: </span>
                {test.testValue} {labTests.find((t) => t.value === test.testType)?.unit || ""}
              </p>

              {/* تاریخ ثبت */}
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-semibold text-gray-700">تاریخ: </span>
                {convertFullTime(test.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
