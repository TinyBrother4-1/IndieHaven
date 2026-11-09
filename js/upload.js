const UploadModule = {
    initWizard() {
        const form = document.getElementById('uploadGameForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const games = Storage.getGames();
            const user = Storage.getUser();

            const newGame = {
                id: 'game_' + Date.now(),
                title: document.getElementById('gameTitleInput').value,
                dev: document.getElementById('gameDevInput').value || user.username,
                desc: document.getElementById('gameDescInput').value,
                fullDesc: document.getElementById('gameFullDescInput').value,
                genre: document.getElementById('gameGenreSelect').value,
                price: parseFloat(document.getElementById('gamePriceInput').value) || 0,
                cover: document.getElementById('gameCoverUrl').value,
                downloadUrl: document.getElementById('gameDownloadUrl').value,
                browserPlayUrl: document.getElementById('gamePlayUrl').value,
                date: new Date().toISOString()
            };

            games.unshift(newGame);
            Storage.saveGames(games);

            user.uploaded.push(newGame.id);
            Storage.saveUser(user);

            alert('Game published successfully!');
            window.location.href = 'profile.html';
        });
    }
};