const GamesModule = {
    async fetchCatalog() {
        try {
            // Determine correct path to games.json based on current depth
            const isPagesDir = window.location.pathname.includes('/pages/');
            const jsonPath = isPagesDir ? '../games.json' : 'games.json';
            
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error('Failed to load games catalog.');
            const data = await response.json();
            return data.games || [];
        } catch (error) {
            console.error('Catalog Error:', error);
            return [];
        }
    },

    async renderHomeGrids() {
        const games = await this.fetchCatalog();
        const recentGrid = document.getElementById('homeRecentGrid');
        const featuredGrid = document.getElementById('homeFeaturedGrid');
        const trendingGrid = document.getElementById('homeTrendingGrid');

        if (!recentGrid) return;

        if (games.length === 0) {
            const emptyHTML = `
                <div class="empty-state-card">
                    <i class="fa-solid fa-gamepad"></i>
                    <h3>No games in the library yet</h3>
                    <p>New indie titles added to GitHub will appear here automatically.</p>
                    <a href="pages/request.html" class="btn primary-btn discord-btn"><i class="fa-brands fa-discord"></i> Request a Game on Discord</a>
                </div>
            `;
            recentGrid.innerHTML = emptyHTML;
            if (featuredGrid) featuredGrid.innerHTML = emptyHTML;
            if (trendingGrid) trendingGrid.innerHTML = emptyHTML;
            return;
        }

        // Sort by dateAdded for recently added
        const sortedRecent = [...games].sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
        const featuredGames = games.filter(g => g.featured);

        recentGrid.innerHTML = sortedRecent.slice(0, 4).map(g => this.createCardHTML(g)).join('');
        if (featuredGrid) {
            featuredGrid.innerHTML = featuredGames.length > 0 ? featuredGames.map(g => this.createCardHTML(g)).join('') : '<p style="color: var(--text-secondary);">No featured games at the moment.</p>';
        }
        if (trendingGrid) {
            trendingGrid.innerHTML = games.slice(0, 4).map(g => this.createCardHTML(g)).join('');
        }
    },

    createCardHTML(game) {
        const isPagesDir = window.location.pathname.includes('/pages/');
        const detailHref = isPagesDir ? `game.html?id=${game.id}` : `pages/game.html?id=${game.id}`;
        
        // Resolve cover path relative to repository subdirectory
        const coverSrc = game.cover ? (isPagesDir ? `../${game.cover}` : game.cover) : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f';
        const priceLabel = game.price?.type === 'free' ? 'FREE' : (game.price?.amount > 0 ? `$${parseFloat(game.price.amount).toFixed(2)}` : 'FREE');

        return `
            <div class="game-card" onclick="window.location.href='${detailHref}'">
                <div class="game-card-img-wrapper">
                    <img src="${coverSrc}" alt="${game.title}" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f'">
                </div>
                <div class="game-card-body">
                    <h3 class="game-card-title">${game.title}</h3>
                    <p class="game-card-dev">${game.developer || 'Independent'}</p>
                    <p class="game-card-desc">${game.shortDescription || game.description || ''}</p>
                    <div class="game-card-footer">
                        <span style="font-size: 0.75rem; background: var(--bg-secondary); padding: 3px 8px; border-radius: 4px;">${game.genres?.[0] || 'Indie'}</span>
                        <span style="font-weight: 700; color: var(--accent-secondary);">${priceLabel}</span>
                    </div>
                </div>
            </div>
        `;
    }
};