"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Triangle } from "react-loader-spinner";
import LineChart from "./LineChart";
import { getInfoByUserId, getInfo } from "@/utils/infoApi";
import { submitDailyMood } from "@/utils/commonApi";
import axios from "axios";
import Link from "next/link";
import { getProfile } from "@/utils/authenticateApi";
import { motivationalQuotes } from "@/constants";

export default function PatientDashboard() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  interface Article {
    title: string;
    link: string;
  }

  //const [articles, setArticles] = useState<Article[]>([]);
  const [articles, setArticles] = useState<
    { originalTitle: string; translatedTitle: string; link: string }[]
  >([]);

  const [dailyQuote, setDailyQuote] = useState<string>("");
  const [dailyHafez, setDailyHafez] = useState<string[]>([]);

  // گرفتن گزارش مود روزانه و آزمایش‌ها
  const {
    data: moodReport,
    isLoading: isLoadingReport,
    refetch,
  } = useQuery({
    queryKey: ["MoodReport"],
    queryFn: () => getInfoByUserId("5"),
    refetchOnWindowFocus: false,
  });

  const { data: labTestReport, isLoading: isLoadingLabTest } = useQuery({
    queryKey: ["LabTestReport"],
    queryFn: () => getInfo("6"),
    refetchOnWindowFocus: false,
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["Profile"],
    queryFn: () => getProfile(),
    refetchOnWindowFocus: false,
  });

  // دریافت فال حافظ از API (اختیاری)
  const fetchHafezPoem = async () => {
    try {
      const response = await axios.get(
        "https://ganjgah.ir/api/ganjoor/hafez/faal"
      );
      if (response.data && response.data.plainText) {
        // تبدیل متن شعر به آرایه‌ای از ابیات
        const verses = response.data.plainText
          .split("\n")
          .filter((line: string) => line.trim() !== "");
        const firstTwoVerses = verses.slice(0, 4);
        setDailyHafez(firstTwoVerses);
      }
    } catch (error) {
      console.error("خطا در دریافت فال حافظ:", error);
      setDailyHafez([
        "امروز فال شما دریافت نشد",
        "اما امید همیشه همراهتان باشد 🌿",
      ]);
    }
  };

  useEffect(() => {
    fetchHafezPoem();
    setDailyQuote(
      motivationalQuotes[new Date().getDate() % motivationalQuotes.length]
    );
  }, []);

  // بررسی اینکه آیا مود امروز ثبت شده
  const todayMood = moodReport?.extraData?.TodayMood.isRecorded
    ? moodReport.extraData.TodayMood.score
    : null;

  const mutation = useMutation({
    mutationFn: (mood: number) => submitDailyMood(mood),
    onSuccess: () => {
      setSelectedMood(null);
      refetch();
    },
  });

  const handleMoodSubmit = async () => {
    if (selectedMood === null) {
      alert("لطفاً یک مود انتخاب کنید.");
      return;
    }
    setLoading(true);
    await mutation.mutateAsync(selectedMood);
    setLoading(false);
  };

  const moodOptions = [
    { value: 4, emoji: "😄", label: "خیلی خوب" },
    { value: 3, emoji: "🙂", label: "خوب" },
    { value: 2, emoji: "😐", label: "معمولی" },
    { value: 1, emoji: "😟", label: "بد" },
    { value: 0, emoji: "😭", label: "خیلی بد" },
  ];

  // useEffect(() => {
  //   const fetchArticles = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://hamihealth.com/wp-json/wp/v2/posts?categories=5"
  //       );
  //       setArticles(response.data);
  //     } catch (error) {
  //       console.error("Error fetching articles:", error);
  //     }
  //   };

  //   fetchArticles();
  // }, []);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles", { method: "GET" });
        if (!response.ok) {
          throw new Error(`خطا در دریافت مقالات: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("❌ خطا در دریافت مقالات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);


  return (
    <div className="w-[95vw] lg:w-[82vw] xl:w-[70vw] 3xl:w-[65vw] mx-auto mt-20 flex flex-col gap-8">
      {/* سطر اول: ثبت مود روزانه + جمله انگیزشی */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ستون ثبت مود */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            خوش آمدی {profileData?.firstName} جان 🌿
          </h2>
          <p className="text-sm text-gray-600 mb-6">حال شما امروز چطور است؟</p>

          {todayMood === null ? (
            <>
              <div className="flex justify-around mb-4">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-4 rounded-full border-2 text-2xl ${
                      selectedMood === mood.value
                        ? "border-green-500 bg-green-100"
                        : "border-gray-300 bg-gray-100"
                    }`}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>

              <button
                onClick={handleMoodSubmit}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md mt-5"
              >
                {loading ? "در حال ثبت..." : "ثبت مود روزانه"}
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-center text-gray-700 text-sm">
                <span className="font-semibold text-blue-800 text-lg">
                  {moodOptions.find((mood) => mood.value === todayMood)?.emoji}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {moodOptions.find((mood) => mood.value === todayMood)?.label}
              </p>
            </div>
          )}
        </div>

        {/* ستون جمله انگیزشی یا فال حافظ */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold text-indigo-900 mb-4">
            ✨ پیام امروز ✨
          </h2>
          <p className="text-sm text-gray-800 italic  text-sm font-semibold">
            {dailyQuote}
          </p>

          <h2 className="text-lg font-bold text-indigo-900 mb-4 mt-5">
            📜 فال حافظ امروز
          </h2>
          <div className="text-gray-800 text-sm font-semibold leading-loose text-center">
            {dailyHafez.map((verse, index) => (
              <p key={index}>{verse}</p>
            ))}
          </div>
        </div>
      </div>

      {/* سطر دوم: گزارش مود و گزارش تست‌های آزمایشگاهی */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* گزارش مود روزانه */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            گزارش مود روزانه شما در یک ماه گذشته
          </h2>
          {isLoadingReport ? (
            <div className="flex justify-center items-center">
              <Triangle
                visible
                height="100"
                width="100"
                color="#003778"
                ariaLabel="loading"
              />
            </div>
          ) : moodReport?.charts?.length > 0 ? (
            <LineChart
              chartTitle="مود روزانه در یک ماه گذشته"
              chartData={moodReport.charts[0].series}
            />
          ) : (
            <p className="text-sm text-gray-500">هیچ گزارشی یافت نشد.</p>
          )}
        </div>

        {/* گزارش تست‌های آزمایشگاهی */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold text-blue-900 mb-4">
            نتایج تست‌های آزمایشگاهی شما
          </h2>
          {isLoadingLabTest ? (
            <div className="flex justify-center items-center">
              <Triangle
                visible
                height="100"
                width="100"
                color="#003778"
                ariaLabel="loading"
              />
            </div>
          ) : labTestReport?.charts?.length > 0 ? (
            <LineChart
              chartTitle="تست‌های آزمایشگاهی"
              chartData={labTestReport.charts[0].series}
            />
          ) : (
            <p className="text-sm text-gray-500">هیچ تستی ثبت نشده است.</p>
          )}
        </div>
      </div>

      {/* سطر سوم: مقالات مرتبط */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-300 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        📚 مقالات مرتبط   
      </h2>
        {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((article: any) => (
            <li
              key={article.id}
              className="p-4 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition duration-200"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition duration-200"
              >
                {article.translatedTitle}
              </a>
              <p className="text-gray-500 text-sm mt-1">({article.title})</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">هیچ مقاله‌ای یافت نشد.</p>
      )}

        {/* <h2 className="text-lg font-bold text-blue-900 mb-4">
          آخرین مقالات مرتبط
        </h2>
        <ul className="list-disc pl-5">
          {articles.length > 0 ? (
            articles.map((article: any) => (
              <li key={article.id} className="text-sm text-gray-700 mb-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {article.title.rendered}
                </a>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">هیچ مقاله‌ای یافت نشد.</p>
          )}
        </ul> */}
      </div>
    </div>
  );
}
