document.addEventListener('DOMContentLoaded', () => {
    // ===== Borrowing History Logic =====
    function getToday() {
        const d = new Date();
        return d.toLocaleDateString();
    }
    function getReturnDate() {
        const d = new Date();
        d.setDate(d.getDate() + 14); // 2 weeks
        return d.toLocaleDateString();
    }
    function saveBuyRecord(book) {
        let buyHistory = JSON.parse(localStorage.getItem('buyHistory')) || [];
        buyHistory.push(book);
        localStorage.setItem('buyHistory', JSON.stringify(buyHistory));
    }
    function saveBorrowRecord(book) {
        let borrowHistory = JSON.parse(localStorage.getItem('borrowHistory')) || [];
        borrowHistory.push(book);
        localStorage.setItem('borrowHistory', JSON.stringify(borrowHistory));
    }
    function renderBuyHistory() {
        const table = document.getElementById('buy-history-table');
        if (!table) return;
        const tbody = table.querySelector('tbody');
        let buyHistory = JSON.parse(localStorage.getItem('buyHistory')) || [];
        tbody.innerHTML = '';
        if (buyHistory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No buy records yet.</td></tr>';
            return;
        }
        buyHistory.forEach((book, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${book.imgSrc}" alt="Book" style="width:60px;height:80px;object-fit:cover;border-radius:8px;"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.quantity}</td>
                <td>${book.price}</td>
                <td>${book.buyDate}</td>
                <td><button class="delete-history-btn" data-type="buying" data-idx="${idx}">Delete</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
    function renderBorrowHistory() {
        const table = document.getElementById('borrow-history-table');
        if (!table) return;
        const tbody = table.querySelector('tbody');
        let borrowHistory = JSON.parse(localStorage.getItem('borrowHistory')) || [];
        tbody.innerHTML = '';
        if (borrowHistory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No borrow records yet.</td></tr>';
            return;
        }
        borrowHistory.forEach((book, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${book.imgSrc}" alt="Book" style="width:60px;height:80px;object-fit:cover;border-radius:8px;"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.borrowDate}</td>
                <td>${book.returnDate}</td>
                <td>${book.status}</td>
                <td><button class="delete-history-btn" data-type="borrowing" data-idx="${idx}">Delete</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
    // Tab switching
    document.getElementById('showBuyTab')?.addEventListener('click', () => {
        document.getElementById('buy-history-table-container').style.display = '';
        document.getElementById('borrow-history-table-container').style.display = 'none';
    });
    document.getElementById('showBorrowTab')?.addEventListener('click', () => {
        document.getElementById('buy-history-table-container').style.display = 'none';
        document.getElementById('borrow-history-table-container').style.display = '';
    });
    // Render on load
    renderBuyHistory();
    renderBorrowHistory();


    // ===== Mobile Navigation =====
    const menuBtn = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.navbar');
    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuBtn.classList.toggle('fa-times');
        });
    }

    // ===== Modals (Search, Cart, Login, Book Details) =====
    const allModals = document.querySelectorAll('.modal-overlay');
    const openModal = modal => modal?.classList.add('active');
    const closeModal = () => allModals.forEach(m => m.classList.remove('active'));

    document.querySelector('#search-btn')?.addEventListener('click', () => openModal(document.querySelector('#search-modal')));
    document.querySelector('#cart-btn')?.addEventListener('click', () => openModal(document.querySelector('#cart-modal')));
    document.querySelector('#login-btn')?.addEventListener('click', () => openModal(document.querySelector('#login-modal')));

    allModals.forEach(modal => {
        modal.querySelector('.close-btn')?.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    });

    // ===== Contact Modal Show on Submit =====
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    const contactModal = document.getElementById('contactModal');
    const closeContactModalBtn = document.getElementById('closeModal');
    if (contactSubmitBtn && contactModal) {
        contactSubmitBtn.addEventListener('click', function () {
            contactModal.style.display = 'flex';
        });
    }
    if (closeContactModalBtn && contactModal) {
        closeContactModalBtn.addEventListener('click', function () {
            contactModal.style.display = 'none';
        });
        contactModal.addEventListener('click', function (e) {
            if (e.target === contactModal) contactModal.style.display = 'none';
        });
    }

    // ===== Autoscroll Carousels (Trending / New Arrivals) =====
    const setupAutoscroll = (carouselSelector) => {
        const track = document.querySelector(carouselSelector + ' .autoscroll-track');
        if (!track) return;
        let scrollAmount = 0;
        setInterval(() => {
            scrollAmount += 1;
            if (scrollAmount >= track.scrollWidth / 2) scrollAmount = 0;
            track.style.transform = `translateX(-${scrollAmount}px)`;
        }, 20);
    };
    setupAutoscroll('.trending-carousel');
    setupAutoscroll('.new-arrivals-carousel');

    // ===== Testimonials Slider =====
    const slidesContainer = document.querySelector(".testimonial-slides");
    if (slidesContainer) {
        const slides = slidesContainer.querySelectorAll(".testimonial-card");
        const dotsContainer = document.querySelector(".slider-dots");
        let currentSlide = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => showSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll(".slider-dot");

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
        showSlide(0);
    }

    // ===== Category Page Filter =====
    const filterLinks = document.querySelectorAll('.filter-list a');
    const bookCardsForFilter = document.querySelectorAll('.book-grid .book-card');
    filterLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const filter = link.dataset.filter;
            bookCardsForFilter.forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.genre === filter) ? 'block' : 'none';
            });
        });
    });

    // ===== Search Modal =====
    const searchInputField = document.querySelector('#search-input-field');
    const searchButton = document.querySelector('.modal-form button[type="submit"]');
    if (searchInputField && searchButton) {
        function getAllBookCards() {
            return document.querySelectorAll('.book-card');
        }
        let lastSearchTerm = '';
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const searchTerm = searchInputField.value.trim().toLowerCase();
            lastSearchTerm = searchTerm;
            getAllBookCards().forEach(book => {
                const title = book.querySelector('h3').textContent.toLowerCase();
                const author = book.querySelector('p').textContent.toLowerCase();
                if (searchTerm === '') {
                    book.style.display = 'block';
                } else {
                    book.style.display = (title.includes(searchTerm) || author.includes(searchTerm)) ? 'block' : 'none';
                }
            });
            closeModal();
        });
        searchInputField.addEventListener('input', () => {
            if (searchInputField.value.trim() === '') {
                getAllBookCards().forEach(book => book.style.display = 'block');
            }
        });
    }

    // ===== Book Details Modal =====
    const bookDetailsModal = document.getElementById('book-details-modal');
    if (bookDetailsModal) {
        document.addEventListener('click', e => {
            const card = e.target.closest('.book-card');
            if (card) {
                const title = card.querySelector('h3').textContent;
                const author = card.querySelector('p').textContent;
                const price = card.querySelector('.price').textContent;
                const imgSrc = card.querySelector('img').src;

                bookDetailsModal.querySelector('#modal-book-title').textContent = title;
                bookDetailsModal.querySelector('#modal-book-author').textContent = `by ${author}`;
                bookDetailsModal.querySelector('#modal-book-price').textContent = price;
                bookDetailsModal.querySelector('.book-details-img img').src = imgSrc;
                openModal(bookDetailsModal);
            }
        });

        document.getElementById('modal-buy-btn')?.addEventListener('click', () => {
            const qty = bookDetailsModal.querySelector('#quantity')?.value || 1;
            const title = bookDetailsModal.querySelector('#modal-book-title').textContent;
            const author = bookDetailsModal.querySelector('#modal-book-author').textContent.replace('by ', '');
            const price = bookDetailsModal.querySelector('#modal-book-price').textContent.replace('₹', '');
            const imgSrc = bookDetailsModal.querySelector('.book-details-img img').src;
            const buyDate = getToday();
            saveBuyRecord({ title, author, price, imgSrc, quantity: qty, buyDate });
            closeModal();
        });

        document.getElementById('modal-borrow-btn')?.addEventListener('click', () => {
            const title = bookDetailsModal.querySelector('#modal-book-title').textContent;
            const author = bookDetailsModal.querySelector('#modal-book-author').textContent.replace('by ', '');
            const imgSrc = bookDetailsModal.querySelector('.book-details-img img').src;
            const borrowDate = getToday();
            const returnDate = getReturnDate();
            const status = 'Borrowed';
            saveBorrowRecord({ title, author, imgSrc, borrowDate, returnDate, status });
            closeModal();
        });
    }

    // ===== Manual Trending Carousel Scroll (One Book at a Time) =====
    const trendingTrack = document.getElementById('trendingTrack');
    const trendingLeftBtn = document.getElementById('trendingLeftBtn');
    const trendingRightBtn = document.getElementById('trendingRightBtn');
    if (trendingTrack && trendingLeftBtn && trendingRightBtn) {
        let currentIndex = 0;
        const bookCards = trendingTrack.querySelectorAll('.book-card');
        const visibleCount = 4;
        function updateCarousel() {
            bookCards.forEach((card, i) => {
                card.style.display = (i >= currentIndex && i < currentIndex + visibleCount) ? 'block' : 'none';
            });
            // Align last book to right edge if at end
            if (currentIndex + visibleCount >= bookCards.length) {
                trendingTrack.style.justifyContent = 'flex-end';
            } else {
                trendingTrack.style.justifyContent = 'flex-start';
            }
        }
        trendingLeftBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex -= 1;
                updateCarousel();
            }
        });
        trendingRightBtn.addEventListener('click', () => {
            if (currentIndex + visibleCount < bookCards.length) {
                currentIndex += 1;
                updateCarousel();
            }
        });
        updateCarousel();
    }

    // Contact form modal logic
    if (window.location.pathname.includes('contact.html')) {
        document.addEventListener('DOMContentLoaded', function () {
            var form = document.querySelector('.contact-form form');
            if (form) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var name = form.querySelector('input[name="name"]')?.value || '';
                    var email = form.querySelector('input[name="email"]')?.value || '';
                    var message = form.querySelector('textarea[name="message"]')?.value || '';
                    showContactModal(name, email, message);
                });
            }

            function showContactModal(name, email, message) {
                // Create modal overlay
                var overlay = document.createElement('div');
                overlay.className = 'modal-overlay active';
                overlay.innerHTML = `
            <div class="modal-content">
              <span class="close-btn">&times;</span>
              <h2>Contact Details</h2>
              <div style="margin-bottom:1.2rem;">
                <strong>Name:</strong> ${name}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Message:</strong> <div style="margin-top:0.5rem;white-space:pre-line;">${message}</div>
              </div>
            </div>
          `;
                document.body.appendChild(overlay);
                overlay.querySelector('.close-btn').onclick = function () {
                    overlay.remove();
                };
            }
        });
    }
    if (window.location.pathname.toLowerCase().includes('borrowing-history.html')) {
        window.clearHistoryData = function () {
            localStorage.removeItem('borrowingHistory');
            localStorage.removeItem('buyingHistory');
            // Optionally, reload the page to reflect changes
            location.reload();
        };
    }

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-history-btn')) {
            var type = e.target.getAttribute('data-type');
            var idx = parseInt(e.target.getAttribute('data-idx'));
            if (type === 'borrowing') {
                var history = JSON.parse(localStorage.getItem('borrowHistory') || '[]');
                history.splice(idx, 1);
                localStorage.setItem('borrowHistory', JSON.stringify(history));
                renderBorrowHistory();
            } else {
                var history = JSON.parse(localStorage.getItem('buyHistory') || '[]');
                history.splice(idx, 1);
                localStorage.setItem('buyHistory', JSON.stringify(history));
                renderBuyHistory();
            }
        }
    });

    function renderHistoryTable(type, data, tableId) {
        var table = document.getElementById(tableId);
        if (!table) return;
        var html = '<thead><tr>';
        if (type === 'borrowing') {
            html += '<th>Book</th><th>Author</th><th>Date</th><th>Action</th>';
        } else {
            html += '<th>Book</th><th>Author</th><th>Price</th><th>Date</th><th>Action</th>';
        }
        html += '</tr></thead><tbody>';
        data.forEach(function (item, idx) {
            html += '<tr>';
            html += `<td>${item.book}</td><td>${item.author}</td>`;
            if (type === 'borrowing') {
                html += `<td>${item.date}</td>`;
            } else {
                html += `<td>${item.price}</td><td>${item.date}</td>`;
            }
            html += `<td><button class="delete-history-btn" data-type="${type}" data-idx="${idx}">Delete</button></td>`;
            html += '</tr>';
        });
        html += '</tbody>';
        table.innerHTML = html;
    }

});
