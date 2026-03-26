import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Aquí puedes añadir reglas adicionales si quieres
    // ej: if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.rol !== "SUPER_ADMIN")
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

// Define qué rutas deben pasar por el middleware de autenticación
export const config = {
  matcher: ["/admin/:path*"],
};
