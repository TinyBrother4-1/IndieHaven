const GamesModule = {
    // Dynamically resolves paths for root files regardless of subdirectory deployment
    getAssetPath(path) {
        const isSubdir = window.location.pathname.includes('/pages/');
        return isSubdir ? `../${path}` : path;
    },

    async fetchCatalog() {
        const jsonUrl = this.getAssetPath('games.json');
        console.log(`[GamesModule] Attempting to fetch games catalog from: ${jsonUrl}`);

        try {
            const response = await fetch(jsonUrl);
            console.log(`[GamesModule] Fetch response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rawText = await response.text();
            
            let data;
            try {
                data = JSON.parse(rawText);
            } catch (parseError) {
                console.error('[GamesModule] JSON Parsing Error:', parseError);
                this.renderErrorState(`Failed to parse games catalog: Invalid JSON format.`);
                return [];
            }

            if (!Array.isArray(data)) {
                console.warn('[GamesModule] Warning: games.json root is not an array. Normalizing data.');
                return [];
            }

            console.log(`[GamesModule] Successfully loaded ${data.length} game entry(ies).`, data);
            return data;

        } catch (error) {
            console.error('[GamesModule] Failed to fetch games.json:', error);
            this.renderErrorState(`Unable to load game catalog. Please verify that games.json exists in the repository root.`);
            return [];
        }
    },

    renderErrorState(message) {
        const gridIds = ['homeRecentGrid', 'browseGrid'];
        gridIds.forEach(id => {
            const grid = document.getElementById(id);
            if (grid) {
                grid.innerHTML = `
                    <div class="empty-state-card" style="border-color: rgba(231, 76, 60, 0.4);">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #e74c3c;"></i>
                        <h3>Catalog Loading Error</h3>
                        <p>${message}</p>
                        <a href="https://discord.gg/kdVEerSBRR" target="_blank" rel="noopener noreferrer" class="btn discord-btn" style="margin-top: 10px;">
                            <i class="fa-brands fa-discord"></i> Get Support on Discord
                        </a>
                    </div>
                `;
            }
        });
    },

    async renderHomeGrids() {
        const games = await this.fetchCatalog();
        const recentGrid = document.getElementById('homeRecentGrid');

        if (!recentGrid) return;

        if (games.length === 0) {
            recentGrid.innerHTML = `
                <div class="empty-state-card">
                    <i class="fa-solid fa-box-open"></i>
                    <h3>No Games in the Marketplace Yet</h3>
                    <p>New indie releases added to your root-level <code>games.json</code> array will appear here automatically.</p>
                    <a href="https://discord.gg/kdVEerSBRR" target="_blank" rel="noopener noreferrer" class="btn discord-btn" style="margin-top: 8px;">
                        <i class="fa-brands fa-discord"></i> Request a Game on Discord
                    </a>
                </div>
            `;
            return;
        }

        const sorted = [...games].sort((a, b) => new Date(b.added || 0) - new Date(a.added || 0));
        recentGrid.innerHTML = sorted.map(g => this.createCardHTML(g)).join('');
    },

    createCardHTML(game) {
        const isSubdir = window.location.pathname.includes('/pages/');
        const detailHref = isSubdir ? `game.html?id=${game.id}` : `pages/game.html?id=${game.id}`;
        
        return `
            <div class="game-card" onclick="window.location.href='${detailHref}'">
                <div class="game-card-thumb">
                    <i class="fa-solid fa-gamepad"></i>
                </div>
                <div class="game-card-body">
                    <h3 class="game-card-title">${game.title}</h3>
                    <p class="game-card-author">By ${game.author}</p>
                    <p class="game-card-desc">${game.desc}</p>
                    <div class="game-card-footer">
                        <span class="genre-pill">${game.genre}</span>
                        <span style="font-weight: 600; color: var(--success); font-size: 0.85rem;"><i class="fa-solid fa-download"></i> Archive</span>
                    </div>
                </div>
            </div>
        `;
    }
};
