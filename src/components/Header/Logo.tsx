// components/Logo.tsx
import Image from "next/image";
import Link from "next/link";
import profileImg from "@/../public/logo.png";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center text-dark dark:text-light">
      <div className=" w-16 md:w-18 rounded-full overflow-hidden border border-solid border-dark dark:border-gray mr-2 md:mr-4">
        <Image
          src={profileImg}
          alt="Recept Mama"
          className="w-full h-auto rounded-full"
          sizes="20vw"
          priority
        />
      </div>
      <span className="font-bold dark:font-semibold text-lg md:text-xl">
        ReceptMama.hu
      </span>
    </Link>
  );
};

export default Logo;
