import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image
          src="/next.svg"
          alt="Logo"
          height={28}
          width={56}
          className="invert"
        />
        <p className="ml-2.5 text-2xl font-semibold text-white">Finance</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
