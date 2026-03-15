import { useAppearance } from '@/hooks/use-appearance';

export default function AppearanceToggleTab() {
    const { appearance, updateAppearance } = useAppearance();

    const darkModeCheck = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            updateAppearance('dark')
        }else{
            updateAppearance('light')
        }
    };

    return (
        <div>
            <div className="theme">
                <label className="theme__toggle-wrap">
                    <input
                        onChange={darkModeCheck}
                        id="theme"
                        className="theme__toggle"
                        type="checkbox"
                        checked={appearance==='dark'}
                    />
                    <span className="theme__icon">
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                        <span className="theme__icon-part"></span>
                    </span>
                </label>
            </div>
        </div>
    );
}
