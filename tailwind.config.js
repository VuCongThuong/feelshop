module.exports = {
    content: ['./src/**/*.+(html|js|eta)'],
    theme: {
        screens: {
            'mobile': {'max': '767px'},
            'plus': '414px',
            'md': '768px',
            'lg': '1024px',
            'lg+': '1025px',
            'xl': '1280px',
            'xl+': '1360px',
            'xxl': '1440px',
            'xxl+': '1512px'
        },
        extend: {
            boxShadow: {
                'md': '0px 2px 2px 0px rgba(0, 0, 0, 0.10)'
            }
        }
    }
};