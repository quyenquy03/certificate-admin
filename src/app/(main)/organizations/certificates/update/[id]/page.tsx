import { OrganizationUpdateCertificate } from "@/components";
import React from "react";
type Props = {
  params: Promise<{ id: string }>;
};
const UpdateCertificatePage = async ({ params }: Props) => {
  const { id } = await params;
  return <OrganizationUpdateCertificate certificateId={id} />;
};

export default UpdateCertificatePage;
