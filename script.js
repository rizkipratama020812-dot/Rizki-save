const APIS = {
            tiktok: 'https://api-faa.my.id/faa/tiktok?url=',
            youtube: 'https://v2.api-varhad.my.id/download/ytmp4?url=',
            youtubeMp3: 'https://v2.api-varhad.my.id/download/ytmp3?url=',
            instagram: 'https://v2.api-varhad.my.id/download/ig?url='
        };

        const SVG_TIKTOK = `<svg viewBox="0 0 2859 3333" xmlns="http://www.w3.org/2000/svg" aria-label="TikTok">
            <path fill="#ffffff" d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-398 247-358 531 77 544 1075 705 992-358V1h551z"/>
        </svg>`;
        const SVG_YOUTUBE = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="YouTube">
            <path fill="#ffffff" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>`;
        const SVG_INSTAGRAM = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Instagram">
            <path fill="#ffffff" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>`;

        const PLATFORM_META = {
            tiktok: {
                title: 'TikTok Downloader',
                subtitle: 'Download video TikTok tanpa watermark · HD · MP3',
                placeholder: 'Tempel link TikTok di sini...',
                logo: SVG_TIKTOK,
                invalidMsg: 'Link tidak valid. Pastikan link berasal dari tiktok.com.'
            },
            youtube: {
                title: 'YouTube Downloader',
                subtitle: 'Download video YouTube dalam berbagai kualitas · MP4',
                placeholder: 'Tempel link YouTube di sini...',
                logo: SVG_YOUTUBE,
                invalidMsg: 'Link tidak valid. Pastikan link berasal dari youtube.com atau youtu.be.'
            },
            instagram: {
                title: 'Instagram Downloader',
                subtitle: 'Download video & reels Instagram · MP4',
                placeholder: 'Tempel link Instagram di sini...',
                logo: SVG_INSTAGRAM,
                invalidMsg: 'Link tidak valid. Pastikan link berasal dari instagram.com.'
            }
        };

        const urlInput = document.getElementById('urlInput');
        const downloadBtn = document.getElementById('downloadBtn');
        const btnText = document.getElementById('btnText');
        const errorMsg = document.getElementById('errorMsg');
        const resultDiv = document.getElementById('result');
        const toastEl = document.getElementById('toast');
        const titleText = document.getElementById('titleText');
        const subtitleText = document.getElementById('subtitleText');
        const logoIcon = document.getElementById('logoIcon');
        const tabs = document.querySelectorAll('.tab');

        let currentPlatform = 'tiktok';
        let toastTimer = null;

        function formatBytes(bytes) {
            const value = Number(bytes);
            if (!Number.isFinite(value) || value <= 0) return '';
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.min(Math.floor(Math.log(value) / Math.log(1024)), sizes.length - 1);
            return (value / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        }

        function formatNumber(n) {
            if (n === null || n === undefined) return '-';
            if (typeof n === 'string') return n;
            if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
            if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
            if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
            return String(n);
        }

        function formatDuration(sec) {
            if (!sec || isNaN(sec)) return null;
            sec = Math.round(sec);
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            return `${m}:${String(s).padStart(2,'0')}`;
        }

        function escapeHtml(str) {
            if (str === null || str === undefined) return '';
            const div = document.createElement('div');
            div.textContent = String(str);
            return div.innerHTML;
        }

        function showToast(msg) {
            toastEl.textContent = msg;
            toastEl.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
        }

        function showError(msg) {
            errorMsg.textContent = msg;
            errorMsg.classList.add('error');
        }

        function clearError() {
            errorMsg.textContent = '';
            errorMsg.classList.remove('error');
        }

        function setLoading(loading) {
            downloadBtn.disabled = loading;
            btnText.innerHTML = loading ? 'Memproses...' : 'Download';
        }

        function getExtension(url, kind) {
            try {
                const u = new URL(url);
                const path = u.pathname.toLowerCase();
                const m = path.match(/\.(mp4|m4a|mp3|webm|mov|aac|wav|jpg|jpeg|png|webp)$/);
                if (m) return '.' + m[1].replace('jpeg', 'jpg');
                const q = u.search.toLowerCase();
                if (q.includes('mime_type=audio')) return '.mp3';
                if (q.includes('mime_type=video')) return '.mp4';
            } catch {}
            return kind === 'audio' ? '.mp3' : (kind === 'image' ? '.jpg' : '.mp4');
        }

        function cleanFilename(s, max = 50) {
            return (s || '')
                .toString()
                .normalize('NFKD')
                .replace(/[^\w\s\-]/g, '')
                .replace(/\s+/g, '_')
                .slice(0, max)
                .replace(/^_+|_+$/g, '') || 'file';
        }

        function buildFilename(base, ext) {
            return `${cleanFilename(base)}${ext}`;
        }

        async function downloadFile(url, filename, btnEl) {
            if (!url) { showToast('Link download tidak tersedia.'); return; }
            const originalHTML = btnEl ? btnEl.innerHTML : null;
            if (btnEl) {
                btnEl.disabled = true;
                btnEl.innerHTML = '<span class="btn-spinner"></span> Menyiapkan...';
            }
            try {
                const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
                if (!res.ok) throw new Error('Fetch gagal: ' + res.status);
                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objectUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
                showToast('Download dimulai: ' + filename);
            } catch (err) {
                console.warn('Download langsung gagal:', err);
                showToast('Download langsung gagal. Server media mungkin membatasi akses (CORS).');
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    if (originalHTML !== null) btnEl.innerHTML = originalHTML;
                }
            }
        }

        function switchPlatform(platform) {
            currentPlatform = platform;
            const meta = PLATFORM_META[platform];

            document.body.setAttribute('data-theme', platform);

            tabs.forEach((t) => {
                const isActive = t.dataset.platform === platform;
                t.classList.toggle('active', isActive);
                t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            titleText.textContent = meta.title;
            subtitleText.textContent = meta.subtitle;
            urlInput.placeholder = meta.placeholder;
            logoIcon.innerHTML = meta.logo;

            // Mainkan ulang transisi ringan setiap platform berganti.
            const header = document.querySelector('header');
            header.classList.remove('platform-transition');
            void header.offsetWidth;
            header.classList.add('platform-transition');

            clearError();
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';
            urlInput.value = '';
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => switchPlatform(tab.dataset.platform));
        });

        function validateUrl(url, platform) {
            try {
                const u = new URL(url);
                const host = u.hostname.replace(/^www\./, '');
                if (platform === 'youtube') {
                    return /youtube\.com$/.test(host) || /youtu\.be$/.test(host);
                }
                if (platform === 'tiktok') {
                    return /tiktok\.com$/.test(host) || /vm\.tiktok\.com$/.test(host) || /vt\.tiktok\.com$/.test(host);
                }
                if (platform === 'instagram') {
                    return /instagram\.com$/.test(host) || /instagr\.am$/.test(host) || /ig\.me$/.test(host);
                }
                return false;
            } catch {
                return false;
            }
        }

        function renderTikTokSlides(data, r) {
            const images = (Array.isArray(r.data) ? r.data : (Array.isArray(r.alternatif) ? r.alternatif : []))
                .filter((url) => typeof url === 'string' && /^https?:\/\//i.test(url));
            if (!images.length) throw new Error('Foto dari postingan TikTok tidak ditemukan.');

            const author = r.pengarang || r.author || {};
            const stats = r.statistik || r.stats || {};
            const title = r.title || r.judul || 'Postingan foto TikTok';
            const username = author['nama pengguna'] || author.username || 'unknown';
            const nickname = author['nama panggilan'] || author.nickname || username;
            const avatar = author.avatar || '';
            const cover = r.sampul || r.cover || images[0];
            const date = r['diambil pada'] || r.taken_at || '-';
            const region = r.wilayah || r.region || '-';
            const id = r.id || '';
            const music = r.informasi_musik || r.music_info || {};
            const musicUrl = music.url || null;
            const safeTitle = escapeHtml(title);
            const firstFilename = buildFilename(`tiktok_${username}_${id || 'slide'}_foto_01`, getExtension(images[0], 'image'));
            const imageDownloadButton = `<button class="dl-btn primary" id="downloadCurrentSlide" data-url="${escapeHtml(images[0])}" data-filename="${escapeHtml(firstFilename)}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Unduh Foto Ini</span>
            </button>`;
            const musicButton = musicUrl ? `<button class="dl-btn music" data-url="${escapeHtml(musicUrl)}" data-filename="${escapeHtml(buildFilename(`tiktok_${username}_audio`, '.mp3'))}">Download Audio (MP3)</button>` : '';

            resultDiv.innerHTML = `
                <div class="result-card photo-result">
                    <div class="author-section">
                        ${avatar ? `<img class="author-avatar" src="${escapeHtml(avatar)}" alt="${escapeHtml(nickname)}" onerror="this.style.display='none'">` : ''}
                        <div class="author-info"><div class="author-name">${escapeHtml(nickname)}</div><div class="author-username">@${escapeHtml(username)}</div></div>
                    </div>
                    <div class="photo-viewer">
                        <img class="photo-slide" id="tiktokSlideImage" src="${escapeHtml(images[0])}" alt="Foto 1 dari ${images.length}" loading="eager">
                        <button class="slide-arrow prev" id="slidePrev" type="button" aria-label="Foto sebelumnya" disabled>‹</button>
                        <button class="slide-arrow next" id="slideNext" type="button" aria-label="Foto berikutnya" ${images.length < 2 ? 'disabled' : ''}>›</button>
                        <span class="slide-counter" id="slideCounter">1 / ${images.length}</span>
                    </div>
                    <div class="slide-dots">${images.map((_, i) => `<button type="button" class="slide-dot ${i === 0 ? 'active' : ''}" data-slide-index="${i}" aria-label="Lihat foto ${i + 1}"></button>`).join('')}</div>
                    <div class="result-body">
                        <p class="video-title">${safeTitle}</p>
                        <div class="meta-row">
                            <span class="meta-item">${images.length} Foto</span>
                            <span class="meta-item">${escapeHtml(date)}</span>
                            <span class="meta-item">${escapeHtml(region)}</span>
                        </div>
                        <div class="downloads photo-downloads">${imageDownloadButton}${musicButton}</div>
                    </div>
                    <div class="stats">
                        <div class="stat"><div class="stat-value">${escapeHtml(stats.tayangan || stats.views || '0')}</div><div class="stat-label">Views</div></div>
                        <div class="stat"><div class="stat-value">${escapeHtml(stats.Suka || stats.likes || '0')}</div><div class="stat-label">Likes</div></div>
                        <div class="stat"><div class="stat-value">${escapeHtml(stats.komentar || stats.comment || '0')}</div><div class="stat-label">Komentar</div></div>
                        <div class="stat"><div class="stat-value">${escapeHtml(stats.bagikan || stats.share || '0')}</div><div class="stat-label">Share</div></div>
                    </div>
                </div>`;

            let activeIndex = 0;
            const slideImage = document.getElementById('tiktokSlideImage');
            const counter = document.getElementById('slideCounter');
            const prev = document.getElementById('slidePrev');
            const next = document.getElementById('slideNext');
            const dots = Array.from(resultDiv.querySelectorAll('.slide-dot'));
            const currentDownload = document.getElementById('downloadCurrentSlide');
            const showSlide = (index) => {
                activeIndex = (index + images.length) % images.length;
                slideImage.src = images[activeIndex];
                currentDownload.dataset.url = images[activeIndex];
                currentDownload.dataset.filename = buildFilename(`tiktok_${username}_${id || 'slide'}_foto_${String(activeIndex + 1).padStart(2, '0')}`, getExtension(images[activeIndex], 'image'));
                currentDownload.querySelector('span').textContent = `Unduh Foto ${activeIndex + 1}`;
                slideImage.alt = `Foto ${activeIndex + 1} dari ${images.length}`;
                counter.textContent = `${activeIndex + 1} / ${images.length}`;
                prev.disabled = activeIndex === 0;
                next.disabled = activeIndex === images.length - 1;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
            };
            prev.addEventListener('click', () => showSlide(activeIndex - 1));
            next.addEventListener('click', () => showSlide(activeIndex + 1));
            dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slideIndex))));
        }

        function renderTikTok(data) {
            const r = data.result || data.hasil;
            if (!r) throw new Error('Data TikTok tidak ditemukan.');

            // API Faa juga mengembalikan postingan Photo Mode berupa beberapa gambar.
            const contentType = String(r.tipe || r.type || '').toLowerCase();
            if (contentType === 'gambar' || contentType === 'image' || Array.isArray(r.data) && r.data.length && typeof r.data[0] === 'string') {
                renderTikTokSlides(data, r);
                return;
            }

            const alts = r.alternatives || {};
            const music = r.music_info || {};
            const stats = r.stats || {};
            const author = r.author || {};
            const size = r.size || {};

            const authorName = author.nickname || 'Unknown';
            const authorUsername = author.username || 'unknown';
            const videoTitle = r.title || 'Tanpa judul';
            const videoId = r.id || '';

            const nowmHd = alts.selected || alts.hd || r.data || null;
            const nowmSd = alts.sd || null;
            const wmUrl = alts.wm || null;
            const musicUrl = music.url || null;
            const videoSrc = nowmHd || wmUrl || r.data || null;

            const buttons = [];
            if (nowmHd) buttons.push({ cls: 'primary', label: 'Video HD (No Watermark)', url: nowmHd, kind: 'video', size: size.nowm_hd });
            if (nowmSd) buttons.push({ cls: 'secondary', label: 'SD (No WM)', url: nowmSd, kind: 'video', size: size.nowm });
            if (wmUrl) buttons.push({ cls: 'secondary', label: 'Dengan Watermark', url: wmUrl, kind: 'video', size: size.wm });
            if (musicUrl) buttons.push({ cls: 'music', label: 'Download Audio (MP3)', url: musicUrl, kind: 'audio', size: null });

            const iconDownload = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
            const iconMusic = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;

            const dlButtonsHtml = buttons.map((b) => {
                const ext = getExtension(b.url, b.kind);
                const filename = buildFilename(`tiktok_${authorUsername}_${videoTitle}_${videoId}`, ext);
                const sizeHtml = b.size ? `<span class="file-size">${formatBytes(b.size)}</span>` : '';
                return `<button class="dl-btn ${b.cls}" data-url="${escapeHtml(b.url)}" data-filename="${escapeHtml(filename)}">
                    ${b.kind === 'audio' ? iconMusic : iconDownload}
                    <span>${escapeHtml(b.label)}</span>
                    ${sizeHtml}
                </button>`;
            }).join('');

            const videoPlayer = videoSrc ? `
                <div class="video-wrap">
                    <video class="video-embed" controls playsinline preload="metadata" poster="${escapeHtml(r.cover || '')}">
                        <source src="${escapeHtml(videoSrc)}" type="video/mp4">
                        Browser Anda tidak mendukung pemutaran video.
                    </video>
                </div>
            ` : '';

            const statsHtml = `
                <div class="stats">
                    <div class="stat"><div class="stat-value">${escapeHtml(stats.views || '0')}</div><div class="stat-label">Views</div></div>
                    <div class="stat"><div class="stat-value">${escapeHtml(stats.likes || '0')}</div><div class="stat-label">Likes</div></div>
                    <div class="stat"><div class="stat-value">${escapeHtml(stats.comment || '0')}</div><div class="stat-label">Komentar</div></div>
                    <div class="stat"><div class="stat-value">${escapeHtml(stats.share || '0')}</div><div class="stat-label">Share</div></div>
                </div>
            `;

            resultDiv.innerHTML = `
                <div class="result-card">
                    <div class="author-section">
                        <img class="author-avatar" src="${escapeHtml(author.avatar || '')}" alt="${escapeHtml(authorName)}" onerror="this.style.display='none'">
                        <div class="author-info">
                            <div class="author-name">${escapeHtml(authorName)}</div>
                            <div class="author-username">@${escapeHtml(authorUsername)}</div>
                        </div>
                    </div>
                    ${videoPlayer}
                    <div class="result-body">
                        <p class="video-title">${escapeHtml(videoTitle)}</p>
                        <div class="meta-row">
                            <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${escapeHtml(r.duration || '-')}</span>
                            <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${escapeHtml(r.taken_at || '-')}</span>
                            <span class="meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${escapeHtml(r.region || '-')}</span>
                        </div>
                        <div class="downloads">${dlButtonsHtml}</div>
                    </div>
                    ${statsHtml}
                </div>
            `;
        }

        function renderYouTube(data) {
            const r = data.result;
            if (!r) throw new Error('Data video tidak ditemukan.');

            const title = r.title || 'Tanpa judul';
            const thumbnail = r.thumbnail || '';
            const duration = r.duration || 0;
            const videos = Array.isArray(r.videos) ? r.videos : [];
            const audio = data.ytAudio?.result || null;

            const seen = new Map();
            videos.forEach((v) => {
                if (!v || !v.url) return;
                const q = Number(v.quality) || 0;
                if (!seen.has(q) || (seen.get(q).label || '').length < (v.label || '').length) {
                    seen.set(q, v);
                }
            });
            const sorted = Array.from(seen.values()).sort((a, b) => (Number(b.quality) || 0) - (Number(a.quality) || 0));
            if (!sorted.length && !audio?.download) throw new Error('Pilihan video maupun audio tidak ditemukan dari API YouTube.');

            const iconDownload = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

            const qualityButtons = sorted.map((v, idx) => {
                const ext = getExtension(v.url, 'video');
                const qLabel = v.label || `${v.quality}p`;
                const filename = buildFilename(`youtube_${title}_${v.quality}p`, ext);
                const isPrimary = idx === 0;
                const hdBadge = (Number(v.quality) >= 720) ? '<span class="badge-hd">HD</span>' : '';
                return `<button class="dl-btn ${isPrimary ? 'primary' : 'secondary'}" data-url="${escapeHtml(v.url)}" data-filename="${escapeHtml(filename)}">
                    ${iconDownload}
                    <span>${escapeHtml(qLabel)}${hdBadge}</span>
                </button>`;
            }).join('');
            const mp3Button = audio?.download ? `<button class="dl-btn music" data-url="${escapeHtml(audio.download)}" data-filename="${escapeHtml(buildFilename(`youtube_${audio.title || title}`, '.mp3'))}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg><span>Download MP3</span></button>` : '';

            resultDiv.innerHTML = `
                <div class="result-card yt">
                    <div class="video-wrap">
                        <img class="yt-thumb" src="${escapeHtml(thumbnail)}" alt="${escapeHtml(title)}" onerror="this.style.display='none'">
                    </div>
                    <div class="result-body">
                        <p class="video-title">${escapeHtml(title)}</p>
                        <div class="meta-row">
                            <span class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                ${escapeHtml(formatDuration(duration) || '-')}
                            </span>
                            <span class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                ${sorted.length} kualitas
                            </span>
                        </div>
                        <div class="quality-grid">${qualityButtons}${mp3Button}</div>
                    </div>
                </div>
            `;
        }

        function renderInstagram(data) {
            const r = data.result;
            if (!r) throw new Error('Data media tidak ditemukan.');

            const type = r.type || 'video';
            const author = r.author || {};
            const stats = r.stats || {};
            const mediaUrl = r.media || '';
            const caption = r.caption || '';
            const uploadAt = r.uploadAt || '-';

            const authorName = author.name || 'Unknown';
            const authorUsername = author.username || 'unknown';
            const authorPP = author.pp || '';

            const isImage = type === 'image' || type === 'photo' || /\.(jpg|jpeg|png|webp)(\?|$)/i.test(mediaUrl);
            const ext = getExtension(mediaUrl, isImage ? 'image' : 'video');
            const filenameBase = `instagram_${authorUsername}_${caption ? caption.slice(0, 30) : 'media'}`;
            const filename = buildFilename(filenameBase, ext);

            const iconDownload = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

            const mediaPreview = mediaUrl ? (
                isImage
                    ? `<div class="video-wrap"><img class="yt-thumb" src="${escapeHtml(mediaUrl)}" alt="${escapeHtml(caption)}" onerror="this.style.display='none'"></div>`
                    : `<div class="video-wrap"><video class="video-embed" controls playsinline preload="metadata" poster="${escapeHtml(authorPP)}"><source src="${escapeHtml(mediaUrl)}" type="video/mp4">Browser Anda tidak mendukung pemutaran video.</video></div>`
            ) : '';

            const statItems = [];
            if (stats.like !== null && stats.like !== undefined) {
                statItems.push(`<div class="stat"><div class="stat-value">${formatNumber(stats.like)}</div><div class="stat-label">Likes</div></div>`);
            }
            if (stats.comments !== null && stats.comments !== undefined) {
                statItems.push(`<div class="stat"><div class="stat-value">${formatNumber(stats.comments)}</div><div class="stat-label">Komentar</div></div>`);
            }
            if (stats.views !== null && stats.views !== undefined) {
                statItems.push(`<div class="stat"><div class="stat-value">${formatNumber(stats.views)}</div><div class="stat-label">Views</div></div>`);
            }
            const statsHtml = statItems.length > 0 ? `<div class="stats">${statItems.join('')}</div>` : '';

            const durationText = stats.duration ? formatDuration(stats.duration) : null;

            resultDiv.innerHTML = `
                <div class="result-card ig">
                    <div class="author-section">
                        <img class="author-avatar" src="${escapeHtml(authorPP)}" alt="${escapeHtml(authorName)}" onerror="this.style.display='none'">
                        <div class="author-info">
                            <div class="author-name">${escapeHtml(authorName)}</div>
                            <div class="author-username">@${escapeHtml(authorUsername)}</div>
                        </div>
                    </div>
                    ${mediaPreview}
                    <div class="result-body">
                        ${caption ? `<p class="video-title">${escapeHtml(caption)}</p>` : ''}
                        <div class="meta-row">
                            <span class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                ${escapeHtml(uploadAt)}
                            </span>
                            <span class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                ${isImage ? 'Gambar' : 'Video'}${durationText ? ' · ' + durationText : ''}
                            </span>
                        </div>
                        <div class="downloads">
                            <button class="dl-btn primary" data-url="${escapeHtml(mediaUrl)}" data-filename="${escapeHtml(filename)}">
                                ${iconDownload}
                                <span>Download ${isImage ? 'Gambar' : 'Video'}</span>
                            </button>
                        </div>
                    </div>
                    ${statsHtml}
                </div>
            `;
        }

        function bindDownloadButtons() {
            resultDiv.querySelectorAll('.dl-btn').forEach((btn) => {
                btn.addEventListener('click', () => {
                    downloadFile(btn.getAttribute('data-url'), btn.getAttribute('data-filename'), btn);
                });
            });
        }

        async function handleDownload() {
            const url = urlInput.value.trim();
            clearError();
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';

            if (!url) { showError('Silakan masukkan link terlebih dahulu.'); urlInput.focus(); return; }

            if (!validateUrl(url, currentPlatform)) {
                showError(PLATFORM_META[currentPlatform].invalidMsg);
                return;
            }

            setLoading(true);
            try {
                const apiUrl = APIS[currentPlatform] + encodeURIComponent(url);
                const res = await fetch(apiUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
                if (!res.ok) throw new Error(`Server merespons dengan status ${res.status}`);
                const data = await res.json();
                if (currentPlatform === 'youtube') {
                    try {
                        const audioRes = await fetch(APIS.youtubeMp3 + encodeURIComponent(url), { method: 'GET', headers: { 'Accept': 'application/json' } });
                        if (audioRes.ok) {
                            const audioData = await audioRes.json();
                            if (audioData && audioData.status === true && audioData.result?.download) data.ytAudio = audioData;
                        }
                    } catch (audioError) {
                        console.warn('API YouTube MP3 tidak tersedia:', audioError);
                    }
                }
                if (!data || data.status === false) {
                    throw new Error(data && data.message ? data.message : 'API gagal memproses link. Pastikan link valid dan publik.');
                }

                if (currentPlatform === 'tiktok') renderTikTok(data);
                else if (currentPlatform === 'youtube') renderYouTube(data);
                else renderInstagram(data);

                bindDownloadButtons();
                resultDiv.style.display = 'flex';
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (err) {
                console.error(err);
                if (err.name === 'TypeError') showError('Gagal terhubung ke server. Periksa koneksi internet Anda atau coba lagi.');
                else showError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        }

        downloadBtn.addEventListener('click', handleDownload);
        urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleDownload(); });
        urlInput.addEventListener('input', clearError);

        switchPlatform('tiktok');
