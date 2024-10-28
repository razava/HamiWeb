import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { X } from "lucide-react";
import { Button } from "./ui/button";
export default function AttachmentsDialog({
  children,
  attachments,
  deleteFile,
  deleteAllAttachmentsFiles,
}: {
  children: React.ReactNode;
  attachments: File[] | [];
  deleteFile: (file: any) => void;
  deleteAllAttachmentsFiles: () => void;
}) {
  return (
    <Dialog>
      {children}
      <DialogContent className=" max-h-[95vh] overflow-y-auto max-sm:p-0">
        <AlertDialog>
          <DialogHeader>
            <DialogTitle className=" mt-7">پیوست‌ها</DialogTitle>
            <DialogDescription className="max-md:px-2 py-5 w-full">
              {attachments.length != 0 && (
                <AlertDialogTrigger>
                  <Button className=" mb-2 absolute right-3 top-1 p-1  bg-white hover:bg-white text-red-600 ">
                    حذف همه
                  </Button>{" "}
                </AlertDialogTrigger>
              )}

              {attachments.length == 0 ? (
                <div className=" text-center my-5">هیج پیوستی وجود ندارد.</div>
              ) : (
                <div className=" flex flex-col gap-2 mt-2 h-full mx-2">
                  {attachments?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className=" flex gap-2 w-full items-center"
                      >
                        <div className=" p-2 bg-blue w-10 grid place-content-center rounded-lg text-white">
                          {index + 1}
                        </div>
                        <div className="bg-gray-200 p-2 rounded-lg max-w-full justify-between flex flex-1">
                          <div className="">
                            <p className=" truncate max-w-[16rem]">
                              {item.name}
                            </p>
                          </div>

                          <X
                            onClick={() => deleteFile(item.name)}
                            className=" cursor-pointer hover:drop-shadow-md"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    آیا میخواهید همه ی فایل ها را حذف کنید؟
                  </AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className=" gap-2">
                  <AlertDialogCancel className=" flex-1">
                    لغو
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className=" flex-1"
                    onClick={() => deleteAllAttachmentsFiles()}
                  >
                    تایید
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </DialogDescription>
          </DialogHeader>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
