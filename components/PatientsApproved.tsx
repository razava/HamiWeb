"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserMedicalInfoById,
  approveOrRejectPatient,
  getPatientGroups,
} from "@/utils/adminApi";
import { Triangle } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getGadScoreDescription, getMddScoreDescription } from "@/constants";

interface UserMedicalInfo {
  userName: string; // اضافه شد
  groupName: string; // اضافه شد
  organ: string;
  diseaseType: string;
  patientStatus: string;
  stage?: number | null;
  pathologyDiagnosis?: string | null;
  initialWeight?: number | null;
  sleepDuration?: number | null;
  appetiteLevel?: string | null;
  gadScore?: number | null;
  mddScore?: number | null;
}

export default function PatientsApproved({ userId }: { userId: string }) {
  const router = useRouter();
  const [medicalInfo, setMedicalInfo] = useState<UserMedicalInfo | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null); // گروه انتخاب‌شده
  const [rejectionReason, setRejectionReason] = useState<string>(""); // دلیل رد

  const { data, isLoading } = useQuery({
    queryKey: ["UserMedicalInfo", userId],
    queryFn: () => getUserMedicalInfoById({ userId }),
    refetchOnWindowFocus: false,
  });

  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["PatientGroups"],
    queryFn: () => getPatientGroups(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setMedicalInfo(data);
    }
  }, [data]);

  // Mutation برای تأیید کاربر
  const approveMutation = useMutation({
    mutationFn: () =>
      approveOrRejectPatient({
        userId,
        patientGroupId: selectedGroup!,
        isApproved: true,
      }),
    onSuccess: () => {
      toast.success("ثبت نام بیمار با موفقیت تأیید شد!");
      router.back(); // بازگشت به لیست بیماران
    },
    onError: () => {
      toast.error("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    },
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-screen bg-transparent">
          <Triangle
            visible={true}
            height="100"
            width="100"
            color="#003778"
            ariaLabel="triangle-loading"
          />
        </div>
      ) : (
        <>
          <div className="flex gap-4 mt-10 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              بازگشت
            </Button>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-2/3 mx-auto bg-[#E9E9E9] rounded-lg p-6">
            <h2 className="text-lg font-bold text-blue-900 mb-2">
              اطلاعات پزشکی بیمار
            </h2>

            {medicalInfo ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* ستون UserName */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      نام کاربری:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.userName || "-"}
                      {" - "}
                      {medicalInfo.groupName}
                    </p>
                  </div>

                  {/* ستون 1 */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      ارگان درگیر:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.organ || "-"}
                    </p>
                  </div>

                  {/* ستون 2 */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      نوع بیماری:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.diseaseType || "-"}
                    </p>
                  </div>

                  {/* ستون 3 */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      وضعیت بیماری:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.patientStatus || "-"}
                    </p>
                  </div>

                  {/* ستون 4 */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      سطح بیماری:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.stage || "-"}
                    </p>
                  </div>

                  {/* ستون 5 */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      وزن اولیه:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.initialWeight || "-"} کیلوگرم
                    </p>
                  </div>

                  {/* ستون 6 */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      مدت زمان خواب:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.sleepDuration || "-"} ساعت
                    </p>
                  </div>

                  {/* ستون 7 */}
                  <div className="p-3 bg-white border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-700 leading-tight">
                      سطح اشتها:
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-2">
                      {medicalInfo.appetiteLevel || "-"}
                    </p>
                  </div>

                  {/* تشخیص پاتولوژی و امتیازات */}
                  <div
                    className="p-3 bg-white border border-gray-300 rounded-md col-span-2 grid gap-3"
                    style={{ gridTemplateColumns: "3fr 1fr 1fr" }}
                  >
                    {/* تشخیص پاتولوژی (ستون اول) */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 leading-tight">
                        تشخیص پاتولوژی:
                      </p>
                      <p className="text-xs text-gray-500 leading-tight mt-2">
                        {medicalInfo.pathologyDiagnosis || "-"}
                      </p>
                    </div>

                    {/* امتیاز GAD (ستون دوم) */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 leading-tight">
                        امتیاز GAD:
                      </p>
                      <p className="text-xs text-gray-500 leading-tight mt-2">
                        {medicalInfo.gadScore || "-"} (
                        {getGadScoreDescription(medicalInfo.gadScore ?? null)})
                      </p>
                    </div>

                    {/* امتیاز MDD (ستون سوم) */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 leading-tight">
                        امتیاز MDD:
                      </p>
                      <p className="text-xs text-gray-500 leading-tight mt-2">
                        {medicalInfo.mddScore || "-"} (
                        {getMddScoreDescription(medicalInfo.mddScore ?? null)})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 bg-white p-4 border border-gray-300 rounded-lg mt-4">
                  {/* انتخاب گروه برای تأیید */}
                  {/* انتخاب گروه برای تأیید */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-gray-700">
                      گروه‌های مشاوره:
                    </p>
                    {isLoadingGroups ? (
                      <p className="text-gray-500 text-xs">
                        در حال بارگذاری گروه‌ها...
                      </p>
                    ) : (
                      <Select
                        onValueChange={(value) => setSelectedGroup(value)}
                        required
                      >
                        {/* اضافه کردن کلاس‌های راست‌چین به SelectTrigger */}
                        <SelectTrigger className="w-full rtl text-right">
                          <SelectValue
                            placeholder="گروه را انتخاب کنید"
                            className="text-right rtl"
                          />
                        </SelectTrigger>

                        {/* اضافه کردن کلاس‌های راست‌چین به SelectContent */}
                        <SelectContent className="text-right rtl">
                          {groups?.map(
                            (group: {
                              id: string;
                              description: string;
                              organ: string;
                              diseaseType: string;
                            }) => (
                              <SelectItem
                                key={group.id}
                                value={group.id}
                                className="text-right rtl"
                              >
                                {group.description}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* دکمه‌های تأیید و رد */}
                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => approveMutation.mutate()}
                      disabled={!selectedGroup}
                      className="bg-green-500 hover:bg-green-600 text-white flex-1"
                    >
                      تأیید کاربر
                    </Button>
                    {/* <Button
               onClick={() => rejectMutation.mutate()}
               disabled={!rejectionReason}
               className="bg-red-500 hover:bg-red-600 text-white flex-1"
             >
               رد کاربر
             </Button> */}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                اطلاعاتی برای نمایش وجود ندارد.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
