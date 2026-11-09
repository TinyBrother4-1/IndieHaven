const SearchModule = {
    init() {
        const input = document.getElementById('globalSearchInput');
        if (!input) return;

        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                const isPages = window.location.pathname.includes('/pages/');
                window.location.href = `${isPages ? 'browse.html' : 'pages/browse.html'}?q=${encodeURIComponent(query)}`;
            }
        });
    }
};
