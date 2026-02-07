document.addEventListener('DOMContentLoaded', () => {
    // YouTube API Key
    const YOUTUBE_API_KEY = 'AIzaSyBYnz372VZgs_mKqBREa9X-aCPf9oqbRBs';
    const LILA_PLAYLIST_ID = 'PLq8eop32VW4_lzzDk9UZI9XWkdyXlaMcV'; // LiLa Live Performances
    const BOXBOMB_PLAYLIST_ID = 'OLAK5uy_mTUy5WF8_RPGYCLlpWdW6GF1DZuMjKJIA'; // Boxbomb Live

    // Unified Video Configuration - Single source of truth
    const VAULT_CONFIG = [
        // Music Videos
        { id: 'GiK9DDAXKJE', type: 'music-videos' },
        { id: 'gbtkkudUFlU', type: 'music-videos' },
        { id: '42I5WpeGZec', type: 'music-videos' },
        
        // Studio Sessions
        { id: 'KvW4oQEYy6o', type: 'studio' },
        { id: 'ZDA9oJFBl7c', type: 'studio' },
        { id: 'FC1TDk5npiY', type: 'studio' },
        { id: '9LL6P55kJsA', type: 'studio' },
        { id: 'eqiF9f2E3TE', type: 'studio' },
    ];

    let livePerformanceVideos = [];
    let allVideos = [];
    let videoMetadata = {};
    let itemsDisplayed = 4;
    let activeFilter = null;

    // Batch fetch YouTube metadata
    const fetchYouTubeMetadata = async (videoIds) => {
        if (!videoIds.length) return {};
        
        try {
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.warn('YouTube API error:', data.error);
                return {};
            }

            const metadata = {};
            if (data.items) {
                data.items.forEach((item) => {
                    metadata[item.id] = {
                        title: item.snippet.title,
                        thumbnail: item.snippet.thumbnails?.maxres?.url || 
                                   item.snippet.thumbnails?.high?.url ||
                                   `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`
                    };
                });
            }
            return metadata;
        } catch (error) {
            console.warn('Failed to fetch YouTube metadata:', error);
            return {};
        }
    };

    // Fetch playlist items
    const fetchPlaylistItems = async (playlistId) => {
        const items = [];
        let pageToken = '';

        try {
            do {
                const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.error) {
                    console.warn('Playlist API error:', data.error);
                    break;
                }

                if (data.items) {
                    data.items.forEach((item) => {
                        const videoId = item.snippet?.resourceId?.videoId;
                        if (videoId) {
                            items.push(videoId);
                        }
                    });
                }

                pageToken = data.nextPageToken || '';
            } while (pageToken);
        } catch (error) {
            console.warn('Failed to fetch playlist:', error);
        }

        return items;
    };

    // Get label for type
    const getLabelForType = (type) => {
        const labels = {
            'music-videos': 'Music Video',
            'studio': 'Studio Session',
            'live': 'Live Performance'
        };
        return labels[type] || 'Video';
    };

    // Create vault card
    const createVaultCard = ({ videoId, title, thumbnail, type }) => {
        const card = document.createElement('div');
        card.className = 'rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl video-trigger cursor-pointer';
        card.setAttribute('data-vault-item', '');
        card.setAttribute('data-vault-type', type);
        card.setAttribute('data-video-id', videoId);

        const mediaWrapper = document.createElement('div');
        mediaWrapper.className = 'aspect-square bg-black/40';

        const img = document.createElement('img');
        img.src = thumbnail;
        img.alt = title;
        img.className = 'w-full h-full object-cover opacity-70';
        img.loading = 'lazy';
        mediaWrapper.appendChild(img);

        const body = document.createElement('div');
        body.className = 'px-4 py-3 flex items-center justify-between';

        const textWrap = document.createElement('div');
        const labelEl = document.createElement('p');
        labelEl.className = 'text-accent text-[10px] uppercase tracking-[0.3em]';
        labelEl.textContent = getLabelForType(type);

        const titleEl = document.createElement('h3');
        titleEl.className = 'text-white text-sm font-bold uppercase';
        titleEl.textContent = title || 'Loading...';

        textWrap.appendChild(labelEl);
        textWrap.appendChild(titleEl);
        body.appendChild(textWrap);

        card.appendChild(mediaWrapper);
        card.appendChild(body);

        return card;
    };

    // Shuffle array for randomization
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Build all videos list
    const buildAllVideos = () => {
        allVideos = [];
        
        // Add configured videos
        VAULT_CONFIG.forEach(config => {
            allVideos.push({
                id: config.id,
                type: config.type
            });
        });

        // Add live performances (randomized)
        const shuffledLive = shuffleArray(livePerformanceVideos.map(id => ({
            id,
            type: 'live'
        })));
        
        allVideos.push(...shuffledLive);
    };

    // Render vault items
    const renderVaultItems = () => {
        const vaultContainer = document.getElementById('vault-items');
        if (!vaultContainer) return;

        vaultContainer.innerHTML = '';
        const filteredVideos = allVideos.filter(v => !activeFilter || v.type === activeFilter);
        const itemsToShow = filteredVideos.slice(0, itemsDisplayed);

        itemsToShow.forEach(video => {
            const metadata = videoMetadata[video.id] || {};
            const card = createVaultCard({
                videoId: video.id,
                title: metadata.title || 'Fetching Title...',
                thumbnail: metadata.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
                type: video.type
            });
            vaultContainer.appendChild(card);
        });

        updateLoadMoreButton(filteredVideos.length);
    };

    // Update load more button
    const updateLoadMoreButton = (totalVisible) => {
        const container = document.getElementById('load-more-container');
        if (!container) return;

        if (itemsDisplayed >= totalVisible) {
            container.classList.add('hidden');
        } else {
            container.classList.remove('hidden');
        }
    };

    // Set filter
    const setFilter = (filter) => {
        activeFilter = filter;
        itemsDisplayed = 4; // Reset pagination
        renderVaultItems();

        // Update button states
        document.querySelectorAll('[data-vault-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-vault-filter') === filter);
        });
    };

    // Bind events
    const bindEvents = () => {
        // Filter buttons
        document.querySelectorAll('[data-vault-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                setFilter(btn.getAttribute('data-vault-filter'));
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                itemsDisplayed += 4;
                renderVaultItems();
                bindVideoTriggers();
            });
        }

        // Video triggers
        bindVideoTriggers();
    };

    // Bind video triggers
    const bindVideoTriggers = () => {
        document.querySelectorAll('[data-vault-item]').forEach(item => {
            item.addEventListener('click', () => {
                const videoId = item.getAttribute('data-video-id');
                if (videoId) openModal(videoId);
            });
        });
    };

    // Modal functions
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    const closeBtn = document.getElementById('close-modal');

    const openModal = (videoId) => {
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal?.classList.remove('active');
        player.src = '';
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });

    // Initialize
    const initialize = async () => {
        try {
            // Fetch configured video metadata
            const configIds = VAULT_CONFIG.map(v => v.id);
            videoMetadata = await fetchYouTubeMetadata(configIds);

            // Fetch live performances from both playlists
            console.log('Fetching live performances from LiLa and Boxbomb playlists...');
            const lilaLive = await fetchPlaylistItems(LILA_PLAYLIST_ID);
            const boxbombLive = await fetchPlaylistItems(BOXBOMB_PLAYLIST_ID);
            livePerformanceVideos = [...lilaLive, ...boxbombLive];
            console.log(`Found ${livePerformanceVideos.length} live performance videos (${lilaLive.length} LiLa + ${boxbombLive.length} Boxbomb)`);

            // Fetch metadata for live videos
            if (livePerformanceVideos.length > 0) {
                const liveMetadata = await fetchYouTubeMetadata(livePerformanceVideos);
                videoMetadata = { ...videoMetadata, ...liveMetadata };
            }

            // Build and render
            buildAllVideos();
            renderVaultItems();
            bindEvents();

        } catch (error) {
            console.error('Initialization error:', error);
        }
    };

    initialize();
});
