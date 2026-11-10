const GamesModule = {
    getAssetPath(path) {
        const isSubdir = window.location.pathname.includes('/pages/');
        return isSubdir ? `../${path}` : path;
    },

    async fetchCatalog() {
        const jsonUrl = this.getAssetPath('games.json');
        console.log(`[GamesModule] Fetching catalog from: ${jsonUrl}`);

        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('[GamesModule] Failed to load games.json:', error);
            this.renderErrorState(`Unable to load game catalog.`);
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
                    </div>
                `;
            }
        });
    },

    formatDescription(descData, isShort = false) {
        if (!descData) return '';
        
        if (typeof descData === 'string') {
            return `<p class="game-desc-paragraph">${descData}</p>`;
        }

        if (Array.isArray(descData)) {
            if (isShort) {
                return descData[0] || '';
            }

            let html = '';
            let inList = false;

            descData.forEach(item => {
                const trimmed = item.trim();
                const isHeading = !trimmed.endsWith('.') && !trimmed.endsWith(')') && trimmed.length < 40 && (trimmed === 'Current Features' || trimmed === 'Development Status' || trimmed.endsWith(':'));

                if (isHeading) {
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }
                    html += `<h3 class="game-desc-heading">${trimmed}</h3>`;
                } else if (trimmed.startsWith('-') || (inList && !isHeading && trimmed.length < 100)) {
                    if (!inList) {
                        html += '<ul class="game-desc-list">';
                        inList = true;
                    }
                    html += `<li>${trimmed.replace(/^- /, '')}</li>`;
                } else {
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }
                    html += `<p class="game-desc-paragraph">${trimmed}</p>`;
                }
            });

            if (inList) html += '</ul>';
            return html;
        }

        return '';
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
                    <p>New indie releases added to your root-level <code>games.json</code> will appear here automatically.</p>
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
        const shortDesc = this.formatDescription(game.desc, true);
        
        return `
            <div class="game-card" onclick="window.location.href='${detailHref}'">
                <div class="game-card-thumb">
                    <i class="fa-solid fa-gamepad"></i>
                </div>
                <div class="game-card-body">
                    <h3 class="game-card-title">${game.title}</h3>
                    <p class="game-card-author">By ${game.author}</p>
                    <div class="game-card-desc">${shortDesc}</div>
                    <div class="game-card-footer">
                        <span class="genre-pill">${game.genre}</span>
                        <span style="font-weight: 600; color: var(--success); font-size: 0.85rem;"><i class="fa-solid fa-download"></i> Archive</span>
                    </div>
                </div>
            </div>
        `;
    }
};
