import { AdminOrganizationCertificates } from "@/components";

type OrganizationCertificatesPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const OrganizationCertificatesPage = async ({
  params,
}: OrganizationCertificatesPageProps): Promise<React.ReactNode> => {
  const { organizationId } = await params;
  return <AdminOrganizationCertificates organizationId={organizationId} />;
};

export default OrganizationCertificatesPage;
