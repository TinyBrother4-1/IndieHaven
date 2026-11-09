const GamesModule = {
    async fetchCatalog() {
        try {
            const isPagesDir = window.location.pathname.includes('/pages/');
            const jsonPath = isPagesDir ? '../games.json' : 'games.json';
            const response = await fetch(jsonPath);
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Failed to load games.json:', error);
            return [];
        }
    },

    async renderHomeGrids() {
        const games = await this.fetchCatalog();
        const recentGrid = document.getElementById('homeRecentGrid');
        const trendingGrid = document.getElementById('homeTrendingGrid');

        if (!recentGrid) return;

        if (games.length === 0) {
            const emptyHTML = `
                <div class="empty-state-card">
                    <i class="fa-solid fa-gamepad"></i>
                    <h3>No games in the library yet</h3>
                    <p>Add entries to your root-level <code>games.json</code> file to display games here automatically.</p>
                    <a href="pages/request.html" class="btn primary-btn discord-btn"><i class="fa-brands fa-discord"></i> Request a Game on Discord</a>
                </div>
            `;
            recentGrid.innerHTML = emptyHTML;
            if (trendingGrid) trendingGrid.innerHTML = emptyHTML;
            return;
        }

        const sorted = [...games].sort((a, b) => new Date(b.added || 0) - new Date(a.added || 0));
        recentGrid.innerHTML = sorted.slice(0, 4).map(g => this.createCardHTML(g)).join('');
        if (trendingGrid) {
            trendingGrid.innerHTML = sorted.slice(0, 4).map(g => this.createCardHTML(g)).join('');
        }
    },

    createCardHTML(game) {
        const isPagesDir = window.location.pathname.includes('/pages/');
        const detailHref = isPagesDir ? `game.html?id=${game.id}` : `pages/game.html?id=${game.id}`;
        
        return `
            <div class="game-card" onclick="window.location.href='${detailHref}'">
                <div class="game-card-img-wrapper" style="display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); height: 160px;">
                    <i class="fa-solid fa-file-zipper" style="font-size: 3rem; color: var(--accent-main);"></i>
                </div>
                <div class="game-card-body">
                    <h3 class="game-card-title">${game.title}</h3>
                    <p class="game-card-dev">${game.author}</p>
                    <p class="game-card-desc">${game.desc}</p>
                    <div class="game-card-footer">
                        <span style="font-size: 0.75rem; background: var(--bg-secondary); padding: 3px 8px; border-radius: 4px;">${game.genre}</span>
                        <span style="font-weight: 700; color: var(--success); font-size: 0.85rem;"><i class="fa-solid fa-download"></i> Archive</span>
                    </div>
                </div>
            </div>
        `;
    }
};
