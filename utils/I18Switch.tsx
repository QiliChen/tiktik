import { useRouter } from 'next/router';
import { AiOutlineTranslation } from 'react-icons/ai';

const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    // 定义支持的语言环境列表
    const locales = ['en', 'cn'];

    const switchLanguage = () => {
        // 确定当前语言在列表中的索引
        const currentLocaleIndex = locales.indexOf(locale);
        // 计算下一个语言的索引（如果当前语言是列表中的最后一个，则循环回到第一个）
        const nextLocaleIndex = (currentLocaleIndex + 1) % locales.length;
        // 获取下一个语言
        const nextLocale = locales[nextLocaleIndex];

        let newPath;
        // 检查 asPath 是否以当前 locale 开始
        if (new RegExp(`^/${locale}`).test(asPath)) {
            // 如果是，则替换为新的 locale
            newPath = asPath.replace(new RegExp(`^/${locale}`), `/${nextLocale}`);
        } else {
            // 如果不是，则在路径前添加新的 locale
            newPath = `/${nextLocale}${asPath}`;
        }

        // 切换到下一个语言并强制刷新页面
        window.location.href = newPath;
    };

    return (
        <button
            onClick={switchLanguage}
            aria-label="Switch Language"
            className="md:hidden inline-flex"
        >
            <AiOutlineTranslation size={32}/>
        </button>
    );
};

export default LanguageSwitcher;
