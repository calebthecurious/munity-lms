import { Navbar } from "@/app/(dashboard)/_components/Navbar";


const MarketingLayout = ({
    children
}: {
    children: React.ReactNode;
    }) => {
    return ( 
        <div className="dark:bg-[#1F1F1F]">
        <Navbar />
        <main className="h-full pt-40">
            {children}
        </main>
        </div>
    );
    }
    
export default MarketingLayout;