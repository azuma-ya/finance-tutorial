import type { ReactNode } from "react";
import { Fragment } from "react";

import Header from "@/components/header";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </Fragment>
  );
};

export default DashboardLayout;
