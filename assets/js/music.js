document.addEventListener('DOMContentLoaded', () => {
    // YouTube API Key
    const YOUTUBE_API_KEY = 'AIzaSyBYnz372VZgs_mKqBREa9X-aCPf9oqbRBs';

    // Fetch YouTube video metadata and update titles
    const fetchTitleFromApi = async (videoId) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
            );
            const data = await response.json();

            if (data.error) {
                console.warn(`YouTube API error for ${videoId}:`, data.error);
                return null;
            }

            if (data.items && data.items[0]) {
                return data.items[0].snippet.title;
            }
        } catch (error) {
            console.warn(`YouTube API request failed for ${videoId}:`, error);
        }

        return null;
    };

    const fetchTitleFromOEmbed = async (videoId) => {
        try {
            const response = await fetch(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            );
            if (!response.ok) return null;
            const data = await response.json();
            return data.title || null;
        } catch (error) {
            console.warn(`YouTube oEmbed request failed for ${videoId}:`, error);
        }

        return null;
    };

    const setItemTitle = (item, title) => {
        const titleElement = item.querySelector('h3');
        if (titleElement && title) {
            titleElement.textContent = title;
        }
    };

    const fetchVideoTitles = async () => {
        const vaultItems = document.querySelectorAll('[data-vault-item]');

        for (const item of vaultItems) {
            const videoId = item.getAttribute('data-video-id');
            if (!videoId) continue;

            let title = await fetchTitleFromApi(videoId);
            if (!title) {
                title = await fetchTitleFromOEmbed(videoId);
            }

            if (title) {
                setItemTitle(item, title);
            }
        }
    };

    // Fetch video titles on page load
    fetchVideoTitles();

    // Video Modal Logic
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    const closeBtn = document.getElementById('close-modal');
    const triggers = document.querySelectorAll('.video-trigger');

    // Vault filter logic
    const vaultFilterButtons = document.querySelectorAll('[data-vault-filter]');
    const vaultItems = document.querySelectorAll('[data-vault-item]');

    const setVaultFilter = (filter) => {
        vaultItems.forEach((item) => {
            const type = item.getAttribute('data-vault-type');
            if (type === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        vaultFilterButtons.forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-vault-filter') === filter);
        });
    };

    if (vaultFilterButtons.length && vaultItems.length) {
        vaultFilterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-vault-filter');
                if (filter) setVaultFilter(filter);
            });
        });
    }

    // Function to open modal
    const openModal = (videoId) => {
        // Update iframe source with autoplay
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        player.src = ""; // Stop video
        document.body.style.overflow = ''; // Unlock scroll
    };

    // Attach Click Listeners to Images
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const videoId = trigger.getAttribute('data-video-id');
            if (videoId) openModal(videoId);
        });
    });

    // Close listeners
    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});