import { Metadata } from "next";

export const metadata: Metadata = {
  title: "字詞管理",
  description: "字詞管理",
};

interface IWordAddLayoutProps {
  children: React.ReactNode;
}


export default function WordAddLayout({ children }: IWordAddLayoutProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {children}
    </div>
  );
}
