"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Operations } from "@/constants";
import useData from "@/store/useData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OperateByInspector } from "@/utils/inspectorApi";
import { toast } from "sonner";
import { Decrypt, formatBytes } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { getOptions } from "@/utils/commonApi";
import AttachmentsDialog from "./AttachmentsDialog";
import { DialogTrigger } from "./ui/dialog";
import { Eye, Upload,ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


export default function InspectorOperations({
  complaintData,
  role,
  updateData,
  id,
  key2,
}: {
  complaintData: any;
  role: string;
  updateData: (data: any) => any;
  id: any;
  key2: any;
}) {
  const [file, setFile] = useState<File[]>([]);
  const [check, setCheck] = useState<any>(false);
  const [charCount, setCharCount] = useState<any>(0);

  // Queries
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Options"],
    queryFn: () => getOptions(),
    refetchOnWindowFocus: false,
  });

  const OperationMutation = useMutation({
    mutationKey: ["Operation"],
    mutationFn: OperateByInspector,
    onSuccess: (res) => {
      toast("عملیات شما با موفقیت انجام شد. ", {
        className: "!bg-green-500 !text-white",
      });
      // const tk = localStorage.getItem("trackingNumber");
      const storedData = JSON.parse(
        localStorage.getItem("CompliantData") as string
      );
      const dcKey = Decrypt(
        storedData.cipherKeyInspector,
        localStorage.getItem("privateKey") as string
      );
      updateData({
        trackingNumber: complaintData.trackingNumber,
        password: key2 ? key2 : dcKey,
      });
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  const FormSchema = z.object({
    text: z
      .string({ required_error: "لطفا متن خود را وارد نمایید." })
      .max(
        data?.maxTextLength,
        `حداکثر ${data?.maxTextLength} کاراکتر می توانید وارد کنید.`
      ),
    ...(role == "Inspector" && {
      type: z.enum(["private", "public"], {
        required_error: "لطفا وضعیت عملیات را انتخاب نمایید.",
      }),
    }),
    operation: z.string({
      required_error: "لطفا نوع عملیات را انتخاب نمایید.",
    }),
    media: z
      .custom<File[]>()
      // .refine((files) => files.length > 0, `Required`)
      .refine(
        (files) => files.length <= data?.maxFileCount,
        `تعداد فایل های پیوست شده  می بایست حداکثر ${data?.maxFileCount} عدد باشد.`
      )
      .refine(
        (files) => files.every((item) => item.size < data?.maxFileSize),
        `حجم هر فایل حداکثر می بایست ${data?.maxFileSize} باشد.`
      )
      .nullish(),
  });

  const password = useData((state) => state.data.password);
  const possibleOperations = complaintData?.possibleOperationsWithDescription;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      operation:
        possibleOperations.length == 1
          ? String(possibleOperations[0].value)
          : undefined,
    },
  });

  // Add the useEffect hook to monitor changes in the description field
  useEffect(() => {
    const text = form.watch("text") as string;
    if (charCount != 0) {
      setCharCount(text?.length);
    }
  }, [form.watch("text")]);

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newCharCount = event.target.value.length;
    // Update charCount only when the user types or removes characters
    if (newCharCount <= data?.maxTextLength) {
      setCharCount(newCharCount);
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const storedData = JSON.parse(
      localStorage.getItem("CompliantData") as string
    );
    const dcKey = Decrypt(
      storedData.cipherKeyInspector,
      localStorage.getItem("privateKey") as string
    );
    const formData = new FormData();
    formData.append("text", data.text);
    formData.append("trackingNumber", complaintData.trackingNumber);
    formData.append("Operation", data.operation);
    if (data.type) {
      formData.append("IsPublic", data.type == "public" ? "true" : "false");
    }
    formData.append("EncodedKey", key2 ? key2 : dcKey);
    if (data?.media && data?.media?.length > 0) {
      for (let i = 0; i < data.media.length; i++) {
        formData.append("Medias", data.media[i]);
      }
    }
    OperationMutation.mutate(formData);
  }
  const deleteAllAttachmentsFiles = () => {
    setFile([]);
    // @ts-expect-error
    form.setValue("media", []);
  };

  const deleteFileFromAttachments = (File: any) => {
    const filtered = file?.filter((item) => item.name !== File);
    setFile(filtered);
    // @ts-expect-error
    form.setValue("media", filtered);
  };

  const allowedExtensions = data?.allowedExtensions;
  const split = allowedExtensions?.split(",");
  const withDot = split?.map((item: string) => "." + item);
  const newAllowedExtensions = withDot?.join(",");
  const formatSize = (size: number) => {
    const string = formatBytes(size);
    return (
      <span className="" dir="ltr">
        {string}
      </span>
    );
  };

  const router = useRouter();

  return (
  
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="text"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className="">
                متن({charCount}/{data?.maxTextLength})
              </FormLabel>
              <FormControl>
                <Textarea
                  // placeholder="متن خود را وارد نمایید"
                  className="resize-none bg-white lg:min-h-[18em]"
                  {...field}
                  disabled={possibleOperations.length == 0}
                  onChange={(e) => {
                    const currentValue = e.target.value;
                    if (currentValue.length <= data?.maxTextLength) {
                      field.onChange(e);
                      handleTextChange(e);
                    } else {
                      // Truncate the value to the allowed limit
                      field.onChange(
                        currentValue.substring(0, data?.maxTextLength)
                      );
                    }
                  }}
                />
              </FormControl>
              {!error ? (
                <FormDescription className=" text-xs my-1 ">
                  حداکثر {data?.maxTextLength} کاراکتر می توانید وارد کنید.
                </FormDescription>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="media"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>
                پیوست‌ها ({field?.value?.length ? field.value.length : 0})
              </FormLabel>
              <div className="flex gap-2 w-full items-center mt-1 mb-2">
                <AttachmentsDialog
                  attachments={file}
                  deleteFile={(item) => deleteFileFromAttachments(item)}
                  deleteAllAttachmentsFiles={deleteAllAttachmentsFiles}
                >
                  <DialogTrigger className="  bg-white rounded-md h-9 text-xs flex-1 flex gap-2 items-center justify-center">
                    <Eye className=" w-4 h-4" />
                    <p>مشاهده</p>
                  </DialogTrigger>
                </AttachmentsDialog>
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer text-sm rounded-md grid place-content-center h-9 px-2 bg-white w-1/2 items-center"
                >
                  <div className=" flex gap-2 justify-center items-center">
                    <p className="text-xs flex gap-2 items-center">
                      <Upload className=" w-4 h-4" />
                      <span>افزودن</span>
                    </p>
                  </div>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept={newAllowedExtensions}
                  multiple
                  onChange={(e) => {
                    // field.onChange(e.target.files ? e.target.files : null);
                    if (file && e.target.files) {
                      const fileArray1 = Array.from(file);
                      const fileArray2 = Array.from(e.target.files);
                      const mergedArray = fileArray1.concat(fileArray2);
                      const uniqueFiles = Array.from(
                        new Map(
                          mergedArray.map((file: any) => [file.name, file])
                        ).values()
                      );
                      setFile(uniqueFiles);
                      field.onChange(uniqueFiles);
                    } else if (!file && e.target.files) {
                      const fileArray2 = Array.from(e.target.files);
                      setFile(fileArray2);
                      field.onChange(fileArray2);
                    }
                  }}
                />
              </div>
              {!error ? (
                <FormDescription className=" text-xs my-1 ">
                  <span>
                   حداکثر حجم {formatSize(data?.maxFileSize)}{" "}
                  </span>{" "}
                  و{" "}
                  {`حداکثر تعداد فایل آپلود شده ${data?.maxFileCount} عدد`}{" "}
                  و{" "}
                  فرمت های مجاز : .pdf,.jpg,.jpeg,.png,.doc,.docx
                </FormDescription>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        {role == "Inspector" && (
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="">
                <FormControl dir="rtl">
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCheck(false);
                    }}
                    // defaultValue={field.value}
                    className="flex space-y-1 text-sm"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          onClick={() => {
                            // @ts-expect-error
                            form.setValue("type", "private");
                          }}
                          value="private"
                          className="ml-2 "
                          checked={form.getValues("type") == "private"}
                          disabled={possibleOperations.length == 0}
                        />
                      </FormControl>
                      <span className=" text-red-500">*</span>

                      <FormLabel className="font-normal">
  خصوصی
  <span className="text-xs text-gray-500 ml-2">
    (قابل مشاهده فقط توسط بازرس)
  </span>
</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="public"
                          className="ml-2 "
                          checked={form.getValues("type") == "public"}
                          disabled={possibleOperations.length == 0}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                      عمومی
  <span className="text-xs text-gray-500 ml-2">
    (قابل انتشار برای گزارش گر)
  </span>
</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className=" mt-1" />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between gap-2 mt-auto ">
          <FormField
            control={form.control}
            name="operation"
            render={({ field }) => (
              <FormItem className="flex-1 ">
                {/* <FormLabel>Email</FormLabel> */}
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCheck(false);
                    if (value == "2") {
                      setCheck(true);
                      // @ts-expect-error
                      form.setValue("type", "public");
                    }
                  }}
                  defaultValue={field.value}
                  dir="rtl"
                >
                  <FormControl>
                    <SelectTrigger
                      className=" bg-white h-10 !placeholder:text-xs text-xs"
                      dir="rtl"
                      disabled={possibleOperations.length == 0}
                    >
                      <span className=" text-red-500">*</span>
                      <SelectValue
                        className="text-xs "
                        placeholder="نوع عملیات"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    ref={(ref) => {
                      if (!ref) return;
                      ref.ontouchstart = (e) => e.preventDefault();
                    }}
                    dir="rtl"
                  >
                    <SelectGroup>
                      <SelectLabel>نوع عملیات</SelectLabel>
                      {possibleOperations.map((item: any) => {
                        return (
                          <SelectItem
                            key={item.value}
                            value={String(item.value)}
                          >
                            {item.description}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                  You can manage email addresses in your{" "}
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={possibleOperations.length == 0}
            className="w-1/3  bg-blue"
            type="submit"
          >
            ثبت
          </Button>

          <Button
  className="w-1/3 bg-gray-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-400"
  type="button"
  onClick={() => router.push("/UserPanel/ControllerDashboard/Complaints")}
>
  بازگشت
</Button>
        </div>
      </form>
    </Form>
   
  );
}
