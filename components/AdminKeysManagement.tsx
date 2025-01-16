"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  useMutation,
  useQuery,
  RefetchOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { GenerateKeyPair, GetKeys, AddKey, ChangeKey } from "@/utils/adminApi";
import { FaRegEdit } from "react-icons/fa";
import { FaDotCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import { ThreeDots } from "react-loader-spinner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "./ui/textarea";
import { Check, KeyRound } from "lucide-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5242880; // 5 MB
// Edit Key Form
const FormSchemaEditKey = z.object({
  uploadPrivateKey: z.any(),
});

// Add Key Form
const FormSchemaAddKey = z.object({
  title: z.string().min(2, {
    message: "عنوان کلید را وارد کنید",
  }),
  publicKey: z.string().min(4, {
    message: "کلید عمومی را وارد کنید",
  }),
});

export default function AdminKeysManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [keyId, setKeyId] = useState("");
  const [done, setDone] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [polling, setPolling] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const inputPubRef = useRef<HTMLTextAreaElement | null>(null);
  const inputPrvRef = useRef<HTMLTextAreaElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e?.target?.result;
      // Process the contents of the file here
      setSelectedFile(contents);
    };
    reader?.readAsText(file);
  };

  // Edit Form
  const formEdit = useForm<z.infer<typeof FormSchemaEditKey>>({
    resolver: zodResolver(FormSchemaEditKey),
    defaultValues: {
      // publicKeyId: "",
      // uploadFile: null,
    },
  });

  // ............'Mutation' Change Key Submit
  const ChangeKeyMutation = useMutation({
    mutationKey: ["ChangeKey"],
    mutationFn: ChangeKey,
    onSuccess: (res) => {
      if (res.total == res.done) {
        localStorage.removeItem("isChangingKey");
        setPolling(false);
        queryClient.invalidateQueries({ queryKey: ["KeysList"] });
        if (res.failed == 0) {
          refetch1();
          toast("عملیات شما با موفقیت انجام شد. ", {
            className: "!bg-green-500 !text-white",
          });
        } else if (res.failed > 0) {
          toast("مشکلی در اعمال کلید به وجود آمد.", {
            className: "!bg-red-500 !text-white",
          });
        }
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null; // Reset the ref value after clearing
        }
      } else {
        localStorage.setItem("isChangingKey", "true");
        setPolling(true);
      }
      setOpenEdit(false);
      setDone(res.done);
      setTotal(res.total);

      // router.refresh()
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  function onSubmitEdit(data: z.infer<typeof FormSchemaEditKey>) {
    ChangeKeyMutation.mutate({
      privateKey: selectedFile,
      publicKeyId: keyId,
      isPolling: false,
    });
  }

  // Add Form
  const formAdd = useForm<z.infer<typeof FormSchemaAddKey>>({
    resolver: zodResolver(FormSchemaAddKey),
    defaultValues: {
      title: "",
      publicKey: "",
    },
  });

  // ............'Mutation' Add Key Submit
  const AddKeyMutation = useMutation({
    mutationKey: ["AddKey"],
    mutationFn: AddKey,
    onSuccess: (res) => {
      setOpenAdd(false);

      refetch1();
      formAdd.reset();

      if (inputPubRef.current && inputPrvRef.current) {
        inputPrvRef.current.value = "";
        inputPubRef.current.value = "";
      }

      toast("عملیات شما با موفقیت انجام شد. ", {
        className: "!bg-green-500 !text-white",
      });

      // inputPubRef.current.clear();
      // router.refresh()
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  function onSubmitAdd(data: z.infer<typeof FormSchemaAddKey>) {
    AddKeyMutation.mutate({
      title: data.title,
      publicKey: data.publicKey,
    });
  }
  

  // List Keys
  const {
    data: data1,
    error: Error1,
    isLoading: isListLoading,
    refetch: refetch1,
    isSuccess: isSuccess1,
  } = useQuery({
    queryKey: ["KeysList"],
    queryFn: () => GetKeys(),
  });

  // GenerateKeyPair
  const {
    data: data2,
    error: Error2,
    isLoading: isNewKeyLoading,
    refetch: refetch2,
    isSuccess: isSuccess2,
  } = useQuery({
    queryKey: ["GenerateKey"],
    queryFn: () => GenerateKeyPair(),
    enabled: false, // Disable automatic fetching
  });

  // Define the type for refetch2
  // type RefetchFunction = (options?: RefetchOptions) => Promise<void>;

  const handleClickGenerate = () => {
    refetch2();
  };
  useEffect(() => {
    if (isSuccess2) {
      formAdd.setValue("publicKey", data2?.publicKey);
    }
  }, [isSuccess2]);

  useEffect(() => {
    if (inputPubRef.current && inputPrvRef.current) {
      inputPubRef.current.value = data2?.publicKey ?? "";
      inputPrvRef.current.value = data2?.privateKey ?? "";
    }
  }, [handleClickGenerate]);

  const refethKey = () => {
    ChangeKeyMutation.mutate({
      privateKey: "",
      publicKeyId: "cb7258da-64b0-4f43-b4f7-8ee11799d643",
      isPolling: true,
    });
  };
  useEffect(() => {
    const isChangingKey = localStorage.getItem("isChangingKey");
    if (isChangingKey) {
      // setTimeout(() => {}, 1000);
      intervalRef.current = setInterval(refethKey, 2000);
      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null; // Reset the ref value after clearing
        }
      };
    }
  }, [polling]);

  const saveTextFile = () => {
    const textToSave = data2?.privateKey ?? "";
    const fileName = "privateKey.txt";

    // Create a Blob containing the file data
    const blob = new Blob([textToSave], { type: "text/plain" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute and create a URL for the Blob
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the document and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (AddKeyMutation.isSuccess) {
      saveTextFile();
    }
  }, [AddKeyMutation.isSuccess]);

  const resetFormAdd = () => {
    formAdd.reset({
      title: "",
      publicKey: "",
    });
  };

  return (
    <div className="w-full min-h-[85vh] flex justify-center">
      <div className="w-[95vw] lg:w-[85vw] 3xl:w-[70vw] mt-8 max-sm:mt-16 pt-9 ">
        {polling && (
          <div className=" w-full md:w-1/2 mx-auto mt-2">
            <p className=" font-bold test-sm">
              درحال اعمال کلید({Math.floor((done * 100) / total)}%) ...
            </p>
            <Progress className=" mt-5" value={(done * 100) / total} />
          </div>
        )}
        {/* 1 */}
        <AlertDialog open={openAdd} onOpenChange={setOpenAdd}>
          <AlertDialogContent className="">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <p className="text-[#464646] text-base font-bold">
                  افزودن کلید جدید
                </p>
                <AlertDialogCancel
                  className="h-auto p-0 border-0"
                  onClick={() => {
                    resetFormAdd();
                  }}
                >
                  <IoMdClose />
                </AlertDialogCancel>
              </AlertDialogTitle>

              <AlertDialogDescription>
                <div className="flex justify-between w-full ">
                  <div className="w-full mt-4 mb-2 text-lg font-bold text-right text-neutral-600">
                    افزودن کلید جدید
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleClickGenerate}
                    disabled={isNewKeyLoading}
                    className="my-2"
                  >
                    {" "}
                    ایجاد جفت کلید
                  </Button>
                </div>
                <Form {...formAdd}>
                  <form
                    onSubmit={formAdd.handleSubmit(onSubmitAdd)}
                    className="flex flex-col w-full mt-6 "
                  >
                    <div className="flex flex-col flex-wrap justify-between">
                      <FormField
                        control={formAdd.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="w-full ">
                            <FormLabel className="text-[#7C838A] text-sm font-medium">
                              عنوان کلید
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="عنوان کلید را وارد نمایید"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formAdd.control}
                        name="publicKey"
                        render={({ field }) => (
                          <FormItem className="w-full ">
                            <FormLabel className="text-[#7C838A]  text-sm font-medium ">
                              کلید خصوصی
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="کلید خصوصی را وارد نمایید."
                                {...field}
                                className="bg-white resize-none"
                                dir="ltr"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-center w-full gap-2 mt-8 sm:justify-end">
                      <Button
                        type="submit"
                        className="w-1/2 p-2 text-center text-white bg-blue min-w-max sm:w-1/3 lg:w-1/4 rounded-xl"
                      >
                        افزودن کلید
                      </Button>
                    </div>
                  </form>
                </Form>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogCancel>بستن</AlertDialogCancel> */}
              {/* <AlertDialogAction>Continue</AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>

          {/* 2 */}
          <div className="flex items-center justify-between w-full mt-1 ">
            <div className="w-full my-4 text-lg font-bold text-right text-neutral-600">
              لیست کلیدها
            </div>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-white bg-orange-500 hover:bg-orange-500/80 hover:text-white"
                // disabled={isNewKeyLoading}
              >
                افزودن کلید جدید
              </Button>
            </AlertDialogTrigger>
          </div>
          <div className="flex flex-row flex-wrap w-full gap-8 md:gap-4">
            {data1?.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className={cn(
                    `flex flex-col justify-center gap-2 w-full md:w-[31%] lg:w-[23%] h-28 px-5 rounded-md shadow-md items-start bg-[#F5F5F5]
                        `,
                    item?.isActive && " border-r-4 border-green-600"
                  )}
                >
                  <div className=" flex gap-2 items-center">
                    <div className=" p-2 bg-blue rounded-lg">
                      <KeyRound className="  text-white" />
                    </div>
                    <p className="text-sm font-normal leading-normal  text-slate-500">
                      {/* عنوان کلید:{" "} */}
                      <span className=" text-slate-800">{item.title}</span>
                    </p>
                  </div>

                  {/* <p className="text-sm font-normal leading-normal  text-slate-500">
                    آیدی کارشناس:{" "}
                    <span className="self-end  text-slate-800">
                      {item.inspectorId}
                    </span>
                  </p> */}
                  {item?.isActive ? (
                    <Check className="self-end w-6 h-6 text-green-600" />
                  ) : (
                    <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
                      <AlertDialogTrigger asChild>
                        {/* <Button variant="outline">Show Dialog</Button> */}
                        <FaDotCircle
                          aria-hidden="true"
                          className="self-end w-6 h-6 text-slate-600 hover:cursor-pointer"
                          onClick={() => setKeyId(item?.id)}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent className=" w-full max-w-3xl h-full lg:max-h-[20em] max-h-[23em]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>انتخاب کلید جدید</AlertDialogTitle>
                          <AlertDialogDescription>
                            <Form {...formEdit}>
                              <form
                                onSubmit={formEdit.handleSubmit(onSubmitEdit)}
                                className="flex flex-col w-full mt-6 "
                              >
                                <div className="flex flex-row flex-wrap justify-between">
                                  <FormField
                                    control={formEdit.control}
                                    name="uploadPrivateKey"
                                    render={({ field }) => (
                                      <FormItem className="w-full ">
                                        <FormLabel className="text-[#7C838A] text-sm font-medium mb-2">
                                          پیوست (کلید خصوصی)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            required={true}
                                            type="file"
                                            accept=".txt"
                                            className="mt-2 bg-slate-300"
                                            // {...field}
                                            onChange={handleFileChange}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="flex justify-center w-full gap-2 mt-8 sm:justify-end">
                                  <Button
                                    type="submit"
                                    className="p-2 text-center text-white bg-blue min-w-max rounded-xl hover:bg-white hover:text-slate-800"
                                  >
                                    اعمال کلید
                                  </Button>

                                  {/* <AlertDialogAction
                                type="submit"
                                className="p-2 text-center text-white bg-blue min-w-max rounded-xl hover:bg-white hover:text-slate-800"
                              >
                              تغییر کلید
                              </AlertDialogAction> */}

                                  <AlertDialogCancel className="mt-0 text-white bg-blue rounded-xl">
                                    بستن
                                  </AlertDialogCancel>
                                </div>
                              </form>
                            </Form>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              );
            })}
          </div>
        </AlertDialog>
      </div>
    </div>
  );
}
