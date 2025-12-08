import React from "react"
import { useTranslation } from "react-i18next"
import { PriceChart } from "@/components/dashboard/PriceChart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const AdamSandboxPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="adamsandbox-heading"
      className="max-w-2xl space-y-3 text-sm"
    >
      <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
      <h1 id="adamsandbox-heading" className="text-xl font-semibold">
        {t("adamsandbox.heading")}
      </h1>
      <p className="text-slate-600 dark:text-slate-300">
        {t("adamsandbox.body")}
      </p>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
    </div>
      <p className="text-slate-400 dark:text-slate-500">
        Keine Speicherung von personenbezogenen Daten, keine Cookies, keine
        Trackingtools. Die dargestellten Kurse stammen aus der öffentlichen
        Coinbase-API und dienen ausschließlich Lernzwecken.
      </p>
      <a href="https://github.com/BFTorres/project-picanha" className="text-primary underline-offset-4">GitHub repo</a>
      <PriceChart />
    </section>
  )
}