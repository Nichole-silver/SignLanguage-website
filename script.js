let video = null;
let canvas = null;
let cameraResultEl = null;
let stream = null;

// Gán DOM sau khi toàn bộ trang đã load
window.addEventListener('DOMContentLoaded', () => {
    video = document.getElementById('camera-feed');
    canvas = document.getElementById('camera-canvas');
    cameraResultEl = document.getElementById('camera-result');
});

// Hàm 1: mở camera và hiển thị thông báo
async function startCamera() {
    if (!video || !cameraResultEl) {
        console.error("Không tìm thấy phần tử video hoặc cameraResultEl.");
        return;
    }

    try {
        // Yêu cầu quyền truy cập camera trước
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }, // 'user' là camera trước
            audio: false
        });

        // Gắn luồng camera vào thẻ video
        video.srcObject = stream;
        await video.play();

        // Thông báo thành công
        cameraResultEl.innerHTML = `
            <div class="testapi-label" style="color: green; font-weight: bold;">
                ✅ Camera đã sẵn sàng. Hãy nhấn "Chụp ảnh".
            </div>
        `;
        console.log("Camera đã sẵn sàng.");
    } catch (err) {
        // Thông báo lỗi nếu không mở được camera
        console.error("Lỗi khi mở camera:", err);
        cameraResultEl.innerHTML = `
            <div class="testapi-result-block" style="color:#d32f2f; font-weight: bold;">
                ❌ Không thể truy cập camera: ${err.message}
            </div>
        `;
    }
}


// Hàm 2: Chụp ảnh
function captureImage() {
    if (!video || !canvas || !cameraResultEl) {
        cameraResultEl.classList.add('active');
        cameraResultEl.innerHTML = '<div class="testapi-result-block" style="color:#d32f2f">Chưa khởi tạo camera hoặc canvas.</div>';
        return;
    }

    // Gợi ý chuẩn bị
    cameraResultEl.classList.add('active');
    cameraResultEl.innerHTML = `
        <div class="testapi-label" style="color: #f57c00; font-weight: bold;">
            🕐 Hãy chuẩn bị động tác tay. Máy sẽ chụp sau <strong>5 giây</strong>...
        </div>
    `;

    const countdownEl = document.getElementById('countdown-overlay');
    let count = 5;
    countdownEl.style.display = 'block';
    countdownEl.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownEl.style.display = 'none';

            // Chụp ảnh
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            capturedImageData = canvas.toDataURL('image/png');

            // Hiển thị ảnh chụp
            cameraResultEl.innerHTML = `
                <div class="testapi-label" style="color: green; font-weight: bold;">✅ Ảnh vừa chụp:</div>
                <img src="${capturedImageData}" style="max-width:200px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #0002;">
                <div class="testapi-label" style="margin-top:8px;">Nhấn "Gửi và dịch" để nhận kết quả.</div>
            `;
        }
    }, 1000); // mỗi giây giảm 1
}


// Hàm 3: Gửi ảnh và dịch
async function captureAndTranslate() {
    if (!capturedImageData) {
        cameraResultEl.innerHTML = `<div class="testapi-result-block" style="color:#d32f2f">Bạn chưa chụp ảnh nào. Hãy nhấn "Chụp ảnh" trước.</div>`;
        return;
    }

    try {
        cameraResultEl.innerHTML = '<div class="testapi-label">Xin chờ giây lát...</div>';

        const response = await fetch('https://hcl-1-1q5z.onrender.com/detect_image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: capturedImageData.split(',')[1]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi máy chủ: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        let letter = data.letter || "Không nhận dạng được ký hiệu";
        let confidence = data.confidence !== undefined ? (data.confidence * 100).toFixed(1) : null;
        let outputClass = (letter === "Không nhận dạng được ký hiệu") ? "normal" : "large";

        cameraResultEl.innerHTML = `
            <div class="testapi-label">Ký hiệu:</div>
            <div class="testapi-output ${outputClass}">${letter}</div>
            ${confidence !== null ? `<div class="testapi-confidence">Độ chính xác: <span>${confidence}%</span></div>` : ""}
        `;

    } catch (error) {
        cameraResultEl.innerHTML = `<div class="testapi-result-block" style="color:#d32f2f">Lỗi: ${error.message}</div>`;
    }
}

// Khởi tạo ứng dụng khi trang được load
document.addEventListener('DOMContentLoaded', function () {
    initDictionary();
    initTestAPI();
    initNavigation();
    initLessons();
    initDictionary();
    initPracticeArea();
    loadUserProgress();
    updateProgressDisplay();
    renderLessonsByCategory();

    // Gán phần tử camera
    video = document.getElementById('camera-feed');
    canvas = document.getElementById('camera-canvas');
    cameraResultEl = document.getElementById('camera-result');

    // Xử lý Test API
    const fileInput = document.getElementById('testapi-fileInput');
    const sendBtn = document.getElementById('testapi-sendBtn');
    const resultEl = document.getElementById('testapi-result');
    const previewEl = document.getElementById('testapi-preview');

    if (fileInput && sendBtn && resultEl && previewEl) {
        // Hiển thị preview ảnh
        fileInput.addEventListener('change', function () {
            previewEl.innerHTML = '';
            if (fileInput.files.length) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewEl.innerHTML = `<img src="${e.target.result}" style="max-width:200px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #0002;">`;
                };
                reader.readAsDataURL(file);
            }
        });

        function toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        sendBtn.addEventListener('click', async () => {
            if (!fileInput.files.length) {
                alert('Vui lòng chọn một ảnh để gửi!');
                return;
            }

            const file = fileInput.files[0];
            try {
                resultEl.textContent = 'Đang gửi ảnh lên API...';
                const base64Image = await toBase64(file);

                const response = await fetch('https://hcl-1-1q5z.onrender.com/detect_image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: base64Image.split(',')[1] })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server trả về lỗi: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                let letter = data.letter || "Không nhận dạng được ký hiệu";
                let confidence = data.confidence !== undefined ? (data.confidence * 100).toFixed(1) : null;
                let outputClass = (letter === "Không nhận dạng được ký hiệu") ? "normal" : "large";

                resultEl.innerHTML = `
                    <div class="testapi-label">Ký hiệu:</div>
                    <div class="testapi-output ${outputClass}">${letter}</div>
                    ${confidence !== null ? `<div class="testapi-confidence">Độ chính xác: <span>${confidence}%</span></div>` : ""}
                `;

            } catch (error) {
                resultEl.innerHTML = `<div class="testapi-result-block" style="color:#d32f2f">Lỗi: ${error.message}</div>`;
            }
        });
    }
});

// Biến toàn cục để lưu trữ dữ liệu
const appData = {
    completedLessons: [],
    practiceScores: [],
    recentActivities: [],
    currentQuizIndex: 0,
    currentQuizScore: 0,
    quizQuestions: [],
    flashcardIndex: 0,
    flashcardDeck: []
};

// Dữ liệu bài học đầy đủ
const lessonData = {
    alphabet: [
        { id: 'lesson-a', title: 'Chữ A', image: 'A-Z/a.png', description: 'Nắm chặt bàn tay, chỉ để ngón cái dựng đứng.', english: 'A', category: 'alphabet' },
        { id: 'lesson-b', title: 'Chữ B', image: 'A-Z/b.png', description: 'Duỗi thẳng 4 ngón tay và khép lại, ngón cái gập vào lòng bàn tay.', english: 'B', category: 'alphabet' },
        { id: 'lesson-c', title: 'Chữ C', image: 'A-Z/c.png', description: 'Uốn cong bàn tay tạo hình chữ C.', english: 'C', category: 'alphabet' },
        { id: 'lesson-d', title: 'Chữ D', image: 'A-Z/d.png', description: 'Ngón trỏ duỗi thẳng, các ngón khác khép lại chạm ngón cái.', english: 'D', category: 'alphabet' },
        { id: 'lesson-e', title: 'Chữ E', image: 'A-Z/e.png', description: 'Tất cả các ngón tay khép lại, chạm vào lòng bàn tay.', english: 'E', category: 'alphabet' },
        { id: 'lesson-f', title: 'Chữ F', image: 'A-Z/f.png', description: 'Ngón trỏ và ngón cái chạm nhau tạo hình tròn, ba ngón còn lại duỗi thẳng.', english: 'F', category: 'alphabet' },
        { id: 'lesson-g', title: 'Chữ G', image: 'A-Z/g.png', description: 'Ngón trỏ và ngón cái duỗi ra, các ngón khác khép lại.', english: 'G', category: 'alphabet' },
        { id: 'lesson-h', title: 'Chữ H', image: 'A-Z/h.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng và song song.', english: 'H', category: 'alphabet' },
        { id: 'lesson-i', title: 'Chữ I', image: 'A-Z/i.png', description: 'Chỉ ngón út duỗi thẳng, các ngón khác khép lại.', english: 'I', category: 'alphabet' },
        { id: 'lesson-j', title: 'Chữ J', image: 'A-Z/j.png', description: 'Tương tự chữ I nhưng có chuyển động cong.', english: 'J', category: 'alphabet' },
        { id: 'lesson-k', title: 'Chữ K', image: 'A-Z/k.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng tạo hình chữ V, ngón cái đặt giữa.', english: 'K', category: 'alphabet' },
        { id: 'lesson-l', title: 'Chữ L', image: 'A-Z/l.png', description: 'Ngón trỏ và ngón cái tạo góc vuông.', english: 'L', category: 'alphabet' },
        { id: 'lesson-m', title: 'Chữ M', image: 'A-Z/m.png', description: 'Ba ngón tay đầu khép lại, ngón cái đặt dưới.', english: 'M', category: 'alphabet' },
        { id: 'lesson-n', title: 'Chữ N', image: 'A-Z/n.png', description: 'Hai ngón tay đầu khép lại, ngón cái đặt dưới.', english: 'N', category: 'alphabet' },
        { id: 'lesson-o', title: 'Chữ O', image: 'A-Z/o.png', description: 'Tất cả các ngón tay tạo hình tròn.', english: 'O', category: 'alphabet' },
        { id: 'lesson-p', title: 'Chữ P', image: 'A-Z/p.png', description: 'Tương tự chữ K nhưng hướng xuống dưới.', english: 'P', category: 'alphabet' },
        { id: 'lesson-q', title: 'Chữ Q', image: 'A-Z/q.png', description: 'Tương tự chữ G nhưng hướng xuống dưới.', english: 'Q', category: 'alphabet' },
        { id: 'lesson-r', title: 'Chữ R', image: 'A-Z/r.png', description: 'Ngón trỏ và ngón giữa chéo nhau.', english: 'R', category: 'alphabet' },
        { id: 'lesson-s', title: 'Chữ S', image: 'A-Z/s.png', description: 'Nắm tay, ngón cái đặt trên các ngón khác.', english: 'S', category: 'alphabet' },
        { id: 'lesson-t', title: 'Chữ T', image: 'A-Z/t.png', description: 'Ngón cái đặt giữa ngón trỏ và ngón giữa.', english: 'T', category: 'alphabet' },
        { id: 'lesson-u', title: 'Chữ U', image: 'A-Z/u.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng và khép lại.', english: 'U', category: 'alphabet' },
        { id: 'lesson-v', title: 'Chữ V', image: 'A-Z/v.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng tách ra tạo hình chữ V.', english: 'V', category: 'alphabet' },
        { id: 'lesson-w', title: 'Chữ W', image: 'A-Z/w.png', description: 'Ba ngón đầu duỗi thẳng tách ra.', english: 'W', category: 'alphabet' },
        { id: 'lesson-x', title: 'Chữ X', image: 'A-Z/x.png', description: 'Ngón trỏ cong như móc câu.', english: 'X', category: 'alphabet' },
        { id: 'lesson-y', title: 'Chữ Y', image: 'A-Z/y.png', description: 'Ngón cái và ngón út duỗi ra, các ngón khác khép lại.', english: 'Y', category: 'alphabet' },
        { id: 'lesson-z', title: 'Chữ Z', image: 'A-Z/z.png', description: 'Ngón trỏ duỗi thẳng và vẽ chữ Z trong không khí.', english: 'Z', category: 'alphabet' }
    ],
    numbers: [
    { id: 'lesson-1', title: 'Số 1', image: '1-10/1.png', description: 'Giơ ngón trỏ lên.', english: 'One', category: 'numbers' },
    { id: 'lesson-2', title: 'Số 2', image: '1-10/2.png', description: 'Giơ ngón trỏ và ngón giữa.', english: 'Two', category: 'numbers' },
    { id: 'lesson-3', title: 'Số 3', image: '1-10/3.png', description: 'Giơ ngón cái, ngón trỏ và ngón giữa.', english: 'Three', category: 'numbers' },
    { id: 'lesson-4', title: 'Số 4', image: '1-10/4.png', description: 'Giơ bốn ngón tay, khép ngón cái.', english: 'Four', category: 'numbers' },
    { id: 'lesson-5', title: 'Số 5', image: '1-10/5-Photoroom.png', description: 'Duỗi thẳng tất cả năm ngón tay.', english: 'Five', category: 'numbers' },
    { id: 'lesson-6', title: 'Số 6', image: '1-10/6-Photoroom.png', description: 'Khép ngón út, duỗi các ngón khác.', english: 'Six', category: 'numbers' },
    { id: 'lesson-7', title: 'Số 7', image: '1-10/7-Photoroom.png', description: 'Khép ngón áp út, duỗi các ngón khác.', english: 'Seven', category: 'numbers' },
    { id: 'lesson-8', title: 'Số 8', image: '1-10/8-Photoroom.png', description: 'Khép ngón giữa, duỗi các ngón khác.', english: 'Eight', category: 'numbers' },
    { id: 'lesson-9', title: 'Số 9', image: '1-10/9-Photoroom.png', description: 'Khép ngón trỏ, duỗi các ngón khác.', english: 'Nine', category: 'numbers' },
    { id: 'lesson-10', title: 'Số 10', image: '1-10/10-Photoroom.png', description: 'Nắm tay lại rồi giơ ngón cái lên.', english: 'Ten', category: 'numbers' }
    ],
    greetings: [
    { id: 'lesson-hello', title: 'Xin Chào', image: 'greeting/hello.png', description: 'Mở rộng bàn tay phải với lòng bàn tay hướng về phía mặt, đưa lên ngang trán và vẫy nhẹ từ trái sang phải.', english: 'Hello', category: 'greetings' },
    { id: 'lesson-myname', title: 'Tên Tôi Là', image: 'greeting/mynameis.png', description: 'Đặt bàn tay phải mở rộng lên ngực với các ngón tay hướng về phía cổ, sau đó chỉ thẳng về phía người đối diện bằng ngón tay trỏ.', english: 'My name is', category: 'greetings' },
    { id: 'lesson-thank', title: 'Cảm Ơn', image: 'greeting/thank.png', description: 'Đặt bàn tay phải mở rộng với lòng bàn tay hướng xuống dưới, chạm nhẹ vào môi rồi đưa thẳng ra phía trước về hướng người đối diện.', english: 'Thank you', category: 'greetings' },
    { id: 'lesson-sorry', title: 'Xin Lỗi', image: 'greeting/sorry.png', description: 'Nắm tay phải thành nắm đấm, đặt lên ngực và xoay theo chuyển động tròn nhẹ nhàng trên vùng tim.', english: 'Please/Sorry', category: 'greetings' },
    { id: 'lesson-yes', title: 'Có', image: 'greeting/yes.png', description: 'Nắm tay phải thành nắm đấm với ngón cái duỗi thẳng hướng lên trên, gật nắm tay lên xuống như động tác gật đầu.', english: 'Yes', category: 'greetings' },
    { id: 'lesson-no', title: 'Không', image: 'greeting/no.png', description: 'Đưa bàn tay phải với ngón tay trỏ và ngón giữa duỗi thẳng, vẫy từ trái sang phải ở trước mặt như động tác lắc đầu.', english: 'No', category: 'greetings' },
    { id: 'lesson-love', title: 'Tôi Yêu Bạn', image: 'greeting/iloveyou.png', description: 'Đưa bàn tay phải lên với ngón cái, ngón trỏ và ngón út duỗi thẳng, ngón giữa và ngón áp út cong xuống, hướng về phía người đối diện.', english: 'I love you', category: 'greetings' },
    { id: 'lesson-help', title: 'Giúp Đỡ', image: 'greeting/help.png', description: 'Nắm tay trái thành nắm đấm với ngón cái duỗi lên trên, đặt bàn tay phải mở rộng dưới nắm tay trái và nâng cả hai tay lên trên.', english: 'Help', category: 'greetings' },
    { id: 'lesson-stop', title: 'Dừng Lại', image: 'greeting/stop.png', description: 'Đưa bàn tay thẳng về phía trước với lòng bàn tay hướng ra ngoài.', english: 'Stop', category: 'greetings' }
    ],
    people: [
    { id: 'lesson-mother', title: 'Mẹ', image: '/people/mother.png', description: ' Đầu ngón cái tay phải chạm vào phần dưới của cằm (lòng bàn tay mở).', english: 'Mother', category: 'people' },
    { id: 'lesson-father', title: 'Bố', image: '/people/father.png', description: 'Đầu ngón cái tay phải chạm vào trán (lòng bàn tay mở, các ngón xòe ra).', english: 'Father', category: 'people' },
    { id: 'lesson-sister', title: 'Chị/Em gái', image: '/people/sister.png', description: 'Chạm ngón cái của tay phải lên cằm (giống từ "girl"), sau đó đưa tay ra trước, kết thúc bằng động tác hai tay tạo hình súng và chạm nhau.', english: 'Sister', category: 'people' },
    { id: 'lesson-brother', title: 'Anh/Em trai', image: '/people/brother.png', description: 'Đầu ngón cái tay phải chạm trán (giống từ "boy"), sau đó hai tay tạo hình súng và chạm nhau như với "sister".', english: 'Brother', category: 'people' },
    { id: 'lesson-grandmother', title: 'Bà', image: '/people/grandma.png', description: 'Làm dấu “mother” nhưng tay di chuyển ra phía trước hai lần.', english: 'Grandmother', category: 'people' },
    { id: 'lesson-grandfather', title: 'Ông', image: '/people/grandpa.png', description: 'Làm dấu “father” rồi đẩy tay ra phía trước hai lần.', english: 'Grandfather', category: 'people' },
    { id: 'lesson-child-boy', title: 'Bé trai', image: '/people/boy.png', description: 'Dùng tay như đang cầm mũ lưỡi trai (tay đặt ở trán, ngón cái và các ngón mở rộng như đang kẹp và mở).', english: 'Boy', category: 'people' },
    { id: 'lesson-child-girl', title: 'Bé gái', image: '/people/girl.png', description: 'Nắm tay lại, chà nhẹ khớp ngón cái dọc theo cằm (từ tai đến cằm).', english: 'Girl', category: 'people' },
    { id: 'lesson-baby', title: 'Em bé', image: '/people/baby.png', description: 'Đặt hai tay dưới dạng đang bồng trẻ, sau đó nhẹ nhàng đung đưa như đang ru em bé.', english: 'Baby', category: 'people' },
    { id: 'lesson-family', title: 'Gia đình', image: '/people/family.png', description: 'Hai tay tạo hình chữ “F” (ngón trỏ và ngón cái chạm nhau tạo vòng tròn), hai tay đối diện nhau, rồi xoay tròn một vòng để kết thúc vị trí hai chữ F sát nhau.', english: 'Family', category: 'people' },
    { id: 'lesson-friend', title: 'Bạn', image: '/people/friend.png', description: 'Móc ngón trỏ tay này vào ngón trỏ tay kia, rồi đổi chiều và móc lại lần nữa.', english: 'Friend', category: 'people' },
    { id: 'lesson-teacher', title: 'Giáo viên', image: '/people/teacher.png', description: 'Đưa hai tay (các ngón khép lại) lên gần trán như đang “mở đầu ra”, sau đó đưa hai bàn tay xuống hai bên giống như chỉ người.', english: 'Teacher', category: 'people' },
    { id: 'lesson-neighbor', title: 'Hàng xóm', image: '/people/neighbor.png', description: 'Hai bàn tay hướng về nhau như cái bắt tay nhưng không chạm, sau đó nhấn nhẹ một tay vào tay kia.', english: 'Neighbor', category: 'people' },
    { id: 'lesson-woman', title: 'Phụ nữ', image: '/people/woman.png', description: 'Đầu ngón cái tay phải chạm vào cằm, rồi di chuyển xuống chạm nhẹ lên ngực (vùng ngực trên).', english: 'Woman', category: 'people' },
    { id: 'lesson-man', title: 'Đàn ông', image: '/people/man.png', description: 'Đầu ngón cái chạm trán (giống “father”), sau đó tay mở ra và hạ xuống trước ngực.', english: 'Man', category: 'people' }
],
emotions: [
    { id: 'lesson-frightened', title: 'Sợ hãi', image: '/feelings/frightened.png', description: 'Đưa hai tay nắm lại trước ngực, sau đó bật mở ra như bị hoảng hốt. Gương mặt hoang mang.', english: 'Frightened', category: 'emotions' },
    { id: 'lesson-happy', title: 'Vui vẻ', image: '/feelings/happy.png', description: 'Dùng lòng bàn tay xoa nhẹ lên ngực theo chuyển động tròn hướng lên, nét mặt tươi sáng.', english: 'Happy', category: 'emotions' },
    { id: 'lesson-sad', title: 'Buồn', image: '/feelings/sad.png', description: 'Mở bàn tay và kéo từ trên mặt xuống, biểu cảm trầm lặng và buồn bã.', english: 'Sad', category: 'emotions' },
    { id: 'lesson-very-good', title: 'Rất tốt', image: '/feelings/very-good.png', description: 'Giơ hai ngón cái lên, nở nụ cười tươi thể hiện sự tích cực.', english: 'Very good', category: 'emotions' },
    { id: 'lesson-angry', title: 'Giận dữ', image: '/feelings/angry.png', description: 'Đưa tay lên phía trước dạng vuốt cong, như cơn giận đang dâng trào. Gương mặt nghiêm lại hoặc cau mày.', english: 'Angry', category: 'emotions' },
    { id: 'lesson-excited', title: 'Hào hứng', image: '/feelings/excited.png', description: 'Đặt hai tay mở gần ngực, ngón giữa chạm nhẹ vào ngực và di chuyển lên xuống luân phiên. Khuôn mặt rạng rỡ.', english: 'Excited', category: 'emotions' },
    { id: 'lesson-love1', title: 'Yêu thương', image: '/feelings/love.png', description: 'Khoanh tay trước ngực như đang ôm người mình thương, kết hợp ánh mắt dịu dàng.', english: 'Love', category: 'emotions' }
],

colors: [
    { id: 'lesson-green', title: 'Màu lục', image: '/colours/green.png', description: 'Tay hình chữ G lắc nhẹ gần má.', english: 'Green', category: 'colors' },
    { id: 'lesson-blue', title: 'Màu lam', image: '/colours/blue.png', description: 'Tay hình chữ B lắc nhẹ trước vai.', english: 'Blue', category: 'colors' },
    { id: 'lesson-yellow', title: 'Màu vàng', image: '/colours/yellow.png', description: 'Tay chữ Y lắc nhẹ gần cằm.', english: 'Yellow', category: 'colors' },
    { id: 'lesson-red', title: 'Màu đỏ', image: '/colours/red.png', description: 'Ngón trỏ chạm môi rồi hạ xuống.', english: 'Red', category: 'colors' },
    { id: 'lesson-white', title: 'Màu trắng', image: '/colours/white.png', description: 'Mở tay ở ngực, kéo ra rồi khép các ngón.', english: 'White', category: 'colors' },
    { id: 'lesson-black', title: 'Màu đen', image: '/colours/black.png', description: 'Ngón trỏ quét ngang trán.', english: 'Black', category: 'colors' }
],

places: [
    { id: 'lesson-school', title: 'Trường học', image: '/places/school.png', description: 'Ngón trỏ quét ngang trán.', english: 'School', category: 'places' }
],

actions: [
]



};

// Tạo dữ liệu từ điển tổng hợp
const dictionaryData = [
    ...lessonData.alphabet,
    ...lessonData.numbers,
    ...lessonData.greetings,
    ...lessonData.people,
    ...lessonData.emotions,
    ...lessonData.colors,
    ...lessonData.places,
    ...lessonData.actions
];

//Tạo bản đồ id -> thứ tự để so sánh
const idOrderMap = {};
dictionaryData.forEach((item, index) => {
    idOrderMap[item.id] = index;
});

// ===== Xử lý điều hướng & menu hamburger =====
let navEventsInitialized = false;
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = navLinks.querySelectorAll('li a');
  const indicator = document.querySelector('.indicator');

  // 👉 Toggle menu mỗi lần ấn hamburger
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');

  // ✅ Chỉ gắn sự kiện click vào menu items 1 lần duy nhất
  if (!navEventsInitialized) {
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        navItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        // Di chuyển indicator nếu không phải mobile
        if (window.innerWidth > 768 && indicator) {
          moveIndicator(item);
        }

        // Đóng menu mobile sau khi chọn mục
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Di chuyển indicator ban đầu
    window.addEventListener('load', () => {
      const activeItem = document.querySelector('li a.active') || navItems[0];
      if (window.innerWidth > 768 && indicator) {
        moveIndicator(activeItem);
      }
    });

    // Di chuyển lại khi resize
    window.addEventListener('resize', () => {
      const activeItem = document.querySelector('li a.active');
      if (window.innerWidth > 768 && activeItem && indicator) {
        moveIndicator(activeItem);
      }
    });

    navEventsInitialized = true;
  }

  // Hàm nội bộ di chuyển indicator
  function moveIndicator(target) {
    const rect = target.getBoundingClientRect();
    const navRect = navLinks.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.left = `${rect.left - navRect.left}px`;
  }
}
document.addEventListener('DOMContentLoaded', initNavigation);



// Chuyển đổi giữa các section
function switchSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
        }
    });
    
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.remove('active');
}

// hàm cho giả lập chuyển tab bài học
function startLesson() {
    document.querySelector('a[href="#lessons"]').click();
}

// Khởi tạo phần bài học
function initLessons() {
    const modal = document.getElementById('lesson-modal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Render bài học theo danh mục
function renderLessonsByCategory() {
    Object.keys(lessonData).forEach(category => {
        const grid = document.getElementById(`${category}-grid`);
        if (grid) {
            grid.innerHTML = lessonData[category].map(lesson => `
                <div class="lesson-card" data-id="${lesson.id}" onclick="openLesson('${lesson.id}')">
                    <div class="lesson-img">
                        <img src="${lesson.image}" alt="${lesson.title}"/>
                    </div>
                    <h4>${lesson.title}</h4>
                    <button class="lesson-btn" onclick="event.stopPropagation(); openLesson('${lesson.id}')">Xem chi tiết</button>
                    <span class="completion-badge hidden"><i class="fas fa-check"></i></span>
                </div>
            `).join('');
        }
    });
    updateLessonCompletionBadges();
}
document.addEventListener('DOMContentLoaded', () => {
  renderLessonsByCategory();
  initLessons(); // nếu cần
});


// Chuyển đổi giữa các danh mục bài học
function changeCategory(categoryId) {
    const tabs = document.querySelectorAll('.category-tabs .tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('onclick').includes(categoryId)) {
            tab.classList.add('active');
        }
    });
    
    const categories = document.querySelectorAll('.lesson-category');
    categories.forEach(category => {
        category.classList.remove('active');
    });
    
    const targetCategory = document.getElementById(categoryId);
    if (targetCategory) {
        targetCategory.classList.add('active');
    }
}

// Mở chi tiết bài học
function openLesson(lessonId) {
    const modal = document.getElementById('lesson-modal');
    const lessonDetail = document.getElementById('lesson-detail');
    
    const lesson = findLessonById(lessonId);
    if (!lesson) return;

    const tips = [
        'Thực hành chậm rãi để nhớ chính xác',
        'Quan sát kỹ hình ảnh mẫu',
        'Luyện tập nhiều lần để thành thạo',
        'Chú ý đến hướng của bàn tay'
    ];

    // Tạo nội dung HTML không gắn sự kiện trực tiếp trong template string
    let content = `
        <h2>${lesson.title}</h2>
        <div class="lesson-detail-content">
            <div class="lesson-media">
                <img src="${lesson.image}" alt="${lesson.title}" class="lesson-detail-img">
                <button class="play-audio" id="play-audio-btn">
                    <i class="fas fa-volume-up"></i> Nghe mô tả
                </button>
                <button class="mark-complete-btn" id="mark-complete-btn">
                    ${appData.completedLessons.includes(lessonId) ? 'Đã hoàn thành' : 'Đánh dấu đã học xong'}
                </button>
            </div>
            <div class="lesson-instructions">
                <h3>Cách thực hiện</h3>
                <p>${lesson.description}</p>
                <div class="lesson-tips">
                    <h4>Lưu ý</h4>
                    <ul>
                        ${tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    lessonDetail.innerHTML = content;
    modal.style.display = 'flex';

    // Gắn sự kiện sau khi gán innerHTML
    const playBtn = document.getElementById('play-audio-btn');
    playBtn.addEventListener('click', () => playAudio(lessonId));

    const completeBtn = document.getElementById('mark-complete-btn');
    completeBtn.addEventListener('click', () => markLessonComplete(lessonId));
}


// Tìm bài học theo ID
function findLessonById(lessonId) {
    for (let category of Object.values(lessonData)) {
        const lesson = category.find(l => l.id === lessonId);
        if (lesson) return lesson;
    }
    return null;
}

// Đánh dấu bài học đã hoàn thành
function markLessonComplete(lessonId) {
    const index = appData.completedLessons.indexOf(lessonId);

    if (index === -1) {
        // Chưa hoàn thành → đánh dấu là hoàn thành
        appData.completedLessons.push(lessonId);

        const lesson = findLessonById(lessonId);
        addRecentActivity(`Hoàn thành bài học: ${lesson.title}`);

        saveUserProgress();
        updateLessonCompletionBadges();
        updateProgressDisplay();

        alert('✅ Bạn đã hoàn thành bài học!');
    } else {
        // Đã hoàn thành → gỡ đánh dấu hoàn thành
        appData.completedLessons.splice(index, 1);  // Xóa khỏi danh sách

        const lesson = findLessonById(lessonId);
        addRecentActivity(`Đã bỏ đánh dấu hoàn thành: ${lesson.title}`);

        saveUserProgress();
        updateLessonCompletionBadges();
        updateProgressDisplay();

        alert('❌ Đã bỏ đánh dấu hoàn thành bài học.');
    }

    openLesson(lessonId);
}

// Cập nhật huy hiệu hoàn thành
function updateLessonCompletionBadges() {
    const allLessons = document.querySelectorAll('.lesson-card');
    allLessons.forEach(card => {
        const lessonId = card.getAttribute('data-id');
        const badge = card.querySelector('.completion-badge');
        
        if (badge) {
            if (appData.completedLessons.includes(lessonId)) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    });
}

// Phát âm thanh 
function playAudio(lessonId) {
    console.log(`Đang phát: ${lessonId}`);
    const audio = new Audio(`audio/${lessonId}.mp3`);
    audio.play().catch(error => {
        console.error(`Không thể phát âm thanh cho ${lessonId}:`, error);
    });
}


// =======================
// KHỞI TẠO TỪ ĐIỂN
// =======================
function initDictionary() {
    const searchInput = document.getElementById('dictionary-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', performDictionarySearch);
        searchBtn.addEventListener('click', performDictionarySearch);
    }

    // Hiển thị tất cả từ ban đầu
    displayDictionaryResults(dictionaryData);
}

// Thực hiện tìm kiếm từ điển
function performDictionarySearch() {
    const searchTerm = document.getElementById('dictionary-search').value.toLowerCase().trim();

    if (searchTerm === '') {
        const sortedOriginal = [...dictionaryData].sort((a, b) => idOrderMap[a.id] - idOrderMap[b.id]);
        displayDictionaryResults(sortedOriginal);
        return;
    }

    const startsWithResults = dictionaryData.filter(item =>
        item.title.toLowerCase().startsWith(searchTerm)
    );

    const containsResults = dictionaryData.filter(item =>
        !startsWithResults.includes(item) &&
        item.title.toLowerCase().includes(searchTerm)
    );

    const finalResults = [...startsWithResults, ...containsResults];
    displayDictionaryResults(finalResults);
}

// Hiển thị kết quả từ điển
function displayDictionaryResults(results) {
    const container = document.getElementById('dictionary-items');
    const noResults = document.getElementById('no-results');

    if (results.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    container.innerHTML = results.map(item => `
        <div class="dictionary-card" data-category="${item.category}">
            <div class="word-img">
                <img src="${item.image}" alt="${item.title}"/>
            </div>
            <div class="word-info">
                <h4>${item.title}</h4>
                <p><strong>English:</strong> ${item.english}</p>
                <p><small>Danh mục: ${getCategoryName(item.category)}</small></p>
            </div>
        </div>
    `).join('');
}

// Lọc từ điển theo danh mục
function filterDictionary(category) {
    document.querySelectorAll('.pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.getAttribute('onclick').includes(category)) {
            pill.classList.add('active');
        }
    });

    const filtered = (category === 'all')
        ? dictionaryData
        : dictionaryData.filter(item => item.category === category);

    filtered.sort((a, b) => idOrderMap[a.id] - idOrderMap[b.id]);
    displayDictionaryResults(filtered);
}

// Lấy tên danh mục tiếng Việt
function getCategoryName(category) {
    const names = {
        alphabet: 'Chữ cái',
        numbers: 'Số đếm',
        greetings: 'Chào hỏi',
        people: 'Con người',
        emotions: 'Cảm xúc',
        colors: 'Màu sắc',
        places: "Địa điểm",
        actions: "Hành động"
    };
    return names[category] || category;
}

// Chuyển đổi chế độ từ điển (search, camera, testapi)
function switchDictionaryMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.mode-btn[onclick*="${mode}"]`).classList.add('active');

    document.querySelectorAll('.dictionary-mode').forEach(div => {
        div.classList.remove('active');
    });
    const modeDiv = document.getElementById(`${mode}-mode`);
    if (modeDiv) modeDiv.classList.add('active');

    if (mode === 'camera') {
        initCamera();
    } else {
        stopCamera?.();
    }

    if (mode === 'testapi') {
        window.restoreTestAPIPreview?.();
    }
}


// Khởi tạo chức năng Test API (Xem trước ảnh khi chọn)
function initTestAPI() {
    let lastPreviewImageSrc = null;

    const fileInput = document.getElementById('testapi-fileInput');
    const previewEl = document.getElementById('testapi-preview');

    if (!fileInput || !previewEl) return;

    fileInput.addEventListener('change', () => {
        if (fileInput.files?.[0]) {
            const reader = new FileReader();
            reader.onload = e => {
                lastPreviewImageSrc = e.target.result;
                previewEl.innerHTML = `<img src="${lastPreviewImageSrc}" style="max-width:200px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #0002;">`;
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            previewEl.innerHTML = '';
        }
    });

    // Hàm khôi phục preview khi chuyển tab
    window.restoreTestAPIPreview = () => {
        if (lastPreviewImageSrc && previewEl) {
            previewEl.innerHTML = `<img src="${lastPreviewImageSrc}" style="max-width:200px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #0002;">`;
        }
    };
}


// Khởi tạo khu vực luyện tập
function initPracticeArea() {
    initQuiz();
    initDragDrop();
    initFlashCards();
}

// Khởi tạo quiz
function initQuiz() {
    generateQuizQuestions();
    startQuiz();
}

// Tạo câu hỏi quiz
function generateQuizQuestions() {
    const allLessons = [...dictionaryData];
    const shuffled = allLessons.sort(() => 0.5 - Math.random());
    appData.quizQuestions = shuffled.slice(0, 20).map(lesson => {
        const wrongAnswers = allLessons
            .filter(l => l.id !== lesson.id && l.category === lesson.category)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        
        const options = [lesson, ...wrongAnswers].sort(() => 0.5 - Math.random());
        
        return {
            question: lesson,
            options: options,
            correctAnswer: lesson.title
        };
    });
}

// Bắt đầu quiz
function startQuiz() {
    appData.currentQuizIndex = 0;
    appData.currentQuizScore = 0;
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-feedback').classList.add('hidden');
    showNextQuestion();
}

// Hiển thị câu hỏi tiếp theo
function showNextQuestion() {
    if (appData.currentQuizIndex >= appData.quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const question = appData.quizQuestions[appData.currentQuizIndex];
    
    document.getElementById('current-question').textContent = appData.currentQuizIndex + 1;
    document.getElementById('current-score').textContent = appData.currentQuizScore;
    document.getElementById('quiz-image').src = question.question.image;
    document.getElementById('quiz-text').textContent = 'Ký hiệu này có ý nghĩa gì?';
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = question.options.map(option => `
        <button class="quiz-option" onclick="selectQuizAnswer('${option.title}', '${question.correctAnswer}')">${option.title}</button>
    `).join('');
    
    document.getElementById('quiz-feedback').classList.add('hidden');
}

// Chọn đáp án quiz
function selectQuizAnswer(selected, correct) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.disabled = true;
        if (option.textContent === correct) {
            option.classList.add('correct');
        } else if (option.textContent === selected && selected !== correct) {
            option.classList.add('incorrect');
        }
    });
    
    const feedback = document.getElementById('quiz-feedback');
    const feedbackText = document.getElementById('feedback-text');
    
    if (selected === correct) {
        appData.currentQuizScore += 5;
        feedbackText.textContent = 'Chính xác! Tuyệt vời!';
        feedbackText.className = 'feedback-text correct';
    } else {
        feedbackText.textContent = `Sai rồi! Đáp án đúng là: ${correct}`;
        feedbackText.className = 'feedback-text incorrect';
    }
    
    document.getElementById('current-score').textContent = appData.currentQuizScore;
    feedback.classList.remove('hidden');
}

// Câu hỏi tiếp theo
function nextQuestion() {
    appData.currentQuizIndex++;
    showNextQuestion();
}

// Hiển thị kết quả quiz
function showQuizResults() {
    const correctAnswers = Math.floor(appData.currentQuizScore / 5);
    const percentage = (correctAnswers / 20) * 100;
    
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('final-score').textContent = appData.currentQuizScore;
    
    let rating, ratingClass;
    if (percentage >= 85) {
        rating = 'Xuất sắc';
        ratingClass = 'rating-excellent';
    } else if (percentage >= 70) {
        rating = 'Giỏi';
        ratingClass = 'rating-good';
    } else if (percentage >= 50) {
        rating = 'Trung bình';
        ratingClass = 'rating-average';
    } else {
        rating = 'Cần cố gắng';
        ratingClass = 'rating-poor';
    }
    
    const ratingElement = document.getElementById('performance-rating');
    ratingElement.textContent = rating;
    ratingElement.className = ratingClass;
    
    document.getElementById('quiz-results').classList.remove('hidden');
    
    // Lưu điểm số
    appData.practiceScores.push(appData.currentQuizScore);
    addRecentActivity(`Hoàn thành quiz - Điểm: ${appData.currentQuizScore}/100`);
    saveUserProgress();
    updateProgressDisplay();
}

// Chuyển đổi loại luyện tập
function changePracticeType(type, event) {
    const areas = document.querySelectorAll(".practice-area");
    areas.forEach(area => area.classList.remove("active"));
    document.getElementById(type).classList.add("active");

    const buttons = document.querySelectorAll(".practice-type");
    buttons.forEach(btn => btn.classList.remove("active"));
    if (event?.currentTarget) {
        event.currentTarget.classList.add("active");
    }

    // Nếu là phần Ghép câu, thì khởi tạo + ẩn feedback cũ
    if (type === "sentence-builder") {
        loadSentenceBuilder();
        const feedback = document.getElementById("sentence-feedback");
        if (feedback) feedback.classList.add("hidden");
    }
}


// Khởi tạo drag drop
function initDragDrop() {
    setupDragDrop();
}

// Thiết lập drag drop
function setupDragDrop() {
    // Chọn ngẫu nhiên 6 bài học từ dữ liệu từ điển
    const randomLessons = dictionaryData.sort(() => 0.5 - Math.random()).slice(0, 6);

    const dragItems = document.getElementById('drag-items');
    const dropTargets = document.getElementById('drop-targets');

    // Tạo các mục có thể kéo (drag items)
    dragItems.innerHTML = randomLessons.map(lesson => `
        <div class="drag-item" draggable="true" data-match="${lesson.id}">${lesson.title}</div>
    `).join('');

    // Tạo các mục đích (drop targets) tương ứng với hình ảnh
    dropTargets.innerHTML = randomLessons.map(lesson => `
        <div class="drop-target" data-target="${lesson.id}">
            <img src="${lesson.image}" alt="${lesson.title}"/>
        </div>
    `).join('');

    // Gán các sự kiện drag và drop cho các phần tử
    const dragItemElements = document.querySelectorAll('.drag-item');
    const dropTargetElements = document.querySelectorAll('.drop-target');

    dragItemElements.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    dropTargetElements.forEach(target => {
        target.addEventListener('dragover', handleDragOver);
        target.addEventListener('drop', handleDrop);
        target.addEventListener('dragenter', handleDragEnter);
        target.addEventListener('dragleave', handleDragLeave);
    });
}

let draggedElement = null;

// Khi bắt đầu kéo một phần tử drag-item
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

// Khi kết thúc thao tác kéo
function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Cho phép phần tử có thể nhận phần tử đang kéo (drop được)
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// Khi phần tử đang kéo đi vào vùng drop
function handleDragEnter(e) {
    this.classList.add('highlight');
}

// Khi phần tử đang kéo rời khỏi vùng drop
function handleDragLeave(e) {
    this.classList.remove('highlight');
}

// Khi phần tử được thả vào mục tiêu
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('highlight');

    if (draggedElement) {
        const draggedId = draggedElement.getAttribute('data-match');
        const targetId = this.getAttribute('data-target');

        if (draggedId === targetId) {
            // Nếu đúng khớp, thêm nội dung vào drop target và ẩn phần tử đã kéo
            const droppedItem = document.createElement('div');
            droppedItem.className = 'dropped-item';
            droppedItem.textContent = draggedElement.textContent;
            this.appendChild(droppedItem);
            draggedElement.style.display = 'none';
        }
    }

    return false;
}


// Reset drag drop
function resetDragDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropTargets = document.querySelectorAll('.drop-target');
    const droppedItems = document.querySelectorAll('.dropped-item');
    
    dragItems.forEach(item => {
        item.style.display = 'block';
    });
    
    dropTargets.forEach(target => {
        target.classList.remove('correct', 'incorrect', 'highlight');
    });
    
    droppedItems.forEach(item => {
        item.remove();
    });
    
    document.getElementById('drag-drop-results').classList.add('hidden');
}

// Kiểm tra drag drop
function checkDragDrop() {
    const dropTargets = document.querySelectorAll('.drop-target');
    let correct = 0;
    let total = 0;
    
    dropTargets.forEach(target => {
        const droppedItem = target.querySelector('.dropped-item');
        if (droppedItem) {
            total++;
            const targetId = target.getAttribute('data-target');
            const lesson = findLessonById(targetId);
            if (lesson && droppedItem.textContent === lesson.title) {
                correct++;
                target.classList.add('correct');
            } else {
                target.classList.add('incorrect');
            }
        }
    });
    
    const score = Math.round((correct / dropTargets.length) * 100);
    const resultsDiv = document.getElementById('drag-drop-results');
    const scoreDiv = document.getElementById('drag-drop-score');
    
    scoreDiv.textContent = `Kết quả: ${correct}/${dropTargets.length} đúng (${score}%)`;
    resultsDiv.classList.remove('hidden');
    
    // Lưu điểm số
    appData.practiceScores.push(score);
    addRecentActivity(`Hoàn thành bài tập kéo thả - Điểm: ${score}%`);
    saveUserProgress();
}

// Khởi tạo flash cards
function initFlashCards() {
    setupFlashCards();
}

// Thiết lập flash cards
function setupFlashCards() {
    // Chỉ lấy các bài học đã hoàn thành hoặc ngẫu nhiên 10 bài
    let availableLessons = appData.completedLessons.length > 0 
        ? dictionaryData.filter(lesson => appData.completedLessons.includes(lesson.id))
        : dictionaryData;
    
    if (availableLessons.length === 0) {
        availableLessons = dictionaryData.slice(0, 10);
    }
    
    appData.flashcardDeck = availableLessons.sort(() => 0.5 - Math.random()).slice(0, 10);
    appData.flashcardIndex = 0;
    
    showCurrentFlashCard();
}

// Hiển thị thẻ flash card hiện tại
function showCurrentFlashCard() {
    if (appData.flashcardDeck.length === 0) return;
    
    const currentCard = appData.flashcardDeck[appData.flashcardIndex];
    const flashcard = document.getElementById('flashcard');
    
    // Reset trạng thái flip
    flashcard.classList.remove('flipped');
    
    // Cập nhật nội dung
    document.getElementById('flashcard-image').src = currentCard.image;
    document.getElementById('flashcard-word').textContent = currentCard.title;
    document.getElementById('flashcard-meaning').textContent = `English: ${currentCard.english}`;
    
    // Cập nhật counter và progress
    const counter = document.getElementById('card-counter');
    counter.textContent = `${appData.flashcardIndex + 1}/${appData.flashcardDeck.length}`;
    
    const progress = ((appData.flashcardIndex + 1) / appData.flashcarecentActivitiesrdDeck.length) * 100;
    const progressBar = document.getElementById('flashcard-progress');
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

// Lật thẻ
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
}

// Thẻ trước
function prevCard() {
    if (appData.flashcardIndex > 0) {
        appData.flashcardIndex--;
        showCurrentFlashCard();
    }
}

// Thẻ sau
function nextCard() {
    if (appData.flashcardIndex < appData.flashcardDeck.length - 1) {
        appData.flashcardIndex++;
        showCurrentFlashCard();
    }
}

// Xáo trộn thẻ
function shuffleCards() {
    appData.flashcardDeck = appData.flashcardDeck.sort(() => 0.5 - Math.random());
    appData.flashcardIndex = 0;
    showCurrentFlashCard();
}

// ==================== GHÉP CÂU BẰNG KÝ HIỆU ====================

const sentences = [
    {
        prompt: "Tôi không sợ",
        correctOrder: ["greeting/IAM.png", "greeting/no.png", "feelings/frightened.png"]
    },
    {
        prompt: "Tôi yêu màu đỏ",
        correctOrder: ["greeting/IAM.png", "feelings/love.png", "colours/red.png"]
    }
];


let currentSentence = null;
function loadSentenceBuilder() {
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    document.getElementById("sentence-prompt").innerText = currentSentence.prompt;

    const shuffled = shuffle([...currentSentence.correctOrder]);

    const pool = document.getElementById("available-signs");
    const dropZone = document.getElementById("sentence-drop-zone");
    pool.innerHTML = '';
    dropZone.innerHTML = '';

    shuffled.forEach(imgName => {
        const img = document.createElement("img");
        img.src = imgName;
        img.draggable = true;
        img.classList.add("sign-img");
        img.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", img.src);
        });
        pool.appendChild(img);
    });
}

// Chỉ gán sự kiện 1 lần duy nhất
document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("sentence-drop-zone");

    dropZone.addEventListener("dragover", (e) => e.preventDefault());

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        const src = e.dataTransfer.getData("text/plain");

        const img = document.createElement("img");
        img.src = src;
        img.classList.add("sign-img");
        dropZone.appendChild(img);

        // Làm mờ và vô hiệu ảnh tương ứng trong pool
        const srcName = src.split("/").pop();
        const poolImgs = document.querySelectorAll("#available-signs img");
        poolImgs.forEach(img => {
            const imgName = img.src.split("/").pop();
            if (imgName === srcName) {
                img.style.opacity = "0.3";
                img.style.pointerEvents = "none";
            }
        });
    });

    // Gọi hàm đầu tiên khi trang tải
    loadSentenceBuilder();
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkSentenceBuilder() {
    const dropZone = document.getElementById("sentence-drop-zone");
    const dropped = Array.from(dropZone.querySelectorAll("img"))
        .map(img => img.src.split("/").pop()); // chỉ lấy tên file

    const expected = currentSentence.correctOrder.map(src => src.split("/").pop()); // chuẩn hóa để trùng kiểu

    const isCorrect = JSON.stringify(dropped) === JSON.stringify(expected);

    const feedback = document.getElementById("sentence-feedback");
    feedback.innerText = isCorrect ? "🎉 Chính xác!" : "❌ Chưa đúng. Hãy thử lại!";
    feedback.classList.remove("hidden");
}


function resetSentenceBuilder() {
    loadSentenceBuilder();
    document.getElementById("sentence-feedback").classList.add("hidden");
}

// Thêm hoạt động gần đây
function addRecentActivity(activity) {
    const now = new Date();
    const timeString = now.toLocaleString('vi-VN');
    
    appData.recentActivities.unshift({
        activity: activity,
        time: timeString
    });

    // Chỉ giữ 10 hoạt động gần nhất
    if (appData.recentActivities.length > 10) {
        appData.recentActivities = appData.recentActivities.slice(0, 10);
    }

    saveUserProgress(); // ➕ lưu ngay khi có thay đổi

    updateRecentActivitiesDisplay();
}


// Cập nhật hiển thị hoạt động gần đây
function updateRecentActivitiesDisplay() {
    const container = document.getElementById('recent-activities');
    
    if (appData.recentActivities.length === 0) {
        container.innerHTML = '<p class="no-activity">Chưa có hoạt động nào được ghi nhận</p>';
        return;
    }
    
    container.innerHTML = appData.recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <p>${activity.activity}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// Lưu tiến trình người dùng
function saveUserProgress() {
    localStorage.setItem('signAppProgress', JSON.stringify(appData));
}


// Tải tiến trình người dùng
function loadUserProgress() {
    const saved = localStorage.getItem('signAppProgress');
    if (saved) {
        const parsed = JSON.parse(saved);
        appData.completedLessons = parsed.completedLessons || [];
        appData.practiceScores = parsed.practiceScores || [];
        appData.recentActivities = parsed.recentActivities || [];
    }
}


// Cập nhật hiển thị tiến trình
function updateProgressDisplay() {
    // Tổng số bài học
    const totalLessons = dictionaryData.length;
    const completedCount = appData.completedLessons.length;
    const completionPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    
    // Cập nhật tổng quan
    document.getElementById('completed-lessons').textContent = completedCount;
    document.getElementById('total-lessons').textContent = totalLessons;
    
    const totalProgress = document.getElementById('total-progress');
    totalProgress.style.width = `${completionPercentage}%`;
    totalProgress.textContent = `${Math.round(completionPercentage)}%`;
    
    // Điểm luyện tập
    const avgScore = appData.practiceScores.length > 0 
        ? Math.round(appData.practiceScores.reduce((a, b) => a + b, 0) / appData.practiceScores.length)
        : 0;
    
    document.getElementById('practice-score').textContent = appData.practiceScores.reduce((a, b) => a + b, 0);
    document.getElementById('average-score').textContent = avgScore;
    
    // Đánh giá tổng thể
    updateOverallRating(completionPercentage, avgScore);
    
    // Cập nhật tiến trình theo danh mục
    updateCategoryProgress();
    
    // Cập nhật hoạt động gần đây
    updateRecentActivitiesDisplay();
}

// Cập nhật đánh giá tổng thể
function updateOverallRating(completionPercentage, avgScore) {
    const overallScore = (completionPercentage * 0.6) + (avgScore * 0.4);
    
    let rating, description, ratingClass;
    
    if (overallScore >= 85) {
        rating = 'Xuất sắc';
        description = 'Bạn đã thành thạo ngôn ngữ ký hiệu! Hãy tiếp tục duy trì và chia sẻ kiến thức.';
        ratingClass = 'rating-excellent';
    } else if (overallScore >= 70) {
        rating = 'Giỏi';
        description = 'Bạn đã có nền tảng vững chắc! Hãy luyện tập thêm để đạt trình độ cao hơn.';
        ratingClass = 'rating-good';
    } else if (overallScore >= 50) {
        rating = 'Trung bình';
        description = 'Bạn đang tiến bộ tốt! Hãy hoàn thành thêm bài học và luyện tập nhiều hơn.';
        ratingClass = 'rating-average';
    } else if (overallScore >= 25) {
        rating = 'Cần cố gắng';
        description = 'Bạn mới bắt đầu! Hãy kiên trì học tập và luyện tập đều đặn.';
        ratingClass = 'rating-poor';
    } else {
        rating = 'Mới bắt đầu';
        description = 'Chào mừng bạn đến với hành trình học ngôn ngữ ký hiệu! Hãy bắt đầu với các bài học cơ bản.';
        ratingClass = 'rating-poor';
    }
    
    const ratingElement = document.getElementById('overall-rating');
    const descriptionElement = document.getElementById('rating-description');
    
    ratingElement.textContent = rating;
    ratingElement.className = ratingClass;
    descriptionElement.textContent = description;
}

// Cập nhật tiến trình theo danh mục
function updateCategoryProgress() {
    Object.keys(lessonData).forEach(category => {
        const categoryLessons = lessonData[category];
        const completedInCategory = categoryLessons.filter(lesson => 
            appData.completedLessons.includes(lesson.id)
        ).length;
        
        const completionElement = document.getElementById(`${category}-completion`);
        const barElement = document.getElementById(`${category}-bar`);
        
        if (completionElement && barElement) {
            const percentage = categoryLessons.length > 0 
                ? (completedInCategory / categoryLessons.length) * 100 
                : 0;
            
            completionElement.textContent = `${completedInCategory}/${categoryLessons.length}`;
            barElement.style.width = `${percentage}%`;
        }
    });
}












