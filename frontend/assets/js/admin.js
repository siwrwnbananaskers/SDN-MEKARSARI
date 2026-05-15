const GAS_URL = "https://script.google.com/macros/s/AKfycbwE7GeybPMytQmd6kVz6njDlUqCbzUFh_Ulq6mESjv1eF7dnINcX0xfqlE4pHS4871o8w/exec";

document.addEventListener('alpine:init', () => {
    Alpine.data('adminApp', () => ({
        loading: false,
        initialLoading: true,
        logoUploading: false,
        adminLogoUploading: false,
        isLoggedIn: false,
        sidebarOpen: window.innerWidth > 768,
        fullPageLoader: false,
        email: '',
        password: '',
        currentTab: localStorage.getItem('sdn_admin_tab') || 'dashboard',
        searchQuery: '',
        
        // Modal & Form State
        showModal: false,
        modalType: '',
        modalTitle: '',
        formData: {},
        formLoading: false,

        showDetailModal: false,
        selectedSlider: null,

        // Student Specific
        showStudentDetailModal: false,
        activeStudent: null,
        currentPage: 1,
        pageSize: 10,
        selectedIds: [],
        
        menus: [
            { id: 'dashboard', label: 'Dashboard', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>' },
            { id: 'students', label: 'Pendaftar', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' },
            { id: 'teachers', label: 'Guru & Staff', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
            { id: 'posts', label: 'Berita', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8"/></svg>' },


            { id: 'messages', label: 'Pesan Masuk', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
            { id: 'sliders', label: 'Hero Slider', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' },
            { id: 'settings', label: 'Pengaturan', icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' }
        ],

        students: [],
        teachers: [],
        posts: [],

        messages: [],

        sliders: [],
        chartRegistration: null,
        chartGender: null,
        chartCategory: null,
        settings: {
            school_name: 'SDN MEKARSARI',
            school_logo: '',
            admin_logo: '',
            hero_subtitle: '',
            school_description: '',
            status: 'Negeri',
            accreditation: 'A',
            npsn: '10602048',
            curriculum: 'Merdeka',
            address: '',
            phone: '',
            email: '',
            google_maps_embed: '',
            announcement_active: 'false',
            announcement_text: '',
            site_url: '',
        },

        msgSearchQuery: '',
        selectedMsg: null,

        get filteredStudents() {
            let filtered = this.students;
            if (this.searchQuery !== '') {
                const q = this.searchQuery.toLowerCase();
                filtered = this.students.filter(s => 
                    s.nama_lengkap?.toLowerCase().includes(q) || 
                    s.nik?.toLowerCase().includes(q) ||
                    s.nisn?.toLowerCase().includes(q) ||
                    s.no_telepon?.toLowerCase().includes(q) ||
                    s.nama_ayah?.toLowerCase().includes(q)
                );
            }
            return filtered;
        },

        get paginatedStudents() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredStudents.slice(start, start + this.pageSize);
        },

        get totalPages() {
            return Math.ceil(this.filteredStudents.length / this.pageSize);
        },

        get filteredMessages() {
            let filtered = this.messages;
            if (this.msgSearchQuery !== '') {
                filtered = this.messages.filter(m => 
                    m.name?.toLowerCase().includes(this.msgSearchQuery.toLowerCase()) || 
                    m.subject?.toLowerCase().includes(this.msgSearchQuery.toLowerCase())
                );
            }
            return [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        },

        // ============================================================
        // TOOLBAR HELPER METHODS (Bold, Italic, Heading, Link)
        // ============================================================
        insertFormat(textarea, before, after) {
            if (!textarea) return;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selected = textarea.value.substring(start, end);
            const replacement = before + (selected || 'teks') + after;
            textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
            // Trigger Alpine model update
            textarea.dispatchEvent(new Event('input'));
            // Reposition cursor inside the format marks
            const newCursorPos = start + before.length + (selected || 'teks').length;
            textarea.focus();
            textarea.setSelectionRange(start + before.length, newCursorPos);
        },

        insertHeading(textarea) {
            if (!textarea) return;
            const start = textarea.selectionStart;
            const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
            const lineContent = textarea.value.substring(lineStart, start);
            // Toggle heading: if already has ###, remove it; else add it
            if (lineContent.startsWith('### ')) {
                textarea.value = textarea.value.substring(0, lineStart) + lineContent.replace(/^### /, '') + textarea.value.substring(start);
            } else {
                textarea.value = textarea.value.substring(0, lineStart) + '### ' + textarea.value.substring(lineStart);
            }
            textarea.dispatchEvent(new Event('input'));
            textarea.focus();
        },

        insertLink(textarea) {
            if (!textarea) return;
            const url = prompt('Masukkan URL tujuan (contoh: https://instagram.com):');
            if (!url) return;
            const label = prompt('Masukkan teks yang ditampilkan (contoh: Instagram Sekolah):') || 'klik di sini';
            const start = textarea.selectionStart;
            const linkText = `[${label}](${url})`;
            textarea.value = textarea.value.substring(0, start) + linkText + textarea.value.substring(textarea.selectionEnd);
            textarea.dispatchEvent(new Event('input'));
            textarea.focus();
        },

        async init() {
            if (localStorage.getItem('sdn_admin_session')) {
                // Segera set status login untuk mencegah UI berkedip ke halaman login
                this.isLoggedIn = true;
                this.initialLoading = false;
                await this.refreshAll();
                this.initDashboardCharts();
                setInterval(() => this.pollMessages(), 30000);

                // Watcher for Tab Changes to force re-render charts
                this.$watch('currentTab', (val) => {
                    localStorage.setItem('sdn_admin_tab', val);
                    if (val === 'dashboard') {
                        this.$nextTick(() => this.initDashboardCharts());
                    }
                });

                // Watcher for Data Changes
                this.$watch('students', () => {
                    if (this.currentTab === 'dashboard') {
                        this.$nextTick(() => this.initDashboardCharts());
                    }
                });
            } else {
                // Jika belum login, ambil data publik secara async (tanpa nge-block) untuk Logo & Favicon
                fetch(`${GAS_URL}?action=getDashboardData&t=${Date.now()}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success' && data.data && data.data.settings && data.data.settings.school_logo) {
                            this.settings.school_logo = this.fixUrl(data.data.settings.school_logo);
                            this.updateFavicon();
                        }
                    })
                    .catch(e => console.error('Gagal mengambil favicon', e))
                    .finally(() => {
                        this.initialLoading = false;
                    });
            }
        },

        async doLogin() {
            if (this.email !== 'sdnmks@gmail.com') {
                alert('Email tidak terdaftar atau tidak memiliki akses admin.');
                return;
            }
            if (this.password !== 'SDNMKS') {
                alert('Kata sandi salah.');
                return;
            }
            this.loading = true;
            try {
                await new Promise(r => setTimeout(r, 1000));
                localStorage.setItem('sdn_admin_session', 'super_admin_token_' + Date.now());
                this.isLoggedIn = true;
                await this.refreshAll();
                this.initDashboardCharts();
            } catch (e) {
                alert('Gagal memuat data dari server.');
            } finally {
                this.loading = false;
            }
        },

        doLogout() {
            localStorage.removeItem('sdn_admin_session');
            this.isLoggedIn = false;
            location.reload();
        },

        fixUrl(url) {
            if (!url) return "";
            if (url.includes("drive.google.com/uc?id=")) {
                const id = url.split("id=")[1].split("&")[0];
                return `https://lh3.googleusercontent.com/d/${id}`;
            }
            return url;
        },

        async refreshAll() {
            if (!this.isLoggedIn) return;
            try {
                const res = await fetch(`${GAS_URL}?action=getDashboardData&t=${Date.now()}`);
                const json = await res.json();
                if (json.status === 'success') {
                    const d = json.data;
                    this.students = d.students;
                    this.teachers = (d.teachers || []).map(t => ({ ...t, photo_url: this.fixUrl(t.photo_url) }));
                    this.posts = (d.posts || []).map(p => ({ ...p, thumbnail_url: this.fixUrl(p.thumbnail_url) }));
                    this.stats = d.stats;
                    this.settings = { ...this.settings, ...d.settings };
                    if (this.settings.school_logo) this.settings.school_logo = this.fixUrl(this.settings.school_logo);
                    if (this.settings.admin_logo) this.settings.admin_logo = this.fixUrl(this.settings.admin_logo);
                    if (this.settings.admin_photo) this.settings.admin_photo = this.fixUrl(this.settings.admin_photo);
                    this.updateFavicon();
                    this.messages = d.messages;
                    this.galleries = d.galleries;
                    this.sliders = (d.sliders || []).map(s => ({ ...s, image_url: this.fixUrl(s.image_url) }));
                }
            } catch (err) { console.error('Gagal mengambil data dashboard'); }
        },

        async pollMessages() {
            if (!this.isLoggedIn || this.currentTab !== 'messages') return;
            try {
                const res = await fetch(`${GAS_URL}?action=getMessages&t=${Date.now()}`);
                const json = await res.json();
                if (json.status === 'success') this.messages = json.data;
            } catch (err) { console.error('Gagal polling pesan'); }
        },

        openAdminProfileModal() {
            this.modalType = 'admin_profile';
            this.modalTitle = 'Edit Profil Pengelola';
            this.formData = { 
                admin_name: this.settings.admin_name || '',
                admin_role: this.settings.admin_role || '',
                admin_photo: this.settings.admin_photo || ''
            };
            this.showModal = true;
        },

        isUnread(m) {
            if (!m) return false;
            return String(m.is_read).toLowerCase() !== 'true';
        },

        async viewMessage(msg) {
            this.selectedMsg = msg;
            if (this.isUnread(msg)) await this.markAsRead(msg.id);
        },

        async markAsRead(id) {
            try {
                const res = await fetch(GAS_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'updateMessageStatus', id: id, is_read: 'true' })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    this.messages = this.messages.map(m => (String(m.id) === String(id)) ? { ...m, is_read: 'true' } : m);
                    if (this.selectedMsg && String(this.selectedMsg.id) === String(id)) this.selectedMsg.is_read = 'true';
                }
            } catch (err) { console.error('Gagal update status baca'); }
        },

        initDashboardCharts() {
            if (this.currentTab !== 'dashboard' || !window.Chart) return;
            
            // Non-reactive storage for chart instances
            if (!this._charts) this._charts = {};
            
            // Debounce to prevent rapid conflicting calls
            if (this._chartTimeout) clearTimeout(this._chartTimeout);
            this._chartTimeout = setTimeout(() => {
                this._renderChartsInternal();
            }, 50);
        },

        _renderChartsInternal() {
            if (this.currentTab !== 'dashboard') return;

            const stats = {
                status: { pending: 0, verified: 0, rejected: 0 },
                gender: { male: 0, female: 0 },
                category: { new: 0, transfer: 0 }
            };

            const students = this.students || [];
            students.forEach(s => {
                const getVal = (altKeys) => {
                    for (let k of altKeys) {
                        if (s[k] !== undefined && s[k] !== null) return String(s[k]).toLowerCase().trim();
                    }
                    return '';
                };
                
                const st = getVal(['status']);
                if (st.includes('verif') || st === 'verified' || st === 'terverifikasi' || st === 'accepted' || st === 'diterima') stats.status.verified++;
                else if (st.includes('tolak') || st === 'rejected' || st === 'ditolak') stats.status.rejected++;
                else stats.status.pending++;

                const gn = getVal(['jenis_kelamin', 'jenis kelamin', 'gender']);
                if (gn.includes('laki') || gn === 'l' || gn === 'male') stats.gender.male++;
                else if (gn.includes('perempuan') || gn === 'p' || gn === 'female') stats.gender.female++;

                const ct = getVal(['jenis_pendaftaran', 'jenis pendaftaran', 'kategori']);
                if (ct.includes('baru') || ct === 'new') stats.category.new++;
                else if (ct.includes('pindah') || ct === 'transfer') stats.category.transfer++;
            });

            const colors = {
                blue: '#1E3A8A', indigo: '#4338CA', yellow: '#F59E0B', 
                red: '#EF4444', emerald: '#10B981', rose: '#F43F5E', slate: '#64748b'
            };

            const chartConfigs = {
                chartRegistration: {
                    type: 'doughnut',
                    data: [stats.status.pending, stats.status.verified, stats.status.rejected],
                    bg: [colors.yellow, colors.emerald, colors.red],
                    labels: [
                        `Pending: ${stats.status.pending}`, 
                        `Terverifikasi: ${stats.status.verified}`, 
                        `Ditolak: ${stats.status.rejected}`
                    ]
                },
                chartGender: {
                    type: 'pie',
                    data: [stats.gender.male, stats.gender.female],
                    bg: [colors.blue, colors.rose],
                    labels: [
                        `Laki-laki: ${stats.gender.male}`, 
                        `Perempuan: ${stats.gender.female}`
                    ]
                },
                chartCategory: {
                    type: 'bar',
                    data: [stats.category.new, stats.category.transfer],
                    bg: [colors.emerald, colors.indigo],
                    labels: [
                        `Siswa Baru: ${stats.category.new}`, 
                        `Pindahan: ${stats.category.transfer}`
                    ]
                }
            };

            Object.keys(chartConfigs).forEach(id => {
                const containerId = id.replace('chart', 'container');
                const container = document.getElementById(containerId);
                if (!container) return;
                
                const config = chartConfigs[id];

                // 1. Hard Destroy
                if (this._charts[id]) {
                    try { this._charts[id].destroy(); } catch(e) {}
                    delete this._charts[id];
                }

                // 2. Hard DOM Reset (Guarantees fresh canvas attached to live DOM)
                container.innerHTML = `<canvas id="${id}"></canvas>`;
                const ctx = document.getElementById(id);
                if (!ctx) return;

                // 3. Fresh Initialization
                try {
                    const baseOptions = { 
                        maintainAspectRatio: false, 
                        plugins: { 
                            legend: { 
                                display: true,
                                position: 'bottom', 
                                labels: { 
                                    usePointStyle: true, 
                                    padding: 15, 
                                    font: { family: "'Inter', sans-serif", weight: 'bold' } 
                                } 
                            },
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                titleFont: { family: "'Inter', sans-serif", size: 13 },
                                bodyFont: { family: "'Inter', sans-serif", size: 14, weight: 'bold' },
                                padding: 12,
                                cornerRadius: 8,
                                displayColors: true,
                                callbacks: {
                                    title: function() { 
                                        return ''; // Hide redundant title
                                    },
                                    label: function(context) {
                                        // Extract base label, ignoring the appended numbers for the legend
                                        let rawLabel = context.label || context.dataset.label || '';
                                        if (context.chart.config.type === 'bar') rawLabel = context.label;
                                        
                                        let cleanLabel = rawLabel.split(':')[0].trim();
                                        let label = cleanLabel ? cleanLabel + ': ' : '';
                                        
                                        if (context.parsed !== null) {
                                            const val = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                            label += val + ' Siswa';
                                        }
                                        return label;
                                    }
                                }
                            }
                        } 
                    };
                    
                    if (config.type === 'bar') {
                        baseOptions.plugins.legend.position = 'top';
                        baseOptions.scales = {
                            y: { beginAtZero: true, ticks: { stepSize: 1, color: colors.slate } },
                            x: { grid: { display: false } }
                        };
                    }

                    const dataset = {
                        data: config.data,
                        backgroundColor: config.bg,
                    };
                    
                    if (config.type !== 'bar') {
                        dataset.hoverOffset = 10;
                        dataset.borderWidth = 0;
                        if (config.type === 'doughnut') dataset.cutout = '55%';
                    } else {
                        dataset.label = 'Jumlah Terpendaftar';
                        dataset.borderRadius = 8;
                        dataset.barThickness = 40;
                    }

                    this._charts[id] = new Chart(ctx, {
                        type: config.type,
                        data: {
                            labels: config.labels,
                            datasets: [dataset]
                        },
                        options: baseOptions
                    });
                } catch(err) { console.error('Failed to init chart', id, err); }
            });
        },

        async markAllAsRead() {
            if (!confirm('Tandai semua pesan sebagai sudah dibaca?')) return;
            this.loading = true;
            try {
                await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'markAllMessagesAsRead' }) });
                this.messages = this.messages.map(m => ({ ...m, is_read: 'true' }));
                if (this.selectedMsg) this.selectedMsg.is_read = 'true';
            } catch (err) { alert('Gagal memproses.'); } finally { this.loading = false; }
        },

        async deleteAllMessages() {
            if (!confirm('PERINGATAN: Hapus semua pesan secara permanen?')) return;
            this.loading = true;
            try {
                const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'deleteAllMessages' }) });
                if ((await res.json()).status === 'success') {
                    this.messages = [];
                    this.selectedMsg = null;
                }
            } catch (err) { alert('Gagal menghapus pesan.'); } finally { this.loading = false; }
        },

        // STUDENT MANAGEMENT
        toggleSelectAll() {
            if (this.selectedIds.length === this.paginatedStudents.length) {
                this.selectedIds = [];
            } else {
                this.selectedIds = this.paginatedStudents.map(s => String(s.id));
            }
        },

        async bulkUpdateStatus(newStatus) {
            if (this.selectedIds.length === 0) return alert('Pilih minimal satu data.');
            if (!confirm(`Ubah status ${this.selectedIds.length} pendaftar menjadi ${newStatus}?`)) return;
            this.loading = true;
            try {
                const res = await fetch(GAS_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'bulkProcessStudents', ids: this.selectedIds, subAction: 'status', value: newStatus })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    this.selectedIds = [];
                    await this.refreshAll();
                    alert(data.message);
                }
            } catch (e) { alert('Gagal memproses permintaan masal.'); } finally { this.loading = false; }
        },

        async bulkDelete() {
            if (this.selectedIds.length === 0) return alert('Pilih data yang ingin dihapus.');
            if (!confirm(`HAPUS PERMANEN ${this.selectedIds.length} data pendaftar?`)) return;
            this.loading = true;
            try {
                const res = await fetch(GAS_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'bulkProcessStudents', ids: this.selectedIds, subAction: 'delete' })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    this.selectedIds = [];
                    await this.refreshAll();
                    alert(data.message);
                }
            } catch (e) { alert('Gagal menghapus data masal.'); } finally { this.loading = false; }
        },

        openStudentDetail(student) {
            this.activeStudent = JSON.parse(JSON.stringify(student)); // Deep clone
            
            // Fix: Format date for <input type="date"> (must be YYYY-MM-DD)
            if (this.activeStudent.tanggal_lahir) {
                const d = new Date(this.activeStudent.tanggal_lahir);
                if (!isNaN(d.getTime())) {
                    this.activeStudent.tanggal_lahir = d.toISOString().split('T')[0];
                }
            }
            
            this.showStudentDetailModal = true;
        },

        async deleteStudent(id) {
            if (!confirm('Hapus pendaftar ini secara permanen?')) return;
            this.loading = true;
            try {
                const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'deleteStudent', id: id }) });
                if ((await res.json()).status === 'success') {
                    this.showStudentDetailModal = false;
                    await this.refreshAll();
                }
            } catch (e) { alert('Gagal menghapus.'); } finally { this.loading = false; }
        },

        async updateStudent() {
            this.loading = true;
            try {
                const res = await fetch(GAS_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'updateStudent', ...this.activeStudent })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    alert('Data diperbarui!');
                    await this.refreshAll();
                }
            } catch (e) { alert('Gagal update data.'); } finally { this.loading = false; }
        },

        // EXPORT LOGIC
        // EXPORT HELPERS
        drawStudentProfile(doc, s, index, total) {
            const schoolName = this.settings.school_name || "SDN MEKARSARI";
            if (index > 0) doc.addPage();
            
            // Header
            doc.setFontSize(16);
            doc.setTextColor(30, 58, 138); // Blue-900
            doc.setFont("times", "bold");
            doc.text(schoolName, 105, 15, { align: "center" });
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont("times", "normal");
            doc.text("BUKU INDUK / BIODATA REGISTER PENDAFTAR SISWA", 105, 21, { align: "center" });
            doc.line(20, 25, 190, 25);

            // Student Identity Header
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.setFont("times", "bold");
            doc.text(s.nama_lengkap.toUpperCase(), 20, 35);
            doc.setFontSize(9);
            doc.setFont("times", "normal");
            doc.setTextColor(100);
            doc.text(`ID Pendaftar: ${s.id} | Status: ${s.status.toUpperCase()}`, 20, 40);
            
            // Prepare Data Sections
            const formatVal = (v, k) => {
                if (!v || v === '-') return "-";
                if (k === 'tanggal_lahir' || k === 'created_at') {
                    const d = new Date(v);
                    return isNaN(d.getTime()) ? v : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
                }
                return String(v);
            };

            const sections = [
                {
                    title: "I. REGISTRASI & IDENTITAS",
                    data: [
                        ["Jenis Pendaftaran", formatVal(s.jenis_pendaftaran)],
                        ["NISN", formatVal(s.nisn)],
                        ["NIK", formatVal(s.nik)],
                        ["No. Telepon/WA", formatVal(s.no_telepon)],
                        ["Tempat, Tgl Lahir", `${formatVal(s.tempat_lahir)}, ${formatVal(s.tanggal_lahir, 'tanggal_lahir')}`],
                        ["Jenis Kelamin", formatVal(s.jenis_kelamin)],
                        ["Agama", formatVal(s.agama)],
                        ["Hobi / Cita-cita", `${formatVal(s.hobi)} / ${formatVal(s.cita_cita)}`]
                    ]
                },
                {
                    title: "II. ALAMAT & TEMPAT TINGGAL",
                    data: [
                        ["Alamat Lengkap", formatVal(s.alamat)],
                        ["Tempat Tinggal", formatVal(s.tempat_tinggal)],
                        ["Moda Transportasi", formatVal(s.transportasi)],
                        ["Jarak ke Sekolah", formatVal(s.jarak_sekolah)]
                    ]
                },
                {
                    title: "III. DATA ORANG TUA / WALI",
                    data: [
                        ["Nama Ayah", formatVal(s.nama_ayah)],
                        ["Pekerjaan Ayah", formatVal(s.pekerjaan_ayah)],
                        ["Nama Ibu", formatVal(s.nama_ibu)],
                        ["Pekerjaan Ibu", formatVal(s.pekerjaan_ibu)],
                        ["Nama Wali", formatVal(s.nama_wali) === '-' ? "Tidak Ada Wali" : formatVal(s.nama_wali)]
                    ]
                },
                {
                    title: "IV. DATA PERIODIK & ASAL SEKOLAH",
                    data: [
                        ["Tinggi / Berat", `${formatVal(s.tinggi_badan)} cm / ${formatVal(s.berat_badan)} kg`],
                        ["Jumlah Saudara", formatVal(s.jumlah_saudara)],
                        ["Asal Sekolah", formatVal(s.asal_sekolah)],
                        ["NPSN Asal", formatVal(s.npsn_asal)],
                        ["Kelas Tujuan", s.jenis_pendaftaran === 'Pindahan' ? formatVal(s.kelas) : "Siswa Baru (Kelas 1)"]
                    ]
                }
            ];

            let startY = 45;
            sections.forEach(sec => {
                doc.autoTable({
                    startY: startY,
                    head: [[{ content: sec.title, colSpan: 2 }]],
                    body: sec.data,
                    theme: 'grid',
                    styles: { font: "times" },
                    headStyles: { fillColor: [30, 58, 138], fontSize: 9, fontStyle: 'bold' },
                    bodyStyles: { fontSize: 8 },
                    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } },
                    margin: { left: 20, right: 20 }
                });
                startY = doc.lastAutoTable.finalY + 5;
            });

            // Footer per page
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.setFont("times", "normal");
            doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 20, 285);
            doc.text(`Halaman ${index + 1} dari ${total}`, 190, 285, { align: "right" });
        },

        exportSingleToPDF(s) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            this.drawStudentProfile(doc, s, 0, 1);
            doc.save(`Biodata_${s.nama_lengkap}.pdf`);
        },

        exportStudentsExcel() {
            if (this.filteredStudents.length === 0) return alert('Tidak ada data.');
            
            // 1. Define Styles
            const headerStyle = {
                font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10, name: "Times New Roman" },
                fill: { fgColor: { rgb: "1E3A8A" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin" }, bottom: { style: "thin" },
                    left: { style: "thin" }, right: { style: "thin" }
                }
            };

            const dataStyle = {
                font: { sz: 9, name: "Times New Roman" },
                alignment: { vertical: "center" },
                border: {
                    top: { style: "thin" }, bottom: { style: "thin" },
                    left: { style: "thin" }, right: { style: "thin" }
                }
            };

            const titleStyle = {
                font: { bold: true, sz: 20, color: { rgb: "1E3A8A" }, name: "Times New Roman" },
                alignment: { horizontal: "left", vertical: "center" }
            };

            // 2. Prepare Headers
            const headerMapping = {
                'nama_lengkap': 'NAMA LENGKAP',
                'jenis_pendaftaran': 'JENIS PENDAFTARAN',
                'kelas': 'KELAS TUJUAN',
                'nisn': 'NISN',
                'nik': 'NIK',
                'no_telepon': 'NO. TELEPON/WA',
                'tempat_lahir': 'TEMPAT LAHIR',
                'tanggal_lahir': 'TANGGAL LAHIR',
                'jenis_kelamin': 'JENIS KELAMIN',
                'agama': 'AGAMA',
                'hobi': 'HOBI',
                'cita_cita': 'CITA-CITA',
                'alamat': 'ALAMAT',
                'tempat_tinggal': 'TEMPAT TINGGAL',
                'transportasi': 'TRANSPORTASI',
                'jarak_sekolah': 'JARAK SEKOLAH',
                'nama_ayah': 'NAMA AYAH',
                'pekerjaan_ayah': 'PEKERJAAN AYAH',
                'nama_ibu': 'NAMA IBU',
                'pekerjaan_ibu': 'PEKERJAAN IBU',
                'asal_sekolah': 'ASAL SEKOLAH',
                'npsn_asal': 'NPSN ASAL',
                'status': 'STATUS',
                'created_at': 'TGL DAFTAR'
            };

            const keys = Object.keys(headerMapping);
            const headers = keys.map(k => ({ v: headerMapping[k], s: headerStyle }));

            // 3. Prepare Rows
            const rows = this.filteredStudents.map(s => {
                return keys.map(k => {
                    let val = s[k];
                    if (k === 'kelas' && s.jenis_pendaftaran !== 'Pindahan') val = 'Kelas 1';
                    if (k === 'tanggal_lahir' || k === 'created_at') {
                        const d = new Date(val);
                        val = isNaN(d.getTime()) ? val : d.toLocaleDateString('id-ID');
                    }
                    return { v: String(val || "-"), s: dataStyle, t: 's' };
                });
            });

            // 4. Combine into AOE (Array of Objects)
            const schoolName = this.settings.school_name || "SDN MEKARSARI";
            const titleRow = [{ v: `REKAPITULASI DATA PENDAFTAR SISWA - ${schoolName}`, s: titleStyle }];
            
            // Build the worksheet data
            const wsData = [
                titleRow, 
                [], // Spacer
                headers,
                ...rows
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // 5. Merges & Column Widths
            ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: keys.length - 1 } }];
            
            const colWidths = keys.map((k, i) => {
                const headerLen = headerMapping[k].length;
                const contents = rows.map(r => String(r[i].v).length);
                const maxContentLen = Math.max(headerLen, ...contents);
                // Menyesuaikan lebar kolom dengan isi teks + padding ekstra agar tidak terpotong
                return { wch: maxContentLen + 5 };
            });
            ws['!cols'] = colWidths;
            ws['!rows'] = [{ hpt: 40 }]; // Menambah tinggi baris judul agar font 20 muat dengan rapi

            // 6. Save
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pendaftar");
            XLSX.writeFile(wb, `Rekap_Professional_Excel_${Date.now()}.xlsx`);
        },

        exportStudentsPDF() {
            if (this.filteredStudents.length === 0) return alert('Tidak ada data.');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4'); 
            this.filteredStudents.forEach((s, index) => {
                this.drawStudentProfile(doc, s, index, this.filteredStudents.length);
            });
            doc.save(`Rekap_Buku_Induk_${Date.now()}.pdf`);
        },

        async updateStudentStatus(id, newStatus) {
            if (!confirm(`Yakin mengubah status menjadi ${newStatus}?`)) return;
            this.loading = true;
            try {
                await fetch(GAS_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'updateStudentStatus', id: id, status: newStatus })
                });
                await this.refreshAll();
            } catch (err) { alert('Gagal update data.'); } finally { this.loading = false; }
        },

        async deleteItem(action, id) {
            if(!confirm('Yakin ingin menghapus data ini?')) return;
            this.loading = true;
            try {
                await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: action, id: id }) });
                if (this.selectedMsg && this.selectedMsg.id === id) this.selectedMsg = null;
                await this.refreshAll();
            } catch (err) { alert('Gagal menghapus.'); } finally { this.loading = false; }
        },

        openAddForm(type) {
            this.modalType = type;
            this.modalTitle = 'Tambah ' + type.charAt(0).toUpperCase() + type.slice(1);
            this.formData = {};
            if (type === 'post') this.formData.category = 'news';
            this.showModal = true;
        },

        openEditForm(type, item) {
            this.modalType = type;
            this.modalTitle = 'Edit ' + type.charAt(0).toUpperCase() + type.slice(1);
            this.formData = { ...item };
            this.showModal = true;
        },

        openDetailModal(item) {
            this.selectedSlider = item;
            this.showDetailModal = true;
        },

        async handleLogoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.settings.school_logo = URL.createObjectURL(file);
            this.logoUploading = true;
            try {
                const reader = new FileReader();
                const base64Promise = new Promise(resolve => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'uploadLogo', base64: await base64Promise }) });
                const data = await res.json();
                if (data.status === 'success') {
                    this.settings.school_logo = data.url;
                    this.updateFavicon();
                } else alert('Gagal upload logo: ' + data.message);
            } catch (err) { alert('Terjadi kesalahan saat upload logo.'); } finally { this.logoUploading = false; }
        },

        deleteLogo() {
            if (confirm('Apakah Anda yakin ingin menghapus logo ini?')) {
                this.settings.school_logo = '';
                this.updateFavicon();
            }
        },

        async handleAdminLogoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.settings.admin_logo = URL.createObjectURL(file);
            this.adminLogoUploading = true;
            try {
                const reader = new FileReader();
                const base64Promise = new Promise(resolve => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'uploadLogo', base64: await base64Promise }) });
                const data = await res.json();
                if (data.status === 'success') this.settings.admin_logo = data.url;
                else alert('Gagal upload logo admin: ' + data.message);
            } catch (err) { alert('Terjadi kesalahan saat upload logo admin.'); } finally { this.adminLogoUploading = false; }
        },

        deleteAdminLogo() {
            if (confirm('Apakah Anda yakin ingin menghapus logo admin ini?')) this.settings.admin_logo = '';
        },

        updateFavicon() {
            const logo = this.settings.school_logo || 'assets/img/favicon.png';
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon'; link.rel = 'shortcut icon'; link.href = logo;
            document.getElementsByTagName('head')[0].appendChild(link);
        },

        async saveForm() {
            this.loading = true;
            try {
                const actionMapping = { teacher:'saveTeacher', post:'savePost', stat:'saveStat', settings:'saveSettings', slider:'saveSlider', admin_profile:'saveSettings' };
                const action = actionMapping[this.modalType];
                if (!action) return;
                const payload = { ...this.formData, action: action };
                if (payload.created_at) payload.created_at = new Date(payload.created_at).toISOString();
                if (this.modalType === 'teacher' && this.formData.photo) payload.photoBase64 = this.formData.photo;
                if (this.modalType === 'post' && this.formData.thumbnailBase64) payload.thumbnailBase64 = this.formData.thumbnailBase64;
                if (this.modalType === 'admin_profile' && this.formData.admin_photo_base64) payload.admin_photo_base64 = this.formData.admin_photo_base64;
                const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload) });
                const data = await res.json();
                if (data.status === 'success') {
                    alert(data.message || 'Data berhasil disimpan!');
                    this.showModal = false;
                    await this.refreshAll();
                } else alert('Gagal: ' + (data.message || 'Terjadi kesalahan pada server'));
            } catch (err) { alert('Gagal terhubung ke server.'); } finally { this.loading = false; }
        }
    }));
});
