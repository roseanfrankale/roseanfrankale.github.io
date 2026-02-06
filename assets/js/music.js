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

    const applyVaultLabelsFromTitles = () => {
        const items = document.querySelectorAll('[data-vault-item]');
        items.forEach((item) => {
            const titleText = item.querySelector('h3')?.textContent || '';
            const videoId = item.getAttribute('data-video-id');
            const typeInfo = getVaultTypeFromTitle(titleText, videoId);
            item.setAttribute('data-vault-type', typeInfo.type);
            const labelEl = item.querySelector('p');
            if (labelEl) labelEl.textContent = typeInfo.label;
        });
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

        applyVaultLabelsFromTitles();
    };

    const vaultContainer = document.getElementById('vault-items');
    const playlistId = vaultContainer?.getAttribute('data-playlist-id');
    const additionalPlaylistId = 'OLAK5uy_mTUy5WF8_RPGYCLlpWdW6GF1DZuMjKJIA'; // Live performance songs
    let playlistLoaded = false;
    let allPlaylistItems = [];
    let itemsDisplayed = 4;

    const createVaultCard = ({ videoId, title, thumbnailUrl, type, label }) => {
        const card = document.createElement('div');
        card.className = 'rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl video-trigger cursor-pointer';
        card.setAttribute('data-vault-item', '');
        card.setAttribute('data-vault-type', type);
        card.setAttribute('data-video-id', videoId);

        const mediaWrapper = document.createElement('div');
        mediaWrapper.className = 'aspect-square bg-black/40';

        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = title;
        img.className = 'w-full h-full object-cover opacity-70';
        img.loading = 'lazy';

        mediaWrapper.appendChild(img);

        const body = document.createElement('div');
        body.className = 'px-4 py-3 flex items-center justify-between';

        const textWrap = document.createElement('div');

        const labelEl = document.createElement('p');
        labelEl.className = 'text-accent text-[10px] uppercase tracking-[0.3em]';
        labelEl.textContent = label;

        const titleEl = document.createElement('h3');
        titleEl.className = 'text-white text-sm font-bold uppercase';
        titleEl.textContent = title;

        textWrap.appendChild(labelEl);
        textWrap.appendChild(titleEl);
        body.appendChild(textWrap);

        card.appendChild(mediaWrapper);
        card.appendChild(body);

        return card;
    };

    const getVaultTypeFromTitle = (title, videoId) => {
        // Music video IDs (hardcoded to avoid title matching issues)
        const musicVideoIds = ['GiK9DDAXKJE', 'gbtkkudUFlU', '42I5WpeGZec'];
        
        if (videoId && musicVideoIds.includes(videoId)) {
            return { type: 'music-videos', label: 'Music Video' };
        }
        
        const lowerTitle = (title || '').toLowerCase();
        if (
            lowerTitle.includes('group therapy') ||
            lowerTitle.includes('heart to heart') ||
            lowerTitle.includes('my obsession')
        ) {
            return { type: 'music-videos', label: 'Music Video' };
        }
        if (lowerTitle.includes('studio') || lowerTitle.includes('session') || lowerTitle.includes('recording')) {
            return { type: 'studio', label: 'Studio Session' };
        }
        return { type: 'live', label: 'Live Performance' };
    };

    const fetchPlaylistItems = async (id) => {
        const items = [];
        let pageToken = '';

        try {
            do {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${YOUTUBE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
                );
                const data = await response.json();

                if (data.error) {
                    console.warn('YouTube playlist API error:', data.error);
                    break;
                }

                const batch = (data.items || []).map((item) => {
                    const snippet = item.snippet || {};
                    const videoId = snippet.resourceId?.videoId;
                    const title = snippet.title || 'Untitled Video';
                    const thumbnails = snippet.thumbnails || {};
                    const thumbnailUrl = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || '';
                    return { videoId, title, thumbnailUrl };
                }).filter((item) => item.videoId);

                items.push(...batch);
                pageToken = data.nextPageToken || '';
            } while (pageToken);
        } catch (error) {
            console.warn('YouTube playlist request failed:', error);
        }

        return items;
    };

    const renderVaultItems = () => {
        if (!allPlaylistItems.length) return;

        vaultContainer.innerHTML = '';
        const itemsToShow = allPlaylistItems.slice(0, itemsDisplayed);

        itemsToShow.forEach((item) => {
            const type = item.type || getVaultTypeFromTitle(item.title, item.videoId).type;
            const typeInfo = { type, label: type === 'live' ? 'Live Performance' : getVaultTypeFromTitle(item.title, item.videoId).label };
            const card = createVaultCard({
                videoId: item.videoId,
                title: item.title,
                thumbnailUrl: item.thumbnailUrl,
                type: typeInfo.type,
                label: typeInfo.label,
            });
            vaultContainer.appendChild(card);
        });

        updateLoadMoreButton();
    };

    const updateLoadMoreButton = () => {
        const loadMoreContainer = document.getElementById('load-more-container');
        if (!loadMoreContainer) return;

        if (itemsDisplayed >= allPlaylistItems.length) {
            loadMoreContainer.classList.add('hidden');
        } else {
            loadMoreContainer.classList.remove('hidden');
        }
    };

    const loadPlaylistVideos = async () => {
        if (!playlistId || !vaultContainer) return;
        allPlaylistItems = await fetchPlaylistItems(playlistId);

        // Fetch additional live performance playlist and tag as live
        const livePerformanceItems = await fetchPlaylistItems(additionalPlaylistId);
        const taggedLiveItems = livePerformanceItems.map((item) => ({
            ...item,
            type: 'live',
        }));

        allPlaylistItems = allPlaylistItems.concat(taggedLiveItems);

        if (!allPlaylistItems.length) return;

        renderVaultItems();
        playlistLoaded = true;
    };

    // Video Modal Logic
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    const closeBtn = document.getElementById('close-modal');
    const getTriggers = () => document.querySelectorAll('.video-trigger');
    let triggers = getTriggers();

    // Vault filter logic
    const vaultFilterButtons = document.querySelectorAll('[data-vault-filter]');
    const getVaultItems = () => document.querySelectorAll('[data-vault-item]');
    let vaultItems = getVaultItems();
    let activeFilter = null;

    const setVaultFilter = (filter) => {
        activeFilter = filter;
        vaultItems.forEach((item) => {
            const type = item.getAttribute('data-vault-type');
            if (!filter || type === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        vaultFilterButtons.forEach((button) => {
            button.classList.toggle('active', button.getAttribute('data-vault-filter') === filter);
        });
    };

    const refreshVaultItems = () => {
        vaultItems = getVaultItems();
        if (activeFilter) {
            const hasActive = Array.from(vaultItems).some((item) => item.getAttribute('data-vault-type') === activeFilter);
            if (!hasActive) {
                const fallbackFilters = ['live', 'music-videos', 'studio'];
                const fallback = fallbackFilters.find((filter) =>
                    Array.from(vaultItems).some((item) => item.getAttribute('data-vault-type') === filter)
                );
                if (fallback) activeFilter = fallback;
            }
        }
        setVaultFilter(activeFilter);
    };

    const bindVideoTriggers = () => {
        triggers = getTriggers();
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const videoId = trigger.getAttribute('data-video-id');
                if (videoId) openModal(videoId);
            });
        });
    };

    if (vaultFilterButtons.length) {
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

    const initializeVault = async () => {
        await loadPlaylistVideos();

        if (!playlistLoaded) {
            fetchVideoTitles();
        }

        refreshVaultItems();
        bindVideoTriggers();

        // Attach Load More button handler after vault is initialized
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                itemsDisplayed += 4;
                renderVaultItems();
                refreshVaultItems();
                bindVideoTriggers();
            });
        }
    };

    initializeVault();

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