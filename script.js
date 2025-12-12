/* ========================================
   JAVASCRIPT - PORTFOLIO WEBSITE
   Semua fungsi untuk interaktivitas website
   ======================================== */

/* =====1. DOCUMENT READY & INITIALIZATION===== */

/* Event listener untuk DOMContentLoaded - dijalankan saat HTML sudah siap */
document.addEventListener('DOMContentLoaded', function() {
    initializeYear();
    setupNavigation();
    initializeTyped();

    // ===== tambahan: inisialisasi dropdown behaviour =====
    // Cari toggle dropdown Dokumen (jika ada)
    const dokToggle = document.getElementById('dokumenToggle'); // id dari index.html
    const dokContainer = document.getElementById('dokumenDropdown'); // wrapper .nav-dropdown

    if (dokToggle && dokContainer) {
        // Saat toggle diklik: buka/tutup menu dropdown
        dokToggle.addEventListener('click', function(e) {
            e.preventDefault(); // mencegah aksi default button
            const isOpen = dokContainer.classList.toggle('open'); // tambahkan/hapus class open
            // perbarui aria-expanded untuk aksesibilitas
            this.setAttribute('aria-expanded', String(isOpen));
        });

        // Tutup dropdown saat klik di luar area dropdown
        document.addEventListener('click', function(event) {
            // jika ada klik dan bukan di dalam dokContainer maka tutup
            if (!dokContainer.contains(event.target)) {
                dokContainer.classList.remove('open');
                dokToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard: tutup dropdown saat ESC ditekan
        document.addEventListener('keydown', function(ev) {
            if (ev.key === 'Escape') {
                dokContainer.classList.remove('open');
                dokToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    // ===== akhir tambahan dropdown =====

    // SEDERHANA: Toggle menu menggunakan kelas pada body untuk konsistensi
    (function simpleNavToggle() {
        const navToggle = document.querySelector('.nav-toggle');
        const navbar = document.querySelector('.navbar');
        const overlay = document.querySelector('.nav-overlay');

        if (!navToggle || !navbar) return;

        // Toggle .nav-open on the header/navbar and body.menu-open so CSS rules apply
        navToggle.addEventListener('click', function () {
            const isOpen = navbar.classList.toggle('nav-open');
            document.body.classList.toggle('menu-open', isOpen);
            this.setAttribute('aria-expanded', String(isOpen));
        });

        // Click overlay to close
        if (overlay) overlay.addEventListener('click', function () {
            navbar.classList.remove('nav-open');
            document.body.classList.remove('menu-open');
            const t = document.querySelector('.nav-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        });

        // Close menu when any nav link clicked (mobile)
        document.querySelectorAll('.nav-menu a').forEach(a => {
            a.addEventListener('click', function () {
                navbar.classList.remove('nav-open');
                document.body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    })();
});

/* =====2. NAVIGATION FUNCTIONS===== */

/* Fungsi untuk setup navigation menu click handler */
function setupNavigation() {
    /* Ambil semua elemen dengan class nav-link (termasuk yang ada di dropdown) */
    const navLinks = document.querySelectorAll('.nav-link');

    /* Loop setiap nav link */
    navLinks.forEach(link => {
        /* Jika link adalah .dropdown-toggle maka kita tidak melakukan scroll langsung,
           karena dropdown-toggle bertugas membuka menu (handled terpisah). */
        if (link.classList.contains('dropdown-toggle')) {
            // ignore standard anchor handling for toggle
            return;
        }

        /* Tambahkan event listener click untuk setiap link biasa (termasuk dropdown-item) */
        link.addEventListener('click', function(e) {
            /* Prevent default link behavior to control smooth scroll manually */
            e.preventDefault();

            /* Ambil target ID dari href (hilangkan '#') */
            const href = this.getAttribute('href') || '';
            const targetId = href.startsWith('#') ? href.substring(1) : null;

            if (targetId) {
                /* Scroll ke section yang sesuai */
                scrollToSection(targetId);
            }

            /* Remove active class dari semua nav link */
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

            /* Add active class ke link yang di-klik */
            this.classList.add('active');

            /* Tutup dropdown jika klik berasal dari dalam dropdown (agar UI rapih) */
            const parentDropdown = this.closest('.nav-item.nav-dropdown');
            if (parentDropdown) {
                parentDropdown.classList.remove('open');
                const toggle = parentDropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }

            /* Tutup mobile nav jika terbuka (berguna di mobile) */
            try { closeNav(); } catch(e) { /* ignore if not defined */ }
        });
    });
}

/* Fungsi untuk menutup mobile nav (dipanggil dari overlay atau link) */
function closeNav() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    if (navbar && navbar.classList.contains('nav-open')) {
        navbar.classList.remove('nav-open');
        document.body.classList.remove('menu-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
}

/* Fungsi untuk smooth scroll ke section tertentu */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

    /* Fungsi untuk menutup mobile nav (dipanggil dari overlay atau link) */
    function closeNav() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        if (navbar && navbar.classList.contains('nav-open')) {
            navbar.classList.remove('nav-open');
            document.body.classList.remove('menu-open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
    }

/* Fungsi untuk smooth scroll ke section tertentu */
function scrollToSection(sectionId) {
    /* Ambil elemen section berdasarkan ID */
    const section = document.getElementById(sectionId);
    
    /* Jika section ditemukan, scroll ke sana */
    if (section) {
        /* Scroll ke section dengan smooth behavior (sudah di CSS) */
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/* =====3. MODAL FUNCTIONS===== */

/* Fungsi untuk membuka project modal */
function openProjectModal(cardElement) {
    /* Ambil elemen dengan class hidden-data dari card yang di-klik */
    const hiddenData = cardElement.querySelector('.hidden-data');
    
    /* Jika hidden data ada */
    if (hiddenData) {
        /* Ambil title dari card h3 */
        const title = cardElement.querySelector('h3').textContent;
        /* Ambil category dari hidden data */
        const category = hiddenData.querySelector('.modal-category').textContent;
        /* Ambil description dari hidden data */
        const description = hiddenData.querySelector('.modal-description').textContent;
        /* Ambil tech dari hidden data */
        const tech = hiddenData.querySelector('.modal-tech').textContent;
        /* Ambil link dari hidden data */
        const link = hiddenData.querySelector('.modal-link').textContent;
        
        /* Set title ke modal */
        document.getElementById('modalTitle').textContent = title;
        /* Set category ke modal */
        document.getElementById('modalCategory').textContent = category;
        /* Set description ke modal */
        document.getElementById('modalDescription').textContent = description;
        /* Set tech ke modal */
        document.getElementById('modalTech').textContent = tech;
        /* Set link ke modal */
        const modalLink = document.getElementById('modalLink');

        // Try to detect embedded document or object inside .modal-link
        const linkContainer = hiddenData.querySelector('.modal-link');
        let handledAsDoc = false;
        if (linkContainer) {
            // If there is an <object> tag (e.g., PDF embedded), open in doc modal
            const obj = linkContainer.querySelector('object');
            const iframe = linkContainer.querySelector('iframe');
            const anchor = linkContainer.querySelector('a');
            const text = linkContainer.textContent.trim();

            if (obj && obj.getAttribute('data')) {
                const dataPath = obj.getAttribute('data');
                previewDocument(dataPath, 'pdf');
                handledAsDoc = true;
            } else if (iframe && iframe.getAttribute('src')) {
                previewDocument(iframe.getAttribute('src'), 'pdf');
                handledAsDoc = true;
            } else if (anchor && anchor.getAttribute('href')) {
                const href = anchor.getAttribute('href');
                if (href.match(/\.pdf(\b|$)/i)) {
                    previewDocument(href, 'pdf');
                    handledAsDoc = true;
                } else {
                    modalLink.href = href;
                }
            } else if (text && text.match(/https?:\/\//i)) {
                // Plain URL text — if it's a PDF, preview; else open external
                if (text.match(/\.pdf(\b|$)/i)) {
                    previewDocument(text, 'pdf');
                    handledAsDoc = true;
                } else {
                    modalLink.href = text;
                }
            } else {
                // fallback: set href to trimmed text
                modalLink.href = text || link;
            }
        } else {
            modalLink.href = link;
        }

        /* If not handled as document, show project modal */
        if (!handledAsDoc) {
            document.getElementById('projectModal').classList.add('active');
            document.getElementById('projectModal').setAttribute('aria-hidden', 'false');
        }
    }
}

/* Fungsi untuk membuka video modal */
function openVideoModal(videoId) {
    /* Set iframe src dengan YouTube embed URL dan video ID */
    document.getElementById('videoFrame').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    /* Tampilkan modal dengan menambahkan class active */
    const vm = document.getElementById('videoModal');
    if (vm) {
        vm.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

/* Fungsi untuk menutup modal */
function closeModal(modalId) {
    /* Ambil elemen modal berdasarkan ID */
    const modal = document.getElementById(modalId);
    
    /* Jika modal adalah videoModal, stop video dengan menghapus src */
    if (modalId === 'videoModal') {
        document.getElementById('videoFrame').src = '';
    }
    // If closing docModal, clear the viewer and current path
    if (modalId === 'docModal') {
        const pdfViewer = document.getElementById('pdfViewer');
        if (pdfViewer) pdfViewer.innerHTML = '';
        window._currentDocPath = null;
    }

    /* Hapus class active dari modal untuk menghidupkannya */
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
    /* Remove body modal lock */
    document.body.classList.remove('modal-open');
}

/* Event listener untuk close modal saat tekan ESC key */
document.addEventListener('keydown', function(e) {
    /* Jika key yang ditekan adalah ESC (keyCode 27) */
    if (e.key === 'Escape') {
        /* Tutup semua modal dengan menghapus class active */
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        /* Stop video saat modal ditutup */
        const vf = document.getElementById('videoFrame');
        if (vf) vf.src = '';
        /* Remove body modal lock */
        document.body.classList.remove('modal-open');
    }
});

/* =====4. FILE HANDLING - PREVIEW & DOWNLOAD===== */

/* Fungsi untuk preview dokumen (PDF atau DOCX) */
function previewDocument(filePath, fileType) {
    /* Ambil container preview */
    const pdfViewer = document.getElementById('pdfViewer');
    /* Clear container terlebih dahulu */
    if (pdfViewer) pdfViewer.innerHTML = '';

    // store current path to support download
    window._currentDocPath = filePath;

    /* Jika file type adalah PDF */
    if (fileType === 'pdf') {
        /* Create iframe untuk preview PDF yang mengisi frame (16:9) */
        const iframe = document.createElement('iframe');
        iframe.src = `${filePath}#toolbar=1`;
        iframe.setAttribute('aria-label', 'PDF Viewer');
        iframe.setAttribute('title', 'PDF Viewer');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.frameBorder = '0';
        if (pdfViewer) pdfViewer.appendChild(iframe);
    }
    /* Jika file type adalah DOCX (Word) */
    else if (fileType === 'docx') {
        const encodedPath = encodeURIComponent(window.location.origin + '/' + filePath);
        const iframe = document.createElement('iframe');
        iframe.src = `https://docs.google.com/gview?url=${encodedPath}&embedded=true`;
        iframe.setAttribute('aria-label', 'Document Viewer');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.frameBorder = '0';
        if (pdfViewer) pdfViewer.appendChild(iframe);
    }

    /* Tampilkan modal document viewer */
    const docModal = document.getElementById('docModal');
    if (docModal) {
        docModal.classList.add('active');
        docModal.setAttribute('aria-hidden', 'false');
        // focus the viewer for accessibility
        if (pdfViewer) pdfViewer.focus();
        // prevent background scroll
        document.body.classList.add('modal-open');
    }
}

/* Helper to download current shown document */
function downloadCurrentDoc() {
    if (!window._currentDocPath) return alert('Tidak ada dokumen untuk di-download.');
    // derive filename from path
    const parts = window._currentDocPath.split('/');
    const fileName = parts[parts.length - 1] || 'document';
    downloadFile(window._currentDocPath, fileName);
}

/* Fungsi untuk download file dari folder documents */
function downloadFile(filePath, fileName) {
    /* Buat element anchor untuk download */
    const link = document.createElement('a');
    /* Set href dengan file path */
    link.href = filePath;
    /* Set download attribute dengan nama file yang diinginkan */
    link.download = fileName;
    /* Tambahkan ke DOM sebelum trigger click */
    document.body.appendChild(link);
    /* Trigger click untuk start download */
    link.click();
    /* Remove element dari DOM setelah selesai */
    document.body.removeChild(link);
}

/* =====5. FORM HANDLING===== */

/* Fungsi untuk handle form submit di contact section */
function handleFormSubmit(event) {
    /* Prevent default form submission behavior */
    event.preventDefault();
    
    /* Ambil semua input dari form */
    const form = event.target;
    const formData = new FormData(form);
    
    /* Ambil form elements */
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const subjectInput = form.querySelectorAll('input[type="text"]')[1];
    const messageInput = form.querySelector('textarea');
    
    /* Buat object dengan form data */
    const formMessage = {
        /* Nama dari input */
        name: nameInput.value,
        /* Email dari input */
        email: emailInput.value,
        /* Phone dari input (opsional) */
        phone: phoneInput.value || 'Tidak ada',
        /* Subject dari input */
        subject: subjectInput.value,
        /* Message dari textarea */
        message: messageInput.value
    };
    
    /* Log form data ke console (dalam praktik real, ini dikirim ke server) */
    console.log('Form Data:', formMessage);
    
    /* Show alert message bahwa form berhasil dikirim */
    alert(`Terima kasih ${formMessage.name}! Pesan Anda telah diterima. Kami akan menghubungi Anda segera.`);
    
    /* Reset form - clear semua input field */
    form.reset();
}

/* =====6. UTILITY FUNCTIONS===== */

/* Fungsi untuk initialize tahun di footer */
function initializeYear() {
    /* Ambil tahun saat ini */
    const year = new Date().getFullYear();
    /* Ambil element dengan ID year */
    const yearElement = document.getElementById('year');
    /* Set textContent dengan tahun saat ini */
    yearElement.textContent = year;
}

/* Typing animation for elements with class .typed and sibling .typed-cursor */
function initializeTyped() {
    const typedEls = document.querySelectorAll('.typed');
    if (!typedEls || typedEls.length === 0) return;

    typedEls.forEach(el => {
        const itemsAttr = el.getAttribute('data-typed-items');
        if (!itemsAttr) return;
        const items = itemsAttr.split(',').map(s => s.trim()).filter(Boolean);
        if (items.length === 0) return;

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const cursor = (el.nextElementSibling && el.nextElementSibling.classList.contains('typed-cursor')) ? el.nextElementSibling : null;

        const typeSpeed = 80; // ms per character
        const deleteSpeed = 40;
        const holdDelay = 1000; // ms to hold on full word

        function tick() {
            const current = items[wordIndex % items.length];
            if (!isDeleting) {
                el.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(tick, holdDelay);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                el.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex++;
                    setTimeout(tick, 300);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }

        // Start typing loop
        tick();
        // Ensure cursor is visible/blinking via CSS
        if (cursor) cursor.style.visibility = 'visible';
    });
}

/* =====7. SCROLL EVENT HANDLER (diganti menjadi midpoint detection untuk kestabilan) ===== */

/* Mengganti pendekatan lama (offsetTop/offsetHeight) dengan getBoundingClientRect midpoint.
   Penjelasan: midpoint viewport (biasanya setengah tinggi layar) dipakai untuk menentukan section
   mana yang sedang 'di tengah' tampilan — lebih stabil bila ada section tinggi (pdf embed) atau
   header sticky. */
window.addEventListener('scroll', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    // hanya sections yang punya id relevan
    const sections = document.querySelectorAll('section[id]');

    // ===== TAMBAHAN BARU:  Tutup dropdown saat user scroll =====
    // Cari dropdown container (elemen dengan class . nav-dropdown)
    const dokContainer = document.getElementById('dokumenDropdown');
    if (dokContainer) {
        // Hapus class 'open' (tutup dropdown)
        dokContainer. classList.remove('open');
        // Update aria-expanded untuk aksesibilitas
        const toggle = dokContainer.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    // ===== AKHIR TAMBAHAN =====

    const midpoint = window.innerHeight / 2; // titik referensi vertikal di viewport
    let currentId = null;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect(); // posisi relatif ke viewport
        // Jika midpoint berada dalam bounds section => section ini aktif
        if (rect.top <= midpoint && rect.bottom >= midpoint) {
            currentId = section.id;
        }
    });

    // Hilangkan class active dari semua nav links dulu
    navLinks.forEach(link => link.classList.remove('active'));

    // Jika ada section yang aktif, cari link yang cocok (termasuk dropdown items)
    if (currentId) {
        // Cari link langsung yang mengarah ke #id
        const direct = document.querySelector(`.nav-link[href="#${currentId}"]`);
        if (direct) {
            direct.classList.add('active');
            // jika link ada di dropdown, beri juga state visual pada tombol toggle (opsional)
        }
    }
});