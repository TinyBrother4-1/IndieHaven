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

        if (!recentGrid) return;

        if (games.length === 0) {
            recentGrid.innerHTML = `
                <div class="empty-state-card">
                    <i class="fa-solid fa-box-open"></i>
                    <h3>Library Sector Empty</h3>
                    <p>No game packages are currently registered in <code>games.json</code>. Request games on Discord or add archives to GitHub.</p>
                    <div style="display: flex; gap: 12px; margin-top: 10px;">
                        <a href="https://discord.gg/kdVEerSBRR" target="_blank" rel="noopener noreferrer" class="btn discord-btn"><i class="fa-brands fa-discord"></i> Request a Game</a>
                    </div>
                </div>
            `;
            return;
        }

        const sorted = [...games].sort((a, b) => new Date(b.added || 0) - new Date(a.added || 0));
        recentGrid.innerHTML = sorted.map(g => this.createCardHTML(g)).join('');
    },

    createCardHTML(game) {
        const isPagesDir = window.location.pathname.includes('/pages/');
        const detailHref = isPagesDir ? `game.html?id=${game.id}` : `pages/game.html?id=${game.id}`;
        
        return `
            <div class="game-card" onclick="window.location.href='${detailHref}'">
                <div class="game-card-preview">
                    <i class="fa-solid fa-file-zipper"></i>
                </div>
                <div class="game-card-body">
                    <h3 class="game-card-title">${game.title}</h3>
                    <p class="game-card-author">${game.author}</p>
                    <p class="game-card-desc">${game.desc}</p>
                    <div class="game-card-footer">
                        <span class="genre-tag">${game.genre}</span>
                        <span style="font-weight: 600; color: var(--accent-success); font-size: 0.8rem;"><i class="fa-solid fa-download"></i> Ready</span>
                    </div>
                </div>
            </div>
        `;
    }
};
