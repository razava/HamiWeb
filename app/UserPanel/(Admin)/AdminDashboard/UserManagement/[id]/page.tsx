import MentorFormPage from "@/components/MentorFormPage";
import React from "react";

export default function page({ params }: { params: any }) {
  const id = params.id;

  return (
    <div className="w-[90vw] sm:w-[90vw] lg:w-[85vw] xl:w-[75vw] 3xl:w-[70vw] mt-10 sm:mt-8 pt-9 mx-auto mb-6">
      <MentorFormPage id={id} />
    </div>
  );
}
