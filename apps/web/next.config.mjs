// V demo režime (NEXT_PUBLIC_DEMO=1) sa appka builduje ako statický export
// pre GitHub Pages na ceste /Plaud (názov repozitára).
const isExport = process.env.NEXT_PUBLIC_DEMO === "1";
const repo = process.env.PAGES_BASE_PATH ?? "/Plaud";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@daka/shared"],
  ...(isExport
    ? {
        output: "export",
        basePath: repo,
        assetPrefix: `${repo}/`,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
