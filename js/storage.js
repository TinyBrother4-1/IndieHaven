const Storage = {
    getGames() {
        try {
            return JSON.parse(localStorage.getItem('indiehaven_games')) || [];
        } catch {
            return [];
        }
    },
    saveGames(games) {
        localStorage.setItem('indiehaven_games', JSON.stringify(games));
    },
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('indiehaven_favorites')) || [];
        } catch {
            return [];
        }
    },
    saveFavorites(favorites) {
        localStorage.setItem('indiehaven_favorites', JSON.stringify(favorites));
    },
    getUser() {
        try {
            return JSON.parse(localStorage.getItem('indiehaven_user')) || {
                username: "IndependentCreator",
                bio: "Publishing unique indie experiences.",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                uploaded: []
            };
        } catch {
            return null;
        }
    },
    saveUser(user) {
        localStorage.setItem('indiehaven_user', JSON.stringify(user));
    }
};