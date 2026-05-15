const GAS_URL = "https://script.google.com/macros/s/AKfycbwE7GeybPMytQmd6kVz6njDlUqCbzUFh_Ulq6mESjv1eF7dnINcX0xfqlE4pHS4871o8w/exec";

document.addEventListener('alpine:init', () => {
    Alpine.data('sdnApp', () => ({
        loading: true,
        activeSection: 'home',
        settings: {
            school_name: 'SDN MEKARSARI',
            school_logo: '',
            hero_subtitle: '',
            school_description: 'Mewujudkan lembaga pendidikan yang unggul dalam prestasi, luhur dalam budi pekerti, dan berwawasan lingkungan.',
            announcement_active: 'false',
            announcement_text: '',
            address: 'Jl. Raya Mekarsari No. 78, Surabaya',
            phone: '031-12345678',
            email: 'sdn.mekarsari78@gmail.com',
            facebook_url: '#',
            instagram_url: '#',
            youtube_url: '#',
            npsn: '10602048',
            status: 'Negeri',
            accreditation: 'A',
            curriculum: 'Merdeka'
        },

        teachers: [],
        news: [],
        videos: [],
        sliders: [],
        activeSlide: 0,
        mobileMenuOpen: false,

        // Article Logic
        showArticleView: false,
        selectedArticle: null,



        openArticle(post) {
            this.selectedArticle = post;
            this.showArticleView = true;
            document.body.style.overflow = 'hidden'; // prevent background scroll
        },
        closeArticle() {
            this.showArticleView = false;
            setTimeout(() => { this.selectedArticle = null; }, 300); // Wait for transition
            document.body.style.overflow = 'auto';
        },

        get mapEmbed() {
            if (!this.settings.google_maps_embed) return "";
            let html = this.settings.google_maps_embed;
            // More aggressive satellite force
            if (html.includes("google.com/maps/embed")) {
                // 1. PB string injection
                if (!html.includes("!1m1!1e3")) {
                    html = html.replace(/pb=(![^"& ]+)/, (match, pb) => "pb=!1m1!1e3" + pb);
                }
                // 2. URL Parameter injection (Legacy/Alternative)
                if (!html.includes("t=k")) {
                    html = html.replace("google.com/maps/embed?", "google.com/maps/embed?t=k&");
                }
            }
            return html;
        },

        fixUrl(url) {
            if (!url) return "";
            // Convert legacy uc?id= format to high-compatibility lh3 format
            if (url.includes("drive.google.com/uc?id=")) {
                const id = url.split("id=")[1].split("&")[0];
                return `https://lh3.googleusercontent.com/d/${id}`;
            }
            return url;
        },

        async init() {
            const startTime = Date.now();
            this.updateFavicon();
            this.setupScrollObserver();

            // SINKRONISASI URL: Pantau perubahan activeSection dan update Hash di Browser
            this.$watch('activeSection', (val) => {
                if (this.loading) return;
                const newHash = (val === 'home' || !val) ? '#' : '#' + val;
                // Gunakan replaceState agar tidak bikin 'lag' atau scroll loncat saat update URL
                if (window.location.hash !== newHash) {
                    history.replaceState(null, null, newHash);
                }
            });

            // Initial sync activeSection with URL Hash if present
            if (window.location.hash) {
                const target = window.location.hash.substring(1);
                if (['home', 'about', 'teachers', 'news', 'contact'].includes(target)) {
                    this.activeSection = target;
                }
            }

            try {
                if (GAS_URL.includes("GANTI")) {
                    const duration = Date.now() - startTime;
                    if (duration < 1500) await new Promise(r => setTimeout(r, 1500 - duration));
                    this.loading = false;
                    return;
                }
                
                const res = await fetch(`${GAS_URL}?action=getDashboardData&t=${Date.now()}`);
                const json = await res.json();
                
                if (json.status === 'success') {
                    const d = json.data;
                    if(d.settings) {
                        this.settings = { ...this.settings, ...d.settings };
                        this.settings.school_logo = this.fixUrl(this.settings.school_logo);
                    }

                    if(d.teachers) {
                        this.teachers = d.teachers.map(t => ({ ...t, photo_url: this.fixUrl(t.photo_url) }));
                    }
                    if(d.posts) {
                        this.news = d.posts.filter(p => p.category === 'news').map(p => ({ ...p, thumbnail_url: this.fixUrl(p.thumbnail_url) }));
                        this.videos = d.posts.filter(p => p.category === 'link').map(p => ({ ...p, thumbnail_url: this.fixUrl(p.thumbnail_url) }));
                    }

                    if(d.sliders && d.sliders.length > 0) {
                        this.sliders = d.sliders.map(s => ({ ...s, image_url: this.fixUrl(s.image_url) }));
                        this.startSlider();
                    }
                }

                setInterval(() => this.fetchSliders(), 10000);

            } catch (err) {
                console.error("Failed to load data from server", err);
            } finally {
                const duration = Date.now() - startTime;
                const minWait = 1500;
                if (duration < minWait) {
                    await new Promise(r => setTimeout(r, minWait - duration));
                }
                this.loading = false;
                this.updateFavicon();
                this.updateDocumentTitle();

                // === STATIC MIRROR: Auto-open target news article if set ===
                this.checkAndOpenTargetNews();

                // Re-sync scroll position after content renders to fix wrong landing on refresh
                if (window.location.hash) {
                    setTimeout(() => {
                        const target = document.querySelector(window.location.hash);
                        if (target) {
                            window.scrollTo({
                                top: target.offsetTop - 80,
                                behavior: "smooth"
                            });
                        }
                    }, 300);
                }
            }
        },

        checkAndOpenTargetNews() {
            // Read ?post=ID from URL query string
            const params = new URLSearchParams(window.location.search);
            const targetId = params.get('post');
            if (!targetId) return;

            // Clean the URL (remove ?post=... without reloading the page)
            const cleanUrl = window.location.pathname + '#news';
            history.replaceState(null, '', cleanUrl);

            // Find the article in loaded news by ID
            const article = this.news.find(p => String(p.id) === String(targetId));

            if (article) {
                setTimeout(() => {
                    const newsSection = document.getElementById('news');
                    if (newsSection) {
                        window.scrollTo({ top: newsSection.offsetTop - 80, behavior: 'smooth' });
                    }
                    setTimeout(() => this.openArticle(article), 600);
                }, 400);
            }
        },

        updateDocumentTitle() {
            if (this.settings.school_name) {
                let newTitle = this.settings.school_name;
                if (this.settings.hero_subtitle) {
                    newTitle += " - " + this.settings.hero_subtitle;
                }
                document.title = newTitle;
            }
        },

        updateFavicon() {
            if (!this.settings.school_logo) return;
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = this.settings.school_logo;
            document.getElementsByTagName('head')[0].appendChild(link);
        },

        setupScrollObserver() {
            const sections = document.querySelectorAll('section[id]');
            
            window.addEventListener('scroll', () => {
                if (this.loading) return;
                
                let current = 'home';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    // Menggunakan offset 150px untuk kompensasi tinggi navbar yang fixed
                    if (window.pageYOffset >= sectionTop - 150) {
                        current = section.id;
                    }
                });

                if (window.pageYOffset < 100) {
                    current = 'home';
                }

                if (this.activeSection !== current) {
                    this.activeSection = current;
                }
            });
        },

        async fetchSliders() {
            try {
                const res = await fetch(`${GAS_URL}?action=getSliders&t=${Date.now()}`);
                const json = await res.json();
                if(json.data && json.data.length > 0) {
                    // Hanya update jika ada perubahan jumlah atau data (opsional, tapi sederhananya timpa saja)
                    this.sliders = json.data;
                }
            } catch (e) { console.error("Polling error", e); }
        },

        startSlider() {
            if (this.sliders.length <= 1) return;
            // Gunakan variabel agar tidak dobel interval jika terpanggil lagi
            if(window.heroInterval) clearInterval(window.heroInterval);
            window.heroInterval = setInterval(() => {
                this.activeSlide = (this.activeSlide + 1) % this.sliders.length;
            }, 2000);
        },

        submitContact(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'saveMessage';
            
            // Basic UI feedback
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Mengirim...";
            btn.disabled = true;

            fetch(GAS_URL, {
                method: "POST",
                body: JSON.stringify(data)
            }).then(r => r.json()).then(res => {
                alert("Pesan berhasil dikirim!");
                e.target.reset();
            }).catch(err => {
                alert("Pesan Anda telah dikirim (atau simulasi sukses jika URL salah).");
                e.target.reset();
            }).finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        }
    }));
});
