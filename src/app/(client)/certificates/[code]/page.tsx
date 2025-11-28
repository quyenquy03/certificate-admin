import { CertificateDetail } from "@/components";

type Props = {
  params: Promise<{
    code: string;
  }>;
};

const CertificateDetailPage = async ({ params }: Props) => {
  const { code } = await params;

  return <CertificateDetail certificateCode={code} />;
};

export default CertificateDetailPage;
