// --- DATA & CONFIG ---
let activities = [];
let userWeight = 70; // Default kg
let weeklyTarget = 150; // Default menit

// Estimasi Kalori per menit (METs kasar)
const caloriesMap = {
    'Lari': 10,
    'Bersepeda': 8,
    'Push Up': 5,
    'Renang': 11,
    'Gym': 6
};

// --- INISIALISASI CHART ---
const ctx = document.getElementById('myChart').getContext('2d');
let workoutChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        datasets: [{
            label: 'Durasi Latihan (Menit)',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: '#FF4500',
            backgroundColor: 'rgba(255, 69, 0, 0.2)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { labels: { color: 'white' } } },
        scales: {
            y: { ticks: { color: '#aaa' }, grid: { color: '#333' } },
            x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
        }
    }
});

// --- NAVIGASI ---
function switchTab(tabId) {
    // Sembunyikan semua section
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    // Reset style tombol navigasi
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Tampilkan section yang dipilih
    document.getElementById(tabId).classList.add('active');
    // Highlight tombol yang diklik
    if(event) event.target.classList.add('active');
}

// --- LOGIKA UTAMA ---
function saveActivity(e) {
    e.preventDefault();

    // Ambil nilai form
    let type = document.getElementById('type').value;
    let duration = parseInt(document.getElementById('duration').value);
    let date = document.getElementById('date').value;
    
    // Hitung Kalori Sederhana (Durasi * Faktor Jenis * (Berat/RefBerat))
    let factor = caloriesMap[type] || 5;
    let burned = Math.round(duration * factor * (userWeight / 70));

    // Simpan ke Array
    let newActivity = {
        id: Date.now(),
        type: type,
        duration: duration,
        date: date,
        calories: burned
    };
    activities.push(newActivity);

    // Reset Form & Pindah ke Dashboard
    document.getElementById('activityForm').reset();
    updateUI();
    
    // Panggil tab dashboard secara manual
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('add').classList.remove('active');
    
    // Simulasi Badge
    checkBadges(burned, duration);
}

function updateUI() {
    // 1. Update Tabel Riwayat
    let tbody = document.getElementById('history-body');
    tbody.innerHTML = "";
    activities.forEach(act => {
        tbody.innerHTML += `
            <tr>
                <td>${act.date}</td>
                <td>${act.type}</td>
                <td>${act.duration} Menit</td>
                <td style="color:var(--secondary)">${act.calories} Kcal</td>
            </tr>
        `;
    });

    // 2. Update Dashboard Stats
    let totalCal = activities.reduce((sum, act) => sum + act.calories, 0);
    let totalMin = activities.reduce((sum, act) => sum + act.duration, 0);
    
    document.getElementById('dash-cal').innerText = totalCal;
    document.getElementById('dash-min').innerText = totalMin;
    document.getElementById('dash-count').innerText = activities.length;

    // 3. Update Progress Target Mingguan
    let progressPercent = (totalMin / weeklyTarget) * 100;
    if(progressPercent > 100) progressPercent = 100;
    document.getElementById('weekly-progress').style.width = progressPercent + "%";
    document.getElementById('target-text').innerText = `${totalMin} / ${weeklyTarget} Menit`;

    // 4. Update Chart (Simulasi: Menambahkan durasi ke data terakhir)
    let currentData = workoutChart.data.datasets[0].data;
    // Untuk demo simpel, kita tambahkan ke index terakhir (Sabtu)
    // Di aplikasi nyata, harus cek hari dari tanggal input
    currentData[6] = totalMin; 
    workoutChart.update();
}

function updateSettings() {
    userWeight = document.getElementById('weight').value;
    weeklyTarget = document.getElementById('weeklyTarget').value;
    updateUI(); // Hitung ulang progress bar
}

function checkBadges(calories, duration) {
    if(calories > 500) {
        document.getElementById('badge-burner').classList.add('unlocked');
    }
    if(duration > 60) {
        document.getElementById('badge-marathon').classList.add('unlocked');
    }
}

// Set tanggal hari ini di input date saat load
document.getElementById('date').valueAsDate = new Date();
