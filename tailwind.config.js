/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Nueva paleta elegante para centro de estética
        primary: "#d4af37",      // Oro elegante
        secondary: "#f5f5dc",    // Beige suave
        accent: "#8b7355",       // Marrón cálido
        neutral: "#6b6b6b",      // Gris sofisticado
        dark: "#2c2c2c",         // Gris oscuro
        light: "#faf8f5",        // Crema muy claro
        success: "#10b981",      // Verde suave
        error: "#ef4444",        // Rojo suave
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
