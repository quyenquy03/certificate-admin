import { AdminOrganizationMembersManagement } from "@/components";

type OrganizationMembersPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

const OrganizationMembersPage = async ({
  params,
}: OrganizationMembersPageProps) => {
  const { organizationId } = await params;

  return <AdminOrganizationMembersManagement organizationId={organizationId} />;
};

export default OrganizationMembersPage;
