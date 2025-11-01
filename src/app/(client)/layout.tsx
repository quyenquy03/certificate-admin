import { ClientLayout } from "@/layouts";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ClientLayout>{children}</ClientLayout>;
};
export default Layout;
