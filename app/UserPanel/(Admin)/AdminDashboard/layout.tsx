import NavbarPanel from "@/components/NavbarPanel";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("Hami_Admin_Token");
  if (!token?.value) {
    return redirect("/");
  }

  return (
    <>
      <NavbarPanel />
      {children}
    </>
  );
}
