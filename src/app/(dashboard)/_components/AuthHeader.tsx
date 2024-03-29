import React from "react";
import Image from "next/image";
import { siteConfig } from "config/site";

type AuthHeaderProps = {
  role: string;
  logoUrl?: string;
};

const AuthHeader: React.FC<AuthHeaderProps> = ({ role, logoUrl }) => {
  const siteName = siteConfig.name;
  return (
    <div>
      {logoUrl ? (
        <Image
          className="h-10 w-auto"
          loading="lazy"
          src={logoUrl}
          alt="Splash"
          width={10}
          height={10}
        />
      ) : (
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-primary">
          {siteName}
        </h2>
      )}

      <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-foreground">
        {role === "admin"
          ? "Sign in to your account"
          : "Sign in to your employee account"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Don't have an account?{" "}
        <a
          href="auth/registration"
          className="font-semibold text-primary hover:underline"
        >
          Register
        </a>
      </p>
    </div>
  );
};
export default AuthHeader;
