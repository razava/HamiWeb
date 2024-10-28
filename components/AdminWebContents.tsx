"use client";
import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { SubmitWebContents, UpdateWebContents } from "@/utils/adminApi";
import { getContents } from "@/utils/commonApi";
import { toast } from "sonner";

export default function AdminWebContents() {
  const [contentValueCall, setContentValueCall] = useState("");
  const [contentValueAbout, setContentValueAbout] = useState("");
  const [contentValueAfter, setContentValueAfter] = useState("");
  const [contentValueBefore, setContentValueBefore] = useState("");
  const [callBtn, setCallBtn] = useState("Add");
  const [aboutBtn, setAboutBtn] = useState("Add");
  const [afterBtn, setAfterBtn] = useState("Add");
  const [beforeBtn, setBeforeBtn] = useState("Add");
  const [callId, setCallId] = useState("");
  const [aboutId, setAboutId] = useState("");
  const [afterId, setAfterId] = useState("");
  const [beforeId, setBeforeId] = useState("");

  const [contentTitle, setContentTitle] = useState("");
  const [contentDesc, setContentDesc] = useState("");

  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["link", "image", "video"],

    ["clean"], // remove formatting button
  ];

  const modules = {
    toolbar: toolbarOptions,
    // clipboard: {
    //     // toggle to add extra line breaks when pasting HTML:
    //     matchVisual: false,
    //   },
  };
  // Define custom styles for the ReactQuill editor
  const editorStyles: React.CSSProperties = {
    height: "12em",
    border: "1px solid #ccc",
    borderRadius: "5px",
    direction: "ltr",
  };

  // Get Content
  const {
    data: data1,
    error: Error1,
    isLoading: isListLoading,
    refetch: refetch1,
    isSuccess: isSuccess1,
  } = useQuery({
    queryKey: ["WebContents"],
    queryFn: () => getContents(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // if (isInitialRender2 && isSuccess1) {
    if (isSuccess1) {
      // {
      data1?.map((item: any) => {
        if (item.title === "CallUs") {
          setContentValueCall(item.content);
          setCallId(item.id);
          setCallBtn("Edit");
        }

        if (item.title === "AboutUs") {
          setContentValueAbout(item.content);
          setAboutId(item.id);
          setAboutBtn("Edit");
        }

        if (item.title === "AfterRegistration") {
          setContentValueAfter(item.content);
          setAfterId(item.id);
          setAfterBtn("Edit");
        }

        if (item.title === "BeforeRegistration") {
          setContentValueBefore(item.content);
          setBeforeId(item.id);
          setBeforeBtn("Edit");
        }
      });
    }
  }, [isSuccess1, refetch1]);

  // Add
  // ............'Mutation' Change Key Submit
  const AddWebContents = useMutation({
    mutationKey: ["AddWebContents"],
    mutationFn: SubmitWebContents,
    onSuccess: (res) => {
      setContentValueCall("");
      setContentValueAbout("");
      setContentValueAfter("");
      setContentValueBefore("");

      toast("عملیات ثبت شما با موفقیت انجام شد. ", {
        className: "!bg-green-500 !text-white",
      });
      refetch1();
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
      refetch1();
    },
  });

  // ............'Mutation' Change Web Contents
  const EditWebContents = useMutation({
    mutationKey: ["EditWebContents"],
    mutationFn: UpdateWebContents,
    onSuccess: (res) => {
      toast("عملیات ویرایش شما با موفقیت انجام شد . ", {
        className: "!bg-green-500 !text-white",
      });
      refetch1();
    },
    onError: (err: any | string) => {
      toast(<>{err.response.data.detail}</>, {
        className: "!bg-red-500 !text-white",
      });
      refetch1();
    },
  });

  // Add Mutation
  function onSubmitAddCallUs() {
    const formData = new FormData();
    // formData.append("title", contentTitle);
    // formData.append("description", contentDesc);

    formData.append("title", "CallUs");
    formData.append("description", "CallUs....");
    formData.append("Content", contentValueCall);

    AddWebContents.mutate(formData);
  }
  // AboutUs
  function onSubmitAddAboutUs() {
    const formData = new FormData();
    formData.append("title", "AboutUs");
    formData.append("description", "AboutUs....");
    formData.append("Content", contentValueAbout);

    AddWebContents.mutate(formData);
  }
  // AboutUs
  function onSubmitAddَAfterText() {
    const formData = new FormData();
    formData.append("title", "AfterRegistration");
    formData.append("description", "AfterRegistration....");
    formData.append("Content", contentValueAfter);

    AddWebContents.mutate(formData);
  }
  // AboutUs
  function onSubmitAddBeforeText() {
    const formData = new FormData();
    formData.append("title", "BeforeRegistration");
    formData.append("description", "BeforeRegistration....");
    formData.append("Content", contentValueBefore);

    AddWebContents.mutate(formData);
  }

  // Edit Mutation
  function onEditCallUs() {
    const formData = new FormData();
    formData.append("title", "CallUs");
    formData.append("description", "CallUs....");
    formData.append("Content", contentValueCall);
    EditWebContents.mutate({ id: callId, payload: formData });
  }

  function onEditAboutUs() {
    const formData = new FormData();
    formData.append("title", "AboutUs");
    formData.append("description", "AboutUs....");
    formData.append("Content", contentValueAbout);
    EditWebContents.mutate({ id: aboutId, payload: formData });
  }

  function onEditAfterText() {
    const formData = new FormData();
    formData.append("title", "AfterRegistration");
    formData.append("description", "AfterRegistration....");
    formData.append("Content", contentValueAfter);
    EditWebContents.mutate({ id: afterId, payload: formData });
  }

  function onEditBeforeText() {
    const formData = new FormData();
    formData.append("title", "BeforeRegistration");
    formData.append("description", "BeforeRegistration....");
    formData.append("Content", contentValueBefore);
    EditWebContents.mutate({ id: beforeId, payload: formData });
  }

  return (
    <div className="w-full min-h-[85vh] flex justify-center">
      <div className="w-[95vw] lg:w-[85vw] 3xl:w-[70vw] mt-8 max-sm:mt-16 pt-9 pb-6 ">
        {/* Cull Us */}
        <div className="flex flex-col w-full">
          <div className="my-4 text-base font-bold text-right text-neutral-600">
            محتوای تماس با ما
          </div>

          <ReactQuill
            modules={modules}
            theme="snow"
            value={contentValueCall}
            onChange={setContentValueCall}
            style={editorStyles}
          />
          <Button
            type="submit"
            onClick={() => {
              if (callBtn === "Add") {
                onSubmitAddCallUs();
              } else if (callBtn === "Edit") {
                onEditCallUs();
              }
              // setContentTitle("Test");
              // setContentDesc("Test....");
            }}
            className="self-end w-1/6 my-2"
          >
            ثبت
          </Button>
        </div>

        {/* About Us */}
        <div className="flex flex-col w-full">
          <div className="my-4 text-base font-bold text-right text-neutral-600">
            محتوای درباره ما
          </div>

          <ReactQuill
            modules={modules}
            theme="snow"
            value={contentValueAbout}
            onChange={setContentValueAbout}
            style={editorStyles}
          />
          <Button
            type="submit"
            onClick={() => {
              if (aboutBtn === "Add") {
                onSubmitAddAboutUs();
              } else if (aboutBtn === "Edit") {
                onEditAboutUs();
              }
            }}
            className="self-end w-1/6 my-2"
          >
            ثبت
          </Button>
        </div>

        {/* BeforeRegistration*/}
        <div className="flex flex-col w-full">
          <div className="my-4 text-base font-bold text-right text-neutral-600">
            محتوای قبل از ثبت گزارش
          </div>

          <ReactQuill
            modules={modules}
            theme="snow"
            value={contentValueBefore}
            onChange={setContentValueBefore}
            style={editorStyles}
          />
          <Button
            type="submit"
            onClick={() => {
              if (beforeBtn === "Add") {
                onSubmitAddBeforeText();
              } else if (beforeBtn === "Edit") {
                onEditBeforeText();
              }
            }}
            className="self-end w-1/6 my-2"
          >
            ثبت
          </Button>
        </div>

        {/* AfterRegistration */}
        <div className="flex flex-col w-full">
          <div className="my-4 text-base font-bold text-right text-neutral-600">
            محتوای بعد از ثبت گزارش
          </div>

          <ReactQuill
            modules={modules}
            theme="snow"
            value={contentValueAfter}
            onChange={setContentValueAfter}
            style={editorStyles}
          />
          <Button
            type="submit"
            onClick={() => {
              if (afterBtn === "Add") {
                onSubmitAddَAfterText();
              } else if (afterBtn === "Edit") {
                onEditAfterText();
              }
            }}
            className="self-end w-1/6 my-2"
          >
            ثبت
          </Button>
        </div>
      </div>
    </div>
  );
}
