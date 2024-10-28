"use client";
import React, { useEffect, useState } from "react";
import greenIcon from "../public/img/greenPoint.svg";
import blueIcon from "../public/img/bluepoint.svg";
import Image from "next/image";
import { ComplainDetailsItems } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { OperateByInspector, getComplaint } from "@/utils/inspectorApi";
import useData from "@/store/useData";
import { Decrypt, convertDate, convertFullTime } from "@/lib/utils";
import { Badge } from "./ui/badge";
import InspectorOperations from "./InspectorOperations";
import { ArrowDownToLine, ArrowRight, File } from "lucide-react";
import { Separator } from "./ui/separator";
import secureLocalStorage from "react-secure-storage";
import { Checkbox } from "./ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Triangle } from "react-loader-spinner";
export default function ComplainsDetails({
  id,
  role,
  Data,
}: {
  id?: number;
  role: string;
  Data?: any;
}) {
  const storeData = useData((state) => state.data);
  const [open, setOpen] = useState<boolean>(true);
  const [check, setCheck] = useState<any>(false);
  const [complaintData, setComplaintData] = useState<any>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [key, setKey] = useState<any>(null);
  const router = useRouter();
  let data;

  const getComplaintMutation = useMutation({
    mutationKey: ["Complaint", id],
    mutationFn: getComplaint,
    onSuccess: (res) => {
      localStorage.setItem("trackingNumber", res.trackingNumber);
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  useEffect(() => {
    const storedData = localStorage.getItem("CompliantData");
    const data = JSON.parse(storedData as string);
    const prvKey = localStorage.getItem("privateKey") as string;
    const cipherKeyInspector = data.cipherKeyInspector;
    const newDcKey = Decrypt(cipherKeyInspector, prvKey);

    const pw = newDcKey as string;
    localStorage.setItem("trackingNumber", data.trackingNumber);
    if (pw) {
      getComplaintMutation.mutate({
        trackingNumber: data.trackingNumber,
        password: pw,
      });
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("CompliantData");
    const data = JSON.parse(storedData as string);
    setComplaintData(data);
  }, []);

  if (getComplaintMutation.isSuccess) {
    data = getComplaintMutation.data;
  }

  const openFileInNewTab = (
    base64Data: any,
    fileType: any,
    fileName?: string
  ) => {
    const blob = b64toBlob(base64Data, fileType);
    const blobUrl = URL.createObjectURL(blob);
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(
        '<html style="height: 100%;"><head><title>File Preview</title></head><body style="margin: 0; padding: 0; height: 100%; overflow: hidden;">'
      );

      // Check the file type and handle accordingly
      if (fileType.includes("image")) {
        newTab.document.write(
          `<img src="data:${fileType};base64,${base64Data}" alt="File Preview"/>`
        );
      } else if (fileType === "application/pdf") {
        newTab.document.write(
          `<iframe width="100%" height="100%" src="${blobUrl}"></iframe>`
        );
      } else {
        downloadFile(base64Data, fileName, fileType);
      }

      newTab.document.write("</body></html>");
      newTab.document.close();

      URL.revokeObjectURL(blobUrl);
    } else {
      console.error("Unable to open a new tab.");
    }
  };

  const downloadFile = (base64Data: any, fileName: any, fileType: any) => {
    const blob = b64toBlob(base64Data, fileType);
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(blobUrl);
  };

  const b64toBlob = (b64Data: any, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e?.target?.result;
      setSelectedFile(contents);
    };
    reader.readAsText(file);
  };

  const checkKey2 = (item: any) => {
    const dcKey = Decrypt(item.cipherKeyInspector, selectedFile);
    if (dcKey != false && dcKey != null) {
      if (check) {
        localStorage.setItem("privateKey", selectedFile);
      }
      localStorage.setItem("trackingNumber", item.trackingNumber);
      setKey(dcKey);
      getComplaintMutation.mutate({
        trackingNumber: item.trackingNumber,
        password: dcKey as string,
      });
      setOpen(false);
    } else {
      toast("کلید شما معتبر نمی باشد.", {
        className: "!bg-red-500 !text-white",
      });
    }
  };

  data = getComplaintMutation?.data;

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent dir="rtl" className="">
          <AlertDialogHeader dir="rtl">
            <AlertDialogTitle dir="rtl">بارگذاری کلید خصوصی</AlertDialogTitle>
            <AlertDialogDescription>
              برای مشاهده شکایت لطفا کلید خود را آپلود نمایید.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5 px-8">
            <Input
              dir="rtl"
              id="picture"
              onChange={handleFileChange}
              type="file"
              accept=".txt"
              className="bg-white  hover:bg-white focus:bg-white"
            />
          </div>
          <div className="flex items-center px-8 space-x-2">
            <Checkbox
              checked={check}
              onCheckedChange={setCheck}
              id="terms"
              className="ml-2 "
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ذخیره کلید برای استفاده در زمان های بعدی
            </label>
          </div>
          <AlertDialogFooter className=" gap-y-2 max-md:w-full max-md:flex max-md:flex-col">
            {/* <DialogClose asChild></DialogClose> */}
            <Button
              variant="outline"
              onClick={() => {
                router.push("/UserPanel/ControllerDashboard/Complaints");
              }}
              type="submit"
              className=" md:ml-2"
            >
              بازگشت
            </Button>
            <Button
              className=" bg-blue hover:bg-blue/90"
              onClick={() => {
                checkKey2(complaintData);
              }}
              type="submit"
            >
              مشاهده
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {getComplaintMutation.data && !getComplaintMutation.isPending ? (
        <>
          {/* <button
            onClick={() =>
              router.push("/UserPanel/ControllerDashboard/Complaints")
            }
            className="flex gap-1 my-2 cursor-pointer  text-blue lg:sticky top-20"
          >
            <span>
              <ArrowRight />
            </span>
            <p>بازگشت</p>
          </button> */}

          <div className="flex items-start w-full gap-2 mt-2 max-lg:flex-col lg:h-[80vh] mb-10">
            {/* 1 */}
            <div className="flex flex-col w-full lg:w-1/3 gap-3 lg:sticky top-28 lg:h-[80vh] max-lg:order-3">
              <div className=" bg-[#E9E9E9] rounded-md p-4 px-6 flex flex-col lg:h-full">
                <p className="text-[#464646] text-base font-bold mb-1">
                  انجام عملیات
                </p>
                <InspectorOperations
                  updateData={(data) => getComplaintMutation.mutate(data)}
                  role={role}
                  complaintData={data}
                  id={id}
                  key2={key}
                />
              </div>
            </div>
            {/* 2 */}
            <div className="flex flex-col self-stretch w-full gap-2 rounded-lg lg:w-2/3 ">
              <div className=" bg-[#E9E9E9] rounded-md py-5 px-6 flex flex-col md:flex-row gap-2 min-h-56 items-stretch justify-center">
                {data.user == null ? (
                  <>
                    <div className="relative flex flex-col w-full p-5 mt-2 border border-gray-400 rounded-md gap-y-1">
                      <p className=" absolute -top-3 right-2 bg-[#E9E9E9] px-2 text-sm text-[#464646] font-bold">
                        اطلاعات کلی
                      </p>
                      <p className="text-[#2e2a2a] text-sm font-medium">
                        موضوع شکایت:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data?.title}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        دستگاه مرتبط:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data?.complaintOrganization
                            ? data?.complaintOrganization.title
                            : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        فرد مرتبط:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.complaining ? data.complaining : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        کد پیگیری:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.trackingNumber ? data.trackingNumber : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        زمان ثبت:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {convertFullTime(data.registeredAt)}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        وضعیت:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data?.statusWithDescription
                            ? data.statusWithDescription.description
                            : "-"}
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative flex flex-col p-5 mt-2 border border-gray-400 rounded-md gap-y-1 md:w-1/2 w-full h-full">
                      <p className=" absolute -top-3 right-2 bg-[#E9E9E9] px-2 text-sm text-[#464646] font-bold">
                        اطلاعات کلی
                      </p>
                      <p className="text-[#2e2a2a] text-sm font-medium">
                        موضوع شکایت:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data?.title}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        دستگاه مرتبط:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data?.complaintOrganization
                            ? data?.complaintOrganization.title
                            : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        فرد مرتبط:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.complaining ? data.complaining : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        کد پیگیری:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.trackingNumber ? data.trackingNumber : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        زمان ثبت:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {convertFullTime(data.registeredAt)}
                        </span>
                      </p>{" "}
                      <p className="text-[#464646] text-sm font-medium">
                        وضعیت:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data?.statusWithDescription
                            ? data.statusWithDescription.description
                            : "-"}
                        </span>
                      </p>
                    </div>
                    <div className="relative flex flex-col items-start p-5 mt-2 border border-gray-400 rounded-md gap-y-1 md:w-1/2 w-full h-full">
                      <p className=" absolute -top-3 right-2 bg-[#E9E9E9] px-2 text-sm text-[#464646] font-bold">
                        اطلاعات شاکی
                      </p>
                      <p className="text-[#2e2a2a] text-sm font-medium">
                        نام:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.user?.firstName ? data.user?.firstName : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        نام خانوادگی:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.user?.lastName ? data.user?.lastName : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        کدملی:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.user?.nationalId ? data.user?.nationalId : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        شماره موبایل:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.user?.phoneNumber
                            ? data.user?.phoneNumber
                            : "-"}
                        </span>
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        {/* کد پیگیری:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.trackingNumber ? data.trackingNumber : "-"}
                        </span> */}
                      </p>
                      <p className="text-[#464646] text-sm font-medium">
                        {/* کد پیگیری:{" "}
                        <span className="text-[#7C838A] text-sm font-medium">
                          {data.trackingNumber ? data.trackingNumber : "-"}
                        </span> */}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="h-[calc(80vh-12.8em)] max-h-[calc(80vh-12.8em)] overflow-hidden">
                <div className="bg-[#E9E9E9] rounded-md py-4 px-6 flex flex-col h-full  ">
                  <p className="text-[#464646] text-base font-bold">
                    روند رسیدگی گزارش{" "}
                  </p>
                  <div
                    className="flex flex-col mt-4 overflow-y-auto 
                  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 "
                  >
                    {data.contents?.map((item: any, index: any, array: any) => {
                      return (
                        <>
                          <div className="flex flex-row gap-2 m-1">
                            <div className="flex">
                              <span className=" flex items-center justify-center w-7 h-7 mt-1 mr-1 bg-blue-100 rounded-md -start-4 ring-2 ring-blue bg-blue2 text-white bg-blue">
                                {array.length - index}
                              </span>
                            </div>
                            <div
                              key={item.id}
                              className="p-4 bg-white rounded-lg shadow-md w-full relative"
                            >
                              <div className="flex items-center sm:gap-4 justify-between flex-col sm:flex-row gap-1">
                                <p className="">
                                  <Badge  className="bg-blue">
                                    {item.operationWithDescription.description}{" "}
                                    توسط {item.sender == 0 ? "شهروند" : "بازرس"}
                                  </Badge>
                                </p>
                                <p className="">
                                  <span className="text-blue text-sm">
                                    {convertFullTime(item.dateTime)}
                                  </span>
                                </p>
                              </div>
                              <p className="text-[#7C838A] text-sm flex flex-wrap whitespace-normal break-all mt-2">
                                {item.text ? item.text : "-"}
                              </p>
                              {item.media.length !== 0 && (
                                <Separator className="mt-2 mb-1 " />
                              )}
                              <div className=" text-[#464646] mt-2">
                                <div className="flex flex-wrap items-center w-full gap-2 mt-2 text-xs  max-md:flex-col">
                                  {item?.media.map(
                                    (item: any, index: number) => {
                                      return (
                                        <div
                                          key={index}
                                          className=" bg-gray-100 text-[#7C838A] w-full md:w-[30%] rounded-md h-12 p-2 flex justify-between gap-3 items-center cursor-pointer"
                                          onClick={() =>
                                            openFileInNewTab(
                                              item.data,
                                              item.mimeType,
                                              item.title
                                            )
                                          }
                                        >
                                          <a className="flex items-center gap-2 truncate cursor-pointer ">
                                            <File className="w-6 h-6 " />
                                            <p className=" max-w-full truncate">
                                              {item.title}
                                            </p>
                                          </a>
                                          {/* <ArrowDownToLine
                                      className="cursor-pointer "
                                      onClick={() =>
                                        downloadFile(
                                          item.data,
                                          item.title,
                                          item.mimeType
                                        )
                                      }
                                    /> */}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {getComplaintMutation.isPending && (
            <div className="flex justify-center items-center w-full h-screen bg-transparent">
            <Triangle
              visible={true}
              height="100"
              width="100"
              color="#003778"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=" bg-transparent"
            />
          </div>
          
          )}
        </>
      )}
    </>
  );
}
