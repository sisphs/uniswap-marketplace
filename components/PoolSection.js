// internal import
import { LiquidityComponent, SingleCard } from "./index";
import { useAccount } from "wagmi";

const HeroSection = () => {
  const { address } = useAccount();
  return (
    <section className="bg-[#1A1A1A] text-gray-100 ">
      <div className="container flex flex-col lg:flex-row lg:justify-between justify-center lg:py-24 sm:py-12 p-6 mx-auto ">
        <div className="flex flex-col justify-center text-center -mt-16 p-6 rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <SingleCard
            index={5}
            name={"LP"}
            walletAddress={address}
            desc="Here, your LP balance is displayed."
          />
        </div>
        <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 lg:h-96 xl:h-122 2xl:h-128 sm:h-80">
          <LiquidityComponent />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
