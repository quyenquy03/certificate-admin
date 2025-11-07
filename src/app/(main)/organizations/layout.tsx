import { OrganizationLayout } from "@/layouts";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <OrganizationLayout>{children}</OrganizationLayout>;
};
export default Layout;
