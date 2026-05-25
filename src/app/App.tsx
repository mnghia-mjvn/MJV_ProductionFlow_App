import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft, Bell, Printer, FileText, Image as ImgIcon,
  Paperclip, Play, CheckCheck, Clock, AlertTriangle,
  Home, ListTodo, Settings, ChevronRight, Camera, Upload,
  Check, X as XIcon, Shield, Wrench, HardHat, ClipboardCheck,
  RotateCcw, BadgeCheck, Download, Eye, Timer, Package,
  Scissors, Cog, Paintbrush, PenTool, Archive,
  Plus, Briefcase, Search, Users, LayoutGrid, CalendarDays,
  Pencil, ChevronDown, UserPlus, Layers, Building2, BarChart3,
  AlertCircle, CheckCircle2, CircleDashed, Hourglass, ScanLine,
  Menu, LogOut, HelpCircle, ChevronRight as ChevRight,
  Globe, Mail, Lock, EyeOff,
} from "lucide-react";
import imgBg       from "../imports/Login112/a8e25246cbd5170e1c08802d1800fdf3d453e317.png";
import imgLogo     from "../imports/Login112/0758065b09caa1922ffaa90cb45af61cd56f3f89.png";
import imgMicrosoft from "../imports/Login112/b413fa58018f84bf9393d355080ec7aec0b04a67.png";
import imgGoogle   from "../imports/Login112/5f9849d48a93a090005402daafc8ef822895df44.png";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "login"
  | "worker-dashboard"
  | "worker-task-detail"
  | "qc-dashboard"
  | "qc-task-detail"
  | "qc-inspection"
  | "pe-dashboard"
  | "job-detail";

type TaskStatus = "Pending" | "In Progress" | "Awaiting QC" | "Awaiting Rework" | "Done";
type JobStatus = "Unassigned" | "Assigned" | "In Progress" | "Completed" | "On Hold";
type Role = "worker" | "qc" | "pe";

interface Task {
  id: string;
  taskNo: string;
  description: string;
  jobNo: string;
  productName: string;
  partSN: string;
  workshop: string;
  status: TaskStatus;
  estimationHours: number;
  dueDate: string;
  workerName: string;
  qcName: string;
  startTime?: Date;
  step: number;
  rejectionNote?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const WORKER_TASKS_INIT: Task[] = [
  {
    id: "t1",
    taskNo: "TSK-051-001",
    description: "Cutting & Bending — Main Frame Rails",
    jobNo: "JOB-RTG-2024-051",
    productName: "RTG Crane Upper Beam Assembly",
    partSN: "RTG-051-UB-001",
    workshop: "Cutting & Bending",
    status: "In Progress",
    estimationHours: 8,
    dueDate: "20 Dec 2024",
    workerName: "Nguyen Van A",
    qcName: "Tran Thi B",
    startTime: new Date(Date.now() - 7320000),
    step: 1,
  },
  {
    id: "t2",
    taskNo: "TSK-050-003",
    description: "Welding — Gantry Leg Structure Rework",
    jobNo: "JOB-RTG-2024-050",
    productName: "RTG Crane Gantry Leg",
    partSN: "RTG-050-GL-003",
    workshop: "Welding",
    status: "Awaiting Rework",
    estimationHours: 6,
    dueDate: "19 Dec 2024",
    workerName: "Nguyen Van A",
    qcName: "Tran Thi B",
    step: 3,
    rejectionNote:
      "Weld bead continuity not meeting spec at joint J-04. Undercut detected. Re-weld and clean the area before resubmitting.",
  },
  {
    id: "t3",
    taskNo: "TSK-049-002",
    description: "Machining — Axle Bearing Housing",
    jobNo: "JOB-RTG-2024-049",
    productName: "RTG Crane Drive Assembly",
    partSN: "RTG-049-DA-002",
    workshop: "Machining",
    status: "Pending",
    estimationHours: 4,
    dueDate: "22 Dec 2024",
    workerName: "Nguyen Van A",
    qcName: "Tran Thi B",
    step: 2,
  },
];

const QC_TASKS_INIT: Task[] = [
  {
    id: "q1",
    taskNo: "TSK-048-004",
    description: "Painting — Hydraulic Oil Tank Visual Inspection",
    jobNo: "JOB-RTG-2024-048",
    productName: "RTG Crane Hydraulic Tank",
    partSN: "RTG-048-HT-001",
    workshop: "Painting",
    status: "Awaiting QC",
    estimationHours: 2,
    dueDate: "18 Dec 2024",
    workerName: "Le Van C",
    qcName: "Tran Thi B",
    step: 4,
  },
  {
    id: "q2",
    taskNo: "TSK-047-005",
    description: "Assembly — Boom Structure QC Check",
    jobNo: "JOB-RTG-2024-047",
    productName: "RTG Crane Boom",
    partSN: "RTG-047-BM-005",
    workshop: "Assembly",
    status: "Awaiting QC",
    estimationHours: 3,
    dueDate: "19 Dec 2024",
    workerName: "Pham Van D",
    qcName: "Tran Thi B",
    step: 5,
  },
  {
    id: "q3",
    taskNo: "TSK-046-002",
    description: "Welding — Spreader Frame Inspection",
    jobNo: "JOB-RTG-2024-046",
    productName: "RTG Crane Spreader",
    partSN: "RTG-046-SP-002",
    workshop: "Welding",
    status: "Pending",
    estimationHours: 2,
    dueDate: "21 Dec 2024",
    workerName: "Hoang Van E",
    qcName: "Tran Thi B",
    step: 3,
  },
];

const INSPECTION_ITEMS = [
  { no: 1, en: "Oil tank are not dented / deformed", vi: "Thùng dầu không bị móp /biến dạng." },
  { no: 2, en: "Ensure Hydraulic Oil ID Plate is fitted correctly", vi: "Đảm bảo ID Plate của thùng dầu thủy lực đươc gắn chính xác" },
  { no: 3, en: "Oil tank has been pressure tested as specified", vi: "Thùng dầu đã được kiểm tra áp lực như quy định" },
  { no: 4, en: "Visually check all connection points have been fully welded", vi: "Kiểm tra ngoại quan tất cả điểm kết nối đã được hàn đầy đủ" },
  { no: 5, en: "Remove and clean anti-rust oil, dusts on all flanges, pipes, machined parts before installing", vi: "Vệ sinh và làm sạch các loại dầu chống rỉ, bụi bẩn trên các mặt bích, ống trước khi lắp vào thùng" },
  { no: 6, en: "No metal shavings, debris, dusts, strange object in the tank", vi: "Không có mạt sắt, ba vớ, bụi bẩn, vật thể lạ trong thùng" },
  { no: 7, en: "Use white cloth and flashlight to check for cleaning of tank before adding anti-rust oil", vi: "Sử dụng vải trắng và đèn pin để kiểm tra độ sạch của thùng trước khi bôi dầu bảo quản" },
  { no: 8, en: "Used correct Anti-rust oil (ANTICORIT VCI UNI 0 40 OIL)", vi: "Sử dụng đúng dầu bảo quản (ANTICORIT VCI UNI 0 40 OIL)" },
  { no: 9, en: "Used correct amount of anti-rust oil (400 ml / 1000 L tank)", vi: "Sử dụng đúng lượng dầu bảo quản (400 ml cho thể tích thùng 1000 lit)" },
  { no: 10, en: "Remove and clean remaining flanges, pipes, machined parts before installing into the tank", vi: "Vệ sinh và làm sạch các chi tiết gia công còn lại trước khi lắp chúng vào thùng" },
  { no: 11, en: "Add anti-rust oil ANTICORIT VCI UNI O 40 to compensate for evaporation if tank is opened", vi: "Thêm dầu chống rỉ ANTICORIT VCI UNI O 40 vào thùng nếu có mở nắp để bù lượng đã bay hơi" },
  { no: 12, en: "Close the tank cap tightly immediately", vi: "Đóng chặt nắp thùng ngay lập tức" },
  { no: 13, en: "Paste QC stamp after checking and transfer to packaging / machine assembly", vi: "Dán tem QC sau khi kiểm tra và cho phép chuyển đi đóng gói hoặc lắp ráp xe" },
];

const WORKSHOP_STEPS = ["Cut & Bend", "Machining", "Welding", "Painting", "Assembly", "Packing"];

// ─── PE Types & Data ─────────────────────────────────────────────────────────
interface JobTask {
  id: string;
  step: number;
  workshop: string;
  description: string;
  worker: string;
  qc: string;
  estimationHours: number;
  dueDate: string;
  status: TaskStatus;
}

interface Job {
  id: string;
  jobNo: string;
  projectNo: string;
  productName: string;
  partSN: string;
  customer: string;
  status: JobStatus;
  createdDate: string;
  startDate: string;
  dueDate: string;
  notes: string;
  progress: number;
  tasks: JobTask[];
}

interface StaffMember {
  id: string;
  name: string;
  role: "worker" | "qc";
  workshops: string[];
}

const STAFF: StaffMember[] = [
  { id: "w1", name: "Nguyen Van A", role: "worker", workshops: ["Cutting & Bending", "Machining"] },
  { id: "w2", name: "Le Van C",    role: "worker", workshops: ["Welding", "Painting"] },
  { id: "w3", name: "Pham Van D",  role: "worker", workshops: ["Assembly"] },
  { id: "w4", name: "Hoang Van E", role: "worker", workshops: ["Welding"] },
  { id: "w5", name: "Tran Van F",  role: "worker", workshops: ["Packaging"] },
  { id: "w6", name: "Nguyen Van G",role: "worker", workshops: ["Cutting & Bending", "Machining", "Welding"] },
  { id: "q1", name: "Tran Thi B",  role: "qc",     workshops: ["All"] },
  { id: "q2", name: "Nguyen Thi G",role: "qc",     workshops: ["Painting", "Assembly"] },
  { id: "q3", name: "Le Thi H",    role: "qc",     workshops: ["Welding", "Cutting & Bending"] },
];

function makeTasksFor(prefix: string, workers: string[], qcs: string[], overrides: Partial<JobTask>[] = []): JobTask[] {
  const defs = [
    { workshop: "Cutting & Bending", desc: "Cut & bend structural frame components", est: 12 },
    { workshop: "Machining",         desc: "Machine axle and bearing components",     est: 8  },
    { workshop: "Welding",           desc: "Weld primary load-bearing structure",      est: 20 },
    { workshop: "Painting",          desc: "Apply epoxy primer and top coat",          est: 6  },
    { workshop: "Assembly",          desc: "Final assembly and electrical integration",est: 16 },
    { workshop: "Packaging",         desc: "Pack and prepare for shipment",            est: 4  },
  ];
  return defs.map((d, i) => ({
    id: `${prefix}-${i + 1}`,
    step: i + 1,
    workshop: d.workshop,
    description: d.desc,
    worker: workers[i] ?? "",
    qc: qcs[i] ?? "",
    estimationHours: d.est,
    dueDate: "",
    status: "Pending" as TaskStatus,
    ...(overrides[i] ?? {}),
  }));
}

const JOBS_INIT: Job[] = [
  {
    id: "j1",
    jobNo: "JOB-RTG-2024-052",
    projectNo: "PRJ-2024-RTG-13",
    productName: "RTG Crane — Full Assembly",
    partSN: "RTG-052-FA-001",
    customer: "Tan Cang Saigon Port",
    status: "Unassigned",
    createdDate: "20 Dec 2024",
    startDate: "06 Jan 2025",
    dueDate: "15 Mar 2025",
    notes: "New order for RTG crane with extended boom. Customer requires red/white color scheme per spec.",
    progress: 0,
    tasks: makeTasksFor("j1t", [], [], [
      { dueDate: "15 Jan 2025" }, { dueDate: "25 Jan 2025" },
      { dueDate: "05 Feb 2025" }, { dueDate: "12 Feb 2025" },
      { dueDate: "25 Feb 2025" }, { dueDate: "10 Mar 2025" },
    ]),
  },
  {
    id: "j2",
    jobNo: "JOB-RTG-2024-051",
    projectNo: "PRJ-2024-RTG-12",
    productName: "RTG Crane Upper Beam Assembly",
    partSN: "RTG-051-UB-001",
    customer: "Vung Tau Container Terminal",
    status: "In Progress",
    createdDate: "05 Dec 2024",
    startDate: "10 Dec 2024",
    dueDate: "20 Dec 2024",
    notes: "Priority order. Upper beam must meet ISO 12345 tolerance spec.",
    progress: 20,
    tasks: makeTasksFor("j2t",
      ["Nguyen Van A", "Nguyen Van A", "Le Van C", "Le Van C", "Pham Van D", "Tran Van F"],
      ["Tran Thi B", "Tran Thi B", "Le Thi H", "Nguyen Thi G", "Tran Thi B", "Tran Thi B"],
      [
        { status: "In Progress", dueDate: "12 Dec 2024" },
        { dueDate: "13 Dec 2024" }, { dueDate: "15 Dec 2024" },
        { dueDate: "17 Dec 2024" }, { dueDate: "19 Dec 2024" },
        { dueDate: "20 Dec 2024" },
      ]),
  },
  {
    id: "j3",
    jobNo: "JOB-RTG-2024-050",
    projectNo: "PRJ-2024-RTG-12",
    productName: "RTG Crane Gantry Leg",
    partSN: "RTG-050-GL-003",
    customer: "Vung Tau Container Terminal",
    status: "In Progress",
    createdDate: "03 Dec 2024",
    startDate: "08 Dec 2024",
    dueDate: "19 Dec 2024",
    notes: "Gantry leg for RTG-12. Note: weld spec per WPS-RTG-2024-003.",
    progress: 45,
    tasks: makeTasksFor("j3t",
      ["Nguyen Van G", "Nguyen Van A", "Hoang Van E", "Le Van C", "Pham Van D", "Tran Van F"],
      ["Le Thi H", "Tran Thi B", "Le Thi H", "Nguyen Thi G", "Tran Thi B", "Tran Thi B"],
      [
        { status: "Done", dueDate: "10 Dec 2024" },
        { status: "Done", dueDate: "11 Dec 2024" },
        { status: "Awaiting Rework", dueDate: "14 Dec 2024" },
        { dueDate: "16 Dec 2024" }, { dueDate: "18 Dec 2024" }, { dueDate: "19 Dec 2024" },
      ]),
  },
  {
    id: "j4",
    jobNo: "JOB-RTG-2024-049",
    projectNo: "PRJ-2024-RTG-11",
    productName: "RTG Crane Drive Assembly",
    partSN: "RTG-049-DA-002",
    customer: "Hai Phong International Terminal",
    status: "Assigned",
    createdDate: "28 Nov 2024",
    startDate: "02 Dec 2024",
    dueDate: "22 Dec 2024",
    notes: "",
    progress: 0,
    tasks: makeTasksFor("j4t",
      ["Nguyen Van A", "Nguyen Van A", "Le Van C", "Le Van C", "Pham Van D", "Tran Van F"],
      ["Tran Thi B", "Tran Thi B", "Le Thi H", "Nguyen Thi G", "Tran Thi B", "Tran Thi B"],
      [
        { dueDate: "05 Dec 2024" }, { dueDate: "08 Dec 2024" },
        { dueDate: "12 Dec 2024" }, { dueDate: "16 Dec 2024" },
        { dueDate: "20 Dec 2024" }, { dueDate: "22 Dec 2024" },
      ]),
  },
  {
    id: "j5",
    jobNo: "JOB-RTG-2024-048",
    projectNo: "PRJ-2024-RTG-11",
    productName: "RTG Crane Hydraulic Tank",
    partSN: "RTG-048-HT-001",
    customer: "Hai Phong International Terminal",
    status: "In Progress",
    createdDate: "25 Nov 2024",
    startDate: "28 Nov 2024",
    dueDate: "18 Dec 2024",
    notes: "Hydraulic tank must pass pressure test at 250 bar.",
    progress: 68,
    tasks: makeTasksFor("j5t",
      ["Nguyen Van A", "Nguyen Van A", "Hoang Van E", "Le Van C", "Pham Van D", "Tran Van F"],
      ["Le Thi H", "Tran Thi B", "Le Thi H", "Nguyen Thi G", "Tran Thi B", "Tran Thi B"],
      [
        { status: "Done", dueDate: "01 Dec 2024" },
        { status: "Done", dueDate: "03 Dec 2024" },
        { status: "Done", dueDate: "07 Dec 2024" },
        { status: "Awaiting QC", dueDate: "14 Dec 2024" },
        { dueDate: "16 Dec 2024" }, { dueDate: "18 Dec 2024" },
      ]),
  },
  {
    id: "j6",
    jobNo: "JOB-RTG-2024-045",
    projectNo: "PRJ-2024-RTG-10",
    productName: "RTG Crane Cabin",
    partSN: "RTG-045-CB-001",
    customer: "Cai Mep International Terminal",
    status: "Completed",
    createdDate: "01 Nov 2024",
    startDate: "05 Nov 2024",
    dueDate: "30 Nov 2024",
    notes: "Cabin including air conditioning and ergonomic operator seat.",
    progress: 100,
    tasks: makeTasksFor("j6t",
      ["Nguyen Van G", "Nguyen Van A", "Le Van C", "Le Van C", "Pham Van D", "Tran Van F"],
      ["Tran Thi B", "Tran Thi B", "Le Thi H", "Nguyen Thi G", "Tran Thi B", "Tran Thi B"],
      [
        { status: "Done", dueDate: "08 Nov 2024" }, { status: "Done", dueDate: "12 Nov 2024" },
        { status: "Done", dueDate: "16 Nov 2024" }, { status: "Done", dueDate: "20 Nov 2024" },
        { status: "Done", dueDate: "26 Nov 2024" }, { status: "Done", dueDate: "30 Nov 2024" },
      ]),
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, "0"); }

function formatElapsed(start: Date): string {
  const s = Math.floor((Date.now() - start.getTime()) / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

function formatCountdown(start: Date, hours: number): string {
  const rem = Math.max(0, hours * 3600 - Math.floor((Date.now() - start.getTime()) / 1000));
  return `${pad(Math.floor(rem / 3600))}:${pad(Math.floor((rem % 3600) / 60))}:${pad(rem % 60)}`;
}

function getProgress(start: Date, hours: number): number {
  return Math.min(100, Math.round(((Date.now() - start.getTime()) / 1000 / (hours * 3600)) * 100));
}

// ─── Shared UI Atoms ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    "Pending": "bg-gray-100 text-gray-500",
    "In Progress": "bg-blue-50 text-[#0E70B8]",
    "Awaiting QC": "bg-purple-50 text-purple-700",
    "Awaiting Rework": "bg-amber-50 text-amber-700",
    "Done": "bg-emerald-50 text-emerald-700",
  };
  const labels: Record<TaskStatus, string> = {
    "Pending": "Pending",
    "In Progress": "In Progress",
    "Awaiting QC": "Awaiting QC",
    "Awaiting Rework": "Rework",
    "Done": "Done",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

function WorkshopBadge({ workshop }: { workshop: string }) {
  const colors: Record<string, string> = {
    "Cutting & Bending": "bg-sky-50 text-sky-700",
    "Machining": "bg-indigo-50 text-indigo-700",
    "Welding": "bg-orange-50 text-orange-700",
    "Painting": "bg-pink-50 text-pink-700",
    "Assembly": "bg-teal-50 text-teal-700",
    "Packaging": "bg-lime-50 text-lime-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[workshop] ?? "bg-gray-100 text-gray-500"}`}>
      {workshop}
    </span>
  );
}

function StatCard({ value, label, color }: { value: number | string; label: string; color: string }) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-3 flex flex-col gap-0.5 border border-black/5"
      style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
      <span className={`text-[22px] font-extrabold leading-none ${color}`}>{value}</span>
      <span className="text-[11px] text-[#8F96A3] leading-tight font-medium">{label}</span>
    </div>
  );
}

function DocRow({ icon, name, sub }: { icon: React.ReactNode; name: string; sub: string }) {
  const [showViewer, setShowViewer] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-black/5">
        <div className="w-9 h-9 rounded-xl bg-[#EAF3FB] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#0F0F0F] truncate">{name}</p>
          <p className="text-[11px] text-[#8F96A3]">{sub}</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setShowViewer(true)} className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border border-black/5">
            <Eye size={12} className="text-[#8F96A3]" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border border-black/5">
            <Download size={12} className="text-[#8F96A3]" />
          </button>
        </div>
      </div>

      {showViewer && (
        <div className="absolute inset-0 z-[90] bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-[90%] max-w-3xl p-4 relative">
            <button onClick={() => setShowViewer(false)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <XIcon size={16} />
            </button>
            <p className="font-bold text-[14px] mb-3">{name}</p>
            <div className="flex gap-4">
              <img src={imgBg} alt="sample" className="w-1/2 object-contain rounded" />
              <div className="flex-1">
                <p className="text-[13px] text-[#8F96A3] mb-2">{sub}</p>
                <p className="text-[13px]">This is a sample preview of the drawing / document. Replace with real file preview as needed.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoGrid({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      {rows.map(({ label, value }) => (
        <div key={label}>
          <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide">{label}</p>
          <p className="text-[13px] font-semibold text-[#0F0F0F] leading-tight mt-0.5">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Scanner & Print Overlays ─────────────────────────────────────────────────
function ScannerOverlay({ onClose, scannedCode }: { onClose: () => void; scannedCode?: string }) {
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setCode(scannedCode ?? "TSK-051-001");
      setScanned(true);
    }, 2200);
    return () => clearTimeout(t);
  }, [scannedCode]);

  return (
    <div className="absolute inset-0 z-[80] flex flex-col items-center justify-center bg-black/85">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 px-5 pt-5 pb-4 flex items-center justify-between">
        <p className="text-white font-extrabold text-[16px]">Scan Code</p>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <XIcon size={18} className="text-white" />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="relative w-[220px] h-[220px]">
        {/* Corner brackets */}
        {[["top-0 left-0", "border-t-2 border-l-2 rounded-tl-lg"],
          ["top-0 right-0", "border-t-2 border-r-2 rounded-tr-lg"],
          ["bottom-0 left-0", "border-b-2 border-l-2 rounded-bl-lg"],
          ["bottom-0 right-0", "border-b-2 border-r-2 rounded-br-lg"]
        ].map(([pos, cls]) => (
          <div key={pos} className={`absolute w-7 h-7 border-white ${cls} ${pos}`} />
        ))}

        {/* Scan line */}
        {!scanned && (
          <motion.div
            className="absolute inset-x-3 h-[2px] rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #4ADE80, transparent)", boxShadow: "0 0 8px rgba(74,222,128,0.8)" }}
            animate={{ y: [8, 204, 8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Scanned result */}
        {scanned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-full bg-green-400/20 flex items-center justify-center">
              <Check size={28} className="text-green-400" />
            </div>
            <p className="text-green-400 text-[13px] font-extrabold">{code}</p>
          </div>
        )}
      </div>

      <p className="text-white/60 text-[12px] font-medium mt-6">
        {scanned ? "Code detected!" : "Align barcode or QR code within the frame"}
      </p>

      <button
        onClick={onClose}
        className="mt-8 px-8 h-11 rounded-2xl bg-white/15 text-white font-bold text-[14px]"
      >
        {scanned ? "Done" : "Cancel"}
      </button>
    </div>
  );
}

function PrintOverlay({ onClose, label }: { onClose: () => void; label: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 1600); return () => clearTimeout(t); }, []);
  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-3xl p-6 mx-6 w-full flex flex-col items-center gap-3"
        style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.3)" }}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${done ? "bg-emerald-50" : "bg-[#EAF3FB]"}`}>
          {done
            ? <Check size={26} className="text-emerald-500" />
            : <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Printer size={26} className="text-[#0E70B8]" />
              </motion.div>
          }
        </div>
        <div className="text-center">
          <p className="text-[16px] font-extrabold text-[#0F0F0F]">{done ? "Sent to Printer" : "Printing…"}</p>
          <p className="text-[12px] text-[#8F96A3] mt-0.5">{label}</p>
        </div>
        {done && (
          <button onClick={onClose}
            className="w-full h-11 rounded-2xl text-white font-bold text-[14px]"
            style={{ background: "linear-gradient(71.49deg, #006FBA 18.99%, #038BE7 76.6%)" }}>
            Close
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Shared Header Action Buttons ─────────────────────────────────────────────
function HeaderIconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="w-9 h-9 rounded-[12px] bg-white border border-black/5 flex items-center justify-center"
      style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.08)" }}>
      {children}
    </button>
  );
}

// ─── Notification Center ──────────────────────────────────────────────────────
interface NotifItem {
  id: string;
  type: "alert" | "success" | "task" | "qc" | "info";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Record<"worker" | "qc" | "pe", NotifItem[]> = {
  worker: [
    { id: "w1", type: "alert",   title: "QC Rejection — Rework Required",         body: "TSK-050-003 Welding weld bead issue at joint J-04. Re-weld and resubmit.",            time: "2 min ago",  unread: true  },
    { id: "w2", type: "task",    title: "New Task Assigned",                        body: "TSK-051-001 Cutting & Bending — Main Frame Rails is ready to start.",                 time: "30 min ago", unread: true  },
    { id: "w3", type: "success", title: "Task Approved by QC",                     body: "TSK-049-001 Machining passed QC inspection. Great work!",                             time: "1 hr ago",   unread: true  },
    { id: "w4", type: "alert",   title: "Deadline Reminder",                        body: "TSK-050-003 due today at 18:00. 2 hours remaining.",                                  time: "2 hr ago",   unread: false },
    { id: "w5", type: "success", title: "Task Completed & Passed",                 body: "TSK-048-004 Painting inspection approved. Moved to Assembly.",                        time: "Yesterday",  unread: false },
    { id: "w6", type: "info",    title: "Schedule Updated",                         body: "JOB-RTG-2024-049 due date extended to 22 Dec 2024 by Project Engineer.",             time: "Yesterday",  unread: false },
  ],
  qc: [
    { id: "q1", type: "qc",     title: "Ready for Inspection",                     body: "TSK-048-004 Hydraulic Tank Painting submitted by Le Van C.",                          time: "5 min ago",  unread: true  },
    { id: "q2", type: "qc",     title: "Ready for Inspection",                     body: "TSK-047-005 Boom Structure Assembly submitted by Pham Van D.",                        time: "15 min ago", unread: true  },
    { id: "q3", type: "alert",  title: "Inspection Deadline Tomorrow",              body: "TSK-046-002 Spreader Frame Welding must be inspected by 21 Dec.",                    time: "1 hr ago",   unread: false },
    { id: "q4", type: "success", title: "Rework Completed",                        body: "TSK-050-003 rework finished by Nguyen Van A. Ready for re-inspection.",               time: "3 hr ago",   unread: false },
    { id: "q5", type: "info",   title: "New Tasks in Queue",                        body: "3 new tasks assigned to your inspection queue for JOB-RTG-2024-051.",                time: "Yesterday",  unread: false },
  ],
  pe: [
    { id: "p1", type: "alert",  title: "Unassigned Job — Action Required",         body: "JOB-RTG-2024-052 has 6 tasks with no workers assigned. Publish before Jan 6.",       time: "Just now",   unread: true  },
    { id: "p2", type: "alert",  title: "Deadline Approaching",                     body: "JOB-RTG-2024-051 due 20 Dec 2024 — 3 days remaining. 20% progress.",                 time: "10 min ago", unread: true  },
    { id: "p3", type: "success", title: "Job Completed",                           body: "JOB-RTG-2024-045 RTG Crane Cabin completed by team. All 6 tasks passed QC.",          time: "1 hr ago",   unread: true  },
    { id: "p4", type: "qc",     title: "QC Requested Rework",                      body: "JOB-RTG-2024-050 Step 3 Welding rejected by Le Thi H. Worker notified.",              time: "2 hr ago",   unread: true  },
    { id: "p5", type: "task",   title: "Job Assigned Successfully",                body: "JOB-RTG-2024-049 published. 6 workers and 4 QC engineers notified.",                  time: "3 hr ago",   unread: true  },
    { id: "p6", type: "info",   title: "Progress Update",                           body: "JOB-RTG-2024-048 is 68% complete. On track for 18 Dec delivery.",                   time: "Yesterday",  unread: false },
    { id: "p7", type: "success", title: "Customer Confirmation",                   body: "Tan Cang Saigon Port confirmed order for JOB-RTG-2024-052.",                          time: "2 days ago", unread: false },
  ],
};

const NOTIF_UNREAD_COUNT: Record<"worker" | "qc" | "pe", number> = { worker: 3, qc: 2, pe: 5 };

function NotificationCenter({ role, onClose }: { role: "worker" | "qc" | "pe"; onClose: () => void }) {
  const [items, setItems] = useState<NotifItem[]>(NOTIFICATIONS[role]);
  const unread = items.filter(n => n.unread).length;

  const iconMap: Record<NotifItem["type"], { bg: string; icon: React.ReactNode }> = {
    alert:   { bg: "bg-amber-50",   icon: <AlertTriangle size={15} className="text-amber-600" /> },
    success: { bg: "bg-emerald-50", icon: <BadgeCheck size={15} className="text-emerald-600" /> },
    task:    { bg: "bg-[#EAF3FB]",  icon: <ClipboardCheck size={15} className="text-[#0E70B8]" /> },
    qc:      { bg: "bg-purple-50",  icon: <Shield size={15} className="text-purple-600" /> },
    info:    { bg: "bg-gray-100",   icon: <Clock size={15} className="text-[#8F96A3]" /> },
  };

  const accentColor = role === "pe" ? "#F59E0B" : role === "qc" ? "#7C3AED" : "#0E70B8";

  return (
    <div className="absolute inset-0 z-[70]" onClick={onClose}>
      <motion.div
        className="absolute top-0 left-0 right-0 bg-white flex flex-col"
        style={{ maxHeight: "88%", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, boxShadow: "0 24px 60px rgba(0,0,0,0.22)" }}
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 32, stiffness: 420 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-black/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <p className="text-[18px] font-extrabold text-[#0F0F0F]">Notifications</p>
              {unread > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold text-white"
                  style={{ background: accentColor }}>
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {unread > 0 && (
                <button onClick={() => setItems(prev => prev.map(n => ({ ...n, unread: false })))}
                  className="text-[12px] font-bold" style={{ color: accentColor }}>
                  Mark all read
                </button>
              )}
              <button onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <XIcon size={16} className="text-[#8F96A3]" />
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {items.map((n, idx) => {
            const { bg, icon } = iconMap[n.type];
            return (
              <button
                key={n.id}
                onClick={() => setItems(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                className={`w-full px-5 py-3.5 flex items-start gap-3 text-left transition-colors ${n.unread ? "bg-white" : "bg-gray-50/60"} ${idx < items.length - 1 ? "border-b border-black/5" : ""}`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {icon}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`text-[13px] leading-tight ${n.unread ? "font-bold text-[#0F0F0F]" : "font-semibold text-[#8F96A3]"}`}>
                      {n.title}
                    </p>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: accentColor }} />
                    )}
                  </div>
                  <p className="text-[12px] text-[#8F96A3] leading-relaxed font-medium line-clamp-2">{n.body}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide mt-1.5" style={{ color: accentColor, opacity: n.unread ? 1 : 0.5 }}>
                    {n.time}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-black/5">
          <button className="w-full h-10 rounded-2xl border border-black/8 text-[13px] font-bold text-[#8F96A3]">
            View All Notifications
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── App Menu ─────────────────────────────────────────────────────────────────
const APP_MENU_CONFIG = {
  worker: {
    name: "Nguyen Van A",
    initials: "NA",
    roleLabel: "Worker",
    accent: "#0E70B8",
    accentBg: "#EAF3FB",
    accentText: "text-[#0E70B8]",
    navItems: [
      { icon: <Home size={18} />,         label: "Dashboard",      active: true  },
      { icon: <ListTodo size={18} />,     label: "My Tasks",       active: false },
      { icon: <ScanLine size={18} />,     label: "Scan Task",      active: false },
      { icon: <ClipboardCheck size={18} />, label: "Task History", active: false },
    ],
  },
  qc: {
    name: "Tran Thi B",
    initials: "TB",
    roleLabel: "QC Engineer",
    accent: "#7C3AED",
    accentBg: "#F5F3FF",
    accentText: "text-purple-600",
    navItems: [
      { icon: <Home size={18} />,           label: "Dashboard",        active: true  },
      { icon: <Shield size={18} />,         label: "Inspection Queue", active: false },
      { icon: <ScanLine size={18} />,       label: "Scan Task",        active: false },
      { icon: <ClipboardCheck size={18} />, label: "Reports",          active: false },
    ],
  },
  pe: {
    name: "Nguyen Duc K",
    initials: "NK",
    roleLabel: "Project Engineer",
    accent: "#D97706",
    accentBg: "#FEF3C7",
    accentText: "text-amber-600",
    navItems: [
      { icon: <Home size={18} />,       label: "Dashboard", active: true  },
      { icon: <Briefcase size={18} />,  label: "Jobs",      active: false },
      { icon: <Users size={18} />,      label: "Team",      active: false },
      { icon: <BarChart3 size={18} />,  label: "Analytics", active: false },
    ],
  },
} as const;

function AppMenu({ role, onClose }: { role: "worker" | "qc" | "pe"; onClose: () => void }) {
  const cfg = APP_MENU_CONFIG[role];
  return (
    <div className="absolute inset-0 z-[70] flex" onClick={onClose}>
      {/* Drawer */}
      <motion.div
        className="relative h-full bg-white flex flex-col"
        style={{ width: "78%", maxWidth: 320, boxShadow: "8px 0 40px rgba(0,0,0,0.18)" }}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 380 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Brand header */}
        <div className="px-6 pt-10 pb-6"
          style={{ background: `linear-gradient(135deg, ${cfg.accent}18, ${cfg.accent}06)` }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: cfg.accent }}>
              <Cog size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-[#0F0F0F] leading-none">Production Flow</p>
              <p className="text-[10px] text-[#8F96A3] font-semibold mt-0.5">v2.4.1 · MJVN Factory</p>
            </div>
          </div>

          {/* User card */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: cfg.accent }}>
              <span className="text-[14px] font-extrabold text-white">{cfg.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-extrabold text-[#0F0F0F] truncate">{cfg.name}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5"
                style={{ background: cfg.accentBg, color: cfg.accent }}>
                {cfg.roleLabel}
              </span>
            </div>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center border border-black/8 bg-white">
              <Pencil size={13} className="text-[#8F96A3]" />
            </button>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto px-3 py-2" style={{ scrollbarWidth: "none" }}>
          <p className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#8F96A3]">Navigation</p>
          {cfg.navItems.map(item => (
            <button
              key={item.label}
              onClick={onClose}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl mb-0.5 transition-colors text-left"
              style={item.active ? { background: cfg.accentBg } : {}}
            >
              <span style={{ color: item.active ? cfg.accent : "#8F96A3" }}>{item.icon}</span>
              <span className="flex-1 text-[14px] font-semibold"
                style={{ color: item.active ? cfg.accent : "#0F0F0F" }}>
                {item.label}
              </span>
              {item.active && (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.accent }} />
              )}
            </button>
          ))}

          <div className="my-3 mx-3 h-px bg-black/5" />
          <p className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#8F96A3]">General</p>

          {[
            { icon: <Settings size={18} />, label: "Settings" },
            { icon: <HelpCircle size={18} />, label: "Help & Support" },
          ].map(item => (
            <button key={item.label} onClick={onClose}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl mb-0.5 hover:bg-gray-50 transition-colors text-left">
              <span className="text-[#8F96A3]">{item.icon}</span>
              <span className="flex-1 text-[14px] font-semibold text-[#0F0F0F]">{item.label}</span>
              <ChevRight size={14} className="text-[#8F96A3]" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 pb-8 pt-3 border-t border-black/5">
          <button onClick={onClose}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-red-50 text-red-600">
            <LogOut size={18} />
            <span className="text-[14px] font-bold">Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Right overlay tap-to-close */}
      <div className="flex-1 bg-black/40" />
    </div>
  );
}

// ─── Phone Chrome ─────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 pb-1 flex-shrink-0">
      <span className="text-[15px] font-bold text-[#0F0F0F] font-['Manrope',sans-serif]">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="4" width="2.5" height="8" rx="1" fill="#0F0F0F" opacity="0.3"/>
          <rect x="4" y="2.5" width="2.5" height="9.5" rx="1" fill="#0F0F0F" opacity="0.5"/>
          <rect x="8" y="1" width="2.5" height="11" rx="1" fill="#0F0F0F" opacity="0.7"/>
          <rect x="12" y="0" width="2.5" height="12" rx="1" fill="#0F0F0F"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 2.5C10.3 2.5 12.4 3.5 13.8 5.1L15 3.9C13.2 2 10.7 0.8 8 0.8C5.3 0.8 2.8 2 1 3.9L2.2 5.1C3.6 3.5 5.7 2.5 8 2.5Z" fill="#0F0F0F" opacity="0.35"/>
          <path d="M8 5.5C9.5 5.5 10.9 6.1 11.9 7.1L13.1 5.9C11.8 4.6 10 3.8 8 3.8C6 3.8 4.2 4.6 2.9 5.9L4.1 7.1C5.1 6.1 6.5 5.5 8 5.5Z" fill="#0F0F0F" opacity="0.65"/>
          <circle cx="8" cy="10" r="1.5" fill="#0F0F0F"/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#0F0F0F" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="18" height="9" rx="2" fill="#0F0F0F"/>
          <path d="M25 4.5V8.5C25.9 8.1 26.5 7.1 26.5 6.5C26.5 5.9 25.9 4.9 25 4.5Z" fill="#0F0F0F" opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function BottomNav({
  role, activeTab, onNavigate, onSwitchRole,
}: {
  role: Role;
  activeTab: "home" | "tasks" | "history" | "settings";
  onNavigate: (tab: string) => void;
  onSwitchRole: () => void;
}) {
  return (
    <div className="flex-shrink-0 relative" style={{ boxShadow: "0 -1px 0 rgba(0,0,0,0.06)" }}>
      <div className="absolute inset-0 bg-white/85 backdrop-blur-xl" />
      <div className="relative flex items-end pt-2">
        <NavBtn icon={<Home size={22} />} label="Home" active={activeTab === "home"} onClick={() => onNavigate("home")} />
        <NavBtn icon={<ListTodo size={22} />} label="Tasks" active={activeTab === "tasks"} onClick={() => onNavigate("tasks")} />
        {/* Center elevated button */}
        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={onSwitchRole}
            className="absolute -top-6 w-[58px] h-[58px] rounded-full flex items-center justify-center shadow-lg border-4 border-[#F5F8FC]"
            style={{ background: "linear-gradient(71.49deg, #006FBA 18.99%, #038BE7 76.6%)" }}
          >
            {role === "worker" ? <HardHat size={24} className="text-white" /> : <Shield size={24} className="text-white" />}
          </button>
          <span className="mt-10 mb-1 text-[11px] font-semibold text-[#8F96A3]">
            {role === "worker" ? "Worker" : "QC"}
          </span>
        </div>
        <NavBtn icon={<ClipboardCheck size={22} />} label="History" active={activeTab === "history"} onClick={() => {}} />
        <NavBtn icon={<Settings size={22} />} label="Settings" active={activeTab === "settings"} onClick={() => {}} />
      </div>
      <div className="flex justify-center pb-2 pt-1">
        <div className="w-32 h-1 bg-black/20 rounded-full" />
      </div>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button className="flex-1 flex flex-col items-center gap-1 pt-2 pb-1" onClick={onClick}>
      <span className={active ? "text-[#0E70B8]" : "text-[#8F96A3]"}>{icon}</span>
      <span className={`text-[11px] font-semibold ${active ? "text-[#0E70B8]" : "text-[#8F96A3]"}`}>{label}</span>
    </button>
  );
}

function HomeIndicatorBar() {
  return (
    <div className="flex-shrink-0 bg-white flex justify-center py-2">
      <div className="w-32 h-1 bg-black/25 rounded-full" />
    </div>
  );
}

// ─── Screen 1: Worker Dashboard ───────────────────────────────────────────────
function WorkerDashboard({
  tasks, onTaskClick,
}: {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  const [filter, setFilter] = useState<"All" | "In Progress" | "Awaiting Rework" | "Done">("All");
  const [tick, setTick] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const inProgress = tasks.filter(t => t.status === "In Progress");
  const rework = tasks.filter(t => t.status === "Awaiting Rework");
  const done = tasks.filter(t => t.status === "Done");
  const pending = tasks.filter(t => t.status === "Pending");
  const activeTask = inProgress[0];

  const displayed = filter === "All" ? tasks
    : filter === "In Progress" ? inProgress
    : filter === "Awaiting Rework" ? rework
    : done;

  const statusDotColor: Record<TaskStatus, string> = {
    "Pending": "#94a3b8",
    "In Progress": "#155dfc",
    "Awaiting QC": "#7c3aed",
    "Awaiting Rework": "#ef4444",
    "Done": "#16a34a",
  };
  const statusBgColor: Record<TaskStatus, string> = {
    "Pending": "#f1f5f9",
    "In Progress": "#dbeafe",
    "Awaiting QC": "#ede9fe",
    "Awaiting Rework": "#ffe2e2",
    "Done": "#dcfce7",
  };
  const statusTextColor: Record<TaskStatus, string> = {
    "Pending": "#45556c",
    "In Progress": "#1447e6",
    "Awaiting QC": "#6d28d9",
    "Awaiting Rework": "#c10007",
    "Done": "#15803d",
  };

  return (
    <>
    <div className="flex flex-col h-full" style={{ background: "#f0f2f5" }}>
      {/* Top bar */}
      <div className="flex-shrink-0 bg-white border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button onClick={() => setShowMenu(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
            <Menu size={18} className="text-[#64748b]" />
          </button>
          <div>
            <p className="text-[15px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Worker Dashboard</p>
            <p className="text-[11px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Nguyen Van A · Worker</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowScanner(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
            <ScanLine size={16} className="text-[#64748b]" />
          </button>
          <button onClick={() => setShowPrint(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
            <Printer size={16} className="text-[#64748b]" />
          </button>
          <div className="relative">
            <button onClick={() => setShowNotifications(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
              <Bell size={16} className="text-[#64748b]" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#ef4444] rounded-full text-[8px] text-white font-bold flex items-center justify-center">3</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="p-4 flex flex-col gap-3">

          {/* Active task banner */}
          {activeTask && (
            <button
              onClick={() => onTaskClick(activeTask)}
              className="w-full rounded-xl p-3.5 flex items-center justify-between text-left"
              style={{ background: "#155dfc" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Play size={13} fill="white" className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-white/70 font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>Active Task</p>
                  <p className="text-[13px] text-white font-bold truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{activeTask.taskNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 bg-white/20 rounded-lg px-2.5 py-1.5">
                <span className="text-[11px] text-white font-bold">View Task</span>
                <ChevronRight size={12} className="text-white" />
              </div>
            </button>
          )}

          {/* Rework alert banner */}
          {rework.length > 0 && (
            <div className="rounded-xl p-3 border border-[#ffc9c9] flex items-center gap-2.5" style={{ background: "#fef2f2" }}>
              <div className="w-7 h-7 rounded-lg bg-[#ffe2e2] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={13} className="text-[#c10007]" />
              </div>
              <p className="text-[12px] text-[#c10007] font-semibold flex-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                {rework.length} task{rework.length > 1 ? "s" : ""} require rework — QC rejected
              </p>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Total Assigned", value: tasks.length, iconBg: "#f1f5f9", iconColor: "#64748b", icon: <ListTodo size={16} color="#64748b" /> },
              { label: "In Progress", value: inProgress.length, iconBg: "#dbeafe", iconColor: "#155dfc", icon: <Play size={15} color="#155dfc" /> },
              { label: "Awaiting Rework", value: rework.length, iconBg: "#ffe2e2", iconColor: "#ef4444", icon: <RotateCcw size={15} color="#ef4444" /> },
              { label: "Done Today", value: done.length, iconBg: "#dcfce7", iconColor: "#16a34a", icon: <CheckCheck size={15} color="#16a34a" /> },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl p-3 border border-[#e2e8f0] flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: card.iconBg }}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[20px] font-bold text-[#1a2332] leading-none" style={{ fontFamily: "Manrope, sans-serif" }}>{card.value}</p>
                  <p className="text-[10px] text-[#64748b] font-semibold mt-0.5 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* My Tasks section */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between" style={{ background: "#f8fafc" }}>
              <p className="text-[13px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>My Tasks</p>
              <div className="flex gap-1">
                {(["All", "In Progress", "Awaiting Rework", "Done"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      background: filter === f ? "#155dfc" : "transparent",
                      color: filter === f ? "white" : "#64748b",
                    }}
                  >
                    {f === "All" ? "All" : f === "In Progress" ? "Active" : f === "Awaiting Rework" ? "Rework" : "Done"}
                  </button>
                ))}
              </div>
            </div>

            {displayed.length === 0 && (
              <div className="py-8 text-center text-[#64748b] text-[13px]" style={{ fontFamily: "Manrope, sans-serif" }}>
                No tasks in this category
              </div>
            )}

            {displayed.map((task, i) => (
              <button
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="w-full text-left px-4 py-3 active:bg-[#f8fafc] transition-colors"
                style={{ borderTop: i > 0 ? "1px solid #e2e8f0" : "none" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#155dfc", fontFamily: "Manrope, sans-serif" }}>
                        {task.taskNo}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: statusBgColor[task.status], color: statusTextColor[task.status], fontFamily: "Manrope, sans-serif" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusDotColor[task.status] }} />
                        {task.status}
                      </span>
                    </div>
                    <p className="text-[12px] font-semibold text-[#1a2332] leading-snug truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{task.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Due: {task.dueDate}</span>
                      <span className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>{task.workshop}</span>
                    </div>
                    {task.status === "In Progress" && task.startTime && (
                      <div className="mt-2">
                        <div className="w-full h-1 bg-[#dbeafe] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${Math.min(100, getProgress(task.startTime, task.estimationHours))}%`,
                            background: "#155dfc",
                          }} />
                        </div>
                        <p className="text-[10px] text-[#155dfc] font-semibold mt-0.5" style={{ fontFamily: "Manrope, sans-serif" }}>
                          {formatElapsed(task.startTime)} elapsed
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-[#94a3b8] flex-shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
    {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} />}
    {showPrint && <PrintOverlay onClose={() => setShowPrint(false)} label="Worker Task List" />}
    {showNotifications && <NotificationCenter role="worker" onClose={() => setShowNotifications(false)} />}
    {showMenu && <AppMenu role="worker" onClose={() => setShowMenu(false)} />}
    </>
  );
}

// ─── Screen 2: Worker Task Detail ─────────────────────────────────────────────
function WorkerTaskDetail({
  task, onUpdate, onBack,
}: {
  task: Task;
  onUpdate: (u: Partial<Task>) => void;
  onBack: () => void;
}) {
  const [tick, setTick] = useState(0);
  const [showDoneSheet, setShowDoneSheet] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (task.status !== "In Progress" || !task.startTime) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [task.status, task.startTime]);

  const isOvertime = task.startTime ? getProgress(task.startTime, task.estimationHours) >= 100 : false;
  const prog = task.startTime ? getProgress(task.startTime, task.estimationHours) : 0;

  const statusDotColor: Record<TaskStatus, string> = {
    "Pending": "#94a3b8", "In Progress": "#155dfc", "Awaiting QC": "#7c3aed",
    "Awaiting Rework": "#fe9a00", "Done": "#16a34a",
  };
  const statusBgColor: Record<TaskStatus, string> = {
    "Pending": "#f1f5f9", "In Progress": "#dbeafe", "Awaiting QC": "#ede9fe",
    "Awaiting Rework": "#fef3c6", "Done": "#dcfce7",
  };
  const statusTextColor: Record<TaskStatus, string> = {
    "Pending": "#45556c", "In Progress": "#1447e6", "Awaiting QC": "#6d28d9",
    "Awaiting Rework": "#bb4d00", "Done": "#15803d",
  };

  return (
    <>
      <div className="flex flex-col h-full" style={{ background: "#f0f2f5" }}>
        {/* Top bar */}
        <div className="flex-shrink-0 bg-white border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button onClick={onBack} className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center">
              <ChevronLeft size={16} className="text-[#64748b]" />
            </button>
            <div>
              <p className="text-[14px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>{task.taskNo}</p>
              <p className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>{task.jobNo} · {task.workshop}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: statusBgColor[task.status], color: statusTextColor[task.status], fontFamily: "Manrope, sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDotColor[task.status] }} />
              {task.status}
            </span>
            <button onClick={() => setShowPrint(true)} className="h-7 px-2.5 rounded-lg border border-[#e2e8f0] flex items-center gap-1">
              <Printer size={12} className="text-[#64748b]" />
              <span className="text-[10px] font-semibold text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Print</span>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="p-4 flex flex-col gap-3">

            {/* Job Traveler Steps */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
                <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest" style={{ fontFamily: "Manrope, sans-serif" }}>Job Traveler Steps</p>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-start">
                  {WORKSHOP_STEPS.map((step, i) => (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                      {i < WORKSHOP_STEPS.length - 1 && (
                        <div className="absolute top-[12px] left-1/2 w-full h-0.5" style={{ background: i + 1 < task.step ? "#bbf7d0" : "#e2e8f0" }} />
                      )}
                      <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold mb-1"
                        style={{
                          background: i + 1 < task.step ? "#dcfce7" : i + 1 === task.step ? "#155dfc" : "#f1f5f9",
                          color: i + 1 < task.step ? "#16a34a" : i + 1 === task.step ? "white" : "#94a3b8",
                        }}>
                        {i + 1 < task.step ? <Check size={10} /> : i + 1}
                      </div>
                      <p className="text-[8px] text-[#64748b] text-center leading-tight font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Information */}
            <div className="bg-white rounded-xl border border-[#e2e8f0]">
              <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
                <p className="text-[12px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Task Information</p>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748b] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>Task Description</p>
                  <p className="text-[13px] font-semibold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>{task.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Job Number", value: task.jobNo },
                    { label: "Product Name", value: task.productName },
                    { label: "Part / Assy SN", value: task.partSN },
                    { label: "Workshop", value: task.workshop },
                    { label: "Estimation", value: `${task.estimationHours}h` },
                    { label: "Due Date", value: task.dueDate },
                    { label: "Assigned QC", value: task.qcName },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748b] mb-0.5" style={{ fontFamily: "Manrope, sans-serif" }}>{label}</p>
                      <p className="text-[12px] font-semibold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Tracking */}
            {task.startTime && task.status === "In Progress" && (
              <div className="bg-white rounded-xl border border-[#e2e8f0]">
                <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
                  <p className="text-[12px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Time Tracking</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between text-[11px] font-semibold mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                    <span className="text-[#64748b]">{Math.min(100, prog)}% complete</span>
                    <span className={isOvertime ? "text-[#ef4444]" : "text-[#155dfc]"}>{isOvertime ? "OVERTIME" : "On track"}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "#e2e8f0" }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${Math.min(100, prog)}%`,
                      background: isOvertime ? "#ef4444" : "#155dfc",
                    }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-2.5 border border-[#e2e8f0]">
                      <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>Elapsed</p>
                      <p className="text-[16px] font-bold text-[#155dfc]" style={{ fontFamily: "JetBrains Mono, monospace" }}>{formatElapsed(task.startTime)}</p>
                    </div>
                    <div className="rounded-lg p-2.5 border border-[#e2e8f0]">
                      <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>Remaining</p>
                      <p className={`text-[16px] font-bold ${isOvertime ? "text-[#ef4444]" : "text-[#1a2332]"}`} style={{ fontFamily: "JetBrains Mono, monospace" }}>{formatCountdown(task.startTime, task.estimationHours)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rework rejection note */}
            {task.status === "Awaiting Rework" && task.rejectionNote && (
              <div className="rounded-xl p-3.5 border border-[#ffc9c9]" style={{ background: "#fef2f2" }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-[#c10007]" />
                  <p className="text-[12px] font-bold text-[#c10007]" style={{ fontFamily: "Manrope, sans-serif" }}>QC Rejection Note</p>
                </div>
                <p className="text-[12px] text-[#c10007] leading-relaxed" style={{ fontFamily: "Manrope, sans-serif" }}>{task.rejectionNote}</p>
                <p className="text-[10px] text-[#ef4444] mt-2 font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>Rejected by: {task.qcName}</p>
              </div>
            )}

            {/* Awaiting QC notice */}
            {task.status === "Awaiting QC" && (
              <div className="rounded-xl p-3.5 border border-[#c4b5fd] flex items-center gap-2.5" style={{ background: "#ede9fe" }}>
                <Shield size={16} className="text-[#6d28d9] flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-bold text-[#6d28d9]" style={{ fontFamily: "Manrope, sans-serif" }}>Submitted for QC Inspection</p>
                  <p className="text-[11px] text-[#7c3aed]" style={{ fontFamily: "Manrope, sans-serif" }}>Awaiting: {task.qcName}</p>
                </div>
              </div>
            )}

            {/* Documents & References */}
            <div className="bg-white rounded-xl border border-[#e2e8f0]">
              <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
                <p className="text-[12px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Documents & References</p>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {[
                  { icon: <FileText size={14} className="text-[#ef4444]" />, iconBg: "#fef2f2", name: `JT-${task.jobNo.replace("JOB-RTG-", "")}-Rev02.pdf`, sub: "Job Traveler · 6 steps" },
                  { icon: <ImgIcon size={14} className="text-[#155dfc]" />, iconBg: "#dbeafe", name: `DWG-${task.partSN}-A1.pdf`, sub: "General Assembly Drawing" },
                  { icon: <ImgIcon size={14} className="text-[#155dfc]" />, iconBg: "#dbeafe", name: `DWG-${task.partSN}-B2.pdf`, sub: "Detail Drawing" },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3 rounded-lg p-2.5 border border-[#e2e8f0]">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: doc.iconBg }}>
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-[#1a2332] truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{doc.name}</p>
                      <p className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>{doc.sub}</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="w-6 h-6 rounded-md border border-[#e2e8f0] flex items-center justify-center">
                        <Eye size={11} className="text-[#64748b]" />
                      </button>
                      <button className="w-6 h-6 rounded-md border border-[#e2e8f0] flex items-center justify-center">
                        <Download size={11} className="text-[#64748b]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-2" />
          </div>
        </div>

        {/* Action footer */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-[#e2e8f0]">
          {task.status === "Pending" && (
            <button
              onClick={() => onUpdate({ status: "In Progress", startTime: new Date() })}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-[14px]"
              style={{ background: "#155dfc", fontFamily: "Manrope, sans-serif" }}
            >
              <Play size={15} fill="white" /> Start Task
            </button>
          )}
          {task.status === "In Progress" && (
            <button
              onClick={() => setShowDoneSheet(true)}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-[14px]"
              style={{ background: "#16a34a", fontFamily: "Manrope, sans-serif" }}
            >
              <CheckCheck size={15} /> Mark as Done
            </button>
          )}
          {task.status === "Awaiting Rework" && (
            <button
              onClick={() => onUpdate({ status: "In Progress", startTime: new Date() })}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-[14px]"
              style={{ background: "#d97706", fontFamily: "Manrope, sans-serif" }}
            >
              <RotateCcw size={15} /> Start Rework
            </button>
          )}
        </div>
      </div>

      {/* Done bottom sheet */}
      {showDoneSheet && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-5 pb-7">
            <div className="w-10 h-1 bg-[#e2e8f0] rounded-full mx-auto mb-4" />
            <p className="text-[16px] font-bold text-[#1a2332] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>Submit Task Result</p>
            <p className="text-[12px] text-[#64748b] mb-4 leading-relaxed" style={{ fontFamily: "Manrope, sans-serif" }}>
              Attach result photos before submitting for QC inspection.
            </p>
            <div className="flex gap-2.5 mb-3.5">
              <button className="flex-1 h-14 rounded-xl border border-dashed border-[#155dfc]/40 flex flex-col items-center justify-center gap-1" style={{ background: "#eff6ff" }}>
                <Camera size={18} className="text-[#155dfc]" />
                <span className="text-[10px] text-[#155dfc] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Camera</span>
              </button>
              <button className="flex-1 h-14 rounded-xl border border-dashed border-[#155dfc]/40 flex flex-col items-center justify-center gap-1" style={{ background: "#eff6ff" }}>
                <Upload size={18} className="text-[#155dfc]" />
                <span className="text-[10px] text-[#155dfc] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Upload File</span>
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              {["#dbeafe", "#fef3c6", "#dcfce7"].map((bg, i) => (
                <div key={i} className="w-[64px] h-[64px] rounded-xl border border-[#e2e8f0] flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Camera size={14} className="text-[#94a3b8]" />
                </div>
              ))}
              <div className="w-[64px] h-[64px] rounded-xl border border-dashed border-[#155dfc]/30 flex items-center justify-center" style={{ background: "#eff6ff" }}>
                <span className="text-[#155dfc] text-xl font-light">+</span>
              </div>
            </div>
            <button
              onClick={() => { onUpdate({ status: "Awaiting QC" }); setShowDoneSheet(false); }}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-[14px] mb-2"
              style={{ background: "#155dfc", fontFamily: "Manrope, sans-serif" }}
            >
              <CheckCheck size={15} /> Confirm & Submit
            </button>
            <button onClick={() => setShowDoneSheet(false)}
              className="w-full h-9 text-[#64748b] font-semibold text-[13px]" style={{ fontFamily: "Manrope, sans-serif" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} scannedCode={task.taskNo} />}
      {showPrint && <PrintOverlay onClose={() => setShowPrint(false)} label={`${task.taskNo} · Job Traveler`} />}
      {showNotifications && <NotificationCenter role="worker" onClose={() => setShowNotifications(false)} />}
    </>
  );
}

// ─── Screen 3: QC Dashboard ───────────────────────────────────────────────────
function QCDashboard({
  tasks, onTaskClick,
}: {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  const awaiting = tasks.filter(t => t.status === "Awaiting QC");
  const upcoming = tasks.filter(t => t.status === "Pending");
  const [filter, setFilter] = useState<"All" | "Awaiting QC" | "Pending">("All");
  const [showScanner, setShowScanner] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const displayed = filter === "All" ? tasks
    : filter === "Awaiting QC" ? awaiting
    : upcoming;

  return (
    <>
    <div className="flex flex-col h-full" style={{ background: "#f0f2f5" }}>
      {/* Top bar */}
      <div className="flex-shrink-0 bg-white border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button onClick={() => setShowMenu(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
            <Menu size={18} className="text-[#64748b]" />
          </button>
          <div>
            <p className="text-[15px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>QC Dashboard</p>
            <p className="text-[11px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Le Thi Bich · QC Engineer</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowScanner(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
            <ScanLine size={16} className="text-[#64748b]" />
          </button>
          <button onClick={() => setShowPrint(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
            <Printer size={16} className="text-[#64748b]" />
          </button>
          <div className="relative">
            <button onClick={() => setShowNotifications(true)} className="w-8 h-8 flex items-center justify-center rounded-lg">
              <Bell size={16} className="text-[#64748b]" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#ef4444] rounded-full text-[8px] text-white font-bold flex items-center justify-center">2</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="p-4 flex flex-col gap-3">

          {/* Amber alert banner */}
          {awaiting.length > 0 && (
            <button
              onClick={() => setFilter("Awaiting QC")}
              className="w-full rounded-xl p-3.5 flex items-center justify-between text-left"
              style={{ background: "#fe9a00" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck size={14} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-white/80 font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>Action Required</p>
                  <p className="text-[13px] text-white font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>
                    {awaiting.length} task{awaiting.length > 1 ? "s" : ""} waiting for inspection
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 bg-white rounded-lg px-2.5 py-1.5">
                <span className="text-[11px] font-bold" style={{ color: "#fe9a00", fontFamily: "Manrope, sans-serif" }}>Start</span>
                <ChevronRight size={12} style={{ color: "#fe9a00" }} />
              </div>
            </button>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Awaiting QC", value: awaiting.length, iconBg: "#fef3c6", icon: <ClipboardCheck size={16} color="#fe9a00" /> },
              { label: "Upcoming Tasks", value: upcoming.length, iconBg: "#dbeafe", icon: <Clock size={16} color="#155dfc" /> },
              { label: "Inspected Today", value: 3, iconBg: "#dcfce7", icon: <BadgeCheck size={16} color="#16a34a" /> },
              { label: "Rejected Today", value: 1, iconBg: "#ffe2e2", icon: <XIcon size={16} color="#ef4444" /> },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl p-3 border border-[#e2e8f0] flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: card.iconBg }}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[20px] font-bold text-[#1a2332] leading-none" style={{ fontFamily: "Manrope, sans-serif" }}>{card.value}</p>
                  <p className="text-[10px] text-[#64748b] font-semibold mt-0.5 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Inspection Queue */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between" style={{ background: "#f8fafc" }}>
              <p className="text-[13px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Inspection Queue</p>
              <div className="flex gap-1">
                {(["All", "Awaiting QC", "Pending"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      background: filter === f ? "#fe9a00" : "transparent",
                      color: filter === f ? "white" : "#64748b",
                    }}
                  >
                    {f === "All" ? "All" : f === "Awaiting QC" ? "Ready" : "Upcoming"}
                  </button>
                ))}
              </div>
            </div>

            {displayed.length === 0 && (
              <div className="py-8 text-center text-[#64748b] text-[13px]" style={{ fontFamily: "Manrope, sans-serif" }}>
                No tasks in this category
              </div>
            )}

            {displayed.map((task, i) => (
              <button
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="w-full text-left px-4 py-3 active:bg-[#f8fafc] transition-colors"
                style={{ borderTop: i > 0 ? "1px solid #e2e8f0" : "none" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#fef3c6", color: "#bb4d00", fontFamily: "Manrope, sans-serif" }}>
                        {task.taskNo}
                      </span>
                      {task.status === "Awaiting QC" && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#fef3c6", color: "#bb4d00", fontFamily: "Manrope, sans-serif" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#fe9a00" }} />
                          Awaiting QC
                        </span>
                      )}
                      {task.status === "Pending" && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#45556c", fontFamily: "Manrope, sans-serif" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] font-semibold text-[#1a2332] leading-snug truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{task.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Worker: {task.workerName}</span>
                      <span className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#94a3b8] flex-shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
    {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} />}
    {showPrint && <PrintOverlay onClose={() => setShowPrint(false)} label="QC Task List" />}
    {showNotifications && <NotificationCenter role="qc" onClose={() => setShowNotifications(false)} />}
    {showMenu && <AppMenu role="qc" onClose={() => setShowMenu(false)} />}
    </>
  );
}

// ─── Screen 4: QC Task Detail ─────────────────────────────────────────────────
function QCTaskDetail({
  task, onBack, onInspect,
}: {
  task: Task;
  onBack: () => void;
  onInspect: () => void;
}) {
  const [showScanner, setShowScanner] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const statusDot: Record<TaskStatus, string> = {
    "Pending": "#94a3b8", "In Progress": "#155dfc", "Awaiting QC": "#fe9a00",
    "Awaiting Rework": "#ef4444", "Done": "#16a34a",
  };
  const statusBg: Record<TaskStatus, string> = {
    "Pending": "#f1f5f9", "In Progress": "#dbeafe", "Awaiting QC": "#fef3c6",
    "Awaiting Rework": "#ffe2e2", "Done": "#dcfce7",
  };
  const statusText: Record<TaskStatus, string> = {
    "Pending": "#45556c", "In Progress": "#1447e6", "Awaiting QC": "#bb4d00",
    "Awaiting Rework": "#c10007", "Done": "#15803d",
  };

  return (
    <>
    <div className="flex flex-col h-full" style={{ background: "#f0f2f5" }}>
      {/* Top bar */}
      <div className="flex-shrink-0 bg-white border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center">
            <ChevronLeft size={16} className="text-[#64748b]" />
          </button>
          <div>
            <p className="text-[14px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>{task.taskNo}</p>
            <p className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>{task.jobNo} · {task.workshop}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: statusBg[task.status], color: statusText[task.status], fontFamily: "Manrope, sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDot[task.status] }} />
            {task.status}
          </span>
          <button onClick={() => setShowPrint(true)} className="h-7 px-2.5 rounded-lg border border-[#e2e8f0] flex items-center gap-1">
            <Printer size={12} className="text-[#64748b]" />
            <span className="text-[10px] font-semibold text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Print</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="p-4 flex flex-col gap-3">

          {/* Task Information */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
              <p className="text-[12px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Task Information</p>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748b] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>Task Description</p>
                <p className="text-[13px] font-semibold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>{task.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Job Number", value: task.jobNo },
                  { label: "Product Name", value: task.productName },
                  { label: "Part / Assy SN", value: task.partSN },
                  { label: "Workshop", value: task.workshop },
                  { label: "Worker", value: task.workerName },
                  { label: "QC Engineer", value: task.qcName },
                  { label: "Due Date", value: task.dueDate },
                  { label: "Estimation", value: `${task.estimationHours}h` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748b] mb-0.5" style={{ fontFamily: "Manrope, sans-serif" }}>{label}</p>
                    <p className="text-[12px] font-semibold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Traveler Steps */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
              <p className="text-[12px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Job Traveler Steps</p>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-start">
                {WORKSHOP_STEPS.map((step, i) => (
                  <div key={step} className="flex-1 flex flex-col items-center relative">
                    {i < WORKSHOP_STEPS.length - 1 && (
                      <div className="absolute top-[12px] left-1/2 w-full h-0.5" style={{ background: i + 1 < task.step ? "#bbf7d0" : "#e2e8f0" }} />
                    )}
                    <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold mb-1"
                      style={{
                        background: i + 1 < task.step ? "#dcfce7" : i + 1 === task.step ? "#fe9a00" : "#f1f5f9",
                        color: i + 1 < task.step ? "#16a34a" : i + 1 === task.step ? "white" : "#94a3b8",
                      }}>
                      {i + 1 < task.step ? <Check size={10} /> : i + 1}
                    </div>
                    <p className="text-[8px] text-[#64748b] text-center leading-tight font-semibold" style={{ fontFamily: "Manrope, sans-serif" }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Worker Submission */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
              <p className="text-[12px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Worker Submission</p>
            </div>
            <div className="p-4">
              <p className="text-[11px] text-[#64748b] mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>
                Submitted by {task.workerName} · 18 Dec 2024, 09:15
              </p>
              <div className="flex gap-2 mb-3">
                {["#dbeafe", "#fef3c6", "#dcfce7"].map((bg, i) => (
                  <div key={i} className="w-[72px] h-[72px] rounded-lg border border-[#e2e8f0] flex items-center justify-center" style={{ backgroundColor: bg }}>
                    <Camera size={14} className="text-[#94a3b8]" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2.5 rounded-lg p-2.5 border border-[#e2e8f0]">
                <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#dbeafe" }}>
                  <Paperclip size={13} className="text-[#155dfc]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#1a2332] truncate" style={{ fontFamily: "Manrope, sans-serif" }}>Measurement_Record_Dec18.pdf</p>
                  <p className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>Attached file · 88 KB</p>
                </div>
                <button className="w-6 h-6 rounded-md border border-[#e2e8f0] flex items-center justify-center">
                  <Download size={11} className="text-[#64748b]" />
                </button>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="px-4 py-2.5 border-b border-[#e2e8f0]" style={{ background: "#f8fafc" }}>
              <p className="text-[12px] font-bold text-[#1a2332]" style={{ fontFamily: "Manrope, sans-serif" }}>Documents & References</p>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {[
                { icon: <FileText size={14} className="text-[#ef4444]" />, iconBg: "#fef2f2", name: `JT-${task.jobNo.replace("JOB-RTG-", "")}-Rev02.pdf`, sub: "Job Traveler · 6 steps" },
                { icon: <ImgIcon size={14} className="text-[#155dfc]" />, iconBg: "#dbeafe", name: `DWG-${task.partSN}-A1.pdf`, sub: "Assembly Drawing" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center gap-2.5 rounded-lg p-2.5 border border-[#e2e8f0]">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: doc.iconBg }}>
                    {doc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-[#1a2332] truncate" style={{ fontFamily: "Manrope, sans-serif" }}>{doc.name}</p>
                    <p className="text-[10px] text-[#64748b]" style={{ fontFamily: "Manrope, sans-serif" }}>{doc.sub}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-6 h-6 rounded-md border border-[#e2e8f0] flex items-center justify-center">
                      <Eye size={11} className="text-[#64748b]" />
                    </button>
                    <button className="w-6 h-6 rounded-md border border-[#e2e8f0] flex items-center justify-center">
                      <Download size={11} className="text-[#64748b]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection form prompt */}
          {task.status === "Awaiting QC" && (
            <div className="rounded-xl p-3.5 border border-[#c4b5fd]" style={{ background: "#ede9fe" }}>
              <div className="flex items-center gap-2 mb-1">
                <ClipboardCheck size={14} className="text-[#6d28d9]" />
                <p className="text-[12px] font-bold text-[#6d28d9]" style={{ fontFamily: "Manrope, sans-serif" }}>Inspection Form Ready</p>
              </div>
              <p className="text-[11px] text-[#7c3aed] leading-relaxed" style={{ fontFamily: "Manrope, sans-serif" }}>
                Tank Visual Inspection Report · 13 checklist items
              </p>
            </div>
          )}

          <div className="h-2" />
        </div>
      </div>

      {/* Action footer */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-[#e2e8f0]">
        {task.status === "Awaiting QC" && (
          <button
            onClick={onInspect}
            className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-[14px]"
            style={{ background: "#fe9a00", fontFamily: "Manrope, sans-serif" }}
          >
            <ClipboardCheck size={15} /> Start Inspection
          </button>
        )}
      </div>
    </div>
    {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} scannedCode={task.taskNo} />}
    {showPrint && <PrintOverlay onClose={() => setShowPrint(false)} label={`${task.taskNo} · QC Report`} />}
    {showNotifications && <NotificationCenter role="qc" onClose={() => setShowNotifications(false)} />}
    </>
  );
}

// ─── Screen 5: QC Inspection Form ────────────────────────────────────────────
type InspResult = "pass" | "fail" | null;

function QCInspectionForm({
  task, onBack, onApprove, onReject,
}: {
  task: Task;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [results, setResults] = useState<Record<number, InspResult>>(
    () => Object.fromEntries(INSPECTION_ITEMS.map(i => [i.no, null]))
  );
  const [remarks, setRemarks] = useState<Record<number, string>>(
    () => Object.fromEntries(INSPECTION_ITEMS.map(i => [i.no, ""]))
  );
  const [oilVolume, setOilVolume] = useState("");
  const [generalNote, setGeneralNote] = useState("");
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const checked = Object.values(results).filter(r => r !== null).length;
  const allChecked = checked === INSPECTION_ITEMS.length;
  const anyFailed = Object.values(results).some(r => r === "fail");
  const failCount = Object.values(results).filter(r => r === "fail").length;

  const setResult = (no: number, v: InspResult) =>
    setResults(prev => ({ ...prev, [no]: v }));

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between flex-shrink-0 bg-[#F5F8FC]">
          <button onClick={onBack} className="w-9 h-9 rounded-[12px] bg-white border border-black/5 flex items-center justify-center"
            style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.08)" }}>
            <ChevronLeft size={20} className="text-[#0F0F0F]" />
          </button>
          <div className="text-center">
            <p className="text-[14px] font-extrabold text-[#0F0F0F]">Inspection Form</p>
            <p className="text-[10px] text-[#8F96A3] font-bold">{task.taskNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <HeaderIconBtn onClick={() => setShowNotifications(true)}>
                <Bell size={17} className="text-purple-600" />
              </HeaderIconBtn>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ED4245] rounded-full text-[8px] text-white font-bold flex items-center justify-center pointer-events-none">2</span>
            </div>
            <HeaderIconBtn onClick={() => setShowScanner(true)}>
              <ScanLine size={17} className="text-purple-600" />
            </HeaderIconBtn>
            <HeaderIconBtn onClick={() => setShowPrint(true)}>
              <Printer size={17} className="text-purple-600" />
            </HeaderIconBtn>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4" style={{ scrollbarWidth: "none" }}>
          {/* Form header */}
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-4 mt-3"
            style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
            <div className="px-4 py-3 text-center"
              style={{ background: "linear-gradient(71.49deg, #006FBA 18.99%, #038BE7 76.6%)" }}>
              <p className="text-white font-extrabold text-[13px]">TANK VISUAL INSPECTION REPORT</p>
              <p className="text-white/75 text-[11px] mt-0.5">KIỂM TRA NGOẠI QUAN THÙNG DẦU</p>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {[
                { label: "Part Number", value: task.partSN },
                { label: "Job Number", value: task.jobNo },
                { label: "Name / Tên", value: task.productName },
                { label: "Project Number", value: "PRJ-2024-RTG-12" },
                { label: "Date / Ngày SX", value: "18/12/2024" },
                { label: "Shift / Ca SX", value: "Day Shift" },
              ].map(({ label, value }) => (
                <div key={label} className="border-b border-black/5 pb-2">
                  <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide">{label}</p>
                  <p className="text-[12px] font-bold text-[#0F0F0F] leading-tight">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[14px] font-extrabold text-[#0F0F0F]">Inspection Items</p>
            <span className={`text-[12px] font-bold ${anyFailed ? "text-red-500" : "text-[#0E70B8]"}`}>
              {checked} / {INSPECTION_ITEMS.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(checked / INSPECTION_ITEMS.length) * 100}%`,
                background: anyFailed
                  ? "linear-gradient(90deg, #F59E0B, #EF4444)"
                  : "linear-gradient(90deg, #0E70B8, #038BE7)",
              }} />
          </div>

          {/* Inspection items */}
          <div className="flex flex-col gap-3 mb-4">
            {INSPECTION_ITEMS.map(item => (
              <div key={item.no}
                className={`bg-white rounded-2xl border overflow-hidden transition-all ${results[item.no] === "pass"
                    ? "border-emerald-200"
                    : results[item.no] === "fail"
                    ? "border-red-200"
                    : "border-black/5"
                  }`}
                style={{ boxShadow: "0 2px 8px rgba(89,93,176,0.05)" }}>
                <div className="p-3.5">
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold mt-0.5 transition-colors
                      ${results[item.no] === "pass" ? "bg-emerald-100 text-emerald-700"
                        : results[item.no] === "fail" ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"}`}>
                      {item.no}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold text-[#0F0F0F] leading-snug">{item.en}</p>
                      <p className="text-[11px] text-[#8F96A3] mt-0.5 leading-snug italic font-medium">{item.vi}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setResult(item.no, "pass")}
                      className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[12px] transition-all ${results[item.no] === "pass"
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                    >
                      <Check size={13} /> Pass ✓
                    </button>
                    <button
                      onClick={() => setResult(item.no, "fail")}
                      className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[12px] transition-all ${results[item.no] === "fail"
                          ? "bg-red-500 text-white shadow-sm"
                          : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                    >
                      <XIcon size={13} /> Fail ✗
                    </button>
                  </div>
                  {results[item.no] === "fail" && (
                    <input
                      type="text"
                      placeholder="Remark / Ghi chú..."
                      value={remarks[item.no]}
                      onChange={e => setRemarks(p => ({ ...p, [item.no]: e.target.value }))}
                      className="w-full mt-2 text-[12px] bg-red-50 border border-red-100 rounded-xl px-3 py-2 outline-none placeholder:text-red-300 text-red-700"
                    />
                  )}
                  {item.no === 9 && results[item.no] === "pass" && (
                    <input
                      type="text"
                      placeholder="Volume used (ml) / Thể tích sử dụng (ml)..."
                      value={oilVolume}
                      onChange={e => setOilVolume(e.target.value)}
                      className="w-full mt-2 text-[12px] bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 outline-none placeholder:text-emerald-300 text-emerald-700"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* General notes */}
          <div className="bg-white rounded-2xl p-4 border border-black/5 mb-4"
            style={{ boxShadow: "0 2px 8px rgba(89,93,176,0.05)" }}>
            <p className="text-[13px] font-bold text-[#0F0F0F] mb-2">General Notes / Ghi chú tổng quát</p>
            <textarea
              value={generalNote}
              onChange={e => setGeneralNote(e.target.value)}
              placeholder="Additional observations or comments..."
              rows={3}
              className="w-full text-[13px] bg-gray-50 border border-black/5 rounded-xl px-3 py-2 outline-none placeholder:text-gray-300 resize-none"
            />
          </div>

          {/* Photo attachment */}
          <div className="bg-white rounded-2xl p-4 border border-black/5 mb-4"
            style={{ boxShadow: "0 2px 8px rgba(89,93,176,0.05)" }}>
            <p className="text-[13px] font-bold text-[#0F0F0F] mb-3">Attach Inspection Photos</p>
            <div className="flex gap-2">
              <button className="w-[72px] h-[72px] rounded-xl bg-[#EAF3FB] border border-dashed border-[#0E70B8]/40 flex flex-col items-center justify-center gap-1">
                <Camera size={18} className="text-[#0E70B8]" />
                <span className="text-[9px] text-[#0E70B8] font-bold">Camera</span>
              </button>
              <button className="w-[72px] h-[72px] rounded-xl bg-[#EAF3FB] border border-dashed border-[#0E70B8]/40 flex items-center justify-center">
                <span className="text-[#0E70B8] text-2xl font-light">+</span>
              </button>
            </div>
          </div>

          {/* Signature section */}
          <div className="bg-white rounded-2xl p-4 border border-black/5 mb-4"
            style={{ boxShadow: "0 2px 8px rgba(89,93,176,0.05)" }}>
            <p className="text-[13px] font-bold text-[#0F0F0F] mb-3">Signatures / Ký tên</p>
            <div className="flex flex-col gap-3">
              {[
                { role: "Painter / Thợ sơn", name: "Le Van C" },
                { role: "Painting QC / QC sơn", name: "Tran Thi B" },
                { role: "Assembler / Thợ lắp ráp", name: "" },
                { role: "Assembly QC / QC lắp ráp", name: "" },
              ].map(({ role: r, name }) => (
                <div key={r} className="flex items-center gap-3 border-b border-black/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-[11px] text-[#8F96A3] font-medium">{r}</p>
                    <p className="text-[13px] font-bold text-[#0F0F0F]">{name || "—"}</p>
                  </div>
                  <div className="w-24 h-9 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-[10px] text-gray-300 font-medium">Signature</span>
                  </div>
                  <div className="w-16">
                    <p className="text-[10px] text-[#8F96A3] font-medium">Date</p>
                    <div className="w-full h-5 border-b border-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result summary */}
          {allChecked && (
            <div className={`rounded-2xl p-4 border mb-4 ${anyFailed ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
              <div className="flex items-center gap-2">
                {anyFailed
                  ? <AlertTriangle size={16} className="text-red-600" />
                  : <BadgeCheck size={16} className="text-emerald-600" />
                }
                <p className={`text-[14px] font-bold ${anyFailed ? "text-red-800" : "text-emerald-800"}`}>
                  {anyFailed
                    ? `${failCount} item${failCount > 1 ? "s" : ""} failed — cannot approve`
                    : "All 13 items passed — ready to approve"
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action footer */}
        <div className="flex-shrink-0 px-5 pt-3 pb-4 bg-[#F5F8FC] border-t border-black/5">
          <div className="flex gap-3">
            <button
              onClick={() => setShowReject(true)}
              disabled={!allChecked}
              className="flex-1 h-[52px] rounded-2xl flex items-center justify-center gap-2 font-bold text-[15px] border-2 border-red-400 text-red-500 bg-white disabled:opacity-40 transition-opacity"
            >
              <XIcon size={18} /> Reject
            </button>
            <button
              onClick={() => setShowApprove(true)}
              disabled={!allChecked || anyFailed}
              className="flex-1 h-[52px] rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-[15px] bg-emerald-500 shadow-md disabled:opacity-40 transition-opacity"
            >
              <BadgeCheck size={18} /> Approve
            </button>
          </div>
        </div>
      </div>

      {/* Approve confirmation sheet */}
      {showApprove && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-8">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <BadgeCheck size={28} className="text-emerald-600" />
            </div>
            <p className="text-[18px] font-extrabold text-center text-[#0F0F0F] mb-1">Approve Inspection</p>
            <p className="text-[13px] text-[#8F96A3] text-center mb-6 leading-relaxed">
              All 13 items passed. Task status will be set to Done and the next task will be notified.
            </p>
            <button
              onClick={() => { setShowApprove(false); onApprove(); }}
              className="w-full h-[52px] rounded-2xl text-white font-bold text-[16px] bg-emerald-500 mb-2"
            >
              Confirm Approval
            </button>
            <button onClick={() => setShowApprove(false)} className="w-full h-10 text-[#8F96A3] font-bold text-[14px]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reject confirmation sheet */}
      {showReject && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-8">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XIcon size={28} className="text-red-600" />
            </div>
            <p className="text-[18px] font-extrabold text-center text-[#0F0F0F] mb-1">Reject & Request Rework</p>
            <p className="text-[13px] text-[#8F96A3] text-center mb-6 leading-relaxed">
              Task will be returned to the worker for rework. Failed items will be shown as the rejection note.
            </p>
            <button
              onClick={() => { setShowReject(false); onReject(); }}
              className="w-full h-[52px] rounded-2xl text-white font-bold text-[16px] bg-red-500 mb-2"
            >
              Confirm Rejection
            </button>
            <button onClick={() => setShowReject(false)} className="w-full h-10 text-[#8F96A3] font-bold text-[14px]">
              Cancel
            </button>
          </div>
        </div>
      )}
      {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} scannedCode={task.taskNo} />}
      {showPrint && <PrintOverlay onClose={() => setShowPrint(false)} label={`Inspection Report · ${task.taskNo}`} />}
      {showNotifications && <NotificationCenter role="qc" onClose={() => setShowNotifications(false)} />}
    </>
  );
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 430,
        height: 932,
        borderRadius: 54,
        background: "#F5F8FC",
        boxShadow: "0 0 0 11px #111827, 0 0 0 13px #374151, 0 40px 100px rgba(0,0,0,0.7)",
        flexShrink: 0,
      }}
    >
      {/* Dynamic island */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-4"
        style={{ pointerEvents: "none" }}>
        <div className="w-[126px] h-[37px] bg-black rounded-full" />
      </div>
      {children}
    </div>
  );
}

// ─── PE Bottom Nav ────────────────────────────────────────────────────────────
function PEBottomNav({ activeTab, onAddJob }: { activeTab: string; onAddJob: () => void }) {
  return (
    <div className="flex-shrink-0 relative" style={{ boxShadow: "0 -1px 0 rgba(0,0,0,0.06)" }}>
      <div className="absolute inset-0 bg-white/85 backdrop-blur-xl" />
      <div className="relative flex items-end pt-2">
        <NavBtn icon={<Home size={22} />} label="Dashboard" active={activeTab === "home"} onClick={() => {}} />
        <NavBtn icon={<Layers size={22} />} label="Jobs" active={activeTab === "jobs"} onClick={() => {}} />
        <div className="flex-1 flex flex-col items-center">
          <button
            onClick={onAddJob}
            className="absolute -top-6 w-[58px] h-[58px] rounded-full flex items-center justify-center shadow-lg border-4 border-[#F5F8FC]"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
          >
            <Plus size={26} className="text-white" />
          </button>
          <span className="mt-10 mb-1 text-[11px] font-semibold text-[#8F96A3]">New Job</span>
        </div>
        <NavBtn icon={<BarChart3 size={22} />} label="Reports" active={false} onClick={() => {}} />
        <NavBtn icon={<Settings size={22} />} label="Settings" active={false} onClick={() => {}} />
      </div>
      <div className="flex justify-center pb-2 pt-1">
        <div className="w-32 h-1 bg-black/20 rounded-full" />
      </div>
    </div>
  );
}

// ─── Job Status Badge ─────────────────────────────────────────────────────────
function JobStatusBadge({ status }: { status: JobStatus }) {
  const map: Record<JobStatus, string> = {
    "Unassigned": "bg-amber-50 text-amber-700",
    "Assigned":   "bg-blue-50 text-[#0E70B8]",
    "In Progress":"bg-indigo-50 text-indigo-700",
    "Completed":  "bg-emerald-50 text-emerald-700",
    "On Hold":    "bg-gray-100 text-gray-500",
  };
  const icons: Record<JobStatus, React.ReactNode> = {
    "Unassigned":  <CircleDashed size={10} />,
    "Assigned":    <UserPlus size={10} />,
    "In Progress": <Hourglass size={10} />,
    "Completed":   <CheckCircle2 size={10} />,
    "On Hold":     <AlertCircle size={10} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${map[status]}`}>
      {icons[status]}{status}
    </span>
  );
}

// ─── Screen 6: PE Dashboard ───────────────────────────────────────────────────
function PEDashboard({
  jobs, onJobClick, onAddJob,
}: {
  jobs: Job[];
  onJobClick: (job: Job) => void;
  onAddJob: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | JobStatus>("All");
  const [showScanner, setShowScanner] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const counts = {
    total: jobs.length,
    unassigned: jobs.filter(j => j.status === "Unassigned").length,
    inProgress: jobs.filter(j => j.status === "In Progress").length,
    completed:  jobs.filter(j => j.status === "Completed").length,
  };

  const filtered = jobs.filter(j => {
    const matchesFilter = filter === "All" || j.status === filter;
    const matchesSearch = search === "" ||
      j.jobNo.toLowerCase().includes(search.toLowerCase()) ||
      j.productName.toLowerCase().includes(search.toLowerCase()) ||
      j.customer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions: Array<"All" | JobStatus> = ["All", "Unassigned", "Assigned", "In Progress", "Completed"];

  return (
    <>
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="px-5 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeaderIconBtn onClick={() => setShowMenu(true)}>
              <Menu size={20} className="text-[#0F0F0F]" />
            </HeaderIconBtn>
            <div>
              <p className="text-[13px] text-[#8F96A3] font-medium">Project Engineer</p>
              <p className="text-[16px] font-extrabold text-[#0F0F0F]">Nguyen Duc K</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HeaderIconBtn onClick={() => setShowScanner(true)}>
              <ScanLine size={17} className="text-amber-500" />
            </HeaderIconBtn>
            <HeaderIconBtn onClick={() => setShowPrint(true)}>
              <Printer size={17} className="text-amber-500" />
            </HeaderIconBtn>
            <div className="relative">
              <HeaderIconBtn onClick={() => setShowNotifications(true)}>
                <Bell size={18} className="text-amber-500" />
              </HeaderIconBtn>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ED4245] rounded-full text-[9px] text-white font-bold flex items-center justify-center pointer-events-none">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats 2×2 grid */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-black/5 flex flex-col gap-1"
          style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
          <span className="text-[26px] font-extrabold text-[#0F0F0F] leading-none">{counts.total}</span>
          <span className="text-[11px] text-[#8F96A3] font-semibold">Total Jobs</span>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col gap-1">
          <span className="text-[26px] font-extrabold text-amber-600 leading-none">{counts.unassigned}</span>
          <span className="text-[11px] text-amber-600 font-semibold">Unassigned</span>
        </div>
        <div className="bg-[#EAF3FB] rounded-2xl p-4 border border-blue-100 flex flex-col gap-1">
          <span className="text-[26px] font-extrabold text-[#0E70B8] leading-none">{counts.inProgress}</span>
          <span className="text-[11px] text-[#0E70B8] font-semibold">In Progress</span>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col gap-1">
          <span className="text-[26px] font-extrabold text-emerald-600 leading-none">{counts.completed}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Completed</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 h-11 border border-black/5"
          style={{ boxShadow: "0 2px 8px rgba(89,93,176,0.05)" }}>
          <Search size={16} className="text-[#8F96A3] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search job, product, customer…"
            className="flex-1 bg-transparent text-[13px] text-[#0F0F0F] outline-none placeholder:text-[#8F96A3]"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <XIcon size={14} className="text-[#8F96A3]" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips — horizontal scroll */}
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filterOptions.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${filter === f
              ? "text-white shadow-sm"
              : "bg-white text-[#8F96A3] border border-black/5"
            }`}
            style={filter === f ? { background: "linear-gradient(135deg, #F59E0B, #D97706)" } : {}}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Job list */}
      <div className="px-5 flex flex-col gap-3 pb-6">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#8F96A3] text-[14px]">
            No jobs match your search
          </div>
        )}
        {filtered.map(job => {
          const doneTasks = job.tasks.filter(t => t.status === "Done").length;
          return (
            <button
              key={job.id}
              onClick={() => onJobClick(job)}
              className="w-full text-left bg-white rounded-2xl p-4 border border-black/5 active:scale-[0.98] transition-transform"
              style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.07)" }}
            >
              {/* Row 1: Job number + status + chevron */}
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-['JetBrains_Mono',monospace] text-[12px] font-bold text-[#0E70B8]">{job.jobNo}</span>
                  <JobStatusBadge status={job.status} />
                </div>
                <ChevronRight size={15} className="text-[#8F96A3] flex-shrink-0 mt-0.5" />
              </div>
              {/* Row 2: Product name */}
              <p className="text-[14px] font-bold text-[#0F0F0F] leading-snug mb-0.5">{job.productName}</p>
              {/* Row 3: Customer */}
              <div className="flex items-center gap-1.5 mb-3">
                <Building2 size={11} className="text-[#8F96A3]" />
                <span className="text-[12px] text-[#8F96A3] font-medium">{job.customer}</span>
              </div>
              {/* Progress bar */}
              {job.status !== "Unassigned" && (
                <div className="mb-2">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#8F96A3] font-medium">{doneTasks}/{job.tasks.length} tasks</span>
                    <span className={`font-bold ${job.progress === 100 ? "text-emerald-600" : "text-[#0E70B8]"}`}>{job.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${job.progress}%`,
                        background: job.progress === 100
                          ? "linear-gradient(90deg, #10B981, #059669)"
                          : "linear-gradient(90deg, #F59E0B, #0E70B8)",
                      }} />
                  </div>
                </div>
              )}
              {/* Due date + project no */}
              <div className="flex items-center justify-between text-[11px] text-[#8F96A3] font-medium">
                <span className="flex items-center gap-1"><CalendarDays size={11} /> Due: {job.dueDate}</span>
                <span>{job.projectNo}</span>
              </div>
              {/* Unassigned alert */}
              {job.status === "Unassigned" && (
                <div className="mt-2.5 flex items-center gap-1.5 bg-amber-50 rounded-lg px-2.5 py-1.5">
                  <AlertCircle size={11} className="text-amber-600" />
                  <span className="text-[11px] text-amber-700 font-bold">No workers assigned yet</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
    {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} />}
    {showPrint && <PrintOverlay onClose={() => setShowPrint(false)} label="Job List Report" />}
    {showNotifications && <NotificationCenter role="pe" onClose={() => setShowNotifications(false)} />}
    {showMenu && <AppMenu role="pe" onClose={() => setShowMenu(false)} />}
    </>
  );
}

// ─── Screen 7: Job Detail ─────────────────────────────────────────────────────
function JobDetail({
  job: initialJob,
  onBack,
  onSave,
}: {
  job: Job;
  onBack: () => void;
  onSave: (updated: Job) => void;
}) {
  const [job, setJob] = useState<Job>(initialJob);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "team">("overview");
  const [editingTask, setEditingTask] = useState<JobTask | null>(null);
  const [pickerFor, setPickerFor] = useState<"worker" | "qc" | null>(null);
  const [showPublishSheet, setShowPublishSheet] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const allAssigned = job.tasks.every(t => t.worker && t.qc && t.dueDate);
  const assignedCount = job.tasks.filter(t => t.worker && t.qc).length;

  function updateField(field: keyof Job, value: string) {
    setJob(j => ({ ...j, [field]: value }));
  }

  function updateTaskField(taskId: string, field: keyof JobTask, value: string | number) {
    setJob(j => ({ ...j, tasks: j.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t) }));
    if (editingTask?.id === taskId) {
      setEditingTask(t => t ? { ...t, [field]: value } : t);
    }
  }

  function handleSave() {
    const status: JobStatus = allAssigned ? "Assigned" : job.status === "Unassigned" ? "Unassigned" : job.status;
    const updated = { ...job, status };
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePublish() {
    const updated: Job = { ...job, status: "Assigned" };
    onSave(updated);
    setShowPublishSheet(false);
    onBack();
  }

  // Staff for picker
  const pickerStaff = pickerFor === "worker"
    ? STAFF.filter(s => s.role === "worker")
    : STAFF.filter(s => s.role === "qc");

  const uniqueWorkers = Array.from(new Set(job.tasks.map(t => t.worker).filter(Boolean)));
  const uniqueQCs    = Array.from(new Set(job.tasks.map(t => t.qc).filter(Boolean)));

  // Options for searchable dropdowns
  const projectOptions = Array.from(new Set(JOBS_INIT.map(j => j.projectNo))).filter(Boolean);
  const productOptions = Array.from(new Set(JOBS_INIT.map(j => j.productName))).filter(Boolean);
  const partOptions = Array.from(new Set(JOBS_INIT.map(j => j.partSN))).filter(Boolean);

  // Date helpers: convert between display format (e.g. "06 Jan 2025") and ISO (yyyy-mm-dd)
  function displayToISO(display: string) {
    const d = new Date(display);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  }
  function isoToDisplay(iso: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between flex-shrink-0 bg-[#F5F8FC]">
          <button onClick={onBack} className="w-9 h-9 rounded-[12px] bg-white border border-black/5 flex items-center justify-center"
            style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.08)" }}>
            <ChevronLeft size={20} className="text-[#0F0F0F]" />
          </button>
          <div className="text-center flex-1 px-2">
            <p className="text-[14px] font-extrabold text-[#0F0F0F] truncate">{job.jobNo}</p>
            <div className="flex justify-center mt-0.5"><JobStatusBadge status={job.status} /></div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <HeaderIconBtn onClick={() => setShowNotifications(true)}>
                <Bell size={15} className="text-amber-500" />
              </HeaderIconBtn>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ED4245] rounded-full text-[8px] text-white font-bold flex items-center justify-center pointer-events-none">5</span>
            </div>
            <HeaderIconBtn onClick={() => setShowScanner(true)}>
              <ScanLine size={15} className="text-[#0E70B8]" />
            </HeaderIconBtn>
            <HeaderIconBtn onClick={() => setShowPrint(true)}>
              <Printer size={15} className="text-[#0E70B8]" />
            </HeaderIconBtn>
            <button onClick={handleSave}
              className={`px-3 h-9 rounded-[12px] flex items-center gap-1.5 font-bold text-[12px] transition-all ${saved ? "bg-emerald-100 text-emerald-700" : "bg-[#0E70B8] text-white"}`}
              style={saved ? {} : { boxShadow: "0 4px 12px rgba(14,112,184,0.3)" }}>
              {saved ? <><Check size={12} /> Saved</> : <><Pencil size={12} /> Save</>}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex-shrink-0 px-5 pb-0 flex gap-0 bg-[#F5F8FC] border-b border-black/5">
          {(["overview", "tasks", "team"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-[13px] font-bold capitalize transition-all border-b-2 ${activeTab === tab
                ? "text-[#0E70B8] border-[#0E70B8]"
                : "text-[#8F96A3] border-transparent"
              }`}
            >
              {tab === "overview" ? "Overview" : tab === "tasks" ? `Tasks (${job.tasks.length})` : "Team"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {/* ── Overview Tab ── */}
          {activeTab === "overview" && (
            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Product info card */}
              <div className="bg-white rounded-2xl p-4 border border-black/5"
                style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
                <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide mb-3">Job Information</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Job Number</p>
                    <input
                      type="text"
                      value={job.jobNo}
                      onChange={e => updateField("jobNo", e.target.value)}
                      placeholder="JOB-RTG-2024-XXX"
                      className="w-full h-10 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none placeholder:text-gray-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Project Number</p>
                    <input
                      list="project-list"
                      value={job.projectNo}
                      onChange={e => updateField("projectNo", e.target.value)}
                      placeholder="PRJ-2024-XXX"
                      className="w-full h-10 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <datalist id="project-list">
                      {projectOptions.map(p => <option key={p} value={p} />)}
                    </datalist>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Product / Part Name</p>
                    <input
                      list="product-list"
                      value={job.productName}
                      onChange={e => updateField("productName", e.target.value)}
                      placeholder="e.g. RTG Crane Upper Beam"
                      className="w-full h-10 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <datalist id="product-list">
                      {productOptions.map(p => <option key={p} value={p} />)}
                    </datalist>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Product / Part Serial</p>
                    <input
                      list="part-list"
                      value={job.partSN}
                      onChange={e => updateField("partSN", e.target.value)}
                      placeholder="e.g. RTG-051-UB-001"
                      className="w-full h-10 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <datalist id="part-list">
                      {partOptions.map(p => <option key={p} value={p} />)}
                    </datalist>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Customer</p>
                    <input
                      type="text"
                      value={job.customer}
                      onChange={e => updateField("customer", e.target.value)}
                      placeholder="Customer company name"
                      className="w-full h-10 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none placeholder:text-gray-300 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Start Date</p>
                    <input
                      type="date"
                      value={displayToISO(job.startDate)}
                      onChange={e => updateField("startDate", isoToDisplay(e.target.value))}
                      className="w-full h-10 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Due Date</p>
                    <input
                      type="date"
                      value={displayToISO(job.dueDate)}
                      onChange={e => updateField("dueDate", isoToDisplay(e.target.value))}
                      className="w-full h-10 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1">Notes</p>
                    <textarea
                      value={job.notes}
                      onChange={e => updateField("notes", e.target.value)}
                      placeholder="Additional notes or specifications…"
                      rows={3}
                      className="w-full bg-[#F5F8FC] border border-black/5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#0F0F0F] outline-none placeholder:text-gray-300 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Drawings & documents */}
              <div className="bg-white rounded-2xl p-4 border border-black/5"
                style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide">Drawings & Documents</p>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-[#0E70B8]">
                    <Plus size={12} /> Attach
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <DocRow icon={<FileText size={15} className="text-[#0E70B8]" />}
                    name={`JT-${job.jobNo.replace("JOB-", "")}-Rev01.pdf`} sub="Job Traveler" />
                  <DocRow icon={<ImgIcon size={15} className="text-[#0E70B8]" />}
                    name={`DWG-${job.partSN}-GA.pdf`} sub="General Assembly Drawing" />
                </div>
              </div>

              {/* Assignment progress */}
              <div className="bg-white rounded-2xl p-4 border border-black/5"
                style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
                <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide mb-3">Assignment Progress</p>
                <div className="flex justify-between text-[12px] mb-2">
                  <span className="text-[#0F0F0F] font-semibold">{assignedCount} / {job.tasks.length} tasks assigned</span>
                  <span className={`font-bold ${allAssigned ? "text-emerald-600" : "text-amber-600"}`}>
                    {allAssigned ? "Ready to publish" : "Incomplete"}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${(assignedCount / job.tasks.length) * 100}%`,
                      background: allAssigned
                        ? "linear-gradient(90deg, #10B981, #059669)"
                        : "linear-gradient(90deg, #F59E0B, #0E70B8)",
                    }} />
                </div>
              </div>
            </div>
          )}

          {/* ── Tasks Tab ── */}
          {activeTab === "tasks" && (
            <div className="px-5 py-4 flex flex-col gap-3">
              <p className="text-[12px] text-[#8F96A3] font-medium">
                Tap a task to assign worker, QC engineer, estimation and due date.
              </p>
              {job.tasks.map(task => {
                const isAssigned = !!(task.worker && task.qc && task.dueDate);
                return (
                  <button
                    key={task.id}
                    onClick={() => setEditingTask(task)}
                    className={`w-full text-left rounded-2xl border overflow-hidden active:scale-[0.98] transition-transform ${isAssigned ? "border-emerald-100 bg-white" : "border-amber-100 bg-white"}`}
                    style={{ boxShadow: "0 2px 8px rgba(89,93,176,0.05)" }}
                  >
                    {/* Step header */}
                    <div className={`px-4 py-2 flex items-center gap-2.5 ${isAssigned ? "bg-emerald-50" : "bg-amber-50"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold ${isAssigned ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"}`}>
                        {task.step}
                      </div>
                      <p className={`text-[13px] font-bold ${isAssigned ? "text-emerald-800" : "text-amber-800"}`}>{task.workshop}</p>
                      <div className="flex-1" />
                      {isAssigned
                        ? <CheckCircle2 size={14} className="text-emerald-500" />
                        : <AlertCircle size={14} className="text-amber-500" />
                      }
                      <Pencil size={13} className={isAssigned ? "text-emerald-400" : "text-amber-400"} />
                    </div>
                    {/* Task body */}
                    <div className="px-4 py-3">
                      <p className="text-[12px] text-[#0F0F0F] font-semibold mb-2 leading-snug">{task.description}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <div>
                          <p className="text-[10px] text-[#8F96A3] font-bold uppercase">Worker</p>
                          <p className={`text-[12px] font-semibold ${task.worker ? "text-[#0F0F0F]" : "text-amber-500"}`}>
                            {task.worker || "Not assigned"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#8F96A3] font-bold uppercase">QC</p>
                          <p className={`text-[12px] font-semibold ${task.qc ? "text-[#0F0F0F]" : "text-amber-500"}`}>
                            {task.qc || "Not assigned"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#8F96A3] font-bold uppercase">Estimation</p>
                          <p className="text-[12px] font-semibold text-[#0F0F0F]">
                            {task.estimationHours ? `${task.estimationHours}h` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#8F96A3] font-bold uppercase">Due Date</p>
                          <p className={`text-[12px] font-semibold ${task.dueDate ? "text-[#0F0F0F]" : "text-amber-500"}`}>
                            {task.dueDate || "Not set"}
                          </p>
                        </div>
                      </div>
                      {task.status !== "Pending" && (
                        <div className="mt-2">
                          <StatusBadge status={task.status} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Team Tab ── */}
          {activeTab === "team" && (
            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#EAF3FB] rounded-2xl p-4 border border-blue-100">
                  <span className="text-[24px] font-extrabold text-[#0E70B8] leading-none">{uniqueWorkers.length}</span>
                  <p className="text-[11px] text-[#0E70B8] font-semibold mt-0.5">Workers</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                  <span className="text-[24px] font-extrabold text-purple-700 leading-none">{uniqueQCs.length}</span>
                  <p className="text-[11px] text-purple-600 font-semibold mt-0.5">QC Engineers</p>
                </div>
              </div>

              {/* Workers */}
              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden"
                style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
                <div className="px-4 py-3 border-b border-black/5 flex items-center gap-2">
                  <HardHat size={15} className="text-[#0E70B8]" />
                  <p className="text-[13px] font-bold text-[#0F0F0F]">Workers</p>
                </div>
                {uniqueWorkers.length === 0
                  ? <p className="px-4 py-4 text-[13px] text-[#8F96A3]">No workers assigned yet</p>
                  : uniqueWorkers.map(name => {
                    const theirTasks = job.tasks.filter(t => t.worker === name);
                    const staffMember = STAFF.find(s => s.name === name);
                    return (
                      <div key={name} className="px-4 py-3 border-b border-black/5 last:border-0 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#EAF3FB] flex items-center justify-center flex-shrink-0">
                          <span className="text-[13px] font-extrabold text-[#0E70B8]">{name.split(" ").pop()?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#0F0F0F]">{name}</p>
                          <p className="text-[11px] text-[#8F96A3] font-medium truncate">
                            {staffMember?.workshops.join(", ") ?? ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-bold text-[#0E70B8]">{theirTasks.length}</p>
                          <p className="text-[10px] text-[#8F96A3]">tasks</p>
                        </div>
                      </div>
                    );
                  })
                }
              </div>

              {/* QC Engineers */}
              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden"
                style={{ boxShadow: "0 4px 16px rgba(89,93,176,0.06)" }}>
                <div className="px-4 py-3 border-b border-black/5 flex items-center gap-2">
                  <Shield size={15} className="text-purple-600" />
                  <p className="text-[13px] font-bold text-[#0F0F0F]">QC Engineers</p>
                </div>
                {uniqueQCs.length === 0
                  ? <p className="px-4 py-4 text-[13px] text-[#8F96A3]">No QC engineers assigned yet</p>
                  : uniqueQCs.map(name => {
                    const theirTasks = job.tasks.filter(t => t.qc === name);
                    const staffMember = STAFF.find(s => s.name === name);
                    return (
                      <div key={name} className="px-4 py-3 border-b border-black/5 last:border-0 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-[13px] font-extrabold text-purple-600">{name.split(" ").pop()?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#0F0F0F]">{name}</p>
                          <p className="text-[11px] text-[#8F96A3] font-medium truncate">
                            {staffMember?.workshops.join(", ") ?? ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-bold text-purple-600">{theirTasks.length}</p>
                          <p className="text-[10px] text-[#8F96A3]">tasks</p>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}
        </div>

        {/* Action footer */}
        <div className="flex-shrink-0 px-5 pt-3 pb-4 bg-[#F5F8FC] border-t border-black/5">
          <button
            onClick={() => setShowPublishSheet(true)}
            disabled={!allAssigned}
            className="w-full h-[52px] rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-[15px] shadow-md disabled:opacity-40 transition-opacity"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
          >
            <Bell size={18} /> Publish & Notify Assignee
          </button>
        </div>
      </div>

      {/* Task assignment bottom sheet */}
      {editingTask && !pickerFor && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl overflow-hidden max-h-[80%] flex flex-col">
            <div className="flex-shrink-0 p-5 pb-3 border-b border-black/5">
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
                  {editingTask.step}
                </div>
                <p className="text-[16px] font-extrabold text-[#0F0F0F]">{editingTask.workshop}</p>
              </div>
              <p className="text-[12px] text-[#8F96A3] font-medium">{editingTask.description}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
              {/* Worker select */}
              <div>
                <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1.5">Assign Worker</p>
                <button
                  onClick={() => setPickerFor("worker")}
                  className="w-full h-11 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 flex items-center justify-between"
                >
                  <span className={`text-[13px] font-semibold ${editingTask.worker ? "text-[#0F0F0F]" : "text-gray-300"}`}>
                    {editingTask.worker || "Select worker…"}
                  </span>
                  <ChevronDown size={15} className="text-[#8F96A3]" />
                </button>
              </div>
              {/* QC select */}
              <div>
                <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1.5">Assign QC Engineer</p>
                <button
                  onClick={() => setPickerFor("qc")}
                  className="w-full h-11 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 flex items-center justify-between"
                >
                  <span className={`text-[13px] font-semibold ${editingTask.qc ? "text-[#0F0F0F]" : "text-gray-300"}`}>
                    {editingTask.qc || "Select QC engineer…"}
                  </span>
                  <ChevronDown size={15} className="text-[#8F96A3]" />
                </button>
              </div>
              {/* Estimation */}
              <div>
                <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1.5">Estimation (hours)</p>
                <input
                  type="number"
                  value={editingTask.estimationHours}
                  onChange={e => updateTaskField(editingTask.id, "estimationHours", Number(e.target.value))}
                  min={1} max={999}
                  className="w-full h-11 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none"
                />
              </div>
              {/* Due date */}
              <div>
                <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide mb-1.5">Due Date</p>
                <input
                  type="text"
                  value={editingTask.dueDate}
                  onChange={e => updateTaskField(editingTask.id, "dueDate", e.target.value)}
                  placeholder="e.g. 15 Jan 2025"
                  className="w-full h-11 bg-[#F5F8FC] border border-black/5 rounded-xl px-3 text-[13px] font-semibold text-[#0F0F0F] outline-none placeholder:text-gray-300"
                />
              </div>
            </div>
            <div className="flex-shrink-0 px-5 pb-6 pt-2 flex gap-3">
              <button onClick={() => setEditingTask(null)}
                className="flex-1 h-12 rounded-2xl border-2 border-gray-200 text-[#8F96A3] font-bold text-[14px]">
                Cancel
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 h-12 rounded-2xl text-white font-bold text-[14px]"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff picker sheet */}
      {pickerFor && editingTask && (
        <div className="absolute inset-0 bg-black/60 z-[60] flex items-end">
          <div className="w-full bg-white rounded-t-3xl overflow-hidden max-h-[65%] flex flex-col">
            <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-black/5">
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <p className="text-[16px] font-extrabold text-[#0F0F0F]">
                Select {pickerFor === "worker" ? "Worker" : "QC Engineer"}
              </p>
              <p className="text-[12px] text-[#8F96A3] font-medium mt-0.5">For: {editingTask.workshop}</p>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {pickerStaff.map(s => {
                const isSelected = pickerFor === "worker"
                  ? editingTask.worker === s.name
                  : editingTask.qc === s.name;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      updateTaskField(editingTask.id, pickerFor, s.name);
                      setPickerFor(null);
                    }}
                    className={`w-full px-5 py-3.5 flex items-center gap-3 border-b border-black/5 transition-colors ${isSelected ? "bg-[#EAF3FB]" : "hover:bg-gray-50"}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-[#0E70B8]" : "bg-gray-100"}`}>
                      <span className={`text-[13px] font-extrabold ${isSelected ? "text-white" : "text-[#8F96A3]"}`}>
                        {s.name.split(" ").pop()?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[13px] font-bold text-[#0F0F0F]">{s.name}</p>
                      <p className="text-[11px] text-[#8F96A3] font-medium">{s.workshops.join(", ")}</p>
                    </div>
                    {isSelected && <Check size={16} className="text-[#0E70B8]" />}
                  </button>
                );
              })}
            </div>
            <div className="flex-shrink-0 p-4 border-t border-black/5">
              <button onClick={() => setPickerFor(null)}
                className="w-full h-11 rounded-2xl border-2 border-gray-200 text-[#8F96A3] font-bold text-[14px]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish confirmation sheet */}
      {showPublishSheet && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-8">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
              <Bell size={26} className="text-white" />
            </div>
            <p className="text-[18px] font-extrabold text-center text-[#0F0F0F] mb-1">Publish Job</p>
            <p className="text-[13px] text-[#8F96A3] text-center mb-3 leading-relaxed">
              Notifications will be sent to all assigned workers and QC engineers in order of the job traveler steps.
            </p>
            {/* Summary of who gets notified */}
            <div className="bg-[#F5F8FC] rounded-2xl p-3 mb-5">
              <p className="text-[11px] text-[#8F96A3] font-bold uppercase tracking-wide mb-2">Will be notified</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set([...uniqueWorkers, ...uniqueQCs])].map(name => (
                  <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-full text-[11px] font-bold text-[#0F0F0F] border border-black/5">
                    <Users size={9} className="text-[#8F96A3]" /> {name}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={handlePublish}
              className="w-full h-[52px] rounded-2xl text-white font-bold text-[16px] mb-2"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
              Confirm & Notify
            </button>
            <button onClick={() => setShowPublishSheet(false)}
              className="w-full h-10 text-[#8F96A3] font-bold text-[14px]">
              Cancel
            </button>
          </div>
        </div>
      )}
      {showScanner && <ScannerOverlay onClose={() => setShowScanner(false)} scannedCode={job.jobNo} />}
      {showPrint && <PrintOverlay onClose={() => setShowPrint(false)} label={`${job.jobNo} · Job Detail`} />}
      {showNotifications && <NotificationCenter role="pe" onClose={() => setShowNotifications(false)} />}
    </>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
const LOGIN_I18N = {
  en: {
    username:      "Username",
    password:      "Password",
    remember:      "Remember me",
    forgot:        "Forgot Password?",
    loginBtn:      "Login",
    orContinue:    "Or continue with",
    errorEmail:    "Email address not recognized.",
    errorPassword: "Incorrect password.",
    footer:        ["User guide", "FAQs", "Contact", "T&C"] as const,
  },
  vn: {
    username:      "Tên đăng nhập",
    password:      "Mật khẩu",
    remember:      "Ghi nhớ đăng nhập",
    forgot:        "Quên mật khẩu?",
    loginBtn:      "Đăng nhập",
    orContinue:    "Hoặc tiếp tục với",
    errorEmail:    "Email không được nhận dạng.",
    errorPassword: "Mật khẩu không đúng.",
    footer:        ["Hướng dẫn", "FAQ", "Liên hệ", "Điều khoản"] as const,
  },
};

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused,    setPwFocused]    = useState(false);
  const [lang, setLang]         = useState<"en" | "vn">("en");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = LOGIN_I18N[lang];

  const ACCOUNTS: Record<string, { pw: string; role: Role }> = {
    "worker@mi-jackvietnam.com": { pw: "123456", role: "worker" },
    "qc@mi-jackvietnam.com":    { pw: "123456", role: "qc"     },
    "pe@mi-jackvietnam.com":    { pw: "123456", role: "pe"     },
    "admin@mi-jackvietnam.com": { pw: "123456", role: "pe"     },
  };

  function submit() {
    const acct = ACCOUNTS[email.toLowerCase().trim()];
    if (!acct) { setError(t.errorEmail); return; }
    if (password !== acct.pw) { setError(t.errorPassword); return; }
    setError("");
    setBusy(true);
    setTimeout(() => onLogin(acct.role), 700);
  }

  function switchLang(l: "en" | "vn") {
    setLang(l);
    setShowLangMenu(false);
    setError("");
  }

  const emailFloating = emailFocused || email.length > 0;
  const pwFloating    = pwFocused    || password.length > 0;

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#f5f5f5" }}
      onClick={() => showLangMenu && setShowLangMenu(false)}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Hero background image */}
        <div className="absolute top-0 left-0 right-0 h-[284px] overflow-hidden">
          <img src={imgBg} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.52)" }} />
        </div>

      <div className="relative z-10">
        {/* Header bar */}
        <div className="flex items-center justify-between h-[48px] px-5 bg-[#f5f5f5]">
          <img src={imgLogo} alt="MI-JACK" className="h-[33px] w-auto object-contain" />

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setShowLangMenu(v => !v); }}
              className="flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-xl"
              style={{ background: "linear-gradient(132deg, rgba(255,255,255,0.9) 17%, rgba(255,255,255,0.5) 49%, rgba(255,255,255,0.9) 83%)" }}>
              <Globe size={16} className="text-[#5E6573]" />
              <span className="text-[13px] font-semibold text-[#5E6573]">{lang.toUpperCase()}</span>
              <ChevronDown size={13} className="text-[#5E6573]" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-[calc(100%+6px)] rounded-xl overflow-hidden z-50"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: 120 }}
                onClick={e => e.stopPropagation()}>
                {(["en", "vn"] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => switchLang(l)}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold transition-colors ${
                      lang === l
                        ? "bg-[#0E70B8] text-white"
                        : "bg-white text-[#0F0F0F] hover:bg-[#F5F8FC]"
                    }`}>
                    <Globe size={15} />
                    {l === "en" ? "English" : "Tiếng Việt"}
                    {lang === l && <Check size={14} className="ml-auto" strokeWidth={2.5} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero title on image */}
        <div className="h-[236px] flex items-center justify-center px-5">
          <p className="text-white text-[40px] font-black uppercase leading-none whitespace-nowrap"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.5px", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
            PRODUCTION FLOW
          </p>
        </div>

        {/* Form card */}
        <div className="mx-[20px] mt-6 rounded-[20px] px-[20px] pt-6 pb-5"
          style={{
            background: "linear-gradient(108deg, rgba(255,255,255,0.92) 17%, rgba(255,255,255,0.55) 49%, rgba(255,255,255,0.92) 83%)",
            boxShadow: "0px 4px 32px 0px rgba(89,93,176,0.12)",
          }}>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-4">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-[13px] text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Email field */}
          <div className="relative h-[48px] mb-4">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="absolute inset-0 w-full h-full pl-10 pr-10 rounded-xl bg-white text-[14px] text-[#0F0F0F] font-medium focus:outline-none"
              style={{ border: `1px solid ${emailFocused ? "#0E70B8" : "#E1E5ED"}` }}
            />
            <div className="absolute left-0 top-0 h-full flex items-center px-3 pointer-events-none">
              <Mail size={18} className="text-[#5E6573]" />
            </div>
            <label
              className="absolute pointer-events-none transition-all duration-150 text-[#5E6573] bg-white px-1"
              style={{
                left: emailFloating ? "28px" : "40px",
                top: emailFloating ? "-1px" : "50%",
                transform: "translateY(-50%)",
                fontSize: emailFloating ? "11px" : "14px",
              }}>
              {t.username}
            </label>
            {email && (
              <button className="absolute right-0 top-0 h-full flex items-center px-3" onClick={() => setEmail("")}>
                <XIcon size={16} className="text-[#D9D9DB]" />
              </button>
            )}
          </div>

          {/* Password field */}
          <div className="relative h-[48px] mb-3">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              onKeyDown={e => e.key === "Enter" && submit()}
              className="absolute inset-0 w-full h-full pl-10 pr-10 rounded-xl bg-white text-[14px] text-[#0F0F0F] font-medium focus:outline-none"
              style={{ border: `1px solid ${pwFocused ? "#0E70B8" : "#E1E5ED"}` }}
            />
            <div className="absolute left-0 top-0 h-full flex items-center px-3 pointer-events-none">
              <Lock size={18} className="text-[#5E6573]" />
            </div>
            <label
              className="absolute pointer-events-none transition-all duration-150 text-[#5E6573] bg-white px-1"
              style={{
                left: pwFloating ? "28px" : "40px",
                top: pwFloating ? "-1px" : "50%",
                transform: "translateY(-50%)",
                fontSize: pwFloating ? "11px" : "14px",
              }}>
              {t.password}
            </label>
            <button className="absolute right-0 top-0 h-full flex items-center px-3" onClick={() => setShowPw(p => !p)}>
              {showPw
                ? <EyeOff size={18} className="text-[#5E6573]" />
                : <Eye size={18} className="text-[#5E6573]" />}
            </button>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between mb-5">
            <button className="flex items-center gap-2" onClick={() => setRemember(r => !r)}>
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${remember ? "bg-[#2F6BFF] border-[#2F6BFF]" : "bg-white border-[#D1D5DB]"}`}>
                {remember && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-[14px] text-[#535965]">{t.remember}</span>
            </button>
            <button className="text-[14px] font-semibold text-[#0E70B8]">{t.forgot}</button>
          </div>

          {/* Login button */}
          <button
            onClick={submit}
            disabled={busy}
            className="w-full h-[46px] rounded-xl text-white text-[16px] font-semibold flex items-center justify-center mb-4 transition-opacity disabled:opacity-75"
            style={{ background: "#0E70B8" }}>
            {busy
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : t.loginBtn}
          </button>

          {/* SSO divider */}
          <p className="text-center text-[14px] text-[#535965] mb-3">{t.orContinue}</p>

          {/* Microsoft */}
          <button className="w-full h-[48px] rounded-xl bg-white border border-[#535965] flex items-center justify-center gap-2.5 mb-3">
            <img src={imgMicrosoft} alt="" className="w-7 h-7 object-contain" />
            <span className="text-[16px] font-semibold text-[#535965]">Microsoft</span>
          </button>

          {/* Google */}
          <button className="w-full h-[48px] rounded-xl bg-white border border-[#535965] flex items-center justify-center gap-2.5">
            <img src={imgGoogle} alt="" className="w-7 h-7 object-contain" />
            <span className="text-[16px] font-semibold text-[#535965]">Google</span>
          </button>
        </div>

      </div>
      </div>

      {/* Footer — pinned to bottom */}
      <div className="flex-shrink-0 flex items-center justify-around px-4 py-4 bg-[#f5f5f5]"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        {t.footer.map(link => (
          <button key={link} className="text-[13px] text-[#0E70B8] font-medium">{link}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole]     = useState<Role>("worker");
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [workerTasks, setWorkerTasks] = useState<Task[]>(WORKER_TASKS_INIT);
  const [qcTasks,     setQcTasks]     = useState<Task[]>(QC_TASKS_INIT);
  const [jobs,        setJobs]         = useState<Job[]>(JOBS_INIT);

  const currentTasks  = role === "worker" ? workerTasks : qcTasks;
  const selectedTask  = selectedId    ? currentTasks.find(t => t.id === selectedId)    ?? null : null;
  const selectedJob   = selectedJobId ? jobs.find(j => j.id === selectedJobId)          ?? null : null;

  function updateTask(id: string, updates: Partial<Task>) {
    if (role === "worker") setWorkerTasks(ts => ts.map(t => t.id === id ? { ...t, ...updates } : t));
    else                   setQcTasks(ts => ts.map(t => t.id === id ? { ...t, ...updates } : t));
  }

  function updateJob(updated: Job) {
    setJobs(js => js.map(j => j.id === updated.id ? updated : j));
  }

  function switchRole() {
    const next: Role = role === "worker" ? "qc" : "worker";
    setRole(next);
    setScreen(next === "worker" ? "worker-dashboard" : "qc-dashboard");
    setSelectedId(null);
  }

  function handleTaskClick(task: Task) {
    setSelectedId(task.id);
    setScreen(role === "worker" ? "worker-task-detail" : "qc-task-detail");
  }

  function handleBack() {
    if (screen === "job-detail") {
      setScreen("pe-dashboard");
      setSelectedJobId(null);
    } else {
      setScreen(role === "worker" ? "worker-dashboard" : "qc-dashboard");
      setSelectedId(null);
    }
  }

  function handleJobClick(job: Job) {
    setSelectedJobId(job.id);
    setScreen("job-detail");
  }

  function handleAddJob() {
    const newJob: Job = {
      id: `j${Date.now()}`,
      jobNo: `JOB-RTG-2024-0${Math.floor(50 + Math.random() * 50)}`,
      projectNo: "PRJ-2024-XXX",
      productName: "New Product / Part",
      partSN: "",
      customer: "",
      status: "Unassigned",
      createdDate: "21 Dec 2024",
      startDate: "",
      dueDate: "",
      notes: "",
      progress: 0,
      tasks: makeTasksFor(`new-${Date.now()}`, [], []),
    };
    setJobs(js => [newJob, ...js]);
    setSelectedJobId(newJob.id);
    setScreen("job-detail");
  }

  function handleLogin(r: Role) {
    setRole(r);
    setScreen(r === "worker" ? "worker-dashboard" : r === "qc" ? "qc-dashboard" : "pe-dashboard");
  }

  const isDashboard = screen === "worker-dashboard" || screen === "qc-dashboard" || screen === "pe-dashboard";

  // ── Demo screen navigator ──
  type DemoEntry = { label: string; screen: Screen; role: Role };
  const demoScreens: DemoEntry[] = [
    { label: "Login",    screen: "login",              role: "worker" },
    { label: "Worker",   screen: "worker-dashboard",  role: "worker" },
    { label: "W-Task",   screen: "worker-task-detail", role: "worker" },
    { label: "QC",       screen: "qc-dashboard",       role: "qc"     },
    { label: "QC-Task",  screen: "qc-task-detail",     role: "qc"     },
    { label: "Inspect",  screen: "qc-inspection",      role: "qc"     },
    { label: "PE",       screen: "pe-dashboard",       role: "pe"     },
    { label: "Job",      screen: "job-detail",         role: "pe"     },
  ];

  function jumpToScreen(s: Screen, r: Role) {
    setRole(r);
    if (s === "worker-task-detail")           setSelectedId("t1");
    else if (s === "qc-task-detail" || s === "qc-inspection") setSelectedId("q1");
    else                                       setSelectedId(null);
    if (s === "job-detail") setSelectedJobId("j2");
    else                    setSelectedJobId(null);
    setScreen(s);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-8 gap-5"
      style={{ background: "linear-gradient(135deg, #0f1929 0%, #1a2a3a 50%, #0f1929 100%)" }}
    >
      {/* App title */}
      <div className="text-center">
        <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mb-0.5">Production Flow</p>
        <p className="text-white/20 text-[10px] font-medium">Mobile App UI · iPhone 16 Pro Max · 8 Screens</p>
      </div>

      {/* Demo screen selector — two rows */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-[480px] bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10">
        {demoScreens.map(d => (
          <button
            key={d.screen}
            onClick={() => jumpToScreen(d.screen, d.role)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${screen === d.screen
              ? d.role === "pe" ? "bg-amber-500 text-white shadow-sm"
                : d.role === "qc" ? "bg-purple-600 text-white shadow-sm"
                : "bg-[#0E70B8] text-white shadow-sm"
              : "text-white/50 hover:text-white/80"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Phone */}
      <PhoneFrame>
        <div className="absolute inset-0 flex flex-col pt-[55px]">
          <StatusBar />
          <div className="flex-1 relative overflow-hidden flex flex-col">

            {/* Login */}
            {screen === "login" && (
              <LoginScreen onLogin={handleLogin} />
            )}

            {/* Worker screens */}
            {screen === "worker-dashboard" && (
              <WorkerDashboard tasks={workerTasks} onTaskClick={handleTaskClick} />
            )}
            {screen === "worker-task-detail" && selectedTask && (
              <WorkerTaskDetail task={selectedTask} onUpdate={u => updateTask(selectedTask.id, u)} onBack={handleBack} />
            )}

            {/* QC screens */}
            {screen === "qc-dashboard" && (
              <QCDashboard tasks={qcTasks} onTaskClick={handleTaskClick} />
            )}
            {screen === "qc-task-detail" && selectedTask && (
              <QCTaskDetail task={selectedTask} onBack={handleBack} onInspect={() => setScreen("qc-inspection")} />
            )}
            {screen === "qc-inspection" && selectedTask && (
              <QCInspectionForm
                task={selectedTask}
                onBack={() => setScreen("qc-task-detail")}
                onApprove={() => { updateTask(selectedTask.id, { status: "Done" }); setScreen("qc-dashboard"); setSelectedId(null); }}
                onReject={() => { setScreen("qc-dashboard"); setSelectedId(null); }}
              />
            )}

            {/* PE screens */}
            {screen === "pe-dashboard" && (
              <PEDashboard jobs={jobs} onJobClick={handleJobClick} onAddJob={handleAddJob} />
            )}
            {screen === "job-detail" && selectedJob && (
              <JobDetail
                job={selectedJob}
                onBack={() => { setScreen("pe-dashboard"); setSelectedJobId(null); }}
                onSave={updateJob}
              />
            )}
          </div>

          {/* Bottom chrome */}
          {isDashboard && screen === "pe-dashboard" && (
            <PEBottomNav activeTab="home" onAddJob={handleAddJob} />
          )}
          {isDashboard && screen !== "pe-dashboard" && (
            <BottomNav role={role} activeTab="home" onNavigate={() => {}} onSwitchRole={switchRole} />
          )}
          {!isDashboard && <HomeIndicatorBar />}
        </div>
      </PhoneFrame>

      <p className="text-white/20 text-[10px] text-center font-medium pb-4">
        Centre button: Worker ↔ QC · Use "PE" tab for Project Engineer view
      </p>
    </div>
  );
}
