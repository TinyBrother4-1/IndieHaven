const GamesModule = {
    // ... existing code ...

    formatDescription(descData, isShort = false) {
        if (!descData) return '';
        
        // If it's a simple string, return directly or truncate for short cards
        if (typeof descData === 'string') {
            return `<p class="game-desc-paragraph">${descData}</p>`;
        }

        // If it's an array of strings
        if (Array.isArray(descData)) {
            if (isShort) {
                // On small cards, show only the first paragraph/item
                return descData[0] || '';
            }

            let html = '';
            let inList = false;

            descData.forEach(item => {
                const trimmed = item.trim();

                // Detect section headers (e.g., "Current Features", "Development Status")
                if (trimmed === 'Current Features' || trimmed === 'Development Status') {
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }
                    html += `<h3 class="game-desc-heading">${trimmed}</h3>`;
                } 
                // Detect bullet point items under headers
                else if (
                    trimmed.startsWith('GPU-accelerated') || 
                    trimmed.startsWith('Supports up to') || 
                    trimmed.startsWith('Continuously moving') || 
                    trimmed.startsWith('Dynamic atomic') || 
                    trimmed.startsWith('Different molecular') || 
                    trimmed.startsWith('Multiple element') || 
                    trimmed.startsWith('Bonding preferences') || 
                    trimmed.startsWith('Adjustable simulation')
                ) {
                    if (!inList) {
                        html += '<ul class="game-desc-list">';
                        inList = true;
                    }
                    html += `<li>${trimmed}</li>`;
                } 
                // Standard paragraphs
                else {
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

    createCardHTML(game) {
        const isSubdir = window.location.pathname.includes('/pages/');
        const detailHref = isSubdir ? `game.html?id=${game.id}` : `pages/game.html?id=${game.id}`;
        
        // Use short formatted description for marketplace cards
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
