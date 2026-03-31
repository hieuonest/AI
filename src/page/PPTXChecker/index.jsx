import { useState } from "react";
import {
  Upload,
  Button,
  Tabs,
  Progress,
  Badge,
  Tag,
  Table,
  Card,
  Statistic,
  Row,
  Col,
  Alert,
  Divider,
  Typography,
  Space,
  Timeline,
  Modal,
  Steps,
  Empty,
  ConfigProvider,
  message,
} from "antd";
import {
  InboxOutlined,
  FileTextOutlined,
  AudioOutlined,
  SwapOutlined,
  FilePdfOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SoundOutlined,
  EyeOutlined,
  BulbOutlined,
  WarningOutlined,
  SyncOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import AppHeader from "../components/Header";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const mockSlideErrors = [
  {
    key: 1,
    slide: 3,
    type: "Sai chính tả",
    detail: "Từ 'quản lý' bị viết thành 'quản lí'",
    suggestion:
      "Sửa thành 'quản lý' — đây là cách viết chuẩn theo từ điển tiếng Việt hiện hành.",
    severity: "warning",
  },
  {
    key: 2,
    slide: 5,
    type: "Sai chính tả",
    detail: "Từ 'phương pháp' bị viết thành 'phương páp'",
    suggestion:
      "Sửa lại thành 'phương pháp'. Kiểm tra kỹ phần gõ tắt trên bàn phím.",
    severity: "error",
  },
  {
    key: 3,
    slide: 7,
    type: "Thiếu footer",
    detail: "Slide không có tên môn học ở chân trang",
    suggestion:
      "Thêm tên môn học vào Footer: Insert → Header & Footer → đánh tên môn → Apply to All.",
    severity: "error",
  },
  {
    key: 4,
    slide: 9,
    type: "Thiếu footer",
    detail: "Slide không có tên môn học ở chân trang",
    suggestion:
      "Dùng Slide Master (View → Slide Master) để áp dụng footer đồng nhất cho tất cả slide.",
    severity: "error",
  },
  {
    key: 5,
    slide: 2,
    type: "Mục bài không viết hoa",
    detail: "Tiêu đề 'chương 1: tổng quan' chưa viết hoa chữ đầu",
    suggestion:
      "Sửa thành 'Chương 1: Tổng quan'. Viết hoa chữ cái đầu tiêu đề.",
    severity: "warning",
  },
  {
    key: 6,
    slide: 4,
    type: "Mục bài không viết hoa",
    detail: "Tiêu đề 'phần ii. nội dung' chưa viết hoa chữ đầu",
    suggestion: "Sửa thành 'Phần II. Nội dung'. Dùng chữ in hoa cho số La Mã.",
    severity: "warning",
  },
  {
    key: 7,
    slide: 11,
    type: "Sai chính tả",
    detail: "Từ 'nghiên cứu' bị viết thành 'nghiên cứụ'",
    suggestion:
      "Sửa lại thành 'nghiên cứu'. Lỗi do nhập dấu thanh điệu thừa ở cuối từ.",
    severity: "error",
  },
];

const mockAudioErrors = [
  {
    key: 1,
    slide: 2,
    type: "Khoảng lặng",
    detail: "Phát hiện khoảng lặng 6.3s tại 00:00:14",
    suggestion:
      "Cắt đoạn lặng từ 00:00:14 đến 00:00:20 bằng Audacity: chọn vùng → Delete. Cho phép lặng tối đa 2s.",
    severity: "warning",
  },
  {
    key: 2,
    slide: 5,
    type: "Khoảng lặng",
    detail: "Phát hiện khoảng lặng 9.1s tại 00:01:02",
    suggestion:
      "Khoảng lặng 9.1s quá dài. Cắt bỏ và ghép lại audio. Nếu dừng có chủ ý, giữ ≤ 2s.",
    severity: "error",
  },
  {
    key: 3,
    slide: 8,
    type: "Tạp âm",
    detail: "Tỷ lệ SNR thấp: 12dB (ngưỡng tối thiểu: 20dB)",
    suggestion:
      "Dùng Noise Reduction trong Audacity: Effect → Noise Reduction → Get Profile → Apply. Hoặc thu âm lại ở nơi yên tĩnh.",
    severity: "error",
  },
  {
    key: 4,
    slide: 10,
    type: "Khoảng lặng",
    detail: "Phát hiện khoảng lặng 5.7s tại 00:02:38",
    suggestion:
      "Cắt đoạn lặng từ 00:02:38 đến 00:02:44. Xem lại kịch bản để tránh ngừng quá lâu.",
    severity: "warning",
  },
  {
    key: 5,
    slide: 12,
    type: "Tạp âm",
    detail: "Tiếng vang nền ảnh hưởng toàn bộ đoạn audio",
    suggestion:
      "Thu âm lại trong phòng có vật liệu hút âm (rèm, thảm). Tránh phòng trống tường gạch. Dùng plugin De-Reverb nếu có.",
    severity: "warning",
  },
];

const mockSimilarityData = [
  {
    key: 1,
    slide: 1,
    similarity: 97,
    detail: "Nội dung audio khớp gần như hoàn toàn với text slide.",
    suggestion: "Không cần chỉnh sửa.",
  },
  {
    key: 2,
    slide: 2,
    similarity: 83,
    detail: "Thiếu một số cụm từ trong phần giải thích ví dụ.",
    suggestion:
      "Bổ sung giải thích ví dụ minh họa, hoặc chỉnh script audio để đề cập đủ ý.",
  },
  {
    key: 3,
    slide: 3,
    similarity: 61,
    detail: "Khoảng 40% nội dung text chưa được đề cập trong audio.",
    suggestion:
      "Xem lại script — có thể thiếu đoạn định nghĩa. Thu âm bổ sung hoặc cắt bớt nội dung trên slide.",
  },
  {
    key: 4,
    slide: 4,
    similarity: 45,
    detail: "Audio và text có sự khác biệt lớn về nội dung.",
    suggestion:
      "Kiểm tra xem audio có bị nhầm slide không. Nếu đúng, thu âm lại để khớp với nội dung text.",
  },
  {
    key: 5,
    slide: 5,
    similarity: 91,
    detail: "Một vài từ kỹ thuật trong text chưa được phát âm rõ.",
    suggestion: "Đọc lại các thuật ngữ kỹ thuật chậm và rõ hơn khi thu âm.",
  },
  {
    key: 6,
    slide: 6,
    similarity: 78,
    detail: "Bullet point cuối chưa được đọc.",
    suggestion: "Bổ sung đọc bullet cuối hoặc gộp ý đó vào câu trước.",
  },
  {
    key: 7,
    slide: 7,
    similarity: 55,
    detail: "Hơn một nửa nội dung slide không xuất hiện trong audio.",
    suggestion:
      "Audio có thể bị cắt ngắn. Kiểm tra thời lượng và thu âm lại toàn bộ slide.",
  },
  {
    key: 8,
    slide: 8,
    similarity: 88,
    detail: "Gần đủ nội dung, chỉ lệch một số từ đồng nghĩa.",
    suggestion:
      "Chấp nhận được. Nếu cần cải thiện, dùng đúng từ ngữ trong slide khi thu âm.",
  },
];

const getSeverityIcon = (s) =>
  s === "error" ? (
    <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
  ) : (
    <ExclamationCircleOutlined style={{ color: "#faad14" }} />
  );

const getSimilarityColor = (val) => {
  if (val >= 85) return "#52c41a";
  if (val >= 65) return "#1677ff";
  if (val >= 45) return "#faad14";
  return "#ff4d4f";
};

const getSimilarityTag = (val) => {
  if (val >= 85) return <Tag color="success">Rất tốt</Tag>;
  if (val >= 65) return <Tag color="processing">Tốt</Tag>;
  if (val >= 45) return <Tag color="warning">Trung bình</Tag>;
  return <Tag color="error">Kém</Tag>;
};

const simLabel = (v) =>
  v >= 85 ? "Rất tốt" : v >= 65 ? "Tốt" : v >= 45 ? "Trung bình" : "Kém";

async function exportWordReport(fileName, slideErrors, audioErrors, simData) {
  let docxLib;
  try {
    docxLib = await import("https://esm.sh/docx@8.5.0");
  } catch (e) {
    message.error("Không tải được thư viện xuất Word. Kiểm tra kết nối mạng.");
    return;
  }

  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    HeadingLevel,
    AlignmentType,
    WidthType,
    BorderStyle,
    ShadingType,
    LevelFormat,
  } = docxLib;

  const now = new Date().toLocaleString("vi-VN");
  const totalErrors = slideErrors.length + audioErrors.length;
  const criticals = [...slideErrors, ...audioErrors].filter(
    (e) => e.severity === "error",
  ).length;
  const avgSim = Math.round(
    simData.reduce((a, b) => a + b.similarity, 0) / simData.length,
  );

  const b = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
  const borders = { top: b, bottom: b, left: b, right: b };
  const cm = { top: 100, bottom: 100, left: 140, right: 140 };

  const hCell = (text, w, bg = "1E40AF") =>
    new TableCell({
      borders,
      width: { size: w, type: WidthType.DXA },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: cm,
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              color: "FFFFFF",
              size: 19,
              font: "Arial",
            }),
          ],
        }),
      ],
    });

  const dCell = (text, w, bg = "FFFFFF") =>
    new TableCell({
      borders,
      width: { size: w, type: WidthType.DXA },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: cm,
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: String(text ?? ""), size: 19, font: "Arial" }),
          ],
        }),
      ],
    });

  const sevCell = (sev, w) =>
    new TableCell({
      borders,
      width: { size: w, type: WidthType.DXA },
      shading: {
        fill: sev === "error" ? "FFF1F0" : "FFFBE6",
        type: ShadingType.CLEAR,
      },
      margins: cm,
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: sev === "error" ? "Nghiem trong" : "Canh bao",
              bold: true,
              color: sev === "error" ? "CF1322" : "D46B08",
              size: 19,
              font: "Arial",
            }),
          ],
        }),
      ],
    });

  const tipCell = (text, w) =>
    new TableCell({
      borders,
      width: { size: w, type: WidthType.DXA },
      shading: { fill: "F0FDF4", type: ShadingType.CLEAR },
      margins: cm,
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: String(text ?? ""),
              size: 18,
              color: "065F46",
              font: "Arial",
            }),
          ],
        }),
      ],
    });

  const scColor = (v) =>
    v >= 85 ? "166534" : v >= 65 ? "1D4ED8" : v >= 45 ? "92400E" : "991B1B";

  const secHead = (text) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 480, after: 200 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 8,
          color: "2563EB",
          space: 2,
        },
      },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 30,
          color: "1D4ED8",
          font: "Arial",
        }),
      ],
    });

  const subHead = (text) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 260, after: 100 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 24,
          color: "374151",
          font: "Arial",
        }),
      ],
    });

  const note = (text) =>
    new Paragraph({
      spacing: { after: 140 },
      children: [
        new TextRun({
          text,
          size: 20,
          italics: true,
          color: "6B7280",
          font: "Arial",
        }),
      ],
    });

  const makeErrorTable = (errors, headerColor) =>
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [800, 1500, 2700, 1300, 3060],
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            hCell("Slide", 800, headerColor),
            hCell("Loai loi", 1500, headerColor),
            hCell("Mo ta loi", 2700, headerColor),
            hCell("Muc do", 1300, headerColor),
            hCell("Goi y chinh sua", 3060, headerColor),
          ],
        }),
        ...errors.map(
          (e, i) =>
            new TableRow({
              children: [
                dCell(
                  "Slide " + e.slide,
                  800,
                  i % 2 === 0 ? "F8FAFF" : "FFFFFF",
                ),
                dCell(e.type, 1500, i % 2 === 0 ? "F8FAFF" : "FFFFFF"),
                dCell(e.detail, 2700, i % 2 === 0 ? "F8FAFF" : "FFFFFF"),
                sevCell(e.severity, 1300),
                tipCell(e.suggestion, 3060),
              ],
            }),
        ),
      ],
    });

  const simTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [800, 1000, 1100, 2730, 3730],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          hCell("Slide", 800, "065F46"),
          hCell("% TD", 1000, "065F46"),
          hCell("Danh gia", 1100, "065F46"),
          hCell("Nhan xet", 2730, "065F46"),
          hCell("Goi y cai thien", 3730, "065F46"),
        ],
      }),
      ...simData.map(
        (s, i) =>
          new TableRow({
            children: [
              dCell("Slide " + s.slide, 800, i % 2 === 0 ? "F0FDF4" : "FFFFFF"),
              new TableCell({
                borders,
                width: { size: 1000, type: WidthType.DXA },
                shading: {
                  fill: i % 2 === 0 ? "F0FDF4" : "FFFFFF",
                  type: ShadingType.CLEAR,
                },
                margins: cm,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: s.similarity + "%",
                        bold: true,
                        color: scColor(s.similarity),
                        size: 22,
                        font: "Arial",
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders,
                width: { size: 1100, type: WidthType.DXA },
                shading: {
                  fill: i % 2 === 0 ? "F0FDF4" : "FFFFFF",
                  type: ShadingType.CLEAR,
                },
                margins: cm,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: simLabel(s.similarity),
                        bold: true,
                        color: scColor(s.similarity),
                        size: 19,
                        font: "Arial",
                      }),
                    ],
                  }),
                ],
              }),
              dCell(s.detail, 2730, i % 2 === 0 ? "F0FDF4" : "FFFFFF"),
              tipCell(s.suggestion, 3730),
            ],
          }),
      ),
    ],
  });

  const summaryTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4000, 5360],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          hCell("Hang muc", 4000, "1E3A8A"),
          hCell("Ket qua", 5360, "1E3A8A"),
        ],
      }),
      ...[
        ["Tong so loi phat hien", totalErrors + " loi"],
        ["Loi nghiem trong (do)", criticals + " loi"],
        ["Loi canh bao (vang)", totalErrors - criticals + " loi"],
        ["Loi slide", slideErrors.length + " loi (chinh ta, footer, muc bai)"],
        ["Loi audio", audioErrors.length + " loi (khoang lang, tap am)"],
        [
          "Do tuong dong audio-text trung binh",
          avgSim + "% - " + simLabel(avgSim),
        ],
        [
          "Slide dat chuan (>=65%)",
          simData.filter((s) => s.similarity >= 65).length +
            " / " +
            simData.length +
            " slide",
        ],
        [
          "Slide can xem lai (<65%)",
          simData.filter((s) => s.similarity < 65).length +
            " / " +
            simData.length +
            " slide",
        ],
      ].map(
        ([k, v], i) =>
          new TableRow({
            children: [
              dCell(k, 4000, i % 2 === 0 ? "EFF6FF" : "F8FAFF"),
              dCell(v, 5360, i % 2 === 0 ? "FFFFFF" : "F8FAFB"),
            ],
          }),
      ),
    ],
  });

  const recommendations = [
    "Uu tien xu ly ngay " +
      criticals +
      " loi nghiem trong (mau do) truoc khi phat hanh bai giang.",
    "Su dung Slide Master (View → Slide Master) de thiet lap footer dong nhat cho toan bo file.",
    "Dung Audacity (mien phi) de cat khoang lang va loc tap am cho cac doan audio bi loi.",
    "Thu am lai " +
      simData.filter((s) => s.similarity < 65).length +
      " slide co do tuong dong < 65% hoac chinh sua script cho phu hop voi noi dung text.",
    "Bat tinh nang Spell Check tieng Viet trong PowerPoint de giam thieu loi chinh ta.",
    "Thuc hien kiem tra lai sau khi sua de dam bao tat ca loi da duoc khac phuc.",
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 30, bold: true, font: "Arial", color: "1D4ED8" },
          paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, bold: true, font: "Arial", color: "374151" },
          paragraph: { spacing: { before: 260, after: 100 }, outlineLevel: 1 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: "BAO CAO KIEM TRA CHAT LUONG",
                bold: true,
                size: 40,
                color: "1D4ED8",
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: "POWERPOINT SLIDE & AUDIO",
                bold: true,
                size: 32,
                color: "374151",
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: "─────────────────────────────────────────",
                size: 20,
                color: "93C5FD",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: "Ten file: " + fileName,
                size: 22,
                color: "374151",
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: "Ngay kiem tra: " + now,
                size: 22,
                color: "374151",
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 },
            children: [
              new TextRun({
                text: "Cong cu: PowerPoint Quality Checker v1.0",
                size: 20,
                italics: true,
                color: "6B7280",
                font: "Arial",
              }),
            ],
          }),

          secHead("I. TONG KET KET QUA KIEM TRA"),
          summaryTable,

          secHead("II. LOI SLIDE"),
          subHead("Tong so: " + slideErrors.length + " loi"),
          note(
            "Bang duoi liet ke tung loi tren slide kem muc do va goi y chinh sua cu the.",
          ),
          makeErrorTable(slideErrors, "1E40AF"),

          secHead("III. LOI AUDIO"),
          subHead("Tong so: " + audioErrors.length + " loi"),
          note(
            "Phan tich khoang lang (>4s) va tap am trong tung doan audio dinh kem slide.",
          ),
          makeErrorTable(audioErrors, "6D28D9"),

          secHead("IV. DO TUONG DONG AUDIO - TEXT SLIDE"),
          subHead("Trung binh: " + avgSim + "% - " + simLabel(avgSim)),
          note(
            "Thang danh gia: Rat tot >= 85% | Tot 65-84% | Trung binh 45-64% | Kem < 45%",
          ),
          simTable,

          secHead("V. KHUYEN NGHI TONG THE"),
          ...recommendations.map(
            (t) =>
              new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                spacing: { after: 100 },
                children: [new TextRun({ text: t, size: 21, font: "Arial" })],
              }),
          ),

          new Paragraph({
            spacing: { before: 600 },
            alignment: AlignmentType.CENTER,
            border: {
              top: {
                style: BorderStyle.SINGLE,
                size: 4,
                color: "D1D5DB",
                space: 1,
              },
            },
            children: [
              new TextRun({
                text: "Bao cao tu dong - PowerPoint Quality Checker - " + now,
                size: 18,
                color: "9CA3AF",
                italics: true,
                font: "Arial",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bao_cao_kiem_tra_" + fileName.replace(/\.pptx$/i, "") + ".docx";
  a.click();
  URL.revokeObjectURL(url);
  message.success("Xuat bao cao Word thanh cong!");
}

export default function Home() {
  const [file, setFile] = useState(null);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState("slide");
  const [reportModal, setReportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const simulateCheck = () => {
    if (!file) return;
    setChecking(true);
    setDone(false);
    setProgress(0);
    setStep(0);
    let cur = 0,
      p = 0;
    const ends = [25, 50, 75, 100];
    const iv = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= ends[cur] && cur < 3) {
        cur++;
        setStep(cur);
      }
      if (p >= 100) {
        clearInterval(iv);
        setChecking(false);
        setDone(true);
      }
    }, 60);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportWordReport(
        file?.name || "bai_giang.pptx",
        mockSlideErrors,
        mockAudioErrors,
        mockSimilarityData,
      );
    } finally {
      setExporting(false);
    }
  };

  const avgSimilarity = Math.round(
    mockSimilarityData.reduce((a, b) => a + b.similarity, 0) /
      mockSimilarityData.length,
  );
  const totalErrors = mockSlideErrors.length + mockAudioErrors.length;
  const criticals = [...mockSlideErrors, ...mockAudioErrors].filter(
    (e) => e.severity === "error",
  ).length;

  const slideErrorCols = [
    {
      title: "Slide",
      dataIndex: "slide",
      width: 65,
      render: (v) => <Tag color="blue">#{v}</Tag>,
    },
    {
      title: "Loại lỗi",
      dataIndex: "type",
      width: 160,
      render: (v, r) => (
        <Tag color={r.severity === "error" ? "red" : "orange"}>{v}</Tag>
      ),
    },
    { title: "Mô tả lỗi", dataIndex: "detail", ellipsis: true },
    {
      title: "Gợi ý sửa",
      dataIndex: "suggestion",
      ellipsis: true,
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: "",
      dataIndex: "severity",
      width: 36,
      render: (v) => getSeverityIcon(v),
    },
  ];

  const audioCols = [
    {
      title: "Slide",
      dataIndex: "slide",
      width: 65,
      render: (v) => <Tag color="purple">#{v}</Tag>,
    },
    {
      title: "Loại lỗi",
      dataIndex: "type",
      width: 130,
      render: (v, r) => (
        <Tag color={r.severity === "error" ? "red" : "orange"}>{v}</Tag>
      ),
    },
    { title: "Mô tả lỗi", dataIndex: "detail", ellipsis: true },
    {
      title: "Gợi ý sửa",
      dataIndex: "suggestion",
      ellipsis: true,
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: "",
      dataIndex: "severity",
      width: 36,
      render: (v) => getSeverityIcon(v),
    },
  ];

  const simCols = [
    {
      title: "Slide",
      dataIndex: "slide",
      width: 65,
      render: (v) => <Tag color="geekblue">#{v}</Tag>,
    },
    {
      title: "Tương đồng",
      dataIndex: "similarity",
      width: 170,
      render: (v) => (
        <Space size={6}>
          <Progress
            percent={v}
            size="small"
            strokeColor={getSimilarityColor(v)}
            style={{ width: 90 }}
            showInfo={false}
          />
          <Text strong style={{ color: getSimilarityColor(v) }}>
            {v}%
          </Text>
        </Space>
      ),
    },
    {
      title: "",
      dataIndex: "similarity",
      width: 90,
      render: (v) => getSimilarityTag(v),
    },
    { title: "Nhận xét", dataIndex: "detail", ellipsis: true },
    {
      title: "Gợi ý",
      dataIndex: "suggestion",
      ellipsis: true,
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
  ];

  const tabItems = [
    {
      key: "slide",
      label: (
        <span>
          <FileTextOutlined /> Lỗi Slide{" "}
          <Badge
            count={mockSlideErrors.length}
            style={{ backgroundColor: "#fa8c16" }}
          />
        </span>
      ),
      children: (
        <div>
          <Row gutter={12} style={{ marginBottom: 14 }}>
            {[
              {
                label: "Sai chính tả",
                count: mockSlideErrors.filter((e) => e.type === "Sai chính tả")
                  .length,
                color: "#ff4d4f",
              },
              {
                label: "Thiếu footer",
                count: mockSlideErrors.filter((e) => e.type === "Thiếu footer")
                  .length,
                color: "#fa8c16",
              },
              {
                label: "Mục bài chưa hoa",
                count: mockSlideErrors.filter(
                  (e) => e.type === "Mục bài không viết hoa",
                ).length,
                color: "#faad14",
              },
            ].map((s) => (
              <Col span={8} key={s.label}>
                <Card
                  size="small"
                  style={{
                    borderColor: s.color + "40",
                    background: s.color + "08",
                    borderRadius: 10,
                  }}
                >
                  <Statistic
                    title={s.label}
                    value={s.count}
                    suffix="lỗi"
                    valueStyle={{ color: s.color, fontSize: 20 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <Table
            dataSource={mockSlideErrors}
            columns={slideErrorCols}
            size="small"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 700 }}
          />
        </div>
      ),
    },
    {
      key: "audio",
      label: (
        <span>
          <AudioOutlined /> Lỗi Audio{" "}
          <Badge
            count={mockAudioErrors.length}
            style={{ backgroundColor: "#722ed1" }}
          />
        </span>
      ),
      children: (
        <div>
          <Row gutter={12} style={{ marginBottom: 14 }}>
            {[
              {
                label: "Khoảng lặng >4s",
                count: mockAudioErrors.filter((e) => e.type === "Khoảng lặng")
                  .length,
                color: "#722ed1",
              },
              {
                label: "Tạp âm / Tiếng ồn",
                count: mockAudioErrors.filter((e) => e.type === "Tạp âm")
                  .length,
                color: "#eb2f96",
              },
            ].map((s) => (
              <Col span={12} key={s.label}>
                <Card
                  size="small"
                  style={{
                    borderColor: s.color + "40",
                    background: s.color + "08",
                    borderRadius: 10,
                  }}
                >
                  <Statistic
                    title={s.label}
                    value={s.count}
                    suffix="lỗi"
                    valueStyle={{ color: s.color, fontSize: 20 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <Table
            dataSource={mockAudioErrors}
            columns={audioCols}
            size="small"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 700 }}
          />
        </div>
      ),
    },
    {
      key: "similarity",
      label: (
        <span>
          <SwapOutlined /> Audio vs Text
        </span>
      ),
      children: (
        <div>
          <Row gutter={12} style={{ marginBottom: 14 }}>
            <Col span={8}>
              <Card
                size="small"
                style={{
                  borderColor: getSimilarityColor(avgSimilarity) + "60",
                  background: getSimilarityColor(avgSimilarity) + "08",
                  borderRadius: 10,
                }}
              >
                <Statistic
                  title="Tương đồng trung bình"
                  value={avgSimilarity}
                  suffix="%"
                  valueStyle={{
                    color: getSimilarityColor(avgSimilarity),
                    fontSize: 26,
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" style={{ borderRadius: 10 }}>
                <Statistic
                  title="Slide đạt (≥65%)"
                  value={
                    mockSimilarityData.filter((s) => s.similarity >= 65).length
                  }
                  suffix={"/ " + mockSimilarityData.length}
                  valueStyle={{ color: "#52c41a", fontSize: 20 }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" style={{ borderRadius: 10 }}>
                <Statistic
                  title="Cần xem lại (<65%)"
                  value={
                    mockSimilarityData.filter((s) => s.similarity < 65).length
                  }
                  suffix={"/ " + mockSimilarityData.length}
                  valueStyle={{ color: "#ff4d4f", fontSize: 20 }}
                />
              </Card>
            </Col>
          </Row>
          <Table
            dataSource={mockSimilarityData}
            columns={simCols}
            size="small"
            pagination={{ pageSize: 8 }}
            scroll={{ x: 800 }}
          />
        </div>
      ),
    },
  ];

  const reportPreview = (
    <div style={{ fontSize: 13, lineHeight: 1.9 }}>
      <Text strong style={{ fontSize: 15, color: "#1D4ED8" }}>
        BÁO CÁO KIỂM TRA POWERPOINT
      </Text>
      <br />
      <Text type="secondary">
        {file?.name || "bai_giang.pptx"} | {new Date().toLocaleString("vi-VN")}
      </Text>
      <Divider style={{ margin: "10px 0" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {[
          { l: "Tổng lỗi", v: totalErrors, c: "#ff4d4f" },
          { l: "Nghiêm trọng", v: criticals, c: "#fa541c" },
          {
            l: "Tương đồng TB",
            v: avgSimilarity + "%",
            c: getSimilarityColor(avgSimilarity),
          },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              background: s.c + "12",
              border: "1px solid " + s.c + "30",
              borderRadius: 8,
              padding: "8px 12px",
            }}
          >
            <div style={{ color: s.c, fontWeight: 700, fontSize: 20 }}>
              {s.v}
            </div>
            <div style={{ color: "#6B7280", fontSize: 11 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <Text strong style={{ color: "#1E40AF" }}>
        II. LỖI SLIDE ({mockSlideErrors.length})
      </Text>
      <Timeline
        style={{ marginTop: 8, marginBottom: 6 }}
        items={mockSlideErrors.map((e) => ({
          color: e.severity === "error" ? "red" : "orange",
          children: (
            <div>
              <Tag color="blue">Slide {e.slide}</Tag>
              <Tag color={e.severity === "error" ? "red" : "orange"}>
                {e.type}
              </Tag>
              <div style={{ color: "#374151", marginTop: 2 }}>{e.detail}</div>
              <div style={{ color: "#059669", fontSize: 12 }}>
                Goi y: {e.suggestion}
              </div>
            </div>
          ),
        }))}
      />
      <Text strong style={{ color: "#6D28D9" }}>
        III. LỖI AUDIO ({mockAudioErrors.length})
      </Text>
      <Timeline
        style={{ marginTop: 8, marginBottom: 6 }}
        items={mockAudioErrors.map((e) => ({
          color: e.severity === "error" ? "red" : "orange",
          children: (
            <div>
              <Tag color="purple">Slide {e.slide}</Tag>
              <Tag color={e.severity === "error" ? "red" : "orange"}>
                {e.type}
              </Tag>
              <div style={{ color: "#374151", marginTop: 2 }}>{e.detail}</div>
              <div style={{ color: "#059669", fontSize: 12 }}>
                Goi y: {e.suggestion}
              </div>
            </div>
          ),
        }))}
      />
      <Text strong style={{ color: "#065F46" }}>
        IV. ĐỘ TƯƠNG ĐỒNG ({avgSimilarity}% TB)
      </Text>
      <div style={{ marginTop: 8 }}>
        {mockSimilarityData.map((s) => (
          <div
            key={s.key}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: "1px solid #f0f0f0",
              alignItems: "flex-start",
            }}
          >
            <Tag color="geekblue" style={{ minWidth: 64, marginTop: 2 }}>
              Slide {s.slide}
            </Tag>
            <div style={{ flex: 1 }}>
              <Space size={6}>
                <Progress
                  percent={s.similarity}
                  size="small"
                  style={{ width: 100 }}
                  strokeColor={getSimilarityColor(s.similarity)}
                  showInfo={false}
                />
                <Text
                  strong
                  style={{ color: getSimilarityColor(s.similarity) }}
                >
                  {s.similarity}%
                </Text>
                {getSimilarityTag(s.similarity)}
              </Space>
              <div style={{ color: "#6B7280", fontSize: 11, marginTop: 2 }}>
                {s.detail}
              </div>
              <div style={{ color: "#059669", fontSize: 11 }}>
                Goi y: {s.suggestion}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return (
    <>
      <AppHeader file={file}/>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2563eb",
            borderRadius: 10,
            fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif",
          },
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
          .checker-root { min-height: 100vh; background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%); padding: 32px 16px; }
          .checker-card { background: white; border-radius: 18px; box-shadow: 0 4px 32px #2563eb14; padding: 32px; max-width: 980px; margin: 0 auto; }
          .header-band { background: linear-gradient(90deg, #1d4ed8 0%, #7c3aed 100%); border-radius: 14px; padding: 22px 28px; margin-bottom: 24px; }
          .upload-zone .ant-upload-drag { border-radius: 12px !important; border: 2px dashed #93c5fd !important; background: #eff6ff !important; }
          .upload-zone .ant-upload-drag:hover { border-color: #2563eb !important; background: #dbeafe !important; }
          .step-bar { background: #f8faff; border-radius: 12px; padding: 16px 24px; margin-bottom: 20px; }
        `}</style>
        <div className="checker-root">
          <div className="checker-card">
            <div className="header-band">
              <Row align="middle" justify="space-between">
                <Col>
                  <Title level={3} style={{ color: "white", margin: 0 }}>
                    <SoundOutlined style={{ marginRight: 10 }} />
                    PowerPoint Quality Checker
                  </Title>
                  <Text style={{ color: "#bfdbfe", fontSize: 13 }}>
                    Kiem tra loi slide, audio & do tuong dong — Xuat bao cao Word
                    (.docx)
                  </Text>
                </Col>
                <Col>
                  <BulbOutlined style={{ fontSize: 38, color: "#bfdbfe" }} />
                </Col>
              </Row>
            </div>

            <div className="upload-zone" style={{ marginBottom: 20 }}>
              <Dragger
                accept=".pptx"
                maxCount={1}
                beforeUpload={(f) => {
                  setFile(f);
                  setDone(false);
                  return false;
                }}
                onRemove={() => {
                  setFile(null);
                  setDone(false);
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "#2563eb", fontSize: 38 }} />
                </p>
                <p className="ant-upload-text" style={{ fontWeight: 600 }}>
                  Kéo thả hoặc nhấn để tải file PowerPoint (.pptx)
                </p>
                <p className="ant-upload-hint" style={{ color: "#64748b" }}>
                  File phải chứa audio trên từng slide. Hỗ trợ định dạng .pptx
                </p>
              </Dragger>
            </div>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Button
                type="primary"
                size="large"
                icon={checking ? <SyncOutlined spin /> : <EyeOutlined />}
                disabled={!file}
                loading={checking}
                onClick={simulateCheck}
                style={{
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 44,
                  paddingInline: 36,
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                  border: "none",
                }}
              >
                {checking ? "Đang kiểm tra..." : "Bắt đầu kiểm tra"}
              </Button>
              {file && !checking && !done && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">📂 {file.name}</Text>
                </div>
              )}
            </div>

            {checking && (
              <div className="step-bar">
                <Steps
                  current={step}
                  size="small"
                  style={{ marginBottom: 14 }}
                  items={[
                    { title: "Đọc file" },
                    { title: "Lỗi slide" },
                    { title: "Audio" },
                    { title: "So sánh" },
                  ]}
                />
                <Progress
                  percent={progress}
                  status="active"
                  strokeColor={{ "0%": "#2563eb", "100%": "#7c3aed" }}
                />
              </div>
            )}

            {done && (
              <div>
                <Alert
                  type="warning"
                  showIcon
                  icon={<WarningOutlined />}
                  message={
                    <>
                      <b>Phát hiện {totalErrors} lỗi</b> ({criticals} nghiêm
                      trọng) · Tương đồng TB:{" "}
                      <b>
                        {avgSimilarity}% — {simLabel(avgSimilarity)}
                      </b>
                    </>
                  }
                  style={{ borderRadius: 10, marginBottom: 16 }}
                  action={
                    <Space>
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => setReportModal(true)}
                      >
                        Xem trước
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        icon={<FileWordOutlined />}
                        loading={exporting}
                        onClick={handleExport}
                        style={{
                          background: "linear-gradient(90deg,#1D4ED8,#7c3aed)",
                          border: "none",
                        }}
                      >
                        {exporting ? "Đang xuất..." : "Xuất Word (.docx)"}
                      </Button>
                    </Space>
                  }
                />
                <Row gutter={12} style={{ marginBottom: 16 }}>
                  {[
                    {
                      icon: <FileTextOutlined />,
                      label: "Lỗi slide",
                      val: mockSlideErrors.length,
                      color: "#fa8c16",
                    },
                    {
                      icon: <AudioOutlined />,
                      label: "Lỗi audio",
                      val: mockAudioErrors.length,
                      color: "#722ed1",
                    },
                    {
                      icon: <SwapOutlined />,
                      label: "Tương đồng TB",
                      val: avgSimilarity + "%",
                      color: getSimilarityColor(avgSimilarity),
                    },
                    {
                      icon: <CloseCircleOutlined />,
                      label: "Lỗi nghiêm trọng",
                      val: criticals,
                      color: "#ff4d4f",
                    },
                  ].map((s) => (
                    <Col span={6} key={s.label}>
                      <Card
                        size="small"
                        style={{
                          borderRadius: 12,
                          textAlign: "center",
                          borderColor: s.color + "40",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            color: s.color,
                            marginBottom: 2,
                          }}
                        >
                          {s.icon}
                        </div>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: s.color,
                          }}
                        >
                          {s.val}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {s.label}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={tabItems}
                  size="middle"
                />
              </div>
            )}

            {!checking && !done && !file && (
              <Empty
                description="Tải lên file .pptx để bắt đầu kiểm tra"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: "32px 0" }}
              />
            )}
          </div>
        </div>

        <Modal
          open={reportModal}
          title={
            <>
              <FilePdfOutlined style={{ color: "#2563eb" }} /> Xem trước báo cáo
            </>
          }
          onCancel={() => setReportModal(false)}
          width={740}
          footer={[
            <Button key="close" onClick={() => setReportModal(false)}>
              Đóng
            </Button>,
            <Button
              key="dl"
              type="primary"
              icon={<FileWordOutlined />}
              loading={exporting}
              style={{
                background: "linear-gradient(90deg,#1D4ED8,#7c3aed)",
                border: "none",
              }}
              onClick={async () => {
                setReportModal(false);
                await handleExport();
              }}
            >
              Xuất Word (.docx)
            </Button>,
          ]}
        >
          {reportPreview}
        </Modal>
      </ConfigProvider>
    </>
  );
}
