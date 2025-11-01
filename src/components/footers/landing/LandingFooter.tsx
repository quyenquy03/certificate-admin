import { Badge } from "@/components/badges";
import { Separator } from "@/components/separators";

export const landingPartners = [
  "EduChain Labs",
  "VeriTrust AI",
  "Global Accreditor",
  "SecureHire",
  "ChainProof Alliance",
];

export const LandingFooter = () => {
  return (
    <footer className="border-t border-indigo-500/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">CertifyChain</h3>
            <p className="mt-4 text-sm text-slate-400">
              Nen tang xac thuc van bang tren blockchain, mang lai su minh bach va tin cay cho he sinh thai giao duc.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-200">Lien he</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>Email: support@certifychain.io</li>
              <li>Dien thoai: +84 24 7300 1234</li>
              <li>Van phong: 845 Innovation Drive, Tang 3</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-200">Doi tac tieu bieu</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {landingPartners.map((partner) => (
                <Badge
                  key={partner}
                  variant="outline"
                  className="border-indigo-500/30 bg-transparent text-slate-300"
                >
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-8 border-indigo-500/10" />
        <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} CertifyChain. Giu moi quyen.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">
              Chinh sach bao mat
            </a>
            <a href="#" className="hover:text-slate-300">
              Dieu khoan su dung
            </a>
            <a href="#" className="hover:text-slate-300">
              Trung tam ho tro
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

