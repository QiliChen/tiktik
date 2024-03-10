import { useRouter } from 'next/router';
import { AiOutlineTranslation } from 'react-icons/ai';

const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    // 定义支持的语言环境列表
    const locales = ['en', 'cn']; // 确保这些值与您的 next.config.js 中的配置相匹配

    const switchLanguage = () => {
        // 确定当前语言在列表中的索引
        const currentLocaleIndex = locales.indexOf(locale);
        // 计算下一个语言的索引（如果当前语言是列表中的最后一个，则循环回到第一个）
        const nextLocaleIndex = (currentLocaleIndex + 1) % locales.length;
        // 获取下一个语言
        const nextLocale = locales[nextLocaleIndex];

        // 切换到下一个语言
        router.push({ pathname, query }, asPath, { locale: nextLocale });
    };

    return (
        <button
            onClick={switchLanguage}
            aria-label="Switch Language"
            className="md:hidden inline-flex" // 'md:hidden' 在 md 尺寸及以下隐藏, 'inline-flex' 用于其他尺寸显示
        >
            <AiOutlineTranslation size={32}/>
        </button>

    );
};

export default LanguageSwitcher;
