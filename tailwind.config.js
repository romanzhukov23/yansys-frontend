module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                light: '0px 5px 12px rgba(132, 146, 166, 0.65)',
                aside: '0 0 4px rgb(0 0 0 / 10%), 0 0 24px rgb(0 0 0 / 8%)'
            },

            fontFamily: {
                'body': ['Poppins', 'sans-serif'],
            }
        },
    },
    plugins: []
}
