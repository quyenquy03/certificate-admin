import { MainLayout } from "@/layouts";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MainLayout>{children}</MainLayout>;
};
export default Layout;
