import type { Locale } from "./dictionary";

export type HistoryTranslations = {
  title: string;
  summary: string;
  discoveryQuestion: string;
  hypothesis: string;
  experimentSetup: string;
  observation: string;
  conclusion: string;
};

export const historyTranslations: Record<string, Record<Locale, Partial<HistoryTranslations>>> = {
  "galileo-motion": {
    vi: {
      title: "Galileo và chuyển động biến đổi đều",
      summary: "Sử dụng mặt phẳng nghiêng để làm chậm chuyển động rơi tự do đủ để đo đạc quãng đường và thời gian.",
      discoveryQuestion: "Quãng đường thay đổi thế nào khi một vật chuyển động nhanh dần?",
      hypothesis: "Chuyển động gia tốc đều có quãng đường tăng tỷ lệ với bình phương thời gian.",
      experimentSetup: "Một viên bi lăn xuống mặt phẳng nghiêng trong khi các mốc thời gian và quãng đường được đánh dấu.",
      observation: "Quãng đường đi được trong các khoảng thời gian bằng nhau tăng liên tiếp.",
      conclusion: "Chuyển động có thể được mô tả bằng toán học thông qua gia tốc.",
    },
    en: {}
  },
  "newton-force-motion": {
    vi: {
      title: "Newton và các định luật chuyển động",
      summary: "Lực giải thích sự thay đổi trạng thái chuyển động thay vì giải thích chính chuyển động đó.",
      discoveryQuestion: "Mối liên hệ giữa lực, khối lượng và gia tốc là gì?",
      hypothesis: "Với cùng một khối lượng, lực tác dụng càng lớn thì gia tốc thu được càng lớn.",
      experimentSetup: "Một vật được kéo bởi một lực tịnh trong khi gia tốc của nó được so sánh với các khối lượng khác nhau.",
      observation: "Gia tốc tỷ lệ thuận với lực tác dụng và tỷ lệ nghịch với khối lượng.",
      conclusion: "Mối liên hệ cô đọng đó là F = ma.",
    },
    en: {}
  },
  "hooke-spring": {
    vi: {
      title: "Hooke và lực đàn hồi",
      summary: "Lò xo kéo lại càng mạnh khi nó bị kéo giãn càng xa.",
      discoveryQuestion: "Lực đàn hồi của lò xo có tỷ lệ thuận với độ giãn hay không?",
      hypothesis: "Trong giới hạn đàn hồi, lực kéo F tỷ lệ thuận với độ giãn x.",
      experimentSetup: "Treo các quả cân vào lò xo và đo độ giãn tương ứng.",
      observation: "Đồ thị biểu diễn mối quan hệ F-x xấp xỉ là một đường thẳng.",
      conclusion: "Lực đàn hồi có thể được mô phỏng dưới dạng công thức F = kx.",
    },
    en: {}
  },
  "joule-heat": {
    vi: {
      title: "Joule và đương lượng cơ năng của nhiệt",
      summary: "Công cơ học tác dụng có thể làm tăng nhiệt độ của nước.",
      discoveryQuestion: "Công và nhiệt có phải là các dạng năng lượng liên kết với nhau?",
      hypothesis: "Thực hiện công cơ học lên nước sẽ làm tăng nhiệt năng của nó.",
      experimentSetup: "Quả nặng rơi làm quay các cánh quạt trong nước trong khi nhiệt độ được đo đạc.",
      observation: "Nhiệt độ của nước tăng lên sau khi các cánh quạt khuấy động nó.",
      conclusion: "Công và nhiệt là các cơ chế truyền năng lượng.",
    },
    en: {}
  },
  "faraday-induction": {
    vi: {
      title: "Faraday và hiện tượng cảm ứng điện từ",
      summary: "Sự thay đổi từ thông có thể cảm ứng ra dòng điện.",
      discoveryQuestion: "Từ trường có thể tạo ra điện hay không?",
      hypothesis: "Di chuyển nam châm gần cuộn dây sẽ tạo ra dòng điện tạm thời.",
      experimentSetup: "Di chuyển nam châm qua một cuộn dây đồng nối với một điện kế cực nhạy.",
      observation: "Kim điện kế bị lệch đi khi nam châm di chuyển qua cuộn dây.",
      conclusion: "Từ trường biến thiên tạo ra dòng điện cảm ứng.",
    },
    en: {}
  },
  "lavoisier-mass-conservation": {
    vi: {
      title: "Lavoisier và định luật bảo toàn khối lượng",
      summary: "Các phản ứng trong bình kín luôn bảo toàn tổng khối lượng.",
      discoveryQuestion: "Khối lượng có bị mất đi trong quá trình biến đổi hóa học không?",
      hypothesis: "Trong một hệ kín, tổng khối lượng của các chất phản ứng luôn không đổi.",
      experimentSetup: "Các chất phản ứng được niêm phong trong một bình kín và cân đo trước và sau phản ứng.",
      observation: "Cân hiển thị cùng một tổng khối lượng trước và sau phản ứng.",
      conclusion: "Các phương trình hóa học phải bảo toàn số nguyên tử và khối lượng.",
    },
    en: {}
  },
  "dalton-atomic-theory": {
    vi: {
      title: "Dalton và thuyết nguyên tử",
      summary: "Vật chất có thể được mô phỏng dưới dạng các nguyên tử kết hợp theo tỷ lệ cố định.",
      discoveryQuestion: "Tại sao các hợp chất được hình thành theo tỷ lệ khối lượng cố định?",
      hypothesis: "Các nguyên tố được cấu tạo từ các nguyên tử, và các hợp chất kết hợp theo tỷ lệ số nguyên nhỏ.",
      experimentSetup: "So sánh tỷ lệ khối lượng trong các hợp chất trên nhiều mẫu khác nhau.",
      observation: "Tỷ lệ khối lượng luôn nhất quán và là các giá trị rời rạc.",
      conclusion: "Thuyết nguyên tử giải thích thành phần hóa học cố định.",
    },
    en: {}
  },
  "mendeleev-periodic-table": {
    vi: {
      title: "Mendeleev và bảng tuần hoàn các nguyên tố",
      summary: "Các nguyên tố được sắp xếp theo tính chất lộ ra các quy luật tuần hoàn và các ô trống.",
      discoveryQuestion: "Các tính chất của nguyên tố có thể được sắp xếp một cách có tính dự báo được không?",
      hypothesis: "Các nguyên tố thể hiện các tính chất lặp lại khi được sắp xếp một cách có hệ thống.",
      experimentSetup: "Sắp xếp các thẻ nguyên tố theo khối lượng và tính chất hóa học.",
      observation: "Các nhóm nguyên tố thẳng hàng và các ô trống dự báo chính xác các nguyên tố chưa được phát hiện.",
      conclusion: "Bảng tuần hoàn là một mô hình có tính dự báo mạnh mẽ.",
    },
    en: {}
  },
  "rutherford-bohr-atom": {
    vi: {
      title: "Thomson, Rutherford và mô hình nguyên tử Bohr",
      summary: "Mô hình nguyên tử tiến hóa từ electron đính kèm sang hạt nhân và quỹ đạo lượng tử hóa.",
      discoveryQuestion: "Bên trong nguyên tử có những gì?",
      hypothesis: "Sự tán xạ và quang phổ tiết lộ cấu trúc bên trong nguyên tử.",
      experimentSetup: "Hạt alpha được bắn phá vào lá vàng mỏng; quang phổ nguyên tử được đo đạc.",
      observation: "Một số hạt alpha bị lệch hướng rất mạnh, chứng tỏ có một hạt nhân cực kỳ đậm đặc.",
      conclusion: "Nguyên tử có một hạt nhân và các electron quay quanh trên các quỹ đạo năng lượng lượng tử hóa.",
    },
    en: {}
  },
  "lewis-covalent-bonding": {
    vi: {
      title: "Lewis và liên kết cộng hóa trị",
      summary: "Các chấm electron hóa trị giải thích các cặp electron dùng chung trong các phân tử.",
      discoveryQuestion: "Làm thế nào các phi kim liên kết mà không cần chuyển giao hoàn toàn electron?",
      hypothesis: "Các nguyên tử có thể dùng chung cặp electron để hoàn thành lớp vỏ hóa trị.",
      experimentSetup: "Biểu diễn các công thức phân tử đã biết bằng các dấu chấm electron hóa trị.",
      observation: "Cặp electron dùng chung giải thích các phân tử bền vững như H2O, O2 và N2.",
      conclusion: "Liên kết cộng hóa trị là các cặp electron dùng chung.",
    },
    en: {}
  }
};

export function getLocalizedTopic<T extends { id: string }>(topic: T, locale: Locale): T {
  const translations = historyTranslations[topic.id]?.[locale];
  if (!translations) return topic;
  return {
    ...topic,
    ...translations
  };
}
