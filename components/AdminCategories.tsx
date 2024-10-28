"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  GetAllCategories,
  GetSingleCategory,
  SubmitCategory,
  UpdateCategory,
  DeleteCategory,
} from "@/utils/adminApi";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
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

// Form Validation
const EditCatFormSchema = z.object({
  titleCat: z
    .string()
    .min(2, {
      message: "عنوان باید حداقل 2 کاراکتر باشد.",
    })
    .max(30, {
      message: "عنوان نباید بیشتر از 30 کاراکتر باشد.",
    }),
  description: z.string().max(160),
});

// Add Key Form
const AddCatFormSchema = z.object({
  titleCategory: z.string().min(2, {
    message: "عنوان  را وارد کنید",
  }),
  description: z.string(),
});

export default function AdminCategories() {
  const router = useRouter();
  // states
  const [keyId, setKeyId] = useState("");
  const [keyIdDel, setKeyIdDel] = useState("");
  const [titleCat, setTitleCat] = useState("");
  const [descCat, setDescCat] = useState("");

  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const [delCat, setDelCat] = React.useState(false);

  // List Categories
  const {
    data: data1,
    error: Error1,
    isLoading: isListLoading,
    refetch: refetch1,
  } = useQuery({
    queryKey: ["CategoriesList"],
    queryFn: () => GetAllCategories(),
  });

  // Edit
  const handleClickEdit = (id: string, title: string, description: string) => {
    // Set state variables
    setKeyId(id);
    setTitleCat(title);
    setDescCat(description);

    // Reset the form with new default values
    formEdit.reset({
      titleCat: title,
      description: description,
    });
  };

  // Form Edit
  type EditCatFormValues = z.infer<typeof EditCatFormSchema>;
  // This can come from your database or API.
  const defaultValuesEdit: Partial<EditCatFormValues> = {
    titleCat: "",
    description: "",
  };

  const formEdit = useForm<EditCatFormValues>({
    resolver: zodResolver(EditCatFormSchema),
    defaultValues: defaultValuesEdit,
    mode: "onChange",
  });

  // Form Add
  type AddCatFormValues = z.infer<typeof AddCatFormSchema>;
  // This can come from your database or API.
  const defaultValuesAdd: Partial<AddCatFormValues> = {
    titleCategory: "",
    description: "",
  };

  const formAdd = useForm<AddCatFormValues>({
    resolver: zodResolver(AddCatFormSchema),
    defaultValues: defaultValuesAdd,
    mode: "onChange",
  });
  // Edit Submit

  // ............'Mutation' Change Key Submit
  const ChangeCatMutation = useMutation({
    mutationKey: ["ChangeCat"],
    mutationFn: UpdateCategory,
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
  const DeleteCatMutation = useMutation({
    mutationKey: ["DeleteCat"],
    mutationFn: DeleteCategory,
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
  // ............'Mutation' Change Key Submit
  const AddCatMutation = useMutation({
    mutationKey: ["AddCat"],
    mutationFn: SubmitCategory,
    onSuccess: (res) => {
      setOpenAdd(false);

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

  function onSubmitEdit(data: EditCatFormValues) {
    ChangeCatMutation.mutate({
      id: keyId,
      payload: {
        title: data.titleCat,
        description: data.description,
      },
    });
  }
  function onSubmitAdd(data: AddCatFormValues) {
    AddCatMutation.mutate({
      title: data.titleCategory,
      description: data.description,
    });
  }

  const resetFormAdd = () => {
    formAdd.reset({
      titleCategory: "",
      description: "",
    });
  };

  return (
    <div className="w-full min-h-[85vh] flex justify-center">
      <div className="w-[95vw] lg:w-[85vw] 3xl:w-[70vw] mt-8 max-sm:mt-16 pt-9 ">
        <div className="flex flex-row items-center  justify-between w-full ">
          {/* 1 */}
          <div className="w-full my-4 text-lg font-bold text-right text-neutral-600">
            لیست دسته بندی ها
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
                افزودن دسته بندی
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="  w-full max-w-3xl h-full lg:max-h-[26em] max-h-[24em]">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p className="text-[#464646] text-base font-bold">
                    افزودن دسته بندی
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
                    <div className="w-full mb-2 text-lg font-bold text-right text-neutral-600">
                      افزودن دسته بندی
                    </div>

                    <Form {...formAdd}>
                      <form
                        onSubmit={formAdd.handleSubmit(onSubmitAdd)}
                        className="flex flex-col w-full mt-6 "
                      >
                        <div className="flex flex-col flex-wrap justify-between">
                          <FormField
                            control={formAdd.control}
                            name="titleCategory"
                            render={({ field }) => (
                              <FormItem className="w-full ">
                                <FormLabel className="text-[#7C838A] text-sm font-medium">
                                  عنوان دسته بندی
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="عنوان دسته بندی را وارد نمایید"
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
                            name="description"
                            render={({ field }) => (
                              <FormItem className="w-full ">
                                <FormLabel className="text-[#7C838A]  text-sm font-medium ">
                                  توضیحات
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="  توضیحات  را وارد کنید"
                                    {...field}
                                    className="bg-white"
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
            <AlertDialogContent className=" w-full max-w-3xl h-full lg:max-h-[25em] max-h-[23em]">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <p className="text-[#464646] text-base font-bold">
                    ویرایش دسته بندی
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
                      <div className="flex flex-col flex-wrap justify-between">
                        <FormField
                          control={formEdit.control}
                          name="titleCat"
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
                          name="description"
                          render={({ field }) => (
                            <FormItem className="w-full ">
                              <FormLabel>توضیحات</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="توضیحات"
                                  className="bg-white resize-none"
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
                          ویرایش دسته بندی
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
                  className={`flex flex-col justify-center gap-2 w-full lg:w-[49%] h-28 px-5 rounded-md shadow-md items-start bg-[#F5F5F5]
                        `}
                >
                  <p className="text-sm font-normal leading-normal text-slate-500">
                    عنوان :<span className=" text-slate-800">{item.title}</span>
                  </p>
                  <p className="text-sm font-normal leading-normal text-slate-500">
                    توضیحات:
                    <span className="self-end text-slate-800">
                      {item.description}
                    </span>
                  </p>

                  <div className="flex items-end justify-end w-full gap-2">
                    <Switch
                      dir="ltr"
                      checked={!item.isDeleted}
                      onCheckedChange={() => {
                        DeleteCatMutation.mutate({
                          id: item.id,
                          payload: !item.isDeleted,
                        });
                      }}
                      id={item.id}
                    />

                    <AlertDialogTrigger asChild>
                      <FaRegEdit
                        aria-hidden="true"
                        className="self-end w-6 h-6 text-slate-600 hover:cursor-pointer"
                        onClick={() =>
                          handleClickEdit(
                            item?.id,
                            item?.title,
                            item?.description
                          )
                        }
                      />
                    </AlertDialogTrigger>
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
