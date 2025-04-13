"use client"
import { usePathname, useRouter } from "next/navigation";
interface ScrollToAnotherPageProps {
    href: string;
    elementId: string;
    children: React.ReactNode;
}

const ScrollToAnotherPage = ({ href, children, elementId }: ScrollToAnotherPageProps) => {
  const router = useRouter();
  const path =usePathname();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (path !== href){
        await router.push(href);
    }
    
    
        setTimeout(() => {
          const target = document.getElementById(elementId);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
  };

  return (
    <a href={href} onClick={handleClick} className="cursor-pointer">
      {children}
    </a>
  );
};

export default ScrollToAnotherPage