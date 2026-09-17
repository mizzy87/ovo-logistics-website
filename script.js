document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll animation observer for fade-ins
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card-3d');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Interactive 3D tilt effect on mouse movement for cards
    const cardInners = document.querySelectorAll('.card-inner');
    
    cardInners.forEach(cardInner => {
        cardInner.addEventListener('mousemove', (e) => {
            const rect = cardInner.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate rotation values (-10 to 10 degrees)
            const rotateY = ((x / rect.width) - 0.5) * 20;
            const rotateX = ((y / rect.height) - 0.5) * -20;
            
            cardInner.style.transform = `translateY(-10px) translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset transformation when mouse leaves
        cardInner.addEventListener('mouseleave', () => {
            cardInner.style.transform = 'translateY(0) translateZ(0) rotateX(0) rotateY(0)';
        });
    });
    
    // Parallax background effect on mouse move
    const bg = document.getElementById('parallaxBg');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        if (bg) {
            bg.style.transform = `translateZ(0) scale(1.05) translate(${x * -20}px, ${y * -20}px)`;
        }
    });

    // --- Comprehensive Client-Side Form Validation for Online Delivery Booking ---
    const bookingForm = document.getElementById('bookingForm');
    const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');
    const bookingResult = document.getElementById('bookingResult');
    const detailsCounter = document.getElementById('detailsCounter');

    // Phone format validation using Regex
    // Validates standard Nigerian mobile/landline numbers (070, 080, 081, 090, 091, 11 digits)
    // as well as international Nigerian (+234 / 234) and standard international E.164 phone formats
    function validatePhoneNumber(rawPhone) {
        const trimmed = (rawPhone || '').trim();
        if (!trimmed) {
            return { isValid: false, message: "Phone number is required." };
        }

        // Check for disallowed characters (only digits, spaces, hyphens, parentheses, and leading plus allowed)
        if (/[^0-9\s\+\-\(\)]/.test(trimmed)) {
            return { isValid: false, message: "Phone number cannot contain letters or special symbols." };
        }

        // Strip formatting characters to test pure digits
        const digitsOnly = trimmed.replace(/[\s\-\(\)]/g, '');
        const cleanDigits = trimmed.replace(/\D/g, '');

        // Nigerian Local format: starts with 070, 080, 081, 090, 091, followed by 8 digits (total 11 digits)
        const isNigerianLocal = /^0[789][01]\d{8}$/.test(digitsOnly);

        // Nigerian International: +234 or 234 followed by 70, 80, 81, 90, 91 and 8 digits
        const isNigerianIntl = /^(?:\+?234)[789][01]\d{8}$/.test(digitsOnly);

        // Standard International format (E.164): + followed by 10 to 15 digits
        const isStandardIntl = /^\+[1-9]\d{9,14}$/.test(digitsOnly);

        // General 10-15 digit phone numbers without plus
        const isGeneralValid = /^[1-9]\d{9,14}$/.test(digitsOnly);

        if (isNigerianLocal || isNigerianIntl || isStandardIntl || isGeneralValid) {
            return { isValid: true };
        }

        // Specific, helpful diagnostic messages
        if (cleanDigits.length < 10) {
            return {
                isValid: false,
                message: `Phone number is too short (${cleanDigits.length} digits). Please enter an 11-digit number (e.g. 09041596476) or international format.`
            };
        }

        if (cleanDigits.length > 15) {
            return {
                isValid: false,
                message: `Phone number is too long (${cleanDigits.length} digits). Maximum is 15 digits.`
            };
        }

        return {
            isValid: false,
            message: "Please enter a valid phone number (e.g. 09041596476 or +2349041596476)."
        };
    }

    // Validation rules for each required field
    const fieldValidators = {
        name: (val) => {
            const str = (val || '').trim();
            if (!str) return "Full name is required.";
            if (str.length < 2) return "Full name must be at least 2 characters long.";
            if (!/[a-zA-Z]/.test(str)) return "Full name must contain letters (e.g. Chinedu Eze).";
            return null;
        },
        phone: (val) => {
            const check = validatePhoneNumber(val);
            return check.isValid ? null : check.message;
        },
        pickup: (val) => {
            const str = (val || '').trim();
            if (!str) return "Pick-up address is required.";
            if (str.length < 3) return "Please provide a detailed pick-up address (at least 3 characters).";
            return null;
        },
        dropoff: (val) => {
            const str = (val || '').trim();
            if (!str) return "Drop-off address is required.";
            if (str.length < 3) return "Please provide a detailed drop-off address (at least 3 characters).";
            return null;
        },
        details: (val) => {
            const str = (val || '').trim();
            if (!str) return "Package details are required.";
            if (str.length < 5) return "Please describe what you are sending (at least 5 characters).";
            return null;
        }
    };

    function setFieldError(fieldId, errorMessage, shouldShake = false) {
        const input = document.getElementById(fieldId);
        const group = document.getElementById(`group-${fieldId}`) || (input ? input.closest('.form-group') : null);
        const errorEl = document.getElementById(`${fieldId}Error`);

        if (group) {
            group.classList.add('has-error');
            group.classList.remove('has-success');

            if (shouldShake) {
                group.classList.remove('shake-error');
                // Force reflow for re-triggering shake animation
                void group.offsetWidth;
                group.classList.add('shake-error');
                setTimeout(() => group.classList.remove('shake-error'), 400);
            }
        }

        if (input) {
            input.setAttribute('aria-invalid', 'true');
        }

        if (errorEl) {
            errorEl.textContent = errorMessage;
        }
    }

    function clearFieldError(fieldId, markSuccess = false) {
        const input = document.getElementById(fieldId);
        const group = document.getElementById(`group-${fieldId}`) || (input ? input.closest('.form-group') : null);
        const errorEl = document.getElementById(`${fieldId}Error`);

        if (group) {
            group.classList.remove('has-error', 'shake-error');
            if (markSuccess && input && input.value.trim().length > 0) {
                group.classList.add('has-success');
            } else {
                group.classList.remove('has-success');
            }
        }

        if (input) {
            input.removeAttribute('aria-invalid');
        }

        if (errorEl) {
            errorEl.textContent = '';
        }
    }

    function clearAllFormValidation() {
        Object.keys(fieldValidators).forEach(fieldId => {
            clearFieldError(fieldId, false);
            const input = document.getElementById(fieldId);
            const group = document.getElementById(`group-${fieldId}`) || (input ? input.closest('.form-group') : null);
            if (group) {
                group.classList.remove('has-success', 'has-error', 'shake-error');
            }
        });
    }

    // Attach real-time input and blur validation listeners to all booking form fields
    if (bookingForm) {
        Object.keys(fieldValidators).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (!input) return;

            // Real-time re-validation on input when field is already in error state
            input.addEventListener('input', () => {
                const group = document.getElementById(`group-${fieldId}`) || input.closest('.form-group');
                const val = input.value;
                const error = fieldValidators[fieldId](val);

                // Update character counter for details textarea
                if (fieldId === 'details' && detailsCounter) {
                    const len = val.trim().length;
                    detailsCounter.textContent = len === 0 ? 'Min 5 chars' : `${len} character${len === 1 ? '' : 's'}`;
                    if (len >= 5) {
                        detailsCounter.style.color = '#10B981';
                    } else {
                        detailsCounter.style.color = '';
                    }
                }

                if (group && group.classList.contains('has-error')) {
                    if (!error) {
                        clearFieldError(fieldId, true);
                    } else {
                        // Update error message live if text changed
                        const errorEl = document.getElementById(`${fieldId}Error`);
                        if (errorEl) errorEl.textContent = error;
                    }
                } else if (!error && val.trim().length > 0) {
                    // Soft success indication
                    clearFieldError(fieldId, true);
                }
            });

            // Blur event: validate field when user moves to next input
            input.addEventListener('blur', () => {
                const val = input.value;
                // Only validate on blur if user entered something or blurred away from required field
                if (val.trim().length > 0) {
                    const error = fieldValidators[fieldId](val);
                    if (error) {
                        setFieldError(fieldId, error, false);
                    } else {
                        clearFieldError(fieldId, true);
                    }
                }
            });
        });

        // Form Submission Handler
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // 1. Honeypot Anti-Spam Check
            const botField = document.getElementById('botField');
            if (botField && botField.value !== "") {
                alert("Spam detected. Form submission blocked.");
                return false;
            }

            // 2. Comprehensive Client-Side Validation across all fields
            let hasValidationError = false;
            let firstInvalidInput = null;

            Object.keys(fieldValidators).forEach(fieldId => {
                const input = document.getElementById(fieldId);
                const val = input ? input.value : '';
                const error = fieldValidators[fieldId](val);

                if (error) {
                    hasValidationError = true;
                    setFieldError(fieldId, error, true);
                    if (!firstInvalidInput && input) {
                        firstInvalidInput = input;
                    }
                } else {
                    clearFieldError(fieldId, true);
                }
            });

            // If any validation failed, halt submission, focus and scroll first invalid field
            if (hasValidationError) {
                if (firstInvalidInput) {
                    firstInvalidInput.focus();
                    firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return false;
            }

            // Form is completely valid, collect values
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const pickup = document.getElementById('pickup').value.trim();
            const dropoff = document.getElementById('dropoff').value.trim();
            const details = document.getElementById('details').value.trim();

            const originalBtnText = bookingSubmitBtn.innerText;
            bookingSubmitBtn.disabled = true;
            bookingSubmitBtn.innerText = "⏳ Saving to Database...";

            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, pickup, dropoff, details })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Failed to submit booking');
                }

                const booking = data.booking;
                
                // Show rich confirmation
                if (bookingResult) {
                    bookingResult.innerHTML = `
                        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🎉</div>
                        <h3>Delivery Booking Saved to Database!</h3>
                        <p style="color: #065F46;">Your request is logged. Your unique package reference is:</p>
                        <div class="booking-ref-display">${booking.id}</div>
                        <p style="font-size: 0.95rem; color: #047857; margin-bottom: 1rem;">
                            Route: <strong>${escapeHtml(booking.pickup)}</strong> ➔ <strong>${escapeHtml(booking.dropoff)}</strong>
                        </p>
                        <div class="booking-result-actions">
                            <button type="button" class="btn-primary" id="btnTrackThis" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
                                🔍 Track this Package
                            </button>
                            <a href="https://wa.me/2349041596476?text=${encodeURIComponent('Hello OVO Logistics, I just booked delivery ID: ' + booking.id + ' for pickup at ' + booking.pickup)}" target="_blank" class="btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem; text-decoration: none;">
                                💬 WhatsApp Confirmation
                            </a>
                            <button type="button" class="btn-secondary" id="btnBookAnother" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
                                + Book Another
                            </button>
                        </div>
                    `;
                    bookingResult.style.display = 'block';
                    bookingResult.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Hook up dynamic buttons inside result
                    document.getElementById('btnTrackThis')?.addEventListener('click', () => {
                        const trackInput = document.getElementById('trackInput');
                        if (trackInput) {
                            trackInput.value = booking.id;
                            document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
                            fetchTracking(booking.id);
                        }
                    });

                    document.getElementById('btnBookAnother')?.addEventListener('click', () => {
                        bookingForm.reset();
                        clearAllFormValidation();
                        if (detailsCounter) detailsCounter.textContent = 'Min 5 chars';
                        bookingResult.style.display = 'none';
                        document.getElementById('name')?.focus();
                    });
                }

                // If DB modal is open, refresh records
                if (document.getElementById('dbModal')?.classList.contains('open')) {
                    loadDbData();
                }

            } catch (err) {
                console.error("Booking error:", err);
                alert("Error saving booking to database: " + err.message);
            } finally {
                bookingSubmitBtn.disabled = false;
                bookingSubmitBtn.innerText = originalBtnText;
            }
        });
    }

    // --- Package Tracking Logic ---
    const trackForm = document.getElementById('trackForm');
    const trackInput = document.getElementById('trackInput');
    const trackingResult = document.getElementById('trackingResult');

    async function fetchTracking(query) {
        if (!query || !trackingResult) return;

        trackingResult.style.display = 'block';
        trackingResult.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--gray);">🔍 Querying database for "${query}"...</div>`;

        try {
            const res = await fetch(`/api/bookings/track/${encodeURIComponent(query.trim())}`);
            const data = await res.json();

            if (!res.ok || !data.success || !data.booking) {
                trackingResult.innerHTML = `
                    <div style="text-align: center; padding: 1.5rem;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
                        <h3 style="color: #DC2626; margin-bottom: 0.5rem;">No Shipment Found</h3>
                        <p style="color: var(--gray);">We couldn't find any delivery record matching <strong>"${query}"</strong>.</p>
                        <p style="font-size: 0.85rem; color: var(--gray); margin-top: 0.5rem;">Tip: Try searching for a demo tracking ID like <strong>OVO-78219</strong> or <strong>OVO-54128</strong>.</p>
                    </div>
                `;
                return;
            }

            const b = data.booking;
            const statusClass = `status-${b.status.toLowerCase().replace(/\s+/g, '-')}`;

            // Build timeline items
            const timelineHtml = (b.statusHistory || []).map((step, idx) => {
                const dateFormatted = new Date(step.timestamp).toLocaleString('en-NG', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                });
                const isLatest = idx === (b.statusHistory.length - 1);
                return `
                    <div class="timeline-item ${isLatest ? 'active' : ''}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-time">${dateFormatted}</div>
                        <div class="timeline-status">${step.status}</div>
                        <div class="timeline-note">${step.note || ''}</div>
                    </div>
                `;
            }).reverse().join('');

            trackingResult.innerHTML = `
                <div class="tracking-header">
                    <div>
                        <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--gray); font-weight: 600;">OVO Tracking Number</div>
                        <div class="tracking-id-badge">${b.id}</div>
                    </div>
                    <div>
                        <span class="tracking-status-pill ${statusClass}">${b.status}</span>
                    </div>
                </div>

                <div class="tracking-details-grid">
                    <div class="tracking-field">
                        <label>Sender / Recipient</label>
                        <p>${b.name} (${b.phone})</p>
                    </div>
                    <div class="tracking-field">
                        <label>Pick-up Location</label>
                        <p>📍 ${b.pickup}</p>
                    </div>
                    <div class="tracking-field">
                        <label>Drop-off Destination</label>
                        <p>🏁 ${b.dropoff}</p>
                    </div>
                    <div class="tracking-field">
                        <label>Package Description</label>
                        <p>📦 ${b.details}</p>
                    </div>
                </div>

                <div>
                    <h4 style="margin-bottom: 1.25rem; font-size: 1.05rem; color: var(--primary);">Real-Time Delivery Milestones</h4>
                    <div class="tracking-timeline">
                        ${timelineHtml || '<p style="color: var(--gray);">No history available yet.</p>'}
                    </div>
                </div>
            `;
        } catch (err) {
            console.error("Tracking error:", err);
            trackingResult.innerHTML = `<div style="text-align: center; color: #DC2626; padding: 1.5rem;">Failed to fetch shipment details from database. Please try again.</div>`;
        }
    }

    if (trackForm && trackInput) {
        trackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            fetchTracking(trackInput.value.trim());
        });
    }

    // --- Database Portal (Admin / Records Management) ---
    const dbModal = document.getElementById('dbModal');
    const openDbBtn = document.getElementById('openDbBtn');
    const footerDbBtn = document.getElementById('footerDbBtn');
    const closeDbModal = document.getElementById('closeDbModal');
    const refreshDbBtn = document.getElementById('refreshDbBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const dbSearchInput = document.getElementById('dbSearchInput');
    const dbStatusFilter = document.getElementById('dbStatusFilter');
    const dbTableBody = document.getElementById('dbTableBody');

    let currentBookings = [];

    function openModal() {
        if (dbModal) {
            dbModal.classList.add('open');
            loadDbData();
        }
    }

    function closeModal() {
        if (dbModal) {
            dbModal.classList.remove('open');
        }
    }

    if (openDbBtn) openDbBtn.addEventListener('click', openModal);
    if (footerDbBtn) footerDbBtn.addEventListener('click', openModal);
    if (closeDbModal) closeDbModal.addEventListener('click', closeModal);

    if (dbModal) {
        dbModal.addEventListener('click', (e) => {
            if (e.target === dbModal) closeModal();
        });
    }

    async function loadDbData() {
        try {
            // Load stats
            const statsRes = await fetch('/api/stats');
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                if (statsData.success && statsData.stats) {
                    document.getElementById('statTotal').innerText = statsData.stats.total;
                    document.getElementById('statPending').innerText = statsData.stats.pending;
                    document.getElementById('statPickedUp').innerText = statsData.stats.pickedUp;
                    document.getElementById('statInTransit').innerText = statsData.stats.inTransit;
                    document.getElementById('statDelivered').innerText = statsData.stats.delivered;
                }
            }

            // Load bookings
            const search = dbSearchInput ? dbSearchInput.value.trim() : '';
            const status = dbStatusFilter ? dbStatusFilter.value : 'All';

            const queryParams = new URLSearchParams();
            if (search) queryParams.set('search', search);
            if (status && status !== 'All') queryParams.set('status', status);

            const res = await fetch(`/api/bookings?${queryParams.toString()}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to load bookings');
            }

            currentBookings = data.bookings || [];
            renderDbTable(currentBookings);

            // Retrieve all bookings for the 7-day trend chart if a filter or search is active
            let allBookingsForChart = currentBookings;
            if (search || (status && status !== 'All')) {
                try {
                    const allRes = await fetch('/api/bookings');
                    const allData = await allRes.json();
                    if (allData.success && allData.bookings) {
                        allBookingsForChart = allData.bookings;
                    }
                } catch (chartErr) {
                    console.warn("Could not fetch full bookings for chart:", chartErr);
                }
            }

            // Render Recharts Trend Visualization
            if (typeof window.renderBookingsTrendChart === 'function') {
                window.renderBookingsTrendChart('dbTrendChartContainer', allBookingsForChart, (filterDateKey) => {
                    if (!filterDateKey) {
                        renderDbTable(currentBookings);
                    } else {
                        const filteredByDate = currentBookings.filter(b => {
                            if (!b.createdAt) return false;
                            const d = new Date(b.createdAt);
                            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                            return key === filterDateKey;
                        });
                        renderDbTable(filteredByDate);
                    }
                });
            }

        } catch (err) {
            console.error("DB Load error:", err);
            if (dbTableBody) {
                dbTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #DC2626; padding: 2rem;">Error connecting to database: ${err.message}</td></tr>`;
            }
        }
    }

    function renderDbTable(bookings) {
        if (!dbTableBody) return;

        if (bookings.length === 0) {
            dbTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--gray);">No records found in database matching your filter.</td></tr>`;
            return;
        }

        const statuses = ['Pending', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'];

        dbTableBody.innerHTML = bookings.map(b => {
            const dateAdded = new Date(b.createdAt).toLocaleDateString('en-NG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const statusClass = `status-${b.status.toLowerCase().replace(/\s+/g, '-')}`;

            return `
                <tr data-id="${b.id}">
                    <td>
                        <strong style="color: var(--primary); letter-spacing: 0.03em; cursor: pointer;" title="Click to view tracking" class="track-link" data-tracking="${b.id}">
                            ${b.id}
                        </strong>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${escapeHtml(b.name)}</div>
                        <div style="font-size: 0.8rem; color: var(--gray);">${escapeHtml(b.phone)}</div>
                    </td>
                    <td style="max-width: 220px;">
                        <div style="font-size: 0.85rem;"><strong>From:</strong> ${escapeHtml(b.pickup)}</div>
                        <div style="font-size: 0.85rem; color: var(--primary);"><strong>To:</strong> ${escapeHtml(b.dropoff)}</div>
                    </td>
                    <td style="max-width: 200px; font-size: 0.85rem; color: var(--gray);">
                        ${escapeHtml(b.details)}
                    </td>
                    <td style="white-space: nowrap; font-size: 0.8rem; color: var(--gray);">
                        ${dateAdded}
                    </td>
                    <td>
                        <select class="db-status-select" data-id="${b.id}">
                            ${statuses.map(s => `<option value="${s}" ${b.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                    </td>
                    <td style="white-space: nowrap;">
                        <button class="btn-delete-record" data-id="${b.id}" title="Delete record">🗑️ Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach event listeners to status selectors
        dbTableBody.querySelectorAll('.db-status-select').forEach(select => {
            select.addEventListener('change', async function() {
                const id = this.getAttribute('data-id');
                const newStatus = this.value;
                try {
                    const res = await fetch(`/api/bookings/${id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus, note: `Status updated via Dispatch Database Portal` })
                    });
                    const resData = await res.json();
                    if (!res.ok || !resData.success) {
                        alert("Failed to update status: " + (resData.error || 'Server error'));
                        loadDbData();
                    } else {
                        // Refresh stats
                        loadDbData();
                    }
                } catch (err) {
                    alert("Error updating status: " + err.message);
                }
            });
        });

        // Attach event listeners to delete buttons
        dbTableBody.querySelectorAll('.btn-delete-record').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                if (confirm(`Are you sure you want to delete delivery record ${id} from the database?`)) {
                    try {
                        const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
                        const resData = await res.json();
                        if (!res.ok || !resData.success) {
                            alert("Failed to delete record: " + (resData.message || resData.error));
                        } else {
                            loadDbData();
                        }
                    } catch (err) {
                        alert("Error deleting record: " + err.message);
                    }
                }
            });
        });

        // Click tracking ID to view tracking in main view
        dbTableBody.querySelectorAll('.track-link').forEach(link => {
            link.addEventListener('click', function() {
                const trk = this.getAttribute('data-tracking');
                closeModal();
                const trackInput = document.getElementById('trackInput');
                if (trackInput) {
                    trackInput.value = trk;
                    document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
                    fetchTracking(trk);
                }
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    if (refreshDbBtn) refreshDbBtn.addEventListener('click', loadDbData);
    if (dbStatusFilter) dbStatusFilter.addEventListener('change', loadDbData);

    if (dbSearchInput) {
        let debounceTimer;
        dbSearchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(loadDbData, 300);
        });
    }

    // Export CSV functionality
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            if (!currentBookings || currentBookings.length === 0) {
                alert("No records to export.");
                return;
            }

            const headers = ["Tracking ID", "Customer Name", "Phone", "Pick-up Address", "Drop-off Address", "Package Details", "Status", "Date Created"];
            const csvRows = [headers.join(",")];

            currentBookings.forEach(b => {
                const row = [
                    `"${b.id}"`,
                    `"${(b.name || '').replace(/"/g, '""')}"`,
                    `"${(b.phone || '').replace(/"/g, '""')}"`,
                    `"${(b.pickup || '').replace(/"/g, '""')}"`,
                    `"${(b.dropoff || '').replace(/"/g, '""')}"`,
                    `"${(b.details || '').replace(/"/g, '""')}"`,
                    `"${b.status}"`,
                    `"${b.createdAt}"`
                ];
                csvRows.push(row.join(","));
            });

            const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ovo_logistics_database_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // --- Dark Mode Logic ---
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem("theme");

    // Initialize theme based on saved preference or OS preference
    if (currentTheme == "dark" || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add("dark-theme");
        if(themeToggle) themeToggle.innerText = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function() {
            document.body.classList.toggle("dark-theme");
            let theme = "light";
            if (document.body.classList.contains("dark-theme")) {
                theme = "dark";
                themeToggle.innerText = '☀️';
            } else {
                themeToggle.innerText = '🌙';
            }
            localStorage.setItem("theme", theme);
        });
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('searchInput');
    const searchableCards = document.querySelectorAll('.card-3d'); // Includes Services and Features

    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const query = e.target.value.toLowerCase();

            searchableCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- Chatbot Logic ---
    const chatWidget = document.getElementById('chatWidget');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    // Store the system prompt for reference or for passing to a backend later.
    const SYSTEM_PROMPT = `
Role and Identity: You are the official AI customer success representative for OVO Logistics Services, a company that specializes in fast, reliable, and secure logistics solutions across Lagos, Nigeria, and worldwide. Your name is OVO SupportBot.

Tone and Personality:
- Tone: Professional, warm, concise, and helpful.
- Language: Keep answers simple, avoiding overly technical jargon.
- Formatting: Use short paragraphs and bullet points.

Core Objectives:
1. Greet users politely and ask how you can assist them today.
2. Answer frequently asked questions based only on the provided knowledge base.
3. Guide users toward booking a delivery or contacting us via WhatsApp.
4. Route frustrated customers to our human team.

Knowledge Base & Business Information:
- Business Hours: Monday - Saturday, 8 AM to 6 PM WAT
- Contact Info: 09041596476
- Location: Lagos, Nigeria (Coverage: Mainland, Island, Ikeja, Lekki, Victoria Island, Ikoyi, Surulere, Yaba, Ikorodu, Ajah, Festac)
- Key Services: 
  - Pick Up & Drop Off
  - Personal Errands
  - Doorstep Delivery
  - International Shipping
- Link to Booking/Sales: Direct them to the online booking form on the website or WhatsApp link.

Strict Rules & Constraints:
- No Hallucinations.
- Handling Unknowns: Say "I don't have that exact information on hand, but I'd be happy to connect you with our human team on WhatsApp at 09041596476."
- Brevity: Keep responses under 100 words.
    `;

    if (chatToggleBtn && chatWidget && closeChatBtn) {
        chatToggleBtn.addEventListener('click', () => {
            chatWidget.classList.add('active');
            chatToggleBtn.style.display = 'none';
        });

        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.remove('active');
            chatToggleBtn.style.display = 'block';
        });
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // TODO: Replace this timeout with a real API call (e.g. fetch to your backend)
        // You will send the SYSTEM_PROMPT along with the user's message to the LLM backend.
        
        setTimeout(() => {
            addMessage("Thank you for your message! This is a mock response. Please connect your backend LLM to continue the conversation.", 'bot');
        }, 1000);
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', handleSendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }
});
