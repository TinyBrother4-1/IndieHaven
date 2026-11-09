const SearchModule = {
    init() {
        const input = document.getElementById('globalSearchInput');
        const box = document.getElementById('searchSuggestions');
        if (!input || !box) return;

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const games = Storage.getGames();

            if (query.length < 2) {
                box.classList.add('hidden');
                return;
            }

            const matches = games.filter(g => 
                g.title.toLowerCase().includes(query) || 
                g.dev.toLowerCase().includes(query) || 
                g.genre.toLowerCase().includes(query)
            ).slice(0, 5);

            if (matches.length === 0) {
                box.classList.add('hidden');
                return;
            }

            const isPages = window.location.pathname.includes('/pages/');
            box.innerHTML = matches.map(g => `
                <div class="suggestion-item" onclick="window.location.href='${isPages ? 'game.html' : 'pages/game.html'}?id=${g.id}'" style="display: flex; gap: 10px; padding: 10px; cursor: pointer; border-bottom: 1px solid var(--border-color);">
                    <img src="${g.cover}" style="width: 40px; height: 30px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <h4 style="font-size: 0.9rem;">${g.title}</h4>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">${g.dev}</p>
                    </div>
                </div>
            `).join('');
            box.classList.remove('hidden');
        });
    }
};