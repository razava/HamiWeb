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
      <div className="px-2 mx-auto mt-10">{children}</div>
    </>
  );
}
