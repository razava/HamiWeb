"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, RefetchOptions } from "@tanstack/react-query";
import {
  GetAllSliders,
  GetSingleSlider,
  SubmitSlider,
  UpdateSlider,
  DeleteSlider,
  GetAllOrganizations,
  GetSingleOrganization,
  SubmitOrganization,
  UpdateOrganization,
  DeleteOrganization,
} from "@/utils/adminApi";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "./ui/textarea";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

const MAX_IMAGE_SIZE = 5242880; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];
// Form Validation
const EditSliderFormSchema = z.object({
  titleSlider: z
    .string()
    .min(2, {
      message: "عنوان باید حداقل 2 کاراکتر باشد.",
    })
    .max(30, {
      message: "عنوان نباید بیشتر از 30 کاراکتر باشد.",
    }),

  uploadImg: z
    .custom<File>((val) => val instanceof File, "Required")
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      `File size should be less than ${MAX_IMAGE_SIZE / (1024 * 1024)} MB.`
    )
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    )
    .nullish(),

  urlSlider: z.string(),
  description: z.string().max(2000),
});

// Add Key Form
const AddSliderFormSchema = z.object({
  titleSlider: z
    .string()
    .min(2, {
      message: "عنوان باید حداقل 2 کاراکتر باشد.",
    })
    .max(30, {
      message: "عنوان نباید بیشتر از 30 کاراکتر باشد.",
    }),

  uploadImg: z
    .custom<File>((val) => val instanceof File, "Required")
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE,
      `File size should be less than ${MAX_IMAGE_SIZE / (1024 * 1024)} MB.`
    )
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    )
    .nullish(),

  urlSlider: z.string(),
  description: z.string().max(2000),
});

export default function AdminSlider() {
  const router = useRouter();
  const [keyId, setKeyId] = useState("");
  const [titleSlider, settitleSlider] = useState("");
  const [descSlider, setDescSlider] = useState("");
  const [urlSlider, seturlSlider] = useState("");
  const [imageSlider, setImageSlider] = useState("");

  const [keyIdDel, setKeyIdDel] = useState("");

  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const [delOrg, setDelOrg] = React.useState(false);

  // List News
  const {
    data: data1,
    error: Error1,
    isLoading: isListLoading,
    refetch: refetch1,
  } = useQuery({
    queryKey: ["SliderList"],
    queryFn: () => GetAllSliders(),
    // refetchOnWindowFocus: false,
  });

  // Edit
  const handleClickEdit = (
    id: string,
    title: string,
    description: string,
    url: string,
    image: string
  ) => {
    // Set state variables
    setKeyId(id);
    settitleSlider(title);
    setDescSlider(description);
    seturlSlider(url);
    setImageSlider(image);

    // Reset the form with new default values
    formEdit.reset({
      titleSlider: title,
      description: description,
      urlSlider: url,
      // uploadImg:image
    });
  };

  // Form Edit
  type EditSliderFormValues = z.infer<typeof EditSliderFormSchema>;
  // This can come from your database or API.
  const defaultValuesEdit: Partial<EditSliderFormValues> = {
    titleSlider: "",
    description: "",
    urlSlider: "",
  };

  const formEdit = useForm<EditSliderFormValues>({
    resolver: zodResolver(EditSliderFormSchema),
    defaultValues: defaultValuesEdit,
    mode: "onChange",
  });

  // Form Add
  type AddSliderFormValues = z.infer<typeof AddSliderFormSchema>;
  // This can come from your database or API.
  const defaultValuesAdd: Partial<AddSliderFormValues> = {
    titleSlider: "",
    description: "",
    urlSlider: "",
  };

  const formAdd = useForm<AddSliderFormValues>({
    resolver: zodResolver(AddSliderFormSchema),
    defaultValues: defaultValuesAdd,
    mode: "onChange",
  });
  // Edit Submit

  // ............'Mutation' Change Slider Submit
  const ChangeSliderMutation = useMutation({
    mutationKey: ["ChangeSlider"],
    mutationFn: UpdateSlider,
    onSuccess: (res) => {
      setOpenEdit(false);

      refetch1();

      toast("عملیات شما با موفقیت انجام شد. ", {
        className: "!bg-green-500 !text-white",
      });
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  //Delete
  const DeleteSliderMutation = useMutation({
    mutationKey: ["DeleteSlider"],
    mutationFn: DeleteSlider,
    onSuccess: (res) => {
      setOpenEdit(false);
      refetch1();
      toast("عملیات شما با موفقیت انجام شد. ", {
        className: "!bg-green-500 !text-white",
      });
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  // Add
  // ............'Mutation' Add Slider Submit
  const AddSliderMutation = useMutation({
    mutationKey: ["AddSlider"],
    mutationFn: SubmitSlider,
    onSuccess: (res) => {
      setOpenAdd(false);
      refetch1();

      toast("عملیات شما با موفقیت انجام شد. ", {
        className: "!bg-green-500 !text-white",
      });
      formAdd.reset({
        titleSlider: "",
        uploadImg: null,
        urlSlider: "",
        description: "",
      });
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
      formAdd.reset({
        titleSlider: "",
        uploadImg: null,
        urlSlider: "",
        description: "",
      });
    },
  });

  function onSubmitEdit(data: EditSliderFormValues) {
    const formData = new FormData();
    formData.append("Title", data.titleSlider);
    if (data?.uploadImg instanceof File) {
      formData.append("Image", data.uploadImg);
    }
    formData.append("Url", data.urlSlider);
    formData.append("Description", data.description);
    // if (data?.media && data?.media?.length > 0) {
    //   for (let i = 0; i < data.media.length; i++) {
    //     formData.append("Medias", data.media[i]);
    //   }
    // }
    ChangeSliderMutation.mutate({ id: keyId, payload: formData });

    refetch1();
  }

  function onSubmitAdd(data: AddSliderFormValues) {
    const formData = new FormData();
    formData.append("Title", data.titleSlider);
    formData.append("Url", data.urlSlider);
    formData.append("Description", data.description);

    if (data?.uploadImg instanceof File) {
      formData.append("Image", data.uploadImg);
    }

    AddSliderMutation.mutate(formData);
  }

  const resetFormAdd = () => {
    formAdd.reset({
      titleSlider: "",
      uploadImg: null,
      urlSlider: "",
      description: "",
    });
  };
  const { resetField } = useForm();

  return (
    <div className="w-full min-h-[85vh] flex justify-center">
      <div className="w-[95vw] lg:w-[85vw] 3xl:w-[70vw] mt-8 max-sm:mt-16 pt-9 ">
        <div className="flex flex-row items-center  justify-between w-full ">
          {/* 1 */}
          <div className="w-full my-4 text-lg font-bold text-right text-neutral-600">
            لیست اسلایدرها
          </div>
          {/* 2 */}

          {/* 1 */}
          <AlertDialog open={openAdd} onOpenChange={setOpenAdd}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                // onClick={handleClickAddCat}
                className="text-white bg-orange-500"
                // disabled={isNewKeyLoading}
              >
                افزودن اسلایدر
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="  w-full max-w-3xl h-full lg:max-h-[28em] max-h-screen sm:max-h-[27em]">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p className="text-[#464646] text-base font-bold">
                    افزودن اسلایدر
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
                  <div className="w-full ">
                    <Form {...formAdd}>
                      <form
                        onSubmit={formAdd.handleSubmit(onSubmitAdd)}
                        className="flex flex-col w-full "
                      >
                        <div className="flex flex-row flex-wrap justify-between">
                          <FormField
                            control={formAdd.control}
                            name="titleSlider"
                            render={({ field }) => (
                              <FormItem className="w-full ">
                                <FormLabel> عنوان اسلایدر</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="عنوان اسلایدر  را وارد نمایید"
                                    {...field}
                                    className="bg-white "
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formAdd.control}
                            name="uploadImg"
                            render={({ field: { onChange }, ...field }) => {
                              // Get current uploadFile value (always watched updated)
                              const uploadImg = formAdd.watch("uploadImg");
                              var filename: string | undefined = undefined;

                              if (uploadImg) {
                                const file: File | null = uploadImg || null;

                                if (file) {
                                  // Check if the file is an image
                                  const allowedImageTypes = [
                                    "image/jpeg",
                                    "image/png",
                                    "image/webp",
                                    "image/jpg",
                                  ];

                                  if (allowedImageTypes.includes(file.type)) {
                                    // Valid image file type
                                    filename = file.name;
                                  } else {
                                    // Invalid file type
                                    // You may want to display an error message or take appropriate action
                                    console.error(
                                      "Invalid file type. Only images (JPEG, PNG, GIF) are allowed."
                                    );
                                  }
                                }
                              }

                              return (
                                <FormItem className="w-full sm:w-[48%]">
                                  <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                                    پیوست
                                  </FormLabel>
                                  {/* File Upload */}
                                  <FormControl>
                                    <Input
                                      type="file"
                                      className="mb-3 bg-white"
                                      accept="image/*"
                                      multiple={false} // Allow only one file
                                      disabled={formAdd.formState.isSubmitting}
                                      {...field}
                                      onChange={(event) => {
                                        const newFile = event.target.files?.[0];
                                        onChange(newFile);
                                      }}
                                    />
                                  </FormControl>
                                  {/* Show File Name */}
                                  {/* <FormDescription>{filename}</FormDescription> */}
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />

                          <FormField
                            control={formAdd.control}
                            name="urlSlider"
                            render={({ field }) => (
                              <FormItem className="w-full sm:w-[48%]">
                                <FormLabel>لینک</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="لینک"
                                    {...field}
                                    className="bg-white "
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={formAdd.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="w-full ">
                                <FormLabel>توضیحات</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="توضیحات"
                                    className="resize-none bg-white 3xl:min-h-[110px]"
                                    {...field}
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
                            className="text-center text-white bg-blue min-w-max rounded-xl hover:bg-white hover:text-slate-800"
                          >
                            افزودن
                          </Button>
                          <AlertDialogCancel
                            className="mt-0 text-white bg-blue rounded-xl"
                            onClick={() => {
                              resetFormAdd();
                            }}
                          >
                            بستن
                          </AlertDialogCancel>
                        </div>
                      </form>
                    </Form>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {/* <AlertDialogCancel>بستن</AlertDialogCancel> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-row flex-wrap justify-between w-full gap-8 md:gap-4 ">
          <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
            <AlertDialogContent className=" w-full max-w-3xl h-full lg:max-h-[28em] max-h-screen sm:max-h-[27em]">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p className="text-[#464646] text-base font-bold">
                    ویرایش اسلایدر
                  </p>
                  <AlertDialogCancel className="h-auto p-0 border-0">
                    <IoMdClose />
                  </AlertDialogCancel>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <Form {...formEdit}>
                    <form
                      onSubmit={formEdit.handleSubmit(onSubmitEdit)}
                      className="flex flex-col w-full"
                    >
                      <div className="flex flex-row flex-wrap justify-between">
                        <FormField
                          control={formEdit.control}
                          name="titleSlider"
                          render={({ field }) => (
                            <FormItem className="w-full ">
                              <FormLabel>عنوان</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="عنوان"
                                  {...field}
                                  className="bg-white "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEdit.control}
                          name="uploadImg"
                          render={({ field: { onChange }, ...field }) => {
                            // Get current uploadFile value (always watched updated)
                            const uploadImg = formEdit.watch("uploadImg");
                            var filename: string | undefined = undefined;

                            if (uploadImg) {
                              const file: File | null = uploadImg || null;

                              if (file) {
                                // Check if the file is an image
                                const allowedImageTypes = [
                                  "image/jpeg",
                                  "image/png",
                                  "image/webp",
                                  "image/jpg",
                                ];

                                if (allowedImageTypes.includes(file.type)) {
                                  // Valid image file type
                                  filename = file.name;
                                } else {
                                  // Invalid file type
                                  // You may want to display an error message or take appropriate action
                                  console.error(
                                    "Invalid file type. Only images (JPEG, PNG, GIF) are allowed."
                                  );
                                }
                              }
                            }

                            return (
                              <FormItem className="w-full sm:w-[48%]">
                                <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                                  پیوست
                                </FormLabel>
                                {/* File Upload */}
                                <FormControl>
                                  <Input
                                    type="file"
                                    className="mb-3 bg-white"
                                    accept="image/*"
                                    multiple={false} // Allow only one file
                                    disabled={formEdit.formState.isSubmitting}
                                    {...field}
                                    onChange={(event) => {
                                      const newFile = event.target.files?.[0];
                                      onChange(newFile);
                                    }}
                                  />
                                </FormControl>
                                {/* Show File Name */}
                                {/* <FormDescription>{filename}</FormDescription> */}
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={formEdit.control}
                          name="urlSlider"
                          render={({ field }) => (
                            <FormItem className="w-full sm:w-[48%]">
                              <FormLabel>لینک</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="لینک"
                                  {...field}
                                  className="bg-white "
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formEdit.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="w-full ">
                              <FormLabel>توضیحات</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="توضیحات"
                                  className="resize-none bg-white 3xl:min-h-[110px]"
                                  {...field}
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
                          ویرایش اسلایدر
                        </Button>

                        <AlertDialogCancel className="mt-0 text-white bg-blue rounded-xl">
                          بستن
                        </AlertDialogCancel>
                      </div>
                    </form>
                  </Form>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>

            {data1?.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className={`w-full lg:w-[48%] bg-[#F5F5F5]  border rounded-lg flex flex-row shadow-md  transition-all
          h-[20em] sm:h-[15em] max-sm:flex-col max-sm:gap-[3px]
                      `}
                >
                  <div className="w-1/2 h-full rounded-r-lg max-sm:h-1/2 max-md:w-1/3 max-sm:w-full">
                    <Image
                      alt="picture"
                      src={`${process.env.NEXT_PUBLIC_BASE_URL_APP}${item?.image?.url}`}
                      height={500}
                      width={500}
                      quality={100}
                      className="w-full h-full rounded-r-lg bg-cover object-cover"
                    />
                  </div>
                  <div className="w-1/2 h-full flex flex-col p-3 justify-between max-md:justify-evenly max-md:w-2/3 max-sm:h-1/2 max-sm:w-full">
                    <div>
                      <p className="text-sm font-normal leading-normal text-slate-500">
                        عنوان :
                        <span className=" text-slate-800">{item.title}</span>
                      </p>
                      <p className="text-sm font-normal leading-normal text-slate-500">
                        توضیحات:
                        <span className="self-end text-slate-800 line-clamp-4">
                          {item.description}
                        </span>
                      </p>
                    </div>
                    {/* <p className="text-sm font-normal leading-normal text-slate-500">
                    محتوا:
                    <span className="self-end text-slate-800">
                      {item.content}
                    </span>
                  </p> */}

                    <div className="flex items-end justify-end w-full gap-2">
                      <Switch
                        dir="ltr"
                        checked={!item.isDeleted}
                        onCheckedChange={() => {
                          DeleteSliderMutation.mutate({
                            id: item.id,
                          });
                        }}
                        id={item.id}
                      />

                      <AlertDialogTrigger asChild>
                        {/* <Button variant="outline">Show Dialog</Button> */}
                        <FaRegEdit
                          aria-hidden="true"
                          className="self-end w-6 h-6 text-slate-600 hover:cursor-pointer"
                          // onClick={() => setKeyId(item?.id)}
                          onClick={() =>
                            handleClickEdit(
                              item?.id,
                              item?.title,
                              item?.description,
                              item?.url,
                              item?.image
                            )
                          }
                        />
                      </AlertDialogTrigger>
                    </div>
                  </div>
                </div>
              );
            })}
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
