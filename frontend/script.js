
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initLessons();
    initDictionary();
    initPracticeArea();
    loadUserProgress();
    updateProgressDisplay();
    renderLessonsByCategory();
})



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
        { id: 'lesson-a', title: 'Chữ A', image: '/frontend/images/A-Z/a.png', description: 'Nắm chặt bàn tay, chỉ để ngón cái dựng đứng.', english: 'A', category: 'alphabet' },
        { id: 'lesson-b', title: 'Chữ B', image: '/frontend/images/A-Z/b.png', description: 'Duỗi thẳng 4 ngón tay và khép lại, ngón cái gập vào lòng bàn tay.', english: 'B', category: 'alphabet' },
        { id: 'lesson-c', title: 'Chữ C', image: '/frontend/images/A-Z/c.png', description: 'Uốn cong bàn tay tạo hình chữ C.', english: 'C', category: 'alphabet' },
        { id: 'lesson-d', title: 'Chữ D', image: '/frontend/images/A-Z/d.png', description: 'Ngón trỏ duỗi thẳng, các ngón khác khép lại chạm ngón cái.', english: 'D', category: 'alphabet' },
        { id: 'lesson-e', title: 'Chữ E', image: '/frontend/images/A-Z/e.png', description: 'Tất cả các ngón tay khép lại, chạm vào lòng bàn tay.', english: 'E', category: 'alphabet' },
        { id: 'lesson-f', title: 'Chữ F', image: '/frontend/images/A-Z/f.png', description: 'Ngón trỏ và ngón cái chạm nhau tạo hình tròn, ba ngón còn lại duỗi thẳng.', english: 'F', category: 'alphabet' },
        { id: 'lesson-g', title: 'Chữ G', image: '/frontend/images/A-Z/g.png', description: 'Ngón trỏ và ngón cái duỗi ra, các ngón khác khép lại.', english: 'G', category: 'alphabet' },
        { id: 'lesson-h', title: 'Chữ H', image: '/frontend/images/A-Z/h.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng và song song.', english: 'H', category: 'alphabet' },
        { id: 'lesson-i', title: 'Chữ I', image: '/frontend/images/A-Z/i.png', description: 'Chỉ ngón út duỗi thẳng, các ngón khác khép lại.', english: 'I', category: 'alphabet' },
        { id: 'lesson-j', title: 'Chữ J', image: '/frontend/images/A-Z/j.png', description: 'Tương tự chữ I nhưng có chuyển động cong.', english: 'J', category: 'alphabet' },
        { id: 'lesson-k', title: 'Chữ K', image: '/frontend/images/A-Z/k.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng tạo hình chữ V, ngón cái đặt giữa.', english: 'K', category: 'alphabet' },
        { id: 'lesson-l', title: 'Chữ L', image: '/frontend/images/A-Z/l.png', description: 'Ngón trỏ và ngón cái tạo góc vuông.', english: 'L', category: 'alphabet' },
        { id: 'lesson-m', title: 'Chữ M', image: '/frontend/images/A-Z/m.png', description: 'Ba ngón tay đầu khép lại, ngón cái đặt dưới.', english: 'M', category: 'alphabet' },
        { id: 'lesson-n', title: 'Chữ N', image: '/frontend/images/A-Z/n.png', description: 'Hai ngón tay đầu khép lại, ngón cái đặt dưới.', english: 'N', category: 'alphabet' },
        { id: 'lesson-o', title: 'Chữ O', image: '/frontend/images/A-Z/o.png', description: 'Tất cả các ngón tay tạo hình tròn.', english: 'O', category: 'alphabet' },
        { id: 'lesson-p', title: 'Chữ P', image: '/frontend/images/A-Z/p.png', description: 'Tương tự chữ K nhưng hướng xuống dưới.', english: 'P', category: 'alphabet' },
        { id: 'lesson-q', title: 'Chữ Q', image: '/frontend/images/A-Z/q.png', description: 'Tương tự chữ G nhưng hướng xuống dưới.', english: 'Q', category: 'alphabet' },
        { id: 'lesson-r', title: 'Chữ R', image: '/frontend/images/A-Z/r.png', description: 'Ngón trỏ và ngón giữa chéo nhau.', english: 'R', category: 'alphabet' },
        { id: 'lesson-s', title: 'Chữ S', image: '/frontend/images/A-Z/s.png', description: 'Nắm tay, ngón cái đặt trên các ngón khác.', english: 'S', category: 'alphabet' },
        { id: 'lesson-t', title: 'Chữ T', image: '/frontend/images/A-Z/t.png', description: 'Ngón cái đặt giữa ngón trỏ và ngón giữa.', english: 'T', category: 'alphabet' },
        { id: 'lesson-u', title: 'Chữ U', image: '/frontend/images/A-Z/u.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng và khép lại.', english: 'U', category: 'alphabet' },
        { id: 'lesson-v', title: 'Chữ V', image: '/frontend/images/A-Z/v.png', description: 'Ngón trỏ và ngón giữa duỗi thẳng tách ra tạo hình chữ V.', english: 'V', category: 'alphabet' },
        { id: 'lesson-w', title: 'Chữ W', image: '/frontend/images/A-Z/w.png', description: 'Ba ngón đầu duỗi thẳng tách ra.', english: 'W', category: 'alphabet' },
        { id: 'lesson-x', title: 'Chữ X', image: '/frontend/images/A-Z/x.png', description: 'Ngón trỏ cong như móc câu.', english: 'X', category: 'alphabet' },
        { id: 'lesson-y', title: 'Chữ Y', image: '/frontend/images/A-Z/y.png', description: 'Ngón cái và ngón út duỗi ra, các ngón khác khép lại.', english: 'Y', category: 'alphabet' },
        { id: 'lesson-z', title: 'Chữ Z', image: '/frontend/images/A-Z/z.png', description: 'Ngón trỏ duỗi thẳng và vẽ chữ Z trong không khí.', english: 'Z', category: 'alphabet' }
    ],
    numbers: [
    { id: 'lesson-1', title: 'Số 1', image: '/frontend/images/1-10/1.png', description: 'Giơ ngón trỏ lên.', english: 'One', category: 'numbers' },
    { id: 'lesson-2', title: 'Số 2', image: '/frontend/images/1-10/2.png', description: 'Giơ ngón trỏ và ngón giữa.', english: 'Two', category: 'numbers' },
    { id: 'lesson-3', title: 'Số 3', image: '/frontend/images/1-10/3.png', description: 'Giơ ngón cái, ngón trỏ và ngón giữa.', english: 'Three', category: 'numbers' },
    { id: 'lesson-4', title: 'Số 4', image: '/frontend/images/1-10/4.png', description: 'Giơ bốn ngón tay, khép ngón cái.', english: 'Four', category: 'numbers' },
    { id: 'lesson-5', title: 'Số 5', image: '/frontend/images/1-10/5-Photoroom.png', description: 'Duỗi thẳng tất cả năm ngón tay.', english: 'Five', category: 'numbers' },
    { id: 'lesson-6', title: 'Số 6', image: '/frontend/images/1-10/6-Photoroom.png', description: 'Khép ngón út, duỗi các ngón khác.', english: 'Six', category: 'numbers' },
    { id: 'lesson-7', title: 'Số 7', image: '/frontend/images/1-10/7-Photoroom.png', description: 'Khép ngón áp út, duỗi các ngón khác.', english: 'Seven', category: 'numbers' },
    { id: 'lesson-8', title: 'Số 8', image: '/frontend/images/1-10/8-Photoroom.png', description: 'Khép ngón giữa, duỗi các ngón khác.', english: 'Eight', category: 'numbers' },
    { id: 'lesson-9', title: 'Số 9', image: '/frontend/images/1-10/9-Photoroom.png', description: 'Khép ngón trỏ, duỗi các ngón khác.', english: 'Nine', category: 'numbers' },
    { id: 'lesson-10', title: 'Số 10', image: '/frontend/images/1-10/10-Photoroom.png', description: 'Nắm tay lại rồi giơ ngón cái lên.', english: 'Ten', category: 'numbers' }
    ],
    greetings: [
    { id: 'lesson-hello', title: 'Xin Chào', image: '/frontend/images/greeting/hello.png', description: 'Mở rộng bàn tay phải với lòng bàn tay hướng về phía mặt, đưa lên ngang trán và vẫy nhẹ từ trái sang phải.', english: 'Hello', category: 'greetings' },
    { id: 'lesson-myname', title: 'Tên Tôi Là', image: '/frontend/images/greeting/mynameis.png', description: 'Đặt bàn tay phải mở rộng lên ngực với các ngón tay hướng về phía cổ, sau đó chỉ thẳng về phía người đối diện bằng ngón tay trỏ.', english: 'My name is', category: 'greetings' },
    { id: 'lesson-thank', title: 'Cảm Ơn', image: '/frontend/images/greeting/thank.png', description: 'Đặt bàn tay phải mở rộng với lòng bàn tay hướng xuống dưới, chạm nhẹ vào môi rồi đưa thẳng ra phía trước về hướng người đối diện.', english: 'Thank you', category: 'greetings' },
    { id: 'lesson-sorry', title: 'Xin Lỗi', image: '/frontend/images/greeting/sorry.png', description: 'Nắm tay phải thành nắm đấm, đặt lên ngực và xoay theo chuyển động tròn nhẹ nhàng trên vùng tim.', english: 'Please/Sorry', category: 'greetings' },
    { id: 'lesson-yes', title: 'Có', image: '/frontend/images/greeting/yes.png', description: 'Nắm tay phải thành nắm đấm với ngón cái duỗi thẳng hướng lên trên, gật nắm tay lên xuống như động tác gật đầu.', english: 'Yes', category: 'greetings' },
    { id: 'lesson-no', title: 'Không', image: '/frontend/images/greeting/no.png', description: 'Đưa bàn tay phải với ngón tay trỏ và ngón giữa duỗi thẳng, vẫy từ trái sang phải ở trước mặt như động tác lắc đầu.', english: 'No', category: 'greetings' },
    { id: 'lesson-love', title: 'Tôi Yêu Bạn', image: '/frontend/images/greeting/iloveyou.png', description: 'Đưa bàn tay phải lên với ngón cái, ngón trỏ và ngón út duỗi thẳng, ngón giữa và ngón áp út cong xuống, hướng về phía người đối diện.', english: 'I love you', category: 'greetings' },
    { id: 'lesson-help', title: 'Giúp Đỡ', image: '/frontend/images/greeting/help.png', description: 'Nắm tay trái thành nắm đấm với ngón cái duỗi lên trên, đặt bàn tay phải mở rộng dưới nắm tay trái và nâng cả hai tay lên trên.', english: 'Help', category: 'greetings' },
    { id: 'lesson-stop', title: 'Dừng Lại', image: '/frontend/images/greeting/stop.png', description: 'Đưa bàn tay thẳng về phía trước với lòng bàn tay hướng ra ngoài.', english: 'Stop', category: 'greetings' }
    ],
    people: [
    { id: 'lesson-mother', title: 'Mẹ', image: '/frontend/images/people/mother.png', description: ' Đầu ngón cái tay phải chạm vào phần dưới của cằm (lòng bàn tay mở).', english: 'Mother', category: 'people' },
    { id: 'lesson-father', title: 'Bố', image: '/frontend/images/people/father.png', description: 'Đầu ngón cái tay phải chạm vào trán (lòng bàn tay mở, các ngón xòe ra).', english: 'Father', category: 'people' },
    { id: 'lesson-sister', title: 'Chị/Em gái', image: '/frontend/images/people/sister.png', description: 'Chạm ngón cái của tay phải lên cằm (giống từ "girl"), sau đó đưa tay ra trước, kết thúc bằng động tác hai tay tạo hình súng và chạm nhau.', english: 'Sister', category: 'people' },
    { id: 'lesson-brother', title: 'Anh/Em trai', image: '/frontend/images/people/brother.png', description: 'Đầu ngón cái tay phải chạm trán (giống từ "boy"), sau đó hai tay tạo hình súng và chạm nhau như với "sister".', english: 'Brother', category: 'people' },
    { id: 'lesson-grandmother', title: 'Bà', image: '/frontend/images/people/grandma.png', description: 'Làm dấu “mother” nhưng tay di chuyển ra phía trước hai lần.', english: 'Grandmother', category: 'people' },
    { id: 'lesson-grandfather', title: 'Ông', image: '/frontend/images/people/grandpa.png', description: 'Làm dấu “father” rồi đẩy tay ra phía trước hai lần.', english: 'Grandfather', category: 'people' },
    { id: 'lesson-child-boy', title: 'Bé trai', image: '/frontend/images/people/boy.png', description: 'Dùng tay như đang cầm mũ lưỡi trai (tay đặt ở trán, ngón cái và các ngón mở rộng như đang kẹp và mở).', english: 'Boy', category: 'people' },
    { id: 'lesson-child-girl', title: 'Bé gái', image: '/frontend/images/people/girl.png', description: 'Nắm tay lại, chà nhẹ khớp ngón cái dọc theo cằm (từ tai đến cằm).', english: 'Girl', category: 'people' },
    { id: 'lesson-baby', title: 'Em bé', image: '/frontend/images/people/baby.png', description: 'Đặt hai tay dưới dạng đang bồng trẻ, sau đó nhẹ nhàng đung đưa như đang ru em bé.', english: 'Baby', category: 'people' },
    { id: 'lesson-family', title: 'Gia đình', image: '/frontend/images/people/family.png', description: 'Hai tay tạo hình chữ “F” (ngón trỏ và ngón cái chạm nhau tạo vòng tròn), hai tay đối diện nhau, rồi xoay tròn một vòng để kết thúc vị trí hai chữ F sát nhau.', english: 'Family', category: 'people' },
    { id: 'lesson-friend', title: 'Bạn', image: '/frontend/images/people/friend.png', description: 'Móc ngón trỏ tay này vào ngón trỏ tay kia, rồi đổi chiều và móc lại lần nữa.', english: 'Friend', category: 'people' },
    { id: 'lesson-teacher', title: 'Giáo viên', image: '/frontend/images/people/teacher.png', description: 'Đưa hai tay (các ngón khép lại) lên gần trán như đang “mở đầu ra”, sau đó đưa hai bàn tay xuống hai bên giống như chỉ người.', english: 'Teacher', category: 'people' },
    { id: 'lesson-neighbor', title: 'Hàng xóm', image: '/frontend/images/people/neighbor.png', description: 'Hai bàn tay hướng về nhau như cái bắt tay nhưng không chạm, sau đó nhấn nhẹ một tay vào tay kia.', english: 'Neighbor', category: 'people' },
    { id: 'lesson-woman', title: 'Phụ nữ', image: '/frontend/images/people/woman.png', description: 'Đầu ngón cái tay phải chạm vào cằm, rồi di chuyển xuống chạm nhẹ lên ngực (vùng ngực trên).', english: 'Woman', category: 'people' },
    { id: 'lesson-man', title: 'Đàn ông', image: '/frontend/images/people/man.png', description: 'Đầu ngón cái chạm trán (giống “father”), sau đó tay mở ra và hạ xuống trước ngực.', english: 'Man', category: 'people' }
],

emotions: [
    { id: 'lesson-frightened', title: 'Sợ hãi', image: '/frontend/images/feelings/frightened.png', description: 'Đưa hai tay nắm lại trước ngực, sau đó bật mở ra như bị hoảng hốt. Gương mặt hoang mang.', english: 'Frightened', category: 'emotions' },
    { id: 'lesson-happy', title: 'Vui vẻ', image: '/frontend/images/feelings/happy.png', description: 'Dùng lòng bàn tay xoa nhẹ lên ngực theo chuyển động tròn hướng lên, nét mặt tươi sáng.', english: 'Happy', category: 'emotions' },
    { id: 'lesson-sad', title: 'Buồn', image: '/frontend/images/feelings/sad.png', description: 'Mở bàn tay và kéo từ trên mặt xuống, biểu cảm trầm lặng và buồn bã.', english: 'Sad', category: 'emotions' },
    { id: 'lesson-very-good', title: 'Rất tốt', image: '/frontend/images/feelings/very-good.png', description: 'Giơ hai ngón cái lên, nở nụ cười tươi thể hiện sự tích cực.', english: 'Very good', category: 'emotions' },
    { id: 'lesson-angry', title: 'Giận dữ', image: '/frontend/images/feelings/angry.png', description: 'Đưa tay lên phía trước dạng vuốt cong, như cơn giận đang dâng trào. Gương mặt nghiêm lại hoặc cau mày.', english: 'Angry', category: 'emotions' },
    { id: 'lesson-excited', title: 'Hào hứng', image: '/frontend/images/feelings/excited.png', description: 'Đặt hai tay mở gần ngực, ngón giữa chạm nhẹ vào ngực và di chuyển lên xuống luân phiên. Khuôn mặt rạng rỡ.', english: 'Excited', category: 'emotions' },
    { id: 'lesson-love1', title: 'Yêu thương', image: '/frontend/images/feelings/love.png', description: 'Khoanh tay trước ngực như đang ôm người mình thương, kết hợp ánh mắt dịu dàng.', english: 'Love', category: 'emotions' }
],

colors: [
    { id: 'lesson-green', title: 'Màu lục', image: '/frontend/images/colours/green.png', description: 'Tay hình chữ G lắc nhẹ gần má.', english: 'Green', category: 'colors' },
    { id: 'lesson-blue', title: 'Màu lam', image: '/frontend/images/colours/blue.png', description: 'Tay hình chữ B lắc nhẹ trước vai.', english: 'Blue', category: 'colors' },
    { id: 'lesson-yellow', title: 'Màu vàng', image: '/frontend/images/colours/yellow.png', description: 'Tay chữ Y lắc nhẹ gần cằm.', english: 'Yellow', category: 'colors' },
    { id: 'lesson-red', title: 'Màu đỏ', image: '/frontend/images/colours/red.png', description: 'Ngón trỏ chạm môi rồi hạ xuống.', english: 'Red', category: 'colors' },
    { id: 'lesson-white', title: 'Màu trắng', image: '/frontend/images/colours/white.png', description: 'Mở tay ở ngực, kéo ra rồi khép các ngón.', english: 'White', category: 'colors' },
    { id: 'lesson-black', title: 'Màu đen', image: '/frontend/images/colours/black.png', description: 'Ngón trỏ quét ngang trán.', english: 'Black', category: 'colors' }
],

places: [
    { id: 'lesson-school', title: 'Trường học', image: '/frontend/images/places/school.png', description: 'Ngón trỏ quét ngang trán.', english: 'School', category: 'places' },
    { id: 'lesson-restaurant', title: 'Nhà hàng', image: '/frontend/images/places/restaurant.png', description: '_________', english: 'Restaurant', category: 'places' },
    { id: 'lesson-hospital', title: 'Bệnh viện', image: '/frontend/images/places/hospital.png', description: '_________', english: 'Hospital', category: 'places' },
    { id: 'lesson-hotel', title: 'Khách sạn', image: '/frontend/images/places/hotel.png', description: '_________', english: 'Hotel', category: 'places' },
    { id: 'lesson-home', title: 'Nhà', image: '/frontend/images/places/home.png', description: '_________', english: 'Home', category: 'places' }
],
others: [
    { id: 'lesson-eat', title: 'Ăn', image: '/frontend/images/others/eat.png', description: '_______', english: 'Eat', category: 'others' },
    { id: 'lesson-drink', title: 'Uống', image: '/frontend/images/others/drink.png', description: '_______', english: 'Drink', category: 'others' },
    { id: 'lesson-learn', title: 'Học', image: '/frontend/images/others/learn.png', description: '_______', english: 'Learn', category: 'others' },
    { id: 'lesson-book', title: 'Quyển Sách', image: '/frontend/images/others/book.png', description: '_______', english: 'Book', category: 'others' },
    { id: 'lesson-water', title: 'Nước', image: '/frontend/images/others/water.png', description: '_______', english: 'Water', category: 'others' }
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
    ...lessonData.others
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
    const audio = new Audio(`/frontend/audio/${lessonId}.mp3`);
    audio.play().catch(error => {
        console.error(`Không thể phát âm thanh cho ${lessonId}:`, error);
    });
}

// ---------KHỞI TẠO TỪ ĐIỂN---------
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
        others: "Hành động"
    };
    return names[category] || category;
}




// === BIẾN TOÀN CỤC ===
let video = null;
let canvas = null;
let cameraResultEl = null;
let stream = null;
let capturedImageBlob = null; // Ảnh chụp từ camera dạng blob

// === KHỞI TẠO ===
window.addEventListener('DOMContentLoaded', () => {
    video = document.getElementById('camera-feed');
    canvas = document.getElementById('camera-canvas');
    cameraResultEl = document.getElementById('camera-result');
});



// === CAMERA MODE ===
// Mở camera
async function startCamera() {
    if (!video || !cameraResultEl) return;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        video.srcObject = stream;
        await video.play();

        cameraResultEl.innerHTML = `<div style="color: green; font-weight: bold;">✅ Camera đã sẵn sàng. Nhấn \"Chụp ảnh\".</div>`;
    } catch (err) {
        console.error("Không thể truy cập camera:", err);
        cameraResultEl.innerHTML = `<div style="color:#d32f2f; font-weight: bold;">❌ Không thể truy cập camera: ${err.message}</div>`;
    }
}

// Dừng camera
function stopCamera() {
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
}

// Đảm bảo video sẵn sàng để chụp
async function ensureVideoReady() {
    return new Promise(resolve => {
        if (video.readyState >= 2 && video.videoWidth > 0) {
            resolve();
        } else {
            const check = setInterval(() => {
                if (video.readyState >= 2 && video.videoWidth > 0) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        }
    });
}

// Chụp ảnh từ camera sau 5 giây đếm ngược
async function captureImage() {
    if (!video || !canvas || !cameraResultEl) return;

    cameraResultEl.innerHTML = `
        <div style="color: #f57c00; font-weight: bold;">
            🕐 Hãy chuẩn bị động tác tay. Máy sẽ chụp sau <strong>5 giây</strong>...
        </div>
    `;

    const countdownEl = document.getElementById('countdown-overlay');
    let count = 5;
    countdownEl.style.display = 'block';
    countdownEl.textContent = count;

    const countdownInterval = setInterval(async () => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownEl.style.display = 'none';

            await ensureVideoReady();

            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                if (!blob) {
                    cameraResultEl.innerHTML = `<div style=\"color:#d32f2f\">❌ Không thể tạo ảnh từ camera.</div>`;
                    return;
                }
                capturedImageBlob = blob;
                const previewUrl = URL.createObjectURL(blob);
                cameraResultEl.innerHTML = `
                    <div style=\"color: green; font-weight: bold;\">✅ Ảnh vừa chụp:</div>
                    <img src="${previewUrl}" style="max-width:200px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #0002;">
                    <div style="margin-top:8px;">Nhấn \"Gửi và dịch\" để nhận kết quả.</div>
                `;
            }, "image/jpeg");
        }
    }, 1000);
}

// Gửi ảnh đã chụp lên Flask API để nhận kết quả
async function captureAndTranslate() {
    if (!capturedImageBlob) {
        cameraResultEl.innerHTML = `<div style="color:#d32f2f">Bạn chưa chụp ảnh nào.</div>`;
        return;
    }

    try {
        cameraResultEl.innerHTML = '<div>⏳ Đang gửi ảnh...</div>';

        const formData = new FormData();
        formData.append("image", capturedImageBlob, "capture.jpg");

        // Thay thế URL dưới đây bằng đường dẫn backend Flask của bạn trên Render
        const API_URL = "https://sign-language-api.onrender.com/detect_image";

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi máy chủ: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const result = data.result || "Không nhận dạng được";

        cameraResultEl.innerHTML = `
            <div>Ký hiệu:</div>
            <div style="font-size: 24px; font-weight: bold;">${result}</div>
        `;

        // Nếu bạn muốn phát âm thanh tương ứng
        playAudioForResult(result);

    } catch (error) {
        cameraResultEl.innerHTML = `<div style="color:#d32f2f">Lỗi khi gửi ảnh: ${error.message}</div>`;
    }
}



// === TEST API MODE (Tải ảnh từ file) ===
function initTestAPIMode() {
    const fileInput = document.getElementById('testapi-fileInput');
    const previewEl = document.getElementById('testapi-preview');
    const sendBtn = document.getElementById('testapi-sendBtn');
    const resultEl = document.getElementById('testapi-result');

    if (!fileInput || !previewEl || !sendBtn || !resultEl) return;

    previewEl.innerHTML = '';
    resultEl.innerHTML = '';

    if (!fileInput.dataset.bound) {
        fileInput.addEventListener('change', () => previewImage(fileInput, previewEl));
        fileInput.dataset.bound = "true";
    }

    if (!sendBtn.dataset.bound) {
        sendBtn.addEventListener('click', () => sendImageToAPI(fileInput, resultEl));
        sendBtn.dataset.bound = "true";
    }
}

function previewImage(fileInput, previewEl) {
    previewEl.innerHTML = '';
    if (fileInput.files.length) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            previewEl.innerHTML = `<img src="${e.target.result}" style="max-width:200px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #0002;">`;
        };
        reader.readAsDataURL(file);
    }
}

//Gửi ảnh từ input đến Flask API và chuyển kết quả sang hàm hiển thị//
async function sendImageToAPI(fileInput, resultEl) {
    if (!fileInput.files.length) {
        alert('Vui lòng chọn một ảnh để gửi!');
        return;
    }

    const file = fileInput.files[0];
    resultEl.innerHTML = '<div class="loading-message">⏳ Đang gửi ảnh lên API...</div>';

    try {
        const base64Image = await toBase64(file);

        const response = await fetch("https://your-backend-url.onrender.com/detect_image", {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const result = data.result || "Không nhận diện được tay";

        // ✅ Gọi hàm hiển thị và xử lý lưu
        displayTestApiResult(result, resultEl, null, base64Image);

    } catch (error) {
        displayTestApiResult(null, resultEl, error.message);
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

function displayTestApiResult(result, resultEl, errorMessage = null, imageData = null) {
    const saveBox = document.getElementById('testapi-saveBox');
    const saveBtn = document.getElementById('testapi-saveBtn');
    let html = '';

    if (errorMessage) {
        html = `<div class="result-error">⚠️ Lỗi: ${errorMessage}</div>`;
        saveBox.classList.add("hidden");
    } else if (!result || result.trim().toLowerCase() === 'không nhận diện được tay') {
        html = `<div class="result-failed">❌ Không nhận diện được tay.</div>`;
        saveBox.classList.add("hidden");
    } else {
        html = `
            <div class="result-success">✅ Ký hiệu nhận dạng: 
                <strong style="font-size: 20px">${result}</strong>
            </div>`;
        saveBox.classList.remove("hidden");

        if (saveBtn && imageData) {
            saveBtn.onclick = () => {
                // ✅ Lưu cả vào bộ đơn giản lẫn appData
                saveRecognizedImage(imageData, result);
                saveTestApiResult(result, imageData);
                saveBox.classList.add("hidden");
            };
        }
    }

    resultEl.innerHTML = html;
}

function saveRecognizedImage(imageData, result) {
    if (!imageData || !result) return;
    const storageKey = 'recognizedImages';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');

    existing.unshift({
        image: imageData,
        result,
        timestamp: Date.now()
    });

    if (existing.length > 30) existing.pop(); // Giới hạn tối đa 30 ảnh

    localStorage.setItem(storageKey, JSON.stringify(existing));
}

function saveTestApiResult(imageData, result) {
    if (!imageData || !result) return;

    // 1. Lưu vào localStorage
    const storageKey = 'recognizedImages';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');

    existing.unshift({
        image: imageData,
        result,
        timestamp: Date.now()
    });

    if (existing.length > 30) existing.pop();
    localStorage.setItem(storageKey, JSON.stringify(existing));

    // 2. Lưu vào hoạt động gần đây
    addRecentActivity({
        type: 'recognition',
        image: imageData,
        result: result
    });
}


// === CHUYỂN CHẾ ĐỘ TỪ ĐIỂN ===
function switchDictionaryMode(mode) {
    if (mode === 'testapi') {
        initTestAPIMode();
    }

    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.mode-btn[onclick*="${mode}"]`).classList.add('active');

    document.querySelectorAll('.dictionary-mode').forEach(div => div.classList.remove('active'));
    const modeDiv = document.getElementById(`${mode}-mode`);
    if (modeDiv) modeDiv.classList.add('active');

    if (mode === 'camera') {
        startCamera();
    } else {
        stopCamera?.();
    }

    if (mode === 'testapi') {
        window.restoreTestAPIPreview?.();
    }
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
        correctOrder: ["images/greeting/IAM.png", "images/greeting/no.png", "images/feelings/frightened.png"]
    },
    {
        prompt: "Tôi yêu màu đỏ",
        correctOrder: ["images/greeting/IAM.png", "images/feelings/love.png", "images/colours/red.png"]
    },
    {
        prompt: "Tôi học ngôn ngữ ký hiệu ASL",
        correctOrder: ["images/greeting/IAM.png", "images/others/learn.png", "images/A-Z/a.png", "A-Z/s.png", "images/A-Z/l.png"]
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

// ================== Thêm hoạt động gần đây ==================
function addRecentActivity(activity) {
    const now = new Date();
    const timeString = now.toLocaleString('vi-VN');

    if (!appData.recentActivities) appData.recentActivities = [];

    // Nếu activity là object có image và result, đưa thẳng các trường vào item
    if (typeof activity === 'object' && activity.image && activity.result) {
        appData.recentActivities.unshift({
            type: 'recognition',
            image: activity.image,
            result: activity.result,
            time: timeString
        });
    } else {
        // Còn lại coi như là chuỗi hoạt động mô tả
        appData.recentActivities.unshift({
            activity,
            time: timeString
        });
    }

    // Giới hạn 10 hoạt động gần đây
    if (appData.recentActivities.length > 10) {
        appData.recentActivities = appData.recentActivities.slice(0, 10);
    }

    saveUserProgress();
    updateRecentActivitiesDisplay();
}





// ================== Hiển thị hoạt động gần đây ==================
function updateRecentActivitiesDisplay() {
    const list = document.getElementById('recent-activities');
    list.innerHTML = '';

    if (!appData.recentActivities || appData.recentActivities.length === 0) {
        list.innerHTML = '<p class="no-activity">Chưa có hoạt động nào được ghi nhận</p>';
        return;
    }

    appData.recentActivities.forEach(item => {
        const div = document.createElement('div');
        div.className = 'activity-item';

        if (item.image && item.result) {
            div.innerHTML = `
                <p><strong>${item.time}</strong></p>
                <img src="${item.image}" alt="Ảnh nhận diện" class="activity-image" style="max-height: 100px; margin: 5px 0;">
                <p>Kết quả: <strong>${item.result}</strong></p>
            `;
        } else if (item.activity) {
            div.innerHTML = `<p><strong>${item.time}</strong>: ${item.activity}</p>`;
        }

        list.appendChild(div);
    });
}




// ================== Lưu tiến trình người dùng vào localStorage ==================
function saveUserProgress() {
    localStorage.setItem('signAppProgress', JSON.stringify(appData));
}


// ================== Tải tiến trình người dùng từ localStorage ==================
function loadUserProgress() {
    const saved = localStorage.getItem('signAppProgress');
    if (saved) {
        const parsed = JSON.parse(saved);
        appData.completedLessons = parsed.completedLessons || [];
        appData.practiceScores = parsed.practiceScores || [];
        appData.recentActivities = parsed.recentActivities || [];
    } else {
        // Nếu không có dữ liệu, khởi tạo trống
        appData.completedLessons = [];
        appData.practiceScores = [];
        appData.recentActivities = [];
    }
}

function showRecognizedImagesInProgress() {
    const saved = loadRecognizedImages();
    saved.slice(0, 10).forEach(entry => {
        addRecentActivity({
            type: 'recognition',
            image: entry.image,
            result: entry.result
        });
    });
}


function loadRecognizedImages() {
    const storageKey = 'recognizedImages';
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Không thể phân tích dữ liệu recognizedImages:', e);
            return [];
        }
    }

    return [];
}


// ================== Cập nhật tiến trình tổng thể và hoạt động gần đây ==================
function updateProgressDisplay() {
    const totalLessons = dictionaryData.length;
    const completedCount = appData.completedLessons.length;
    const completionPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    // Tổng quan
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

    // Cập nhật tiến trình từng danh mục
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


// ================== Cập nhật tiến trình từng danh mục bài học ==================
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













