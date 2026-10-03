'use client'

import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* ─── Download ─── */
// Link file cài đặt desktop app. Cấu hình qua biến môi trường NEXT_PUBLIC_DOWNLOAD_URL
// (khi ra bản mới có thể ghi đè mà không cần sửa code). Mặc định lấy file trên GitHub Releases.
const DOWNLOAD_URL =
    process.env.NEXT_PUBLIC_DOWNLOAD_URL ||
    'https://github.com/Sharks-s/EXE/releases/download/v0.1.0/FocusBuddy_0.1.0_x64-setup.exe'

/* ─── i18n ─── */
type Lang = 'vi' | 'en'

interface LandingStats {
    totalFocusMinutes: number
    completedSessions: number
    completionRate: number
    raisedBuddies: number
}

interface LandingTestimonial {
    id?: number
    name: string
    role: string
    avatar: string
    text: string
    color: string
    rating: number
}

const EMPTY_LANDING_STATS: LandingStats = {
    totalFocusMinutes: 0,
    completedSessions: 0,
    completionRate: 0,
    raisedBuddies: 0,
}

const TESTIMONIAL_ACCENTS = [
    { avatar: '/images/PANDO.png', color: '#483BFC' },
    { avatar: '/images/FROGI.png', color: '#FA8A38' },
    { avatar: '/images/MONKI.png', color: '#35C85E' },
    { avatar: '/images/PIGGY.png', color: '#FF909E' },
]

const FALLBACK_TESTIMONIALS: LandingTestimonial[] = [
    {
        name: 'Minh Quân',
        role: 'Sinh viên ĐH Bách Khoa',
        avatar: '/images/PANDO.png',
        text: 'Từ ngày dùng FocusBuddy, mình học đều hơn hẳn. App nhắc đúng lúc nên mình ít bị trôi qua TikTok giữa session.',
        color: '#483BFC',
        rating: 5,
    },
    {
        name: 'Linh Nhi',
        role: 'Freelance Designer',
        avatar: '/images/FROGI.png',
        text: 'Mình thích nhất phần nghỉ có thưởng. Làm xong một block tập trung thấy nhẹ đầu, không còn cảm giác bị ép quá.',
        color: '#FA8A38',
        rating: 5,
    },
    {
        name: 'Văn Đức',
        role: 'Lập trình viên remote',
        avatar: '/images/MONKI.png',
        text: 'FocusBuddy giúp mình giữ nhịp làm việc ở nhà tốt hơn. Nhìn streak tăng mỗi ngày cũng có động lực quay lại bàn làm việc.',
        color: '#35C85E',
        rating: 5,
    },
    {
        name: 'Thu Hà',
        role: 'Học sinh lớp 12',
        avatar: '/images/PIGGY.png',
        text: 'Ôn thi bằng Pomodoro trong FocusBuddy dễ theo hơn nhiều. Có buddy đi cùng nên mình bớt nản khi học các môn dài.',
        color: '#FF909E',
        rating: 5,
    },
]

function normalizeTestimonial(item: Partial<LandingTestimonial>, index: number): LandingTestimonial | null {
    const text = typeof item.text === 'string' ? item.text.trim() : ''
    const rating = typeof item.rating === 'number' ? item.rating : 0

    if (!text || rating < 4) return null

    const accent = TESTIMONIAL_ACCENTS[index % TESTIMONIAL_ACCENTS.length]

    return {
        id: item.id,
        name: item.name?.trim() || 'Người dùng FocusBuddy',
        role: item.role?.trim() || 'Người dùng thực tế',
        avatar: item.avatar || accent.avatar,
        text,
        color: item.color || accent.color,
        rating: Math.min(5, Math.max(4, Math.round(rating))),
    }
}

function useLandingStats() {
    const [stats, setStats] = useState<LandingStats>(EMPTY_LANDING_STATS)

    useEffect(() => {
        let active = true

        async function loadStats() {
            try {
                const response = await fetch('/api/landing/stats')
                const json = await response.json()
                if (active && response.ok && json?.success && json.data) {
                    setStats(json.data)
                }
            } catch {
                if (active) setStats(EMPTY_LANDING_STATS)
            }
        }

        loadStats()
        return () => {
            active = false
        }
    }, [])

    return stats
}

function useLandingTestimonials() {
    const [testimonials, setTestimonials] = useState<LandingTestimonial[]>(FALLBACK_TESTIMONIALS)

    useEffect(() => {
        let active = true

        async function loadTestimonials() {
            try {
                const response = await fetch('/api/landing/testimonials')
                const json = await response.json()
                const rawItems = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
                const goodReviews = rawItems
                    .map((item: Partial<LandingTestimonial>, index: number) => normalizeTestimonial(item, index))
                    .filter((item: LandingTestimonial | null): item is LandingTestimonial => Boolean(item))

                if (active && response.ok && goodReviews.length > 0) {
                    setTestimonials(goodReviews)
                }
            } catch {
                if (active) setTestimonials(FALLBACK_TESTIMONIALS)
            }
        }

        loadTestimonials()
        return () => {
            active = false
        }
    }, [])

    return testimonials
}

function formatCompact(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 100_000 ? 0 : 1).replace('.0', '')}K`
    return String(Math.round(n))
}

const translations = {
    vi: {
        nav: { features: 'Tính năng', buddy: 'Buddy', how: 'Cách hoạt động', privacy: 'Bảo mật' },
        downloadFree: 'Tải miễn phí',
        downloadFreeFull: 'Tải về miễn phí',
        downloadSub: 'Windows 10/11 · ~170MB',
        watchDemo: 'Xem demo',
        heroBadge: 'Miễn phí hoàn toàn · Không cần tài khoản',
        heroTitleLine1: 'Buddy đồng hành.',
        heroYou: 'Bạn ',
        heroPhrases: ['tập trung.', 'tiến bộ.', 'bứt phá.'],
        heroSub1: 'Ứng dụng Pomodoro thông minh với ',
        heroSubHighlight: 'pet ảo đồng hành',
        heroSub2: ', AI giám sát tập trung, và hệ thống phần thưởng giúp bạn duy trì động lực mỗi ngày.',
        heroTagline: 'Focus today, archive tomorrow.',
        streakCard: 'Streak hiện tại',
        streakValue: '90 ngày',
        sessionCard: 'Session hoàn thành',
        sessionValue: '25 phút',
        featuresBadge: 'Tính năng',
        featuresTitle1: 'Mọi thứ bạn cần để',
        featuresTitle2: 'tập trung thực sự',
        featuresDesc: 'Không chỉ là timer. FocusBuddy là người bạn đồng hành hiểu bạn, theo dõi bạn, và quan tâm đến sự tiến bộ của bạn.',
        features: [
            {
                title: 'Pomodoro thông minh',
                desc: 'Học 25 phút, nghỉ có thưởng. Tích lũy thời gian nghỉ khi hoàn thành liên tiếp. Session bị gián đoạn không được tính — giữ cho bạn trung thực với bản thân.',
                badge: 'Core',
                detail: ['Tùy chỉnh thời gian', 'Thưởng nghỉ tích lũy', 'Chuỗi streak'],
            },
            {
                title: 'Giám sát thông minh',
                desc: 'Camera phát hiện khi bạn rời khỏi màn hình hoặc có tư thế xấu. Theo dõi ứng dụng đang mở để nhận biết khi bạn đang xem TikTok hay chơi game.',
                badge: 'AI Powered',
                detail: ['Nhận diện khuôn mặt cục bộ', 'Phát hiện app giải trí', 'Cảnh báo thông minh'],
            },
            {
                title: 'AI đồng hành cá nhân',
                desc: 'Pet của bạn có trí tuệ nhân tạo thực sự — nói chuyện, nhắc nhở, cảnh báo với cá tính riêng biệt. Có thể nghiêm khắc, hài hước, hay ngọt ngào tuỳ bạn chọn.',
                badge: 'Mới',
                detail: ['3 cá tính khác nhau', 'Giọng nói tùy chỉnh', 'Phản ứng thời gian thực'],
            },
            {
                title: 'Thống kê & Tiến độ',
                desc: 'Biểu đồ trực quan hiển thị thời gian tập trung theo ngày/tuần. Theo dõi chuỗi ngày, so sánh tuần này với tuần trước, xem pet lớn lên theo từng session.',
                badge: 'Analytics',
                detail: ['Biểu đồ ngày/tuần/tháng', 'Streak calendar', 'So sánh hiệu suất'],
            },
        ],
        petsBadge: 'Virtual Pets',
        petsTitle1: 'Chọn người bạn',
        petsTitle2: 'hoàn hảo của bạn',
        petsDesc: 'Mỗi buddy có cá tính, giọng nói, và cách phản ứng riêng. Chọn người phù hợp với phong cách học của bạn.',
        petQuoteLabel: (name: string) => `${name} nói khi bạn xao nhãng:`,
        howBadge: 'Cách hoạt động',
        howTitle1: 'Đơn giản như',
        howTitle2: 'đếm đến 4',
        steps: [
            { title: 'Chọn Pet & Cá tính', desc: 'Chọn Pando, Frogi, Monki, hoặc Piggy. Tùy chỉnh giọng nói và mức độ nghiêm khắc.' },
            { title: 'Bắt đầu session 25 phút', desc: 'Buddy đồng hành. Camera phát hiện rời màn hình, app phát hiện khi bạn mở TikTok hay YouTube.' },
            { title: 'Nhận phần thưởng nghỉ', desc: 'Hoàn thành → tích lũy thời gian nghỉ. Buddy lên XP, đôi khi nhận vật phẩm hiếm!' },
            { title: 'Xem tiến trình tăng', desc: 'Streak mỗi ngày, biểu đồ tuần, buddy mạnh hơn. Bạn thấy rõ mình đang tiến bộ từng ngày.' },
        ],
        cycleLabel: 'Chu kỳ Pomodoro',
        cycleNote: 'Mỗi lần học 25 phút bạn nhận 5 phút nghỉ, tích lũy thời gian nghỉ để nhận kinh nghiệm nâng cấp Buddy',
        statsTitle1: 'Con số',
        statsTitle2: 'nói lên tất cả',
        statsLabels: ['Phút tập trung đã ghi nhận', 'Sessions Pomodoro hoàn thành', 'Tỷ lệ hoàn thành session', 'Buddy ảo đã được nuôi dưỡng'],
        privacyBadge: 'Bảo mật & Riêng tư',
        privacyTitle1: 'Camera của bạn,',
        privacyTitle2: 'bí mật của bạn',
        privacyDesc: 'Chúng tôi hiểu rằng camera là điều nhạy cảm. Đó là lý do FocusBuddy xây dựng hoàn toàn dựa trên nguyên tắc xử lý cục bộ — dữ liệu của bạn không bao giờ rời khỏi máy tính.',
        privacyArchTitle: 'Kiến trúc Privacy-First',
        privacyArchDesc: 'Camera API → Local ML Model → Kết quả (không có ảnh)',
        privacyItems: [
            { title: 'Xử lý cục bộ 100%', desc: 'Camera phân tích ngay trên thiết bị bạn. Không một frame ảnh nào rời khỏi máy tính.' },
            { title: 'Không lưu hình ảnh', desc: 'Dữ liệu camera bị xóa ngay sau phân tích. Chúng tôi không thể xem và không muốn xem.' },
            { title: 'Dữ liệu là của bạn', desc: 'Lịch sử phiên học lưu trên máy bạn. Export hoặc xóa bất kỳ lúc nào bạn muốn.' },
            { title: 'Hoạt động độc lập', desc: 'Hầu hết tính năng không cần internet. Kết nối chỉ dùng cho đồng bộ đám mây (tùy chọn).' },
        ],
        testiBadge: 'Người dùng nói gì',
        testiTitle1: 'Hàng nghìn người đã',
        testiTitle2: 'tìm lại sự tập trung',
        ctaTitle1: 'Buddy đang chờ',
        ctaTitle2: 'bạn đấy',
        ctaDesc: 'Bắt đầu ngay hôm nay. Miễn phí hoàn toàn, không cần tài khoản, không cần thẻ ngân hàng.',
        ctaChecklist: ['Không cần tài khoản', 'Camera xử lý cục bộ', 'Cập nhật miễn phí mãi mãi'],
        footerDesc: 'Người bạn đồng hành cho hành trình tập trung và phát triển bản thân của bạn.',
        footerCols: [
            { title: 'Sản phẩm', links: ['Tính năng', 'Changelog', 'Roadmap', 'Tải về'] },
            { title: 'Hỗ trợ', links: ['Trung tâm hỗ trợ', 'Discord Community', 'Báo lỗi', 'Liên hệ'] },
            { title: 'Pháp lý', links: ['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie Policy'] },
        ],
        footerCopyright: '© 2026 FocusBuddy. Được làm bởi nhà Slytherin tại Việt Nam.',
        footerStatus: 'Tất cả hệ thống hoạt động bình thường',
    },
    en: {
        nav: { features: 'Features', buddy: 'Buddy', how: 'How it works', privacy: 'Privacy' },
        downloadFree: 'Free download',
        downloadFreeFull: 'Download for free',
        downloadSub: 'Windows 10/11 · ~170MB',
        watchDemo: 'Watch demo',
        heroBadge: 'Completely free · No account required',
        heroTitleLine1: 'A buddy that stays.',
        heroYou: 'You ',
        heroPhrases: ['stay focused.', 'keep improving.', 'break through.'],
        heroSub1: 'A smart Pomodoro app with a ',
        heroSubHighlight: 'virtual pet companion',
        heroSub2: ', AI focus monitoring, and a reward system that keeps you motivated every day.',
        heroTagline: 'Focus today, archive tomorrow.',
        streakCard: 'Current streak',
        streakValue: '90 days',
        sessionCard: 'Session completed',
        sessionValue: '25 minutes',
        featuresBadge: 'Features',
        featuresTitle1: 'Everything you need to',
        featuresTitle2: 'truly stay focused',
        featuresDesc: "Not just a timer. FocusBuddy is a companion that understands you, watches out for you, and cares about your progress.",
        features: [
            {
                title: 'Smart Pomodoro',
                desc: 'Study for 25 minutes, earn break time. Break time accumulates when you complete sessions back to back. Interrupted sessions don\'t count — keeping you honest with yourself.',
                badge: 'Core',
                detail: ['Customizable timers', 'Accumulated break rewards', 'Streak tracking'],
            },
            {
                title: 'Smart monitoring',
                desc: 'The camera detects when you step away from the screen or slouch. App tracking recognizes when you open TikTok or a game.',
                badge: 'AI Powered',
                detail: ['On-device face detection', 'Entertainment app detection', 'Smart alerts'],
            },
            {
                title: 'Personal AI companion',
                desc: 'Your pet has real AI — it talks, reminds, and warns you with its own personality. Choose strict, funny, or sweet.',
                badge: 'New',
                detail: ['3 distinct personalities', 'Customizable voice', 'Real-time reactions'],
            },
            {
                title: 'Stats & Progress',
                desc: 'Visual charts of daily/weekly focus time. Track your streak, compare this week to last, and watch your pet grow with every session.',
                badge: 'Analytics',
                detail: ['Daily/weekly/monthly charts', 'Streak calendar', 'Performance comparison'],
            },
        ],
        petsBadge: 'Virtual Pets',
        petsTitle1: 'Pick the buddy',
        petsTitle2: 'that fits you best',
        petsDesc: 'Every buddy has its own personality, voice, and way of reacting. Pick the one that matches your study style.',
        petQuoteLabel: (name: string) => `What ${name} says when you get distracted:`,
        howBadge: 'How it works',
        howTitle1: 'As simple as',
        howTitle2: 'counting to 4',
        steps: [
            { title: 'Pick a pet & personality', desc: 'Choose Pando, Frogi, Monki, or Piggy. Customize the voice and strictness level.' },
            { title: 'Start a 25-minute session', desc: 'Your buddy stays with you. The camera detects when you leave, apps detect TikTok or YouTube.' },
            { title: 'Earn break rewards', desc: 'Complete a session → earn break time. Your buddy gains XP and sometimes rare items!' },
            { title: 'Watch your progress grow', desc: 'Daily streaks, weekly charts, a stronger buddy. You can clearly see yourself improving every day.' },
        ],
        cycleLabel: 'Pomodoro cycle',
        cycleNote: 'Every 25-minute session earns you 5 minutes of break, which accumulates into XP to level up your Buddy',
        statsTitle1: 'The numbers',
        statsTitle2: 'speak for themselves',
        statsLabels: ['Minutes of focus recorded', 'Pomodoro sessions completed', 'Session completion rate', 'Virtual buddies raised'],
        privacyBadge: 'Security & Privacy',
        privacyTitle1: 'Your camera,',
        privacyTitle2: 'your secret',
        privacyDesc: "We know cameras are sensitive. That's why FocusBuddy is built entirely on local processing — your data never leaves your computer.",
        privacyArchTitle: 'Privacy-First Architecture',
        privacyArchDesc: 'Camera API → Local ML Model → Result (no images)',
        privacyItems: [
            { title: '100% local processing', desc: 'The camera analyzes footage right on your device. Not a single frame ever leaves your computer.' },
            { title: 'No images stored', desc: 'Camera data is deleted immediately after analysis. We can\'t see it, and we don\'t want to.' },
            { title: 'Your data is yours', desc: 'Session history is stored on your device. Export or delete it anytime.' },
            { title: 'Works offline', desc: 'Most features work without internet. Connection is only used for optional cloud sync.' },
        ],
        testiBadge: 'What users say',
        testiTitle1: 'Thousands have already',
        testiTitle2: 'found their focus again',
        ctaTitle1: "Your buddy's",
        ctaTitle2: 'waiting for you',
        ctaDesc: 'Start today. Completely free, no account, no credit card required.',
        ctaChecklist: ['No account needed', 'Local camera processing', 'Free updates forever'],
        footerDesc: 'Your companion on the journey to focus and self-improvement.',
        footerCols: [
            { title: 'Product', links: ['Features', 'Changelog', 'Roadmap', 'Download'] },
            { title: 'Support', links: ['Help center', 'Discord Community', 'Report a bug', 'Contact'] },
            { title: 'Legal', links: ['Privacy policy', 'Terms of service', 'Cookie policy'] },
        ],
        footerCopyright: '© 2024 FocusBuddy. Made with ❤️ in Vietnam.',
        footerStatus: 'All systems operational',
    },
}

type Translation = typeof translations.vi

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Translation }>({
    lang: 'vi',
    setLang: () => { },
    t: translations.vi,
})

function useLang() {
    return useContext(LanguageContext)
}

function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
    const { lang, setLang } = useLang()

    return (
        <div
            className={`inline-flex items-center rounded-full p-0.5 ${variant === 'mobile' ? 'w-fit' : ''}`}
            style={{ background: '#F0F1FA', border: '1.5px solid rgba(72,59,252,0.1)' }}
        >
            {(['vi', 'en'] as Lang[]).map((l) => (
                <button
                    key={l}
                    onClick={() => setLang(l)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{
                        background: lang === l ? '#483BFC' : 'transparent',
                        color: lang === l ? '#ffffff' : '#6b7280',
                    }}
                >
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    )
}

/* ─── Hooks ─── */
function useScrollReveal() {
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add('revealed')
                })
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        )
        document.querySelectorAll('.lp-reveal, .lp-reveal-left, .lp-reveal-right').forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
    const [v, setV] = useState(false)
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.3 })
        if (ref.current) io.observe(ref.current)
        return () => io.disconnect()
    }, [ref])
    return v
}

function useCountUp(target: number, trigger: boolean, ms = 2000) {
    const [n, setN] = useState(0)
    useEffect(() => {
        if (!trigger) return
        let cur = 0
        const step = target / (ms / 16)
        const id = setInterval(() => {
            cur += step
            if (cur >= target) {
                setN(target)
                clearInterval(id)
            } else {
                setN(Math.floor(cur))
            }
        }, 16)
        return () => clearInterval(id)
    }, [target, trigger, ms])
    return n
}

function useMousePos(ref: React.RefObject<HTMLElement | null>) {
    const [p, setP] = useState({ x: 0, y: 0 })
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const h = (e: MouseEvent) => {
            const r = el.getBoundingClientRect()
            setP({ x: e.clientX - r.left, y: e.clientY - r.top })
        }
        el.addEventListener('mousemove', h)
        return () => el.removeEventListener('mousemove', h)
    }, [ref])
    return p
}

/* ─── Icons ─── */
const IcoDownload = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
)
const IcoCheck = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const IcoClock = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
const IcoChart = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
)
const IcoAI = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z" />
        <circle cx="9" cy="13" r="1" fill="currentColor" /><circle cx="15" cy="13" r="1" fill="currentColor" />
    </svg>
)
const IcoEye = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
)
const IcoStar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

/* ─── Navbar ─── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const { t } = useLang()

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', h)
        return () => window.removeEventListener('scroll', h)
    }, [])

    const navItems: { label: string; href: string }[] = [
        { label: t.nav.features, href: '#features' },
        { label: t.nav.buddy, href: '#pets' },
        { label: t.nav.how, href: '#how' },
        { label: t.nav.privacy, href: '#privacy' },
    ]

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
            style={{
                background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(18px)' : 'none',
                borderBottom: scrolled ? '1.5px solid rgba(72,59,252,0.08)' : 'none',
                boxShadow: scrolled ? '0 2px 24px rgba(72,59,252,0.07)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Image src="/images/LOGOFINAL.png" alt="FocusBuddy" width={140} height={32} className="h-8 w-auto" priority />

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="text-sm font-semibold transition-colors"
                            style={{ color: '#0C1141', opacity: 0.65 }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.65')}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <LanguageSwitcher />
                    <a id="nav-download-btn" href={DOWNLOAD_URL} download className="lp-btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
                        <IcoDownload />
                        <span>{t.downloadFree}</span>
                    </a>
                </div>

                <button className="md:hidden" style={{ color: '#483BFC' }} onClick={() => setOpen(!open)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        {open ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {open && (
                <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-4 shadow-lg" style={{ borderColor: 'rgba(72,59,252,0.08)' }}>
                    {navItems.map((item) => (
                        <a key={item.href} href={item.href} className="text-sm font-semibold" style={{ color: '#0C1141' }}>
                            {item.label}
                        </a>
                    ))}
                    <LanguageSwitcher variant="mobile" />
                    <a id="mobile-download-btn" href={DOWNLOAD_URL} download className="lp-btn-primary px-5 py-3 text-sm flex items-center justify-center gap-2 mt-1">
                        <IcoDownload />
                        <span>{t.downloadFree}</span>
                    </a>
                </div>
            )}
        </header>
    )
}

/* ─── Hero ─── */
function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null)
    const mouse = useMousePos(heroRef)
    const { t } = useLang()
    const [typed, setTyped] = useState('')
    const phrases = t.heroPhrases
    const [pi, setPi] = useState(0)
    const [del, setDel] = useState(false)

    // Reset typing effect when language changes
    useEffect(() => {
        setTyped('')
        setPi(0)
        setDel(false)
    }, [phrases])

    useEffect(() => {
        const phrase = phrases[pi]
        let t: ReturnType<typeof setTimeout>
        if (!del && typed.length < phrase.length) {
            t = setTimeout(() => setTyped(phrase.slice(0, typed.length + 1)), 80)
        } else if (!del && typed.length === phrase.length) {
            t = setTimeout(() => setDel(true), 1800)
        } else if (del && typed.length > 0) {
            t = setTimeout(() => setTyped(typed.slice(0, -1)), 40)
        } else {
            setDel(false)
            setPi((i) => (i + 1) % phrases.length)
        }
        return () => clearTimeout(t)
    }, [typed, del, pi, phrases])

    return (
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden lp-hero-bg lp-dot-grid">
            <div
                className="absolute pointer-events-none"
                style={{
                    left: mouse.x,
                    top: mouse.y,
                    width: 480,
                    height: 480,
                    background: 'radial-gradient(circle, rgba(72,59,252,0.10) 0%, rgba(250,138,56,0.05) 50%, transparent 70%)',
                    transform: 'translate(-50%,-50%)',
                    borderRadius: '50%',
                    zIndex: 1,
                }}
            />

            <div
                className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full pointer-events-none opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(72,59,252,0.15) 0%, transparent 70%)', animation: 'lp-blob-move 12s ease-in-out infinite' }}
            />
            <div
                className="absolute bottom-1/4 right-1/5 w-64 h-64 rounded-full pointer-events-none opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(250,138,56,0.2) 0%, transparent 70%)', animation: 'lp-blob-move 16s ease-in-out infinite 4s' }}
            />
            <div
                className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full pointer-events-none opacity-25"
                style={{ background: 'radial-gradient(circle, rgba(53,200,94,0.2) 0%, transparent 70%)', animation: 'lp-blob-move 10s ease-in-out infinite 8s' }}
            />

            <div className="absolute top-28 left-10 md:left-24 lp-float-a pointer-events-none">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: '#EEF0FF', border: '2px solid rgba(72,59,252,0.15)' }}>
                    <span className="text-2xl">⭐</span>
                </div>
            </div>
            <div className="absolute top-44 right-10 md:right-24 lp-float-b pointer-events-none" style={{ animationDelay: '1.5s' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: '#FFF3EA', border: '2px solid rgba(250,138,56,0.2)' }}>
                    <span className="text-xl">🎯</span>
                </div>
            </div>
            <div className="absolute bottom-48 left-14 md:left-40 lp-float-c pointer-events-none" style={{ animationDelay: '3s' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{ background: '#EDFAF2', border: '2px solid rgba(53,200,94,0.2)' }}>
                    <span className="text-lg">✨</span>
                </div>
            </div>
            <div className="absolute bottom-40 right-14 md:right-36 lp-float-a pointer-events-none" style={{ animationDelay: '2s' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{ background: '#FFF0F2', border: '2px solid rgba(255,144,158,0.2)' }}>
                    <span className="text-xl">💫</span>
                </div>
            </div>

            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
                <div
                    className="lp-hero-badge inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-8"
                    style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(72,59,252,0.12)', color: '#483BFC', border: '1.5px solid rgba(72,59,252,0.15)' }}
                >
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" style={{ boxShadow: '0 0 6px rgba(53,200,94,0.7)' }} />
                    {t.heroBadge}
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-6">
                    <span className="block" style={{ color: '#0C1141' }}>{t.heroTitleLine1}</span>
                    <span className="block mt-2">
                        <span className="lp-gradient-text-blue">{t.heroYou}</span>
                        <span style={{ color: '#0C1141' }}>{typed}</span>
                        <span className="inline-block w-0.5 h-12 md:h-16 ml-1 align-middle rounded-full" style={{ background: '#FA8A38', animation: 'lp-blink 1s step-end infinite' }} />
                    </span>
                </h1>

                <p className="lp-hero-sub text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed font-medium" style={{ color: '#4a5279' }}>
                    {t.heroSub1}<span style={{ color: '#483BFC', fontWeight: 700 }}>{t.heroSubHighlight}</span>{t.heroSub2}
                </p>
                <p className="font-semibold mb-10 text-base" style={{ color: '#FA8A38' }}>
                    {t.heroTagline}
                </p>

                <div className="lp-hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <a id="hero-download-btn" href={DOWNLOAD_URL} download className="lp-btn-primary px-9 py-4 text-lg flex items-center gap-3">
                        <IcoDownload />
                        <div className="text-left">
                            <div className="font-bold leading-none">{t.downloadFreeFull}</div>
                            <div className="text-xs opacity-75 font-medium mt-0.5">{t.downloadSub}</div>
                        </div>
                    </a>
                    <button className="lp-btn-outline px-9 py-4 text-lg flex items-center gap-2.5 bg-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        <span>{t.watchDemo}</span>
                    </button>
                </div>

                <div className="relative flex justify-center">
                    <div className="relative inline-block">
                        <Image
                            src="/images/4PET.png"
                            alt="FocusBuddy mascots"
                            width={672}
                            height={400}
                            className="w-full max-w-2xl mx-auto drop-shadow-xl"
                            style={{ filter: 'drop-shadow(0 20px 40px rgba(72,59,252,0.15))' }}
                            priority
                        />
                        <div className="absolute -left-4 md:-left-16 top-1/3 lp-card px-4 py-3 flex items-center gap-3 shadow-lg lp-float-b" style={{ animationDelay: '1s', minWidth: '140px' }}>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#EEF0FF' }}>🔥</div>
                            <div>
                                <p className="font-bold text-sm" style={{ color: '#0C1141' }}>{t.streakValue}</p>
                                <p className="text-xs font-medium" style={{ color: '#7b82a8' }}>{t.streakCard}</p>
                            </div>
                        </div>
                        <div className="absolute -right-4 md:-right-16 top-1/4 lp-card px-4 py-3 flex items-center gap-3 shadow-lg lp-float-a" style={{ animationDelay: '0.5s', minWidth: '150px' }}>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#FFF3EA' }}>⏱️</div>
                            <div>
                                <p className="font-bold text-sm" style={{ color: '#0C1141' }}>{t.sessionValue}</p>
                                <p className="text-xs font-medium" style={{ color: '#7b82a8' }}>{t.sessionCard}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />
        </section>
    )
}

/* ─── Marquee ─── */
function MarqueeSection() {
    const stats = useLandingStats()
    const items = [
        { icon: '⏱️', text: `${formatCompact(stats.totalFocusMinutes)} phút tập trung`, color: '#483BFC' },
        { icon: '✅', text: `${formatCompact(stats.completedSessions)} sessions hoàn thành`, color: '#35C85E' },
        { icon: '📈', text: `${stats.completionRate.toFixed(1).replace('.0', '')}% tỷ lệ hoàn thành`, color: '#35C85E' },
        { icon: '🐼', text: `${formatCompact(stats.raisedBuddies)} pet được nuôi dưỡng`, color: '#483BFC' },
    ]
    const doubled = [...items, ...items]

    return (
        <div className="py-5 border-y" style={{ borderColor: 'rgba(72,59,252,0.08)', background: '#F7F8FF' }}>
            <div className="lp-marquee-wrap">
                <div className="lp-marquee-fwd">
                    {doubled.map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-8 whitespace-nowrap">
                            <span className="text-xl">{s.icon}</span>
                            <span className="font-bold text-sm" style={{ color: s.color }}>{s.text}</span>
                            <span className="ml-6 text-xl" style={{ color: 'rgba(72,59,252,0.15)' }}>·</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── Features ─── */
function FeaturesSection() {
    const { t } = useLang()
    const colors = [
        { color: '#483BFC', bg: '#EEF0FF' },
        { color: '#FA8A38', bg: '#FFF3EA' },
        { color: '#35C85E', bg: '#EDFAF2' },
        { color: '#FF909E', bg: '#FFF0F2' },
    ]
    const icons = [<IcoClock key="c" />, <IcoEye key="e" />, <IcoAI key="a" />, <IcoChart key="ch" />]

    return (
        <section id="features" className="py-28 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 lp-reveal">
                    <div className="lp-badge-blue mb-6">{t.featuresBadge}</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: '#0C1141' }}>
                        {t.featuresTitle1}<br />
                        <span className="lp-gradient-text">{t.featuresTitle2}</span>
                    </h2>
                    <p className="text-base font-medium max-w-xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
                        {t.featuresDesc}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {t.features.map((f, i) => (
                        <div key={i} className={`lp-spotlight-card lp-card p-7 ${i % 2 === 0 ? 'lp-reveal-left' : 'lp-reveal-right'}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                            <div className="flex items-start gap-5">
                                <div className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 p-3" style={{ background: colors[i].bg, color: colors[i].color }}>
                                    {icons[i]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="font-bold text-lg" style={{ color: '#0C1141' }}>{f.title}</h3>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: colors[i].bg, color: colors[i].color }}>{f.badge}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed mb-4 font-medium" style={{ color: '#6b7280' }}>{f.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {f.detail.map((d, j) => (
                                            <span key={j} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: '#F7F8FF', color: '#483BFC', border: '1.5px solid rgba(72,59,252,0.12)' }}>
                                                <IcoCheck />{d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── Pet Section (mock data — giữ nguyên, chỉ dịch label/tiêu đề) ─── */
const PETS = [
    { img: '/images/PANDO.png', name: 'Pando', role: 'Panda', personality: 'Ngọt ngào & Kiên nhẫn', color: '#483BFC', bg: '#EEF0FF', level: 12, xp: 750, quote: 'Cố lên nào! Thêm 5 phút nữa thôi bạn ơi!' },
    { img: '/images/FROGI.png', name: 'Frogi', role: 'Frog', personality: 'Nghiêm khắc & Trí tuệ', color: '#FA8A38', bg: '#FFF3EA', level: 15, xp: 920, quote: 'Session bị gián đoạn. Bắt đầu lại. Không có ngoại lệ.' },
    { img: '/images/MONKI.png', name: 'Monki', role: 'Monkey', personality: 'Hài hước & Năng động', color: '#35C85E', bg: '#EDFAF2', level: 8, xp: 320, quote: 'Ủa mở TikTok hả? Thôi 1 video thôi nha... 1 thôi á!' },
    { img: '/images/PIGGY.png', name: 'Piggy', role: 'Pig', personality: 'Dễ thương & Cổ vũ', color: '#FF909E', bg: '#FFF0F2', level: 5, xp: 180, quote: 'Bạn đã làm rất tốt rồi! Piggy tự hào về bạn lắm 🩷' },
]

function PetSection() {
    const { t } = useLang()
    const [active, setActive] = useState(0)
    const pet = PETS[active]

    return (
        <section id="pets" className="py-28 px-6" style={{ background: '#F7F8FF' }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 lp-reveal">
                    <div className="lp-badge-blue mb-6">{t.petsBadge}</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: '#0C1141' }}>
                        {t.petsTitle1}<br />
                        <span className="lp-gradient-text">{t.petsTitle2}</span>
                    </h2>
                    <p className="text-base font-medium max-w-xl mx-auto" style={{ color: '#6b7280' }}>
                        {t.petsDesc}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="grid grid-cols-2 gap-4 lp-reveal-left">
                        {PETS.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className="lp-spotlight-card text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer"
                                style={{
                                    background: active === i ? p.color : '#ffffff',
                                    border: `2px solid ${active === i ? p.color : 'rgba(72,59,252,0.08)'}`,
                                    boxShadow: active === i ? `0 8px 30px ${p.color}33` : '0 2px 12px rgba(0,0,0,0.05)',
                                    transform: active === i ? 'translateY(-4px)' : 'none',
                                }}
                            >
                                <Image
                                    src={p.img}
                                    alt={p.name}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 object-cover rounded-full mb-3 mx-auto"
                                    style={{ border: `3px solid ${active === i ? 'rgba(255,255,255,0.5)' : p.color + '30'}` }}
                                />
                                <p className="font-bold text-center text-base leading-tight" style={{ color: active === i ? '#ffffff' : '#0C1141' }}>{p.name}</p>
                                <p className="text-xs text-center font-medium mt-1" style={{ color: active === i ? 'rgba(255,255,255,0.75)' : '#9ca3af' }}>{p.personality}</p>
                            </button>
                        ))}
                    </div>

                    <div className="lp-reveal-right">
                        <div className="lp-card p-8 text-center">
                            <Image
                                src={pet.img}
                                alt={pet.name}
                                width={160}
                                height={160}
                                className="w-40 h-40 object-cover rounded-full mx-auto mb-6 lp-pet-bounce"
                                style={{ border: `4px solid ${pet.color}`, boxShadow: `0 0 40px ${pet.color}33` }}
                            />
                            <h3 className="font-bold text-3xl mb-1" style={{ color: '#0C1141' }}>{pet.name}</h3>
                            <p className="font-semibold text-sm mb-1" style={{ color: pet.color }}>{pet.role}</p>
                            <p className="text-sm font-medium mb-6" style={{ color: '#6b7280' }}>{pet.personality}</p>

                            <div className="mb-6">
                                <div className="flex justify-between text-xs font-bold mb-2" style={{ color: '#9ca3af' }}>
                                    <span>Level {pet.level}</span>
                                    <span>{pet.xp}/1000 XP</span>
                                </div>
                                <div className="lp-xp-bar">
                                    <div className="lp-xp-fill" style={{ width: `${pet.xp / 10}%`, background: `linear-gradient(90deg, ${pet.color}, ${pet.color}bb)` }} />
                                </div>
                            </div>

                            <div className="rounded-2xl p-4 text-left" style={{ background: pet.bg, border: `1.5px solid ${pet.color}22` }}>
                                <p className="text-xs font-bold mb-1" style={{ color: pet.color }}>{t.petQuoteLabel(pet.name)}</p>
                                <p className="text-sm font-medium leading-relaxed italic" style={{ color: '#374151' }}>&quot;{pet.quote}&quot;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── How It Works ─── */
function HowItWorksSection() {
    const { t } = useLang()
    const meta = [
        { icon: '🎨', color: '#483BFC', bg: '#EEF0FF' },
        { icon: '🚀', color: '#FA8A38', bg: '#FFF3EA' },
        { icon: '🎁', color: '#35C85E', bg: '#EDFAF2' },
        { icon: '📈', color: '#FF909E', bg: '#FFF0F2' },
    ]

    return (
        <section id="how" className="py-28 px-6 bg-white">
            <div className="lp-divider mb-0" />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 lp-reveal">
                    <div className="lp-badge-orange mb-6">{t.howBadge}</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight" style={{ color: '#0C1141' }}>
                        {t.howTitle1}<br /><span style={{ color: '#FA8A38' }}>{t.howTitle2}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    {t.steps.map((s, i) => (
                        <div key={i} className="lp-reveal flex flex-col items-center text-center" style={{ transitionDelay: `${i * 0.12}s` }}>
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-5 relative" style={{ background: meta[i].bg, border: `2px solid ${meta[i].color}25` }}>
                                {meta[i].icon}
                                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: meta[i].color, boxShadow: `0 4px 12px ${meta[i].color}60` }}>
                                    {i + 1}
                                </span>
                            </div>
                            <h3 className="font-bold text-base mb-2" style={{ color: '#0C1141' }}>{s.title}</h3>
                            <p className="text-sm font-medium leading-relaxed" style={{ color: '#6b7280' }}>{s.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="lp-card-blue rounded-3xl p-8 text-center lp-reveal">
                    <p className="font-bold text-xs tracking-widest uppercase mb-7" style={{ color: '#483BFC', opacity: 0.6 }}>{t.cycleLabel}</p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {['🎯 25m', '→', '☕ 5m', '→', '🎯 25m', '→', '☕ 5m'].map((item, i) => (
                            <span
                                key={i}
                                className={item === '→' ? 'font-bold text-lg' : 'px-3 py-1.5 rounded-xl text-xs font-bold'}
                                style={
                                    item === '→'
                                        ? { color: 'rgba(72,59,252,0.2)' }
                                        : {
                                            background: item.includes('☕') || item.includes('🎉') ? '#EDFAF2' : '#EEF0FF',
                                            color: item.includes('☕') || item.includes('🎉') ? '#35C85E' : '#483BFC',
                                            border: `1.5px solid ${item.includes('☕') || item.includes('🎉') ? 'rgba(53,200,94,0.2)' : 'rgba(72,59,252,0.15)'}`,
                                        }
                                }
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs font-medium mt-5" style={{ color: '#9ca3af' }}>{t.cycleNote}</p>
                </div>
            </div>
        </section>
    )
}

/* ─── Stats ─── */
function StatsSection() {
    const { t } = useLang()
    const stats = useLandingStats()
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref)
    const n1 = useCountUp(stats.totalFocusMinutes, inView, 2500)
    const n2 = useCountUp(stats.completedSessions, inView, 2200)
    const n3 = useCountUp(stats.completionRate, inView, 1800)
    const n4 = useCountUp(stats.raisedBuddies, inView, 2000)

    const values = [formatCompact(n1), formatCompact(n2), n3.toFixed(1).replace('.0', ''), formatCompact(n4)]
    const suffixes = ['', '+', '%', '+']
    const meta = [
        { color: '#483BFC', bg: '#EEF0FF', icon: '📊' },
        { color: '#FA8A38', bg: '#FFF3EA', icon: '✅' },
        { color: '#35C85E', bg: '#EDFAF2', icon: '📈' },
        { color: '#FF909E', bg: '#FFF0F2', icon: '🐼' },
    ]

    return (
        <section ref={ref} className="py-24 px-6" style={{ background: '#F7F8FF' }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14 lp-reveal">
                    <h2 className="text-3xl md:text-5xl font-bold" style={{ color: '#0C1141' }}>
                        {t.statsTitle1} <span className="lp-gradient-text">{t.statsTitle2}</span>
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {t.statsLabels.map((label, i) => (
                        <div key={i} className="lp-spotlight-card lp-card p-7 text-center lp-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: meta[i].bg }}>
                                {meta[i].icon}
                            </div>
                            <div className="font-bold text-3xl md:text-4xl mb-1" style={{ color: meta[i].color }}>
                                {values[i]}{suffixes[i]}
                            </div>
                            <p className="text-xs font-semibold leading-snug" style={{ color: '#9ca3af' }}>{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ─── Privacy ─── */
function PrivacySection() {
    const { t } = useLang()
    const meta = [
        { icon: '🔒', color: '#483BFC', bg: '#EEF0FF' },
        { icon: '🚫', color: '#FA8A38', bg: '#FFF3EA' },
        { icon: '📊', color: '#35C85E', bg: '#EDFAF2' },
        { icon: '🌐', color: '#FF909E', bg: '#FFF0F2' },
    ]

    return (
        <section id="privacy" className="py-28 px-6 bg-white">
            <div className="lp-divider mb-0" />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                    <div className="lp-reveal-left">
                        <div className="lp-badge-green mb-6">{t.privacyBadge}</div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: '#0C1141' }}>
                            {t.privacyTitle1}<br /><span style={{ color: '#35C85E' }}>{t.privacyTitle2}</span>
                        </h2>
                        <p className="text-base font-medium leading-relaxed mb-8" style={{ color: '#6b7280' }}>
                            {t.privacyDesc}
                        </p>
                        <div className="flex items-center gap-4 p-5 rounded-2xl" style={{ background: '#EDFAF2', border: '1.5px solid rgba(53,200,94,0.2)' }}>
                            <span className="text-3xl">🛡️</span>
                            <div>
                                <p className="font-bold" style={{ color: '#0C1141' }}>{t.privacyArchTitle}</p>
                                <p className="text-sm font-medium" style={{ color: '#35C85E' }}>{t.privacyArchDesc}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lp-reveal-right">
                        {t.privacyItems.map((item, i) => (
                            <div key={i} className="lp-spotlight-card lp-card p-6" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: meta[i].bg }}>
                                    {meta[i].icon}
                                </div>
                                <h3 className="font-bold mb-2" style={{ color: '#0C1141' }}>{item.title}</h3>
                                <p className="text-sm font-medium leading-relaxed" style={{ color: '#6b7280' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── Testimonials ─── */
function TestimonialsSection() {
    const { t } = useLang()
    const testi = useLandingTestimonials()
    const doubled = [...testi, ...testi]

    return (
        <section className="py-28 px-6 overflow-hidden" style={{ background: '#F7F8FF' }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 lp-reveal">
                    <div className="lp-badge-orange mb-6">{t.testiBadge}</div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: '#0C1141' }}>
                        {t.testiTitle1}<br /><span className="lp-gradient-text">{t.testiTitle2}</span>
                    </h2>
                </div>

                <div className="lp-marquee-wrap mb-5">
                    <div className="lp-marquee-fwd" style={{ gap: '20px' }}>
                        {doubled.map((t2, i) => (
                            <div key={i} className="lp-spotlight-card lp-card p-6 w-80 flex-shrink-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <Image src={t2.avatar} alt={t2.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid ${t2.color}40` }} />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm" style={{ color: '#0C1141' }}>{t2.name}</p>
                                        <p className="text-xs font-medium" style={{ color: '#9ca3af' }}>{t2.role}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: t2.rating }).map((_, j) => (
                                            <span key={j} style={{ color: '#FA8A38' }}><IcoStar /></span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm font-medium leading-relaxed" style={{ color: '#4b5563' }}>&quot;{t2.text}&quot;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── Download CTA ─── */
function DownloadSection() {
    const { t } = useLang()
    return (
        <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(150deg, #EEF0FF 0%, #F0EDFF 40%, #FFF5EE 100%)' }}>
            <div className="lp-divider mb-0" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[600px] h-[600px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(72,59,252,0.15) 0%, rgba(250,138,56,0.08) 50%, transparent 70%)' }} />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10 lp-reveal">
                <div className="flex items-end justify-center gap-6 mb-10">
                    {PETS.map((p, i) => (
                        <Image
                            key={i}
                            src={p.img}
                            alt={p.name}
                            width={i === 2 ? 100 : 80}
                            height={i === 2 ? 100 : 80}
                            className={`rounded-full object-cover border-4 shadow-lg ${['lp-float-a', 'lp-float-b', 'lp-float-c', 'lp-float-a'][i]}`}
                            style={{
                                borderColor: p.color,
                                boxShadow: `0 8px 24px ${p.color}33`,
                                animationDelay: `${i * 0.6}s`,
                            }}
                        />
                    ))}
                </div>

                <h2 className="text-5xl md:text-7xl font-bold mb-5 leading-tight" style={{ color: '#0C1141' }}>
                    {t.ctaTitle1}<br /><span className="lp-gradient-text">{t.ctaTitle2}</span>
                </h2>
                <p className="text-lg font-medium mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
                    {t.ctaDesc}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10">
                    <a id="cta-download-btn" href={DOWNLOAD_URL} download className="lp-btn-primary px-10 py-4 text-lg flex items-center gap-4 w-full sm:w-auto justify-center">
                        <IcoDownload />
                        <div className="text-left">
                            <div className="font-bold leading-none">{t.downloadFreeFull}</div>
                            <div className="text-xs opacity-75 font-medium mt-0.5">{t.downloadSub}</div>
                        </div>
                    </a>
                    <div className="text-sm font-semibold space-y-1.5" style={{ color: '#6b7280' }}>
                        {t.ctaChecklist.map((c) => (
                            <div key={c} className="flex items-center gap-2">
                                <span style={{ color: '#35C85E' }}><IcoCheck /></span>{c}
                            </div>
                        ))}
                    </div>
                </div>

                <Image src="/images/LOGOFINAL.png" alt="FocusBuddy" width={140} height={32} className="h-8 mx-auto opacity-50 w-auto" />
                <p className="text-xs font-semibold mt-2" style={{ color: '#9ca3af' }}>{t.heroTagline}</p>
            </div>
        </section>
    )
}

/* ─── Footer ─── */
function Footer() {
    const { t } = useLang()
    return (
        <footer className="border-t py-14 px-6 bg-white" style={{ borderColor: 'rgba(72,59,252,0.08)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                    <div>
                        <Image src="/images/LOGOFINAL.png" alt="FocusBuddy" width={120} height={28} className="h-7 mb-4 w-auto" />
                        <p className="text-sm font-medium leading-relaxed mb-5" style={{ color: '#9ca3af' }}>
                            {t.footerDesc}
                        </p>
                    </div>

                    {t.footerCols.map((col) => (
                        <div key={col.title}>
                            <h3 className="font-bold text-sm mb-4" style={{ color: '#0C1141' }}>{col.title}</h3>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href={link === 'Tải về' || link === 'Download' ? DOWNLOAD_URL : '#'} className="text-sm font-medium transition-colors" style={{ color: '#9ca3af' }}>{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: 'rgba(72,59,252,0.06)' }}>
                    <p className="text-sm font-medium" style={{ color: '#c4c9e0' }}>{t.footerCopyright}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px rgba(53,200,94,0.7)' }} />
                        <span className="text-xs font-semibold" style={{ color: '#c4c9e0' }}>{t.footerStatus}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

/* ─── Page Export ─── */
export default function LandingPage() {
    useScrollReveal()
    const [lang, setLang] = useState<Lang>('vi')
    const t = translations[lang]

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            <div className="min-h-screen bg-white text-[#0C1141]">
                <Navbar />
                <main>
                    <HeroSection />
                    <MarqueeSection />
                    <FeaturesSection />
                    <PetSection />
                    <HowItWorksSection />
                    <StatsSection />
                    <PrivacySection />
                    <TestimonialsSection />
                    <DownloadSection />
                </main>
                <Footer />
            </div>
        </LanguageContext.Provider>
    )
}
