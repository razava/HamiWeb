import React, { useEffect, useState } from "react";

import { CreditCard, LogOut, User, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProfile, revoke } from "@/utils/authenticateApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import useToken from "@/store/useToken";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function ProfileDropDown() {
  const router = useRouter();
  const [role, setRole] = useState<any>(null);
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Profile"],
    queryFn: () => getProfile(),
  });

  const revokeMutation = useMutation({
    mutationFn: revoke,
    onSuccess: (res) => {},
    onError: (err: any | string) => {},
  });

  const logout = () => {
    revokeMutation.mutate({
      refreshToken: getCookie("Hami_Admin_Refresh_Token"),
    });
    deleteCookie("Hami_Admin_Token");
    localStorage.removeItem("privateKey");
    localStorage.removeItem("privatePassword");
    router.push("/");
  };
  useEffect(() => {
    const userRole = localStorage.getItem("Hami_Role");
    if (userRole == "Admin") {
      setRole("AdminDashboard");
    } else {
      setRole("ControllerDashboard");
    }
  }, []);

  const saveToken = useToken((state) => state.saveToken);
  return (
    <DropdownMenu dir="rtl" modal={false}>
      <DropdownMenuTrigger
        className=" max-sm:-mr-8 max-sm:text-xs w-12"
        asChild
      >
        <Button
          //   variant="outline"
          className=" truncate bg-white text-blue hover:bg-white w-32 flex justify-center items-center gap-2"
        >
          <User className=" w-5 h-5" />
          {/* {profileData?.title ? profileData?.title : profileData?.userName} */}
          <p className=" truncate self-end">
            {" "}
            {profileData?.firstName || profileData?.lastName
              ? profileData?.firstName + " " + profileData?.lastName
              : profileData?.userName}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 sm:ml-10">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/UserPanel/${role}/Profile`)}
          >
            <User className="w-4 h-4 ml-2" />
            <span>پروفایل</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="w-4 h-4 ml-2" />
          <span>خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
