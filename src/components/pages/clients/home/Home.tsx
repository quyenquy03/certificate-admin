"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiUserPlus,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiGrid,
  FiFileText,
  FiMail,
  FiPhone,
  FiMessageCircle,
} from "react-icons/fi";
import { Button } from "@/components/buttons";
import { Badge } from "@/components/badges";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/cards";
import { Separator } from "@/components/separators";
import { Header as LandingHeader } from "@/components/headers/landing";

const steps = [
  {
    marker: "1️⃣",
    title: "Thu thập dữ liệu gốc",
    description:
      "Nhà trường hoặc trung tâm đào tạo gửi hồ sơ văn bằng qua API bảo mật hoặc cổng quản trị, đảm bảo tính chính xác tuyệt đối của thông tin ban đầu.",
  },
  {
    marker: "2️⃣",
    title: "Mã hóa và ghi lên blockchain",
    description:
      "Dữ liệu được mã băm, ký số và lưu trữ trên blockchain — bất biến, không thể chỉnh sửa, tạo dấu vân tay kỹ thuật số duy nhất cho mỗi chứng chỉ.",
  },
  {
    marker: "3️⃣",
    title: "Xác thực tức thời",
    description:
      "Doanh nghiệp hoặc cá nhân quét mã QR hoặc truy cập liên kết để kiểm tra trạng thái chứng chỉ, kết quả được trả về ngay trong vài giây.",
  },
];

const benefits = [
  {
    icon: FiShield,
    title: "🛡️ Chống giả mạo tuyệt đối",
    description:
      "Mỗi chứng chỉ gắn chữ ký số và mã băm riêng biệt, không thể chỉnh sửa hay sao chép, bảo vệ giá trị thật của văn bằng.",
  },
  {
    icon: FiCheckCircle,
    title: "⏱️ Minh bạch theo thời gian thực",
    description:
      "Hệ thống xác thực vận hành 24/7, trả kết quả tức thì và lưu vết toàn bộ lịch sử truy cập để dễ dàng kiểm soát.",
  },
  {
    icon: FiClock,
    title: "⚡ Tiết kiệm thời gian và chi phí",
    description:
      "Tự động hóa khâu kiểm tra, giảm thao tác thủ công và rút ngắn quá trình xác minh từ hàng ngày xuống chỉ còn vài giây.",
  },
  {
    icon: FiLock,
    title: "🔒 Bảo mật dữ liệu học viên",
    description:
      "Dữ liệu cá nhân và thành tích học tập được mã hóa, phân quyền truy cập rõ ràng, tuân thủ các tiêu chuẩn bảo mật quốc tế.",
  },
];

const lookupFeatures = [
  {
    icon: FiSearch,
    title: "Tra cứu theo mã chứng chỉ",
    description:
      "Nhập mã định danh duy nhất để xem thông tin văn bằng, trạng thái hiệu lực và nguồn phát hành.",
  },
  {
    icon: FiGrid,
    title: "Quét QR thông minh",
    description:
      "Sử dụng điện thoại hoặc máy quét để đọc mã QR trên văn bằng, xác thực chỉ với một lần chạm.",
  },
  {
    icon: FiFileText,
    title: "Báo cáo chi tiết",
    description:
      "Theo dõi lịch sử cập nhật, đơn vị liên quan và các lần xác thực trước đó trong một bảng điều khiển duy nhất.",
  },
];

const contactDetails = [
  {
    icon: FiMail,
    label: "Email",
    value: "support@certifychain.io",
  },
  {
    icon: FiPhone,
    label: "Hotline",
    value: "+84 24 7300 1234",
  },
  {
    icon: FiMessageCircle,
    label: "Chat trực tuyến",
    value: "Hỗ trợ 24/7 dành cho trường học và doanh nghiệp.",
  },
];

const partners = [
  "EduChain Labs",
  "VeriTrust AI",
  "Global Accreditor",
  "SecureHire",
  "ChainProof Alliance",
];

export const Home: FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <LandingHeader />
      <main className="pt-0">
        <section
          id="gioi-thieu"
          className="relative overflow-hidden scroll-mt-[80px] text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950" />
          <div className="absolute top-1/2 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-24 pt-32 sm:px-8 md:pt-36">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl"
            >
              CertifyChain
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
              className="text-2xl font-medium text-indigo-200 sm:text-3xl md:text-4xl"
            >
              Nền tảng xác thực chứng chỉ, văn bằng qua Blockchain
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="max-w-3xl text-lg text-slate-300 sm:text-xl"
            >
              Giải pháp giúp nhà trường, doanh nghiệp và học viên xác thực văn bằng chỉ trong vài giây. Mỗi chứng chỉ
              được mã hóa, lưu trữ phi tập trung và có thể kiểm chứng ở mọi nơi, mọi lúc — đảm bảo minh bạch, an toàn và
              không thể làm giả.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="h-12 rounded-full px-8 text-base font-medium"
                onClick={() => scrollToSection("tra-cuu-chung-chi")}
              >
                <FiSearch className="mr-2 h-4 w-4" />
                Tra cứu chứng chỉ
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-indigo-400/60 px-8 text-base text-indigo-200 hover:bg-indigo-500/10"
                onClick={() => scrollToSection("dang-ky-ngay")}
              >
                <FiUserPlus className="mr-2 h-4 w-4" />
                Đăng ký ngay
              </Button>
            </motion.div>
          </div>
        </section>

        <section
          id="cach-hoat-dong-loi-ich"
          className="bg-slate-900/60 scroll-mt-[80px] text-center"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-20">
            <Badge
              variant="secondary"
              className="mx-auto bg-indigo-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-200 sm:text-base"
            >
              ⚙️ Cách hoạt động & Lợi ích
            </Badge>
            <h2 className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">
              Chu trình xác thực tinh gọn – bảo mật – đáng tin cậy
            </h2>
            <p className="mt-4 max-w-3xl text-center text-slate-300 sm:mx-auto">
              Quy trình của CertifyChain được xây dựng xoay quanh trải nghiệm người dùng và tính minh bạch tuyệt đối.
              Từ khâu phát hành, lưu trữ đến xác thực, mọi dữ liệu đều được xử lý tự động và an toàn trên blockchain.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-indigo-200">
              🔹 Ba bước xác thực thông minh
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <Card
                  key={step.title}
                  className="border border-indigo-500/10 bg-slate-900/50 text-left shadow-lg shadow-indigo-500/10"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl text-slate-100">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-lg text-indigo-300">
                        {step.marker}
                      </span>
                      <span>{step.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-16 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200">
                🌐 Lợi ích nổi bật
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={benefit.title} className="border border-indigo-500/10 bg-slate-900/60 text-left">
                      <CardHeader className="flex items-start gap-3">
                        <span className="rounded-full bg-indigo-500/10 p-3 text-indigo-300">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <CardTitle className="text-lg text-slate-100">{benefit.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-300">{benefit.description}</CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="tra-cuu-chung-chi"
          className="mx-auto max-w-6xl scroll-mt-[80px] px-6 py-16 text-center sm:px-8 md:py-20"
        >
          <Badge
            variant="secondary"
            className="mx-auto bg-indigo-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-200 sm:text-base"
          >
            Tra cứu chứng chỉ
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">
            Kiểm tra văn bằng an toàn trong tích tắc
          </h2>
          <p className="mt-4 max-w-3xl text-center text-slate-300 sm:mx-auto">
            Dành cho nhà tuyển dụng, phòng nhân sự và cựu sinh viên. Chỉ cần một cú nhấp chuột để xác minh thông tin đúng
            chuẩn blockchain.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {lookupFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border border-indigo-500/10 bg-slate-900/50 text-left">
                  <CardHeader className="space-y-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-xl text-slate-100">{feature.title}</CardTitle>
                    <CardDescription className="text-sm text-slate-300">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section
          id="doi-tac"
          className="bg-slate-900/60 scroll-mt-[80px] text-center"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-20">
            <Badge
              variant="secondary"
              className="mx-auto bg-indigo-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-200 sm:text-base"
            >
              Đối tác
            </Badge>
            <h2 className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">
              Đồng hành cùng hệ sinh thái giáo dục và nhân sự
            </h2>
            <p className="mt-4 max-w-3xl text-center text-slate-300 sm:mx-auto">
              Nền tảng được tin dùng bởi các trường đại học, doanh nghiệp tuyển dụng và tổ chức chứng nhận trên khắp châu
              Á.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {partners.map((partner) => (
                <Badge
                  key={partner}
                  variant="outline"
                  className="border-indigo-500/30 bg-transparent px-4 py-2 text-sm font-medium text-slate-300"
                >
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section
          id="dang-ky-ngay"
          className="bg-gradient-to-br from-indigo-600/10 via-slate-900 to-slate-950 scroll-mt-[80px] text-center"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 sm:px-8">
            <Badge
              variant="secondary"
              className="bg-indigo-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-200 sm:text-base"
            >
              Đăng ký ngay
            </Badge>
            <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">
              Sẵn sàng triển khai nền tảng xác thực số?
            </h2>
            <p className="max-w-2xl text-lg text-slate-300">
              Đội ngũ CertifyChain hỗ trợ phân tích nhu cầu, kết nối API và đào tạo vận hành chỉ trong vài ngày.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="h-12 rounded-full px-8 text-base font-medium">
                Đăng ký ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-indigo-400/60 px-8 text-base text-indigo-200 hover:bg-indigo-500/10"
              >
                Yêu cầu demo
              </Button>
            </div>
          </div>
        </section>

        <section
          id="lien-he"
          className="mx-auto max-w-6xl scroll-mt-[80px] px-6 py-16 text-center sm:px-8 md:py-20"
        >
          <Badge
            variant="secondary"
            className="mx-auto bg-indigo-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-indigo-200 sm:text-base"
          >
            Liên hệ
          </Badge>
          <h2 className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">
            Kết nối với chúng tôi để được tư vấn chi tiết
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="border border-indigo-500/10 bg-slate-900/60 text-left">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-100">Hỗ trợ tức thì</CardTitle>
                <CardDescription className="text-slate-300">
                  Nhận tư vấn triển khai, cung cấp lộ trình onboarding riêng và tài liệu kỹ thuật cho đội ngũ của bạn.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-300">
                  {contactDetails.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <li key={channel.label} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-slate-200">{channel.label}</p>
                          <p>{channel.value}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
            <Card className="border border-indigo-500/10 bg-slate-900/60 text-left">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl text-slate-100">Liên hệ cùng chuyên gia</CardTitle>
                <CardDescription className="text-slate-300">
                  Vui lòng điền thông tin để chúng tôi liên hệ tư vấn chi tiết theo nhu cầu của bạn.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-sm font-medium text-slate-200">
                      Họ và tên
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-lg border border-indigo-500/20 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-sm font-medium text-slate-200">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="email@domain.com"
                      className="w-full rounded-lg border border-indigo-500/20 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-sm font-medium text-slate-200">
                      Nội dung
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Mô tả nhu cầu tích hợp, quy mô tổ chức hoặc câu hỏi của bạn..."
                      className="w-full rounded-lg border border-indigo-500/20 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-full text-base">
                    Gửi yêu cầu
                  </Button>
                  <p className="text-sm text-slate-400">
                    Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-indigo-500/10 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-100">CertifyChain</h3>
              <p className="mt-4 text-sm text-slate-400">
                Giải pháp xác thực văn bằng dựa trên blockchain, mang lại sự minh bạch và uy tín cho hệ sinh thái giáo
                dục.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-200">Liên hệ</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li>Email: support@certifychain.io</li>
                <li>Điện thoại: +84 24 7300 1234</li>
                <li>Văn phòng: 845 Innovation Drive, Tầng 3</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-200">Đối tác tiêu biểu</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {partners.map((partner) => (
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
            <p>&copy; {new Date().getFullYear()} CertifyChain. Giữ mọi quyền.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-slate-300">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-slate-300">
                Trợ giúp truy cập
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
