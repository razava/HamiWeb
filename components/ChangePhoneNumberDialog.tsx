import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCaptcha } from "@/utils/commonApi";
import { ThreeDots } from "react-loader-spinner";
import Image from "next/image";
import { postChangePhoneNumber } from "@/utils/authenticateApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function ChangePhoneNumberDialog({
  data,
  open,
  setOpen,
}: {
  data?: any;
  open: any;
  setOpen: (state: any) => any;
}) {
  const router = useRouter();

  const {
    data: CaptchaData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Captcha"],
    queryFn: () => getCaptcha(),
    refetchOnWindowFocus: false,
  });

  const changePhoneNumberMutation = useMutation({
    mutationKey: ["postChangePhoneNumber"],
    mutationFn: postChangePhoneNumber,
    onSuccess: (res) => {
      localStorage.setItem("ph_token", res.token);
      localStorage.setItem("ph_newToken", res.newToken);
      localStorage.setItem("ph_phoneNumber", res.phoneNumber);
      localStorage.setItem("ph_newPhoneNumber", res.newPhoneNumber);
      const userRole = localStorage.getItem("userRole");
      if (userRole === "Admin") {
        router.push(`/UserPanel/AdminDashboard/ChangePhoneNumber`);
      } else {
        router.push(`/UserPanel/ControllerDashboard/ChangePhoneNumber`);
      }
    },
    onError: (err: any | string) => {
      refetch();
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  const FormSchema = z.object({
    phoneNumber: z.string().min(1, {
      message: "لطفا شماره موبایل را وارد نمایید.",
    }),
    captcha: z
      .string({ required_error: "لطفا کد امنیتی را وارد نمایید." })
      .length(5, { message: "لطفا کد امنیتی را به طور کامل وارد نمایید." }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = {
      newPhoneNumber: data.phoneNumber,
      captcha: {
        key: CaptchaData?.headers["captcha-key"],
        value: data.captcha,
      },
    };
    changePhoneNumberMutation.mutate(payload);
  }

  const srcForImage = CaptchaData
    ? URL.createObjectURL(CaptchaData.data)
    : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>تغییر شماره موبایل</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col w-full my-6 ">
                
                <FormField
  control={form.control}
  name="phoneNumber"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel className="text-[#7C838A] text-sm font-medium mt-7">
        شماره موبایل جدید
      </FormLabel>
      <FormControl>
        <Input
          onClick={() => setOpen(true)}
          type="text"
          className="text-base"
          {...field}
          // تنها پذیرش کاراکترهای عددی
          onChange={(e) => {
            const value = e.target.value;
            // فیلتر کردن کاراکترهای غیر عددی
            if (/^\d*$/.test(value)) {
              field.onChange(value);
            }
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


                  <div className="flex items-center gap-3 mt-4">
                    <FormField
                      control={form.control}
                      name="captcha"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem className="items-center flex-1 h-10 ">
                          {/* <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                    رمز عبور
                  </FormLabel> */}
                          <FormControl>
                            <Input
                              className=" text-base"
                              placeholder="کد امنیتی"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isLoading ? (
                      <div className="flex justify-center text-center w-36">
                        <ThreeDots
                          visible={true}
                          height="50"
                          width="50"
                          color="#003778"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-center ">
                        <Image
                          alt="icon"
                          src={srcForImage as string}
                          className="h-12 rounded-md shadow-md w-36"
                          width={150}
                          height={20}
                          quality={100}
                        />
                        <RefreshCcw
                          className="cursor-pointer "
                          onClick={() => refetch()}
                          color="#003778"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <DialogFooter>
              <Button type="submit">تایید و ادامه</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
