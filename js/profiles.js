const ProfileModule = {
    render() {
        const container = document.getElementById('profileContainer');
        if (!container) return;

        const user = Storage.getUser();
        const games = Storage.getGames();
        const userGames = games.filter(g => user.uploaded.includes(g.id));

        container.innerHTML = `
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 30px; border-radius: var(--radius-lg); display: flex; gap: 20px; align-items: center; margin-bottom: 30px;">
                <img src="${user.avatar}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-main);">
                <div>
                    <h2>${user.username}</h2>
                    <p style="color: var(--text-secondary); margin-top: 4px;">${user.bio}</p>
                </div>
            </div>
            <h2>Your Published Games (${userGames.length})</h2>
            <div class="game-grid" style="margin-top: 16px;">
                ${userGames.length === 0 ? '<p style="color: var(--text-secondary);">No games uploaded yet.</p>' : userGames.map(g => GamesModule.createCardHTML(g)).join('')}
            </div>
        `;
    }
};