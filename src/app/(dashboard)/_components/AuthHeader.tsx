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
    </div>
  );
};
export default AuthHeader;
