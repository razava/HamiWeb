"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableController from "./TableController";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import { getComplaintsList, getPossibleStates } from "@/utils/inspectorApi";
import { Button } from "@/components/ui/button";
import { Triangle } from "react-loader-spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Decrypt } from "@/lib/utils";
import useData from "@/store/useData";
import { toast } from "sonner";
import Pagination from "./Pagination";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "react-responsive";

export default function TabController() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Adjust the max width for mobile

  const [search, setSearch] = useState<any>(null);
  const [page, setPage] = useState<any>(1);
  const [totalCount, setTotalCount] = useState<any>(0);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [pageSize, setPageSize] = useState<any>(0);
  const [totalPages, setTotalPages] = useState<any>(0);
  const [cancel, setCancel] = useState<boolean>(false);

  const router = useRouter();

  const [psblState, setPsblState] = useState(0);
  const [selectedTab, setSelectedTab] = useState<string>("0");

  const {
    data: dataState,
    isLoading: isLoadingState,
    refetch: refetchState,
  } = useQuery({
    queryKey: ["PossibleStates"],
    queryFn: () => getPossibleStates(),
    refetchOnWindowFocus: false,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ComplaintsList", psblState, dataState, page],
    queryFn: () =>
      getComplaintsList({
        states: psblState,
        TrackingNumber: search,
        PageNumber: page,
      }),
    refetchOnWindowFocus: false,
  });

  const handelSearch = (event: any) => {
    setPage(1);
    refetch();
  };
  useEffect(() => {
    if (cancel) {
      refetch();
    }
  }, [cancel]);

  useEffect(() => {
    if (data) {
      const headersData = JSON.parse(data.headers["x-pagination"]);
      setTotalCount(headersData.TotalCount);
      setTotalPages(headersData.TotalPages);
      setCurrentPage(headersData.CurrentPage);
      setPageSize(headersData.PageSize);
      setCancel(false);
    }
  }, [data]);
  useEffect(() => {
    const activeTab = localStorage.getItem("ActiveTab");
    const activePage = localStorage.getItem("ActivePage");
    if (activeTab) {
      setSelectedTab(activeTab);
      setPsblState(Number(activeTab));
    }
    if (activePage) {
      setCurrentPage(activePage);
    }
  }, []);
  
  const isZero = totalCount === 0;

  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mt-16 pt-9 mx-auto">
      {isMobile ? (
        // Render your shadcn Select for mobile
        <div>
          <Tabs value={String(selectedTab)} className="" dir="rtl">
            <div className="flex flex-col-reverse items-center justify-between w-full gap-4 mb-5 lg:flex-row lg:gap-2">
              <Select
                value={selectedTab}
                onValueChange={(value) => {
                  setPsblState(Number(value));
                  setSelectedTab(String(value));
                  localStorage.setItem("ActiveTab", String(value));
                  localStorage.setItem("ActivePage", page);
                  refetch();
                  setSearch("");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full h-12 bg-[#E9E9E9] " dir="rtl">
                  <SelectValue placeholder="انتخاب دسته بندی" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {dataState?.map((item: any) => (
                    <SelectItem key={item.value} value={String(item.value)}>
                      {item.title} ({item.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Search Box */}
              <Search
                value={search}
                changeValue={(data: any) => setSearch(data)}
                mode="controller"
                action={handelSearch}
                Cancel={() => setCancel(true)}
              />
            </div>

            {/* Tab Content */}
            <TabsContent value={selectedTab} key={selectedTab}>
              {data ? (
                <TableController
                  data={data?.data}
                  currentPage={currentPage}
                  pageSize={pageSize}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              )}

              {!isZero ? (
                <Pagination
                  TotalPages={totalPages}
                  currentPage={currentPage - 1}
                  countPage={totalCount}
                  Page={(num: number) => setPage(num + 1)}
                />
              ) : (
                <>
                  {" "}
                  {data?.data.length == 0 && (
                    <p className="flex justify-center mx-auto mt-10 text-blue/50">
                      گزارشی وجود ندارد
                    </p>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        // Render Tabs for larger screens
        // <Tabs value={String(selectedTab)} className="" dir="rtl">
        //   <div className="flex flex-col-reverse items-center justify-between w-full gap-4 mb-5 lg:flex-row lg:gap-2">

        //     {/* Tab Title  */}
        //     <TabsList className="flex w-full gap-1 h-a max-lg:flex-wrap max lg:w-4/5 md:gap-4 lg:gap-1 p-1">
        //       {/* <p className="text-xs font-bold 3xl:ml-6 sm:text-sm max-xl:hidden">
        //       لیست شکایت ها |
        //     </p> */}

        //       {dataState?.map((item: any) => {
        //         return (
        //           <TabsTrigger
        //             key={item.value}
        //             className="hover:border-b-2 border-b-blue flex-1 h-10"
        //             value={String(item.value)}
        //             // data-state={isActive ? 'active' : 'inactive'}
        //             onClick={() => {
        //               setPsblState(item.value);
        //               setSelectedTab(String(item.value));
        //               localStorage.setItem("ActiveTab", String(item.value));
        //               localStorage.setItem("ActivePage", page);
        //               refetch();
        //               setSearch("");
        //               setPage(1);
        //             }}
        //           >
        //             <div className="relative w-full ">
        //               {item.title} ({item.count})
        //             </div>
        //           </TabsTrigger>
        //         );
        //       })}
        //     </TabsList>

        //     {/* Search Box */}
        //     <Search
        //       value={search}
        //       changeValue={(data: any) => setSearch(data)}
        //       mode="controller"
        //       action={handelSearch}
        //       Cancel={() => setCancel(true)}
        //     />
        //   </div>

        //   {/* Tab Content */}

        //   <TabsContent value={selectedTab} key={selectedTab}>
        //     {data ? (
        //       <TableController
        //         data={data?.data}
        //         currentPage={currentPage}
        //         pageSize={pageSize}
        //       />
        //     ) : (
        //       <div className="flex flex-col gap-3">
        //         <Skeleton className="w-full h-12" />
        //         <Skeleton className="w-full h-12" />
        //         <Skeleton className="w-full h-12" />
        //         <Skeleton className="w-full h-12" />
        //       </div>
        //     )}

        //     {!isZero ? (
        //       <Pagination
        //         TotalPages={totalPages}
        //         currentPage={currentPage - 1}
        //         countPage={totalCount}
        //         Page={(num: number) => setPage(num + 1)}
        //       />
        //     ) : (
        //       <>
        //         {" "}
        //         {data?.data.length == 0 && (
        //           <p className="flex justify-center mx-auto mt-10 text-blue/50">
        //             درخواستی وجود ندارد
        //           </p>
        //         )}
        //       </>
        //     )}
        //   </TabsContent>
        // </Tabs>
        <div>
          <Tabs value={String(selectedTab)} className="" dir="rtl">
            <div className="flex flex-col-reverse items-center justify-between w-full gap-4 mb-5 lg:flex-row lg:gap-2">
              {/* Tab Title  */}
              <TabsList className="flex w-full gap-1 h-a max-lg:flex-wrap max lg:w-4/5 md:gap-4 lg:gap-1 p-1">
                {dataState?.map((item: any) => (
                  <TabsTrigger
                    key={item.value}
                    className="hover:border-b-2 border-b-blue flex-1 h-10"
                    value={String(item.value)}
                    onClick={() => {
                      setPsblState(item.value);
                      setSelectedTab(String(item.value));
                      localStorage.setItem("ActiveTab", String(item.value));
                      localStorage.setItem("ActivePage", String(currentPage));
                      refetch();
                      setSearch("");
                      setPage(1);
                    }}
                  >
                    <div className="relative w-full ">
                      {item.title} ({item.count})
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Search Box */}
              <Search
                value={search}
                changeValue={(data: any) => setSearch(data)}
                mode="controller"
                action={handelSearch}
                Cancel={() => setCancel(true)}
              />
            </div>

            {/* Tab Content */}
            <TabsContent value={selectedTab} key={selectedTab}>
              {data ? (
                <TableController
                  data={data?.data}
                  currentPage={currentPage}
                  pageSize={pageSize}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              )}

              {!isZero ? (
                <Pagination
                  TotalPages={totalPages}
                  currentPage={currentPage - 1}
                  countPage={totalCount}
                  Page={(num: number) => setPage(num + 1)}
                />
              ) : (
                <>
                  {" "}
                  {data?.data.length == 0 && (
                    <p className="flex justify-center mx-auto mt-10 text-blue/50">
                      گزارشی وجود ندارد
                    </p>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
