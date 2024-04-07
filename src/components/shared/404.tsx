import Link from "next/link";
import React from "react";

import Image from "next/image";

const Custom404 = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-background p-4 text-center">
      <Image
        src="/assets/images/error-404.png"
        alt="Picture of error 404"
        width={300}
        height={300}
      />
      <h1 className="text-3xl md:text-6xl">
        404: The page you are looking for isn't here
      </h1>
      <p>You came here by mistake. Try using the navigation.</p>
      <Link href="/" className="mt-4 rounded-lg bg-primary p-2 px-2">
        <span className="px-2">Back to home</span>
      </Link>
    </div>
  );
};

export default Custom404;
