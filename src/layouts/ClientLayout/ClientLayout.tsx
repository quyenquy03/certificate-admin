import { ReactNode } from "react";

type ClientLayoutProps = {
  children: ReactNode;
};

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return <div>{children}</div>;
};
