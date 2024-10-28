"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AdminMenuItems, ControllerMenuItems } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { Squash as Hamburger } from "hamburger-react";
import { AnimatePresence, motion } from "framer-motion";
import { getProfile, revoke } from "@/utils/authenticateApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DoorOpen, LogOut } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import useSignalR from "@/hooks/useSignalR";
import ProfileDropDown from "./ProfileDropDown";

export default function NavbarPanel() {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("");
  const [role, setRole] = useState<string | null>("");

  useEffect(() => {
    const userRole = localStorage.getItem("Hami_Role");
    setRole(userRole);
  }, []);

  useEffect(() => {
    // Set the active link based on the current route
    setActiveLink(pathname);
  }, [pathname]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["Profile"],
    queryFn: () => getProfile(),
  });

  const revokeMutation = useMutation({
    mutationFn: revoke,
    onSuccess: (res) => {},
    onError: (err: any | string) => {},
  });

  const menus = {
    Admin: AdminMenuItems,
    Inspector: ControllerMenuItems,
  };
  const selectedMenu = menus[role as keyof typeof menus];

  const logout = () => {
    revokeMutation.mutate({
      refreshToken: getCookie("Hami_Admin_Refresh_Token"),
    });
    deleteCookie("Hami_Admin_Token");
    localStorage.removeItem("privateKey");
    localStorage.removeItem("privatePassword");
    router.push("/");
  };
  const signalr = useSignalR();

  return (
    <div className="fixed top-0 z-10 flex flex-row items-center justify-between w-full gap-3 px-8 py-4 shadow-md sm:items-center sm:gap-0 bg-blue max-md:px-4 ">
      <div className="flex items-center gap-8  max-md:gap-4">
        <div className=" md:hidden">
          <Hamburger
            toggled={isOpen}
            size={20}
            toggle={setOpen}
            direction="right"
            color="#fff"
          />
        </div>
        <p className="inline-block text-sm font-bold text-white bg-clip-text max-md:text-sm max-md:font-medium">
          پنل کاربری {<span className=" max-md:hidden">|</span>}
        </p>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[100] left-0 shadow-4xl right-0 top-[3rem] p-5 bg-gradient-to-b from-blue to-white border-b border-b-white/20"
            >
              <ul className="grid gap-2 ">
                {selectedMenu.map((item, idx, array) => {
                  // const { Icon } = item;
                  const lastItem = array.length - 1;
                  return (
                    <motion.li
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1 + idx / 10,
                      }}
                      key={item.name}
                      className=" w-full p-[0.08rem] rounded-xl bg-gradient-to-tr from-neutral-800 via-white to-neutral-700"
                    >
                      <Link
                        onClick={() => setOpen((prev) => !prev)}
                        className={`flex items-center justify-between w-full p-3 rounded-xl  text-white
                        ${lastItem === idx ? "bg-blue" : "bg-blue"} `}
                        href={item.href}
                      >
                        <span className="flex gap-1 text-sm">{item.name}</span>
                        {/* <Icon className="text-xl" /> */}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-row gap-7 max-md:gap-3 max-md:hidden">
          {role && (
            <>
              {selectedMenu.map(
                (item: { id: number; name: string; href: string }) => {
                  const isActive = activeLink === item.href;

                  return (
                    <Link key={item.id} href={item.href}>
                      <p
                        className={`text-white font-normal text-sm max-md:text-xs
                   hover:bg-white/50  rounded-sm p-1
                   animate-out duration-300 ${isActive ? "bg-white/50 " : ""}`}
                      >
                        {item.name}
                      </p>
                    </Link>
                  );
                }
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 ">
        <h1 className="inline-block text-sm font-bold text-white bg-clip-text before:max-md:hidden max-md:text-xs max-md:font-medium">
          <ProfileDropDown />
        </h1>
      </div>
    </div>
  );
}
