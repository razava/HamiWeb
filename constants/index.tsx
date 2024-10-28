import { LuMapPin } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import bgimg from "../public/img/bg.png";

export const menuItems = [
  { id: 1, name: "صفحه اصلی", href: "/" },
  { id: 2, name: "اخبار", href: "/" },
  { id: 3, name: "درباره ما", href: "/" },
  { id: 4, name: "تماس با ما", href: "/CallUs" },
  { id: 5, name: "پیگیری", href: "/" },
  { id: 6, name: "ورود به پنل کاربری", href: "/Login" },
];

export const sliderItems = [
  { id: 1, img: bgimg },
  { id: 2, img: bgimg },
  { id: 3, img: bgimg },
];

export const boxItems = [
  {
    id: 1,
    name: "ثبت شکایت",
    icon: "/img/box1.svg",
    icon2: "/img/box1-hover.svg",
    description: "ارسال گزارش نارضایتی از پرسنل",
    link: "/RequestStep1",
  },
  {
    id: 2,
    name: "پیگیری شکایت",
    icon: "/img/box2.svg",
    icon2: "/img/box2-hover.svg",
    description: "پیگیری گزارش ارسال شده",
    link: "/FollowUp",
  },
  {
    id: 3,
    name: "ثبت شکایت(شناس)",
    icon: "/img/box1.svg",
    icon2: "/img/box1-hover.svg",
    description: "ارسال گزارش نارضایتی از پرسنل",
    link: "/CitizenLogin",
  },
  // {
  //   id: 3,
  //   name: "مشاهده آمار",
  //   icon: "/img/box3.svg",
  //   icon2: "/img/box3-hover.svg",
  //   description: "مشاهده آمار و گزارشات درخواست ها",
  //   link: "/",
  // },
];

export const newsItems = [
  {
    id: 1,
    title: "شروع به کار سامانه حامی",
    content:
      "این سامانه با هدف نظارت بر عملکرد پرستل و نهادهای مرتبط با امور مردمی در شهرداری استان یزد در زمستان 1402 شروع به فعالیت نموده است ...",
    date: "24 آذر ماه 1402",
  },
  {
    id: 2,
    title: "شروع به کار سامانه حامی",
    content:
      "این سامانه با هدف نظارت بر عملکرد پرستل و نهادهای مرتبط با امور مردمی در شهرداری استان یزد در زمستان 1402 شروع به فعالیت نموده است ...",
    date: "24 آذر ماه 1402",
  },
  {
    id: 3,
    title: "شروع به کار سامانه حامی  ",
    content:
      "این سامانه با هدف نظارت بر عملکرد پرستل و نهادهای مرتبط با امور مردمی در شهرداری استان یزد در زمستان 1402 شروع به فعالیت نموده است ...",
    date: "24 آذر ماه 1402",
  },
];

export const counterItems = [
  { id: 1, name: "تعداد گزارشات ارسال شده", count: "1041+" },
  { id: 2, name: "تعداد گزارشات ارسال شده", count: "1041+" },
  { id: 3, name: "تعداد گزارشات ارسال شده", count: "1041+" },
  { id: 4, name: "تعداد گزارشات ارسال شده", count: "1041+" },
  { id: 5, name: "تعداد گزارشات ارسال شده", count: "1041+" },
];

export const requestItems = [
  { id: 1, name: "درخواست از طرف شهروند" },
  { id: 2, name: "دریافت کد رهگیری" },
  { id: 3, name: "بررسی توسط بازرس شهرداری" },
  { id: 4, name: " اعلام نتیجه درخواست" },
];

export const aboutFooterItems = [
  {
    id: 1,
    name: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و بااستفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجلهدر ستون و سطرآنچنان که لازم است لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ   ",
  },
];
export const footerItems = [
  { id: 1, name: "قوانین مربوط به حامی", href: "/" },
  { id: 2, name: "ارسال گزارش در سامانه حامی قوه قضاییه", href: "/" },
  { id: 3, name: "وب سایت قوه قضاییه", href: "/" },
  { id: 4, name: " وب سایت ریاست جمهوری", href: "/" },
];

export const callUsItems = [
  {
    id: 1,
    title: "نشانی",
    icon: <LuMapPin size="full" />,
    description: " نشانی ما جهت ارتباط ",
    description2: "google map",
  },
  {
    id: 2,
    title: "نشانی الکترونیک",
    icon: <HiOutlineMail size="full" />,
    description: "جهت ارتباط ما با باا شماره",
    description2: "sotzani@gamil.com",
  },
  {
    id: 3,
    title: "تماس با ما ",
    icon: <FiPhone size="full" />,
    description: "جهت ارتباط ما با باا شماره",
    description2: "03531234567",
  },
];

export const ControllerMenuItems = [
  { id: 1, name: "پیشخوان", href: "/UserPanel/ControllerDashboard" },
  { id: 2, name: "گزارش ها", href: "/UserPanel/ControllerDashboard/Complaints" },
  {
    id: 3,
    name: " آمار و اطلاعات",
    href: "/UserPanel/ControllerDashboard/Reports",
  },
];

export const AdminMenuItems = [
  { id: 1, name: "پیشخوان", href: "/UserPanel/AdminDashboard" },
  // { id: 2, name: "مدیریت کاربران", href: "/UserPanel/AdminDashboard/UserManagement" },
  {
    id: 3,
    name: "مدیریت کلید ها",
    href: "/UserPanel/AdminDashboard/KeysManagement",
  },
  { id: 4, name: "سازمان ها", href: "/UserPanel/AdminDashboard/Organizations" },
  { id: 5, name: "دسته بندی ها", href: "/UserPanel/AdminDashboard/Categories" },
  { id: 6, name: "اخبار", href: "/UserPanel/AdminDashboard/News" },
  { id: 7, name: "اسلایدر", href: "/UserPanel/AdminDashboard/Slider" },
  { id: 8, name: "مدیریت محتوا", href: "/UserPanel/AdminDashboard/WebContents" },
];

export const ControllerTableItems = [
  {
    id: 1,
    date: "1402/09/05",
    title: "درخواست رشوه ",
    content: "واحد روابط عمومی شهرداری",
  },
  {
    id: 2,
    date: "1402/09/05",
    title: "درخواست رشوه ",
    content: "واحد روابط عمومی شهرداری",
  },
  {
    id: 3,
    date: "1402/09/05",
    title: "درخواست رشوه ",
    content: "واحد روابط عمومی شهرداری",
  },
];

export const ComplainDetailsItems = [
  {
    id: 1,
    title: "ثبت شکایت",
    desc: "سند  54841",
    date: "1402/09/05",
    time: " 12:58 ",
  },
  {
    id: 2,
    title: "تایید توسط بازرس ...",
    desc: "سند  54841",
    date: "1402/09/05",
    time: " 12:58 ",
  },
  {
    id: 3,
    title: "ارجاع به واحد...",
    desc: "سند  54841",
    date: "1402/09/05",
    time: " 12:58 ",
  },
  {
    id: 4,
    title: "پاسخ",
    desc: "سند  54841",
    date: "1402/09/05",
    time: " 12:58 ",
  },
];

export const AdminCardItems = [
  { id: 1, name: "تعداد گزارشات ارسال شده", count: "100" },
  { id: 2, name: "تعداد گزارشات ارسال شده", count: "200" },
  { id: 3, name: "تعداد گزارشات ارسال شده", count: "300" },
  { id: 4, name: "تعداد گزارشات ارسال شده", count: "400" },
];

export const AdminTableItems = [
  {
    id: 1,
    name: "محمد یزدی زاده",
    phone: "09134504190",
    useRole: "ادمین",
    date: "1402/09/05",
    desc: "واحد روابط عمومی شهرداری",
  },
  {
    id: 2,
    name: "محسن یزدی پناه",
    phone: "09134504190",
    useRole: "ادمین",
    date: "1402/09/05",
    desc: "واحد روابط عمومی شهرداری",
  },
];

export const Operations = [
  { value: 0, name: "ثبت شده" },
  { value: 1, name: "دیدن" },
  { value: 2, name: "درخواست توضیحات" },
  { value: 3, name: "پاسخ شهروند" },
  { value: 4, name: "لغو درخواست" },
  { value: 5, name: "افزودن جزییات" },
  { value: 6, name: "پایان درخواست" },
  { value: 7, name: "شروع مجدد درخواست" },
];

export const errorMessages = {
  500: "خطایی رخ داد. لطفا از اتصال اینترنت خود اطمینان حاصل نمایید.",
  400: "مشکلی در ارسال درخواست به وجود آمد.",
  480: "لطفا تمام اطلاعات خواسته شده را وارد نمایید.",
  428: "کد فعالسازی را وارد نمایید.",
};