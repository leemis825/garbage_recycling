// src/recyclingData.js

export const recyclingData = {
  cardboard: {
    title: "종이상자류",
    category: "재활용품",
    color: "#d35400",
    steps: [
      { step: 1, title: "테이프, 스티커 제거", description: "박스에 붙은 모든 테이프, 운송장 스티커를 완전히 제거해주세요.", icon: "✂️" },
      { step: 2, title: "납작하게 접기", description: "상자를 평평하게 펼쳐서 부피를 줄여주세요.", icon: "📦" },
      { step: 3, title: "끈으로 묶어 배출", description: "흩날리지 않도록 끈으로 묶어서 배출합니다.", icon: "📚" },
    ],
    tips: ["물이나 음식물로 오염된 골판지는 재활용이 불가능합니다."],
    schedule: {
      day: "금요일, 토요일",
      time: "평일 06:00 ~ 15:00, 토요일 06:00 ~ 12:00 (공휴일 제외)",
      location: "지정된 재활용 수거함",
    },
  },
  glass: {
    title: "유리병",
    category: "재활용품",
    color: "#2ecc71",
    steps: [
      { step: 1, title: "내용물 비우고 헹구기", description: "병 안의 내용물을 완전히 비우고 물로 헹궈주세요.", icon: "🚰" },
      { step: 2, title: "뚜껑 제거", description: "금속 또는 플라스틱 뚜껑을 제거하여 별도 배출해주세요.", icon: "🔄" },
      { step: 3, title: "깨지지 않게 배출", description: "깨진 유리는 신문지에 싸서 종량제 봉투에 버려주세요.", icon: "🗞️" },
    ],
    tips: ["거울, 도자기, 사기그릇, 내열유리 등은 재활용이 아니므로 종량제 봉투에 버려야 합니다."],
    schedule: {
      day: "화요일, 목요일",
      time: "평일 06:00 ~ 15:00, 토요일 06:00 ~ 12:00 (공휴일 제외)",
      location: "지정된 재활용 수거함 (공병)",
    },
  },
  metal: {
    title: "캔/고철류",
    category: "재활용품",
    color: "#95a5a6",
    steps: [
      { step: 1, title: "내용물 비우고 헹구기", description: "캔 안의 내용물을 깨끗하게 비우고 물로 헹궈주세요.", icon: "🚰" },
      { step: 2, title: "압착하여 배출", description: "가능하다면 발로 밟아 부피를 줄여주세요.", icon: "🦶" },
      { step: 3, title: "가스 용기 처리", description: "부탄가스, 살충제 용기는 구멍을 뚫어 가스를 비운 후 배출하세요. (화기 주의!)", icon: "💥" },
    ],
    tips: ["알루미늄 캔과 철 캔은 함께 배출해도 괜찮습니다."],
    schedule: {
      day: "화요일, 목요일",
      time: "평일 06:00 ~ 15:00, 토요일 06:00 ~ 12:00 (공휴일 제외)",
      location: "지정된 재활용 수거함 (캔/고철)",
    },
  },
  paper: {
    title: "종이류",
    category: "재활용품",
    color: "#f1c40f",
    steps: [
      { step: 1, title: "이물질 제거", description: "비닐 코팅, 테이프, 스프링, 스테이플러 심 등을 제거해주세요.", icon: "✂️" },
      { step: 2, title: "물기 없게 배출", description: "종이가 물에 젖지 않도록 주의해주세요.", icon: "💧" },
      { step: 3, title: "끈으로 묶어 배출", description: "상자는 펼치고, 신문이나 책은 흩날리지 않게 끈으로 묶어서 배출합니다.", icon: "📚" },
    ],
    tips: ["영수증, 사진, 기름 묻은 종이, 코팅된 전단지는 재활용이 안되므로 일반쓰레기로 배출하세요."],
    schedule: {
      day: "금요일, 토요일",
      time: "평일 06:00 ~ 15:00, 토요일 06:00 ~ 12:00 (공휴일 제외)",
      location: "지정된 재활용 수거함",
    },
  },
  plastic: {
    title: "플라스틱",
    category: "재활용품",
    color: "#3498db",
    steps: [
      { step: 1, title: "내용물 비우고 헹구기", description: "용기 안의 내용물을 깨끗하게 비우고 물로 헹궈주세요.", icon: "🚰" },
      { step: 2, title: "라벨 제거", description: "겉면에 붙어있는 비닐 라벨을 깨끗하게 제거해주세요.", icon: "🏷️" },
      { step: 3, title: "압착하여 배출", description: "가능하다면 부피를 줄여 투명 비닐에 담아 배출합니다.", icon: "♻️" },
    ],
    tips: ["투명 페트병은 다른 플라스틱과 분리하여 전용 수거함에 배출하는 것이 가장 좋습니다."],
    schedule: {
      day: "월요일, 수요일",
      time: "평일 06:00 ~ 15:00, 토요일 06:00 ~ 12:00 (공휴일 제외)",
      location: "지정된 재활용 수거함 (플라스틱)",
    },
  },
  trash: {
    title: "일반쓰레기",
    category: "종량제 봉투",
    color: "#34495e",
    steps: [
      { step: 1, title: "재활용 불가 품목 확인", description: "오염된 쓰레기, 여러 재질이 섞인 물건 등 재활용이 안되는지 확인합니다.", icon: "❓" },
      { step: 2, title: "종량제 봉투에 담기", description: "해당 지역의 종량제 봉투에 담아주세요.", icon: "🛍️" },
      { step: 3, title: "묶어서 배출", description: "봉투가 터지지 않도록 윗부분을 잘 묶어서 배출합니다.", icon: "🎀" },
    ],
    tips: ["음식물 쓰레기, 대형 폐기물, 의약품 등은 종량제 봉투에 버리면 안 됩니다."],
    schedule: {
      day: "평일 및 토요일",
      time: "평일 06:00 ~ 15:00, 토요일 06:00 ~ 12:00 (공휴일 제외)",
      location: "지정된 배출 장소",
    },
  },
};
