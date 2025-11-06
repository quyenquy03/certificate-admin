import { UpdateCertificate } from "@/components";
import React from "react";
type Props = {
  params: {
    id: string;
  };
};
const UpdateCertificatePage = ({ params }: Props) => {
  const { id } = params;
  return <UpdateCertificate />;
};

export default UpdateCertificatePage;
