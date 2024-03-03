import React from "react";

type pageProps = {
  params: {
    path: string;
  };
};

const page: React.FC<pageProps> = ({ params }) => {
  return <div>Have a good {params.path}</div>;
};
export default page;
