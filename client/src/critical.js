const loadingScreenEl = document.getElementById('loading-screen');

window.loadingScreen = {
    fadeOut: () => {
        loadingScreenEl.classList.add('LoadingScreen--fade-out');
        setTimeout(() => {
            loadingScreenEl.remove();
        }, 5000);
    }
}

window.onload = () => {
    setTimeout(() => {
        window.loadingScreen.fadeOut();
    }, 500);
}