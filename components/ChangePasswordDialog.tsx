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
import { X } from "lucide-react";
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
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/utils/authenticateApi";
import { deleteCookie } from "cookies-next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function ChangePasswordDialog({
  data,
  open,
  setOpen,
}: {
  data?: any;
  open: any;
  setOpen: (state: any) => any;
}) {
  const router = useRouter();
  const ChangePasswordMutation = useMutation({
    mutationKey: ["ChangePassword"],
    mutationFn: changePassword,
    onSuccess: (res) => {
      deleteCookie("Hami_Admin_Token");
      localStorage.removeItem("privateKey");
      localStorage.removeItem("privatePassword");
      router.push("/");
      toast("رمز عبور شما با موفقیت تغییر یافت.", {
        className: "!bg-green-500 !text-white",
      });
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
    },
  });

  const FormSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
    repeatedPassword: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.newPassword !== data.repeatedPassword) {
      toast("رمز عبور شما با هم مطابقت ندارد.", {
        className: "!bg-red-500 !text-white",
      });
      return;
    }
    ChangePasswordMutation.mutate({
      token: data.oldPassword,
      newPassword: data.newPassword,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {" "}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full mt-6  "
          >
            <DialogHeader>
              <DialogTitle>تغییر رمز عبور</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col w-full my-6 ">
                  <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                          رمز عبور فعلی
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                          رمز عبور جدید
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repeatedPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-[#7C838A]  text-sm font-medium mt-7">
                          تکرار رمز عبور
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <DialogFooter>
              <Button type="submit">تایید و ادامه</Button>
            </DialogFooter>{" "}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
