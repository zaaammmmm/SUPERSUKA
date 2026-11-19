// Exact /siska route prevents the optional catch-all route from creating
// alternating trailing-slash redirects with upstream SISKA.
export { GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS } from "@/app/[service]/[[...path]]/route";
